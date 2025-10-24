import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get user's diagnostic data
    const { data: diagnostic } = await supabaseClient
      .from('diagnostics')
      .select('*')
      .eq('user_id', userId)
      .eq('completed', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!diagnostic) {
      return new Response(
        JSON.stringify({ tags: [], message: 'No diagnostic found' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    }

    // Generate tags based on diagnostic data
    const tags: string[] = [];
    const score = diagnostic.total_score;
    const profile = diagnostic.profile;
    const dimensionScores = diagnostic.dimension_scores;

    // Priority tags
    if (score <= 40) {
      tags.push('🚨 Alta Prioridade');
      tags.push('Hot Lead');
    } else if (score <= 70) {
      tags.push('⚠️ Média Prioridade');
      tags.push('Warm Lead');
    } else {
      tags.push('✅ Baixa Urgência');
      tags.push('Cold Lead');
    }

    // Profile-based tags
    if (profile) {
      tags.push(`Perfil: ${profile}`);
    }

    // Dimension-specific tags
    if (dimensionScores.debts < 10) {
      tags.push('💳 Endividado Crítico');
    }
    
    if (dimensionScores.behavior < 8) {
      tags.push('📊 Precisa Controle');
    }
    
    if (dimensionScores.reserves < 5) {
      tags.push('🏦 Sem Reserva');
    }
    
    if (dimensionScores.income >= 8) {
      tags.push('💰 Boa Renda');
    }

    if (dimensionScores.goals < 5) {
      tags.push('🎯 Sem Planejamento');
    }

    // Opportunity tags
    if (score <= 50 && dimensionScores.income >= 6) {
      tags.push('💎 Potencial Alto');
    }

    if (dimensionScores.reserves < 7 && dimensionScores.income >= 7) {
      tags.push('💡 Oportunidade Investimentos');
    }

    // Update profile with tags
    const { error: updateError } = await supabaseClient
      .from('profiles')
      .update({ tags })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating tags:', updateError);
    }

    return new Response(
      JSON.stringify({ tags, success: !updateError }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error('Error in auto-tag-leads function:', error);
    return new Response(
      JSON.stringify({ 
        error: error?.message || 'An error occurred',
        tags: []
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
