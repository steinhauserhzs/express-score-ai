import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  userId?: string;
  recipientEmail: string;
  emailType: string;
  subject: string;
  htmlContent: string;
  metadata?: Record<string, any>;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { userId, recipientEmail, emailType, subject, htmlContent, metadata }: EmailRequest = await req.json();

    console.log(`Sending email to ${recipientEmail}, type: ${emailType}`);

    // Send email using Resend
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "DiagnoFinance <onboarding@resend.dev>",
        to: [recipientEmail],
        subject: subject,
        html: htmlContent,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("Resend API error:", resendData);
      throw new Error("Failed to send email");
    }

    // Log email in database
    const { error: logError } = await supabase
      .from("email_logs")
      .insert({
        user_id: userId || null,
        email_type: emailType,
        recipient_email: recipientEmail,
        subject: subject,
        status: "sent",
        external_id: resendData.id,
        metadata: metadata || {},
      });

    if (logError) {
      console.error("Failed to log email:", logError);
    }

    // Track journey event if userId provided
    if (userId) {
      await supabase.from("customer_journey_events").insert({
        user_id: userId,
        event_type: "email_opened",
        event_title: `Email enviado: ${emailType}`,
        event_description: subject,
        metadata: { email_type: emailType, external_id: resendData.id },
      });
    }

    return new Response(
      JSON.stringify({ success: true, emailId: resendData.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in send-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
