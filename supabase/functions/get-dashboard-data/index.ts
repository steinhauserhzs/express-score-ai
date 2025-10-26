import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const authHeader = req.headers.get('Authorization')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    console.log(`[get-dashboard-data] Fetching data for user: ${user.id}`);

    // Fetch all data in parallel for maximum performance
    const [diagnosticResult, historyResult, badgesResult, gamificationResult] = await Promise.all([
      // Latest diagnostic
      supabase
        .from('diagnostics')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),

      // Diagnostic history (last 10)
      supabase
        .from('diagnostic_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10),

      // User badges
      supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false }),

      // Gamification data
      supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()
    ]);

    // Check for errors
    if (diagnosticResult.error) throw diagnosticResult.error;
    if (historyResult.error) throw historyResult.error;
    if (badgesResult.error) throw badgesResult.error;
    if (gamificationResult.error) throw gamificationResult.error;

    console.log('[get-dashboard-data] Data fetched successfully');

    return new Response(
      JSON.stringify({
        diagnostic: diagnosticResult.data,
        history: historyResult.data || [],
        badges: badgesResult.data || [],
        gamification: gamificationResult.data
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('[get-dashboard-data] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});