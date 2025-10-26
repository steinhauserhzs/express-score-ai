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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    // Get current and previous month diagnostics
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const { data: diagnostics } = await supabaseClient
      .from('diagnostics')
      .select('*')
      .eq('user_id', user.id)
      .eq('completed', true)
      .order('created_at', { ascending: false })
      .limit(2);

    const currentDiagnostic = diagnostics?.[0];
    const previousDiagnostic = diagnostics?.[1];

    // Get goals progress
    const { data: goals } = await supabaseClient
      .from('financial_goals')
      .select('*')
      .eq('user_id', user.id)
      .in('status', ['in_progress', 'achieved']);

    // Get badges earned this month
    const { data: badges } = await supabaseClient
      .from('user_badges')
      .select('*, badges(*)')
      .eq('user_id', user.id)
      .gte('earned_at', oneMonthAgo.toISOString());

    // Get gamification stats
    const { data: gamification } = await supabaseClient
      .from('user_gamification')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Calculate score evolution
    const scoreEvolution = previousDiagnostic 
      ? currentDiagnostic.total_score - previousDiagnostic.total_score
      : 0;

    // Calculate goals summary
    const goalsCompleted = goals?.filter(g => g.status === 'achieved' && 
      new Date(g.achieved_at!) >= oneMonthAgo).length || 0;
    
    const goalsProgress = goals?.map(g => ({
      title: g.title,
      progress: Math.round((g.current_amount / g.target_amount) * 100),
      target: g.target_amount,
      current: g.current_amount,
    })) || [];

    // Generate report
    const report = {
      month: new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
      user: {
        name: user.user_metadata?.full_name || 'Usuário',
        email: user.email,
      },
      scoreEvolution: {
        current: currentDiagnostic?.total_score || 0,
        previous: previousDiagnostic?.total_score || 0,
        change: scoreEvolution,
        percentile: calculatePercentile(currentDiagnostic?.total_score || 0),
      },
      goals: {
        total: goals?.length || 0,
        completed: goalsCompleted,
        inProgress: goals?.filter(g => g.status === 'in_progress').length || 0,
        progress: goalsProgress,
      },
      badges: {
        newBadges: badges?.length || 0,
        totalPoints: gamification?.total_points || 0,
        level: gamification?.current_level || 1,
      },
      nextSteps: generateNextSteps(currentDiagnostic, goals || []),
    };

    return new Response(
      JSON.stringify({ success: true, report }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error generating report:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function calculatePercentile(score: number): number {
  // Simple percentile calculation
  if (score >= 130) return 95;
  if (score >= 110) return 80;
  if (score >= 90) return 65;
  if (score >= 70) return 50;
  if (score >= 50) return 30;
  return 15;
}

function generateNextSteps(diagnostic: any, goals: any[]): string[] {
  const steps: string[] = [];
  
  if (!diagnostic) {
    steps.push('Faça seu diagnóstico financeiro para receber recomendações personalizadas');
    return steps;
  }

  const { dimension_scores } = diagnostic;
  
  // Based on weakest dimensions
  const weakDimensions = Object.entries(dimension_scores || {})
    .sort(([, a]: any, [, b]: any) => a - b)
    .slice(0, 3);

  weakDimensions.forEach(([dim, score]: any) => {
    if (dim === 'debts' && score < 15) {
      steps.push('Priorize a renegociação das suas dívidas - assista ao vídeo "Como Negociar Dívidas"');
    } else if (dim === 'reserves' && score < 10) {
      steps.push('Comece sua reserva de emergência - mesmo que seja com R$ 100/mês');
    } else if (dim === 'behavior' && score < 12) {
      steps.push('Implemente o controle de gastos - use nossa planilha gratuita');
    }
  });

  // Goal-based recommendations
  const activeGoals = goals?.filter(g => g.status === 'in_progress') || [];
  if (activeGoals.length > 0) {
    const closestGoal = activeGoals.sort((a, b) => 
      (b.current_amount / b.target_amount) - (a.current_amount / a.target_amount)
    )[0];
    
    if (closestGoal) {
      const remaining = closestGoal.target_amount - closestGoal.current_amount;
      steps.push(`Continue poupando para "${closestGoal.title}" - faltam apenas R$ ${remaining.toFixed(2)}`);
    }
  }

  // General recommendation
  steps.push('Refaça seu diagnóstico no próximo mês para acompanhar sua evolução');

  return steps;
}