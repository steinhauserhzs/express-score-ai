import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function checkCondition(condition: any, user: any, supabase: any): Promise<boolean> {
  switch (condition.type) {
    case "low_score": {
      const { data } = await supabase
        .from("diagnostics")
        .select("total_score")
        .eq("user_id", user.id)
        .eq("completed", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      return data && data.total_score < (condition.threshold || 30);
    }

    case "incomplete_diagnostic": {
      const { data } = await supabase
        .from("diagnostics")
        .select("created_at, completed")
        .eq("user_id", user.id)
        .eq("completed", false)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (!data) return false;
      
      const hoursSinceStart = (Date.now() - new Date(data.created_at).getTime()) / (1000 * 60 * 60);
      return hoursSinceStart >= (condition.hours || 48);
    }

    case "inactive_user": {
      const { data } = await supabase
        .from("customer_journey_events")
        .select("created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (!data) {
        const signupDate = new Date(user.created_at);
        const daysSinceSignup = (Date.now() - signupDate.getTime()) / (1000 * 60 * 60 * 24);
        return daysSinceSignup >= (condition.days || 7);
      }
      
      const daysSinceActivity = (Date.now() - new Date(data.created_at).getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceActivity >= (condition.days || 7);
    }

    case "churn_risk": {
      return user.churn_risk === condition.level;
    }

    default:
      return false;
  }
}

async function executeAction(action: any, user: any, supabase: any): Promise<void> {
  switch (action.type) {
    case "email": {
      await supabase.functions.invoke("send-email", {
        body: {
          userId: user.id,
          recipientEmail: user.email,
          emailType: action.config.email_type,
          subject: action.config.subject,
          htmlContent: action.config.html_content,
        },
      });
      break;
    }

    case "notification": {
      await supabase.from("notifications").insert({
        user_id: user.id,
        type: action.config.notification_type,
        title: action.config.title,
        message: action.config.message,
      });
      break;
    }

    case "tag": {
      const currentTags = user.tags || [];
      if (!currentTags.includes(action.config.tag)) {
        await supabase
          .from("profiles")
          .update({ tags: [...currentTags, action.config.tag] })
          .eq("id", user.id);
      }
      break;
    }

    default:
      console.log(`Unknown action type: ${action.type}`);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Processing automation triggers...");

    // Get active triggers
    const { data: triggers, error: triggersError } = await supabase
      .from("automation_triggers")
      .select("*")
      .eq("is_active", true);

    if (triggersError) throw triggersError;

    if (!triggers || triggers.length === 0) {
      return new Response(
        JSON.stringify({ success: true, message: "No active triggers" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let processedCount = 0;

    // Get all users
    const { data: users, error: usersError } = await supabase
      .from("profiles")
      .select("id, email, full_name, tags, churn_risk, created_at");

    if (usersError) throw usersError;

    // Process each trigger
    for (const trigger of triggers) {
      console.log(`Processing trigger: ${trigger.trigger_name}`);

      for (const user of users || []) {
        // Check if condition is met
        const conditionMet = await checkCondition(trigger.condition_config, user, supabase);

        if (conditionMet) {
          console.log(`Trigger ${trigger.trigger_name} matched for user ${user.id}`);
          
          // Execute action
          await executeAction(
            {
              type: trigger.action_type,
              config: trigger.action_config,
            },
            user,
            supabase
          );

          processedCount++;
        }
      }

      // Update last executed
      await supabase
        .from("automation_triggers")
        .update({ last_executed_at: new Date().toISOString() })
        .eq("id", trigger.id);
    }

    console.log(`Processed ${processedCount} trigger actions`);

    return new Response(
      JSON.stringify({
        success: true,
        triggersProcessed: triggers.length,
        actionsExecuted: processedCount,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in process-triggers function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
