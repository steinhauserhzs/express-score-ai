import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TrackEventRequest {
  eventName: string;
  eventCategory: string;
  pagePath?: string;
  properties?: Record<string, any>;
  sessionId?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    let userId = null;
    
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    const { eventName, eventCategory, pagePath, properties, sessionId }: TrackEventRequest = await req.json();

    console.log(`Tracking event: ${eventName} (${eventCategory}) for user ${userId || 'anonymous'}`);

    // Insert product event
    const { error: eventError } = await supabase
      .from("product_events")
      .insert({
        user_id: userId,
        session_id: sessionId || null,
        event_name: eventName,
        event_category: eventCategory,
        page_path: pagePath || null,
        properties: properties || {},
      });

    if (eventError) {
      console.error("Failed to track event:", eventError);
      throw eventError;
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in track-event function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
