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

    console.log("Starting recovery of incomplete diagnostics...");

    // Find diagnostics abandoned in the last 24-72 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const seventyTwoHoursAgo = new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString();

    const { data: incompleteDiagnostics, error: diagnosticsError } = await supabase
      .from("diagnostics")
      .select(`
        id,
        user_id,
        created_at,
        responses_json,
        profiles!inner(email, full_name)
      `)
      .eq("completed", false)
      .gte("created_at", seventyTwoHoursAgo)
      .lte("created_at", twentyFourHoursAgo);

    if (diagnosticsError) {
      console.error("Error fetching incomplete diagnostics:", diagnosticsError);
      throw diagnosticsError;
    }

    console.log(`Found ${incompleteDiagnostics?.length || 0} incomplete diagnostics`);

    let emailsSent = 0;
    let notificationsCreated = 0;

    for (const diagnostic of incompleteDiagnostics || []) {
      const profile = diagnostic.profiles as any;
      const messageCount = diagnostic.responses_json?.messages?.length || 0;
      
      // Only recover if user has started (at least 5 messages)
      if (messageCount < 5) continue;

      const progress = Math.round((messageCount / 38) * 100);

      // Create notification
      const { error: notifError } = await supabase
        .from("notifications")
        .insert({
          user_id: diagnostic.user_id,
          type: "diagnostic_reminder",
          title: "🎯 Continue seu diagnóstico!",
          message: `Você está ${progress}% completo! Faltam poucos minutos para descobrir seu Score Express.`,
        });

      if (!notifError) {
        notificationsCreated++;
      }

      // Send recovery email
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4F46E5; font-size: 28px; margin-bottom: 10px;">
              🎯 Não deixe seu diagnóstico pela metade!
            </h1>
          </div>
          
          <div style="background: #F3F4F6; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
            <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-bottom: 15px;">
              Olá ${profile.full_name},
            </p>
            <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-bottom: 15px;">
              Percebemos que você começou seu <strong>Diagnóstico Financeiro Express</strong> mas não finalizou!
            </p>
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <div style="text-align: center;">
                <div style="font-size: 48px; font-weight: bold; color: #4F46E5; margin-bottom: 10px;">
                  ${progress}%
                </div>
                <p style="color: #6B7280; font-size: 14px;">COMPLETO</p>
              </div>
            </div>
            <p style="font-size: 16px; color: #374151; line-height: 1.6; margin-bottom: 15px;">
              <strong>Você já fez ${messageCount} perguntas!</strong> Faltam apenas alguns minutos para:
            </p>
            <ul style="color: #374151; line-height: 1.8; margin-bottom: 20px;">
              <li>✨ Descobrir seu Score Express (0-150 pontos)</li>
              <li>📊 Ver análise detalhada das 6 dimensões</li>
              <li>🎯 Receber recomendações personalizadas</li>
              <li>🏆 Desbloquear seu primeiro badge</li>
            </ul>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${supabaseUrl.replace('https://rpjkccdfulotegejzowk.supabase.co', 'https://seu-dominio.com')}/diagnostic" 
               style="display: inline-block; background: #4F46E5; color: white; padding: 16px 40px; 
                      text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
              🚀 Continuar Diagnóstico Agora
            </a>
          </div>

          <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 15px; border-radius: 6px; margin: 25px 0;">
            <p style="margin: 0; color: #92400E; font-size: 14px;">
              <strong>⚡ Dica:</strong> Use o <strong>Modo Turbo</strong> para finalizar em apenas 5 minutos com 10 perguntas essenciais!
            </p>
          </div>

          <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
            <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
              Se você não solicitou este diagnóstico, pode ignorar este email.
            </p>
          </div>
        </div>
      `;

      const { error: emailError } = await supabase.functions.invoke("send-email", {
        body: {
          userId: diagnostic.user_id,
          recipientEmail: profile.email,
          emailType: "diagnostic_recovery",
          subject: `🎯 ${profile.full_name}, você está ${progress}% completo no seu diagnóstico!`,
          htmlContent: emailHtml,
          metadata: {
            diagnostic_id: diagnostic.id,
            progress,
            message_count: messageCount,
          },
        },
      });

      if (!emailError) {
        emailsSent++;
      }

      // Log journey event
      await supabase.from("customer_journey_events").insert({
        user_id: diagnostic.user_id,
        event_type: "email_sent",
        event_title: "Email de recuperação enviado",
        event_description: `Diagnóstico ${progress}% completo - tentativa de recuperação`,
        metadata: {
          diagnostic_id: diagnostic.id,
          progress,
          email_type: "diagnostic_recovery",
        },
      });
    }

    console.log(`Recovery complete: ${emailsSent} emails sent, ${notificationsCreated} notifications created`);

    return new Response(
      JSON.stringify({
        success: true,
        diagnosticsFound: incompleteDiagnostics?.length || 0,
        emailsSent,
        notificationsCreated,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in recover-incomplete-diagnostics:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
