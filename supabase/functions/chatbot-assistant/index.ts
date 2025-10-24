import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { message, conversationId, conversationType = "general" } = await req.json();

    console.log(`Chatbot request from user ${user.id}, conversation type: ${conversationType}`);

    // Get or create conversation
    let currentConversationId = conversationId;
    
    if (!currentConversationId) {
      const { data: newConversation, error: convError } = await supabase
        .from("chatbot_conversations")
        .insert({
          user_id: user.id,
          conversation_type: conversationType,
          message_count: 0,
        })
        .select()
        .single();

      if (convError) throw convError;
      currentConversationId = newConversation.id;
    }

    // Save user message
    await supabase.from("chatbot_messages").insert({
      conversation_id: currentConversationId,
      role: "user",
      content: message,
    });

    // Get conversation history
    const { data: messages } = await supabase
      .from("chatbot_messages")
      .select("role, content")
      .eq("conversation_id", currentConversationId)
      .order("created_at", { ascending: true })
      .limit(20);

    // Get user context for better responses
    const { data: diagnostic } = await supabase
      .from("diagnostics")
      .select("total_score, dimension_scores, profile, score_classification")
      .eq("user_id", user.id)
      .eq("completed", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // Build system prompt with context
    let systemPrompt = `Você é um assistente financeiro inteligente da DiagnoFinance. 
Seu objetivo é ajudar o usuário com dúvidas sobre sua saúde financeira de forma clara e amigável.`;

    if (diagnostic && conversationType === "diagnostic_questions") {
      systemPrompt += `

O usuário possui os seguintes dados financeiros:
- Score Total: ${diagnostic.total_score}
- Classificação: ${diagnostic.score_classification}
- Perfil: ${diagnostic.profile}
- Dimensões: ${JSON.stringify(diagnostic.dimension_scores)}

Use essas informações para responder perguntas específicas sobre o diagnóstico dele.
Seja claro, objetivo e dê recomendações práticas.`;
    }

    // Call Lovable AI
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...(messages || []),
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI API error:", errorText);
      throw new Error("Failed to get AI response");
    }

    const aiData = await aiResponse.json();
    const assistantMessage = aiData.choices[0].message.content;

    // Save assistant message
    await supabase.from("chatbot_messages").insert({
      conversation_id: currentConversationId,
      role: "assistant",
      content: assistantMessage,
    });

    // Update conversation message count
    await supabase
      .from("chatbot_conversations")
      .update({ message_count: (messages?.length || 0) + 2 })
      .eq("id", currentConversationId);

    return new Response(
      JSON.stringify({
        success: true,
        message: assistantMessage,
        conversationId: currentConversationId,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in chatbot-assistant function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
