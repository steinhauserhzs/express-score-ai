import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "userId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Calculating next best action for user ${userId}`);

    // Gather user data
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, email, lead_score, churn_risk, tags, created_at")
      .eq("id", userId)
      .single();

    const { data: diagnostics } = await supabase
      .from("diagnostics")
      .select("completed, total_score, profile, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(2);

    const { data: consultations } = await supabase
      .from("consultations")
      .select("status, scheduled_date")
      .eq("client_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);

    const { data: lastEmail } = await supabase
      .from("email_logs")
      .select("email_type, sent_at, opened_at")
      .eq("user_id", userId)
      .order("sent_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: badges } = await supabase
      .from("user_badges")
      .select("badge_type")
      .eq("user_id", userId);

    // Build context for AI
    const context = {
      profile: profile || {},
      diagnostics: diagnostics || [],
      consultations: consultations || [],
      lastEmail: lastEmail || null,
      badgesCount: badges?.length || 0,
      daysSinceSignup: Math.floor(
        (Date.now() - new Date(profile?.created_at || Date.now()).getTime()) / (1000 * 60 * 60 * 24)
      ),
    };

    const prompt = `Você é um especialista em análise de leads e estratégia de engajamento.

Analise o seguinte lead e sugira a PRÓXIMA MELHOR AÇÃO que um consultor deve tomar:

Lead Score: ${profile?.lead_score || 50}
Risco de Churn: ${profile?.churn_risk || "low"}
Tags: ${profile?.tags?.join(", ") || "nenhuma"}
Dias desde cadastro: ${context.daysSinceSignup}

Diagnósticos: ${diagnostics?.length || 0} completados
Último score: ${diagnostics?.[0]?.total_score || "N/A"}
Perfil: ${diagnostics?.[0]?.profile || "N/A"}

Consultorias: ${consultations?.length || 0} agendadas
Status: ${consultations?.[0]?.status || "nenhuma"}

Último email: ${lastEmail?.email_type || "nenhum"}
Abriu email: ${lastEmail?.opened_at ? "sim" : "não"}

Badges conquistados: ${context.badgesCount}

Responda em JSON com o seguinte formato:
{
  "action": "tipo da ação (email, whatsapp, call, offer)",
  "priority": "alta, média ou baixa",
  "title": "Título da ação sugerida",
  "description": "Descrição detalhada do que fazer",
  "reasoning": "Por que essa é a melhor ação agora"
}`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "Você é um especialista em análise de leads." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!aiResponse.ok) {
      throw new Error("Failed to get AI response");
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices[0].message.content;

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    const suggestion = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    if (!suggestion) {
      throw new Error("Failed to parse AI response");
    }

    return new Response(
      JSON.stringify({
        success: true,
        suggestion,
        context,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in next-best-action function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
