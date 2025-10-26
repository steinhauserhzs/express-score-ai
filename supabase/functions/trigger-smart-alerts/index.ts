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
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });

    // Get user from auth header
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Fetch user's latest diagnostics
    const { data: diagnostics } = await supabase
      .from('diagnostics')
      .select('*')
      .eq('user_id', user.id)
      .eq('completed', true)
      .order('created_at', { ascending: false })
      .limit(2);

    const alerts = [];

    if (diagnostics && diagnostics.length > 0) {
      const current = diagnostics[0];
      const previous = diagnostics[1];

      // Regra 1: Score caindo
      if (previous && current.total_score < previous.total_score - 10) {
        alerts.push({
          user_id: user.id,
          alert_type: 'score_drop',
          title: 'Score em Queda',
          message: `⚠️ Seu score caiu ${previous.total_score - current.total_score} pontos. Vamos identificar o problema?`,
          priority: 'high',
          action_url: '/my-journey'
        });
      }

      // Regra 2: Score melhorando significativamente
      if (previous && current.total_score > previous.total_score + 15) {
        alerts.push({
          user_id: user.id,
          alert_type: 'score_improvement',
          title: 'Parabéns! Score em Alta',
          message: `🎉 Você melhorou ${current.total_score - previous.total_score} pontos! Continue assim!`,
          priority: 'low',
          action_url: '/my-journey'
        });
      }

      // Regra 3: Diagnóstico desatualizado (mais de 90 dias)
      const daysSinceLastDiagnostic = Math.floor(
        (Date.now() - new Date(current.created_at).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (daysSinceLastDiagnostic > 90) {
        alerts.push({
          user_id: user.id,
          alert_type: 'outdated_diagnostic',
          title: 'Hora de Atualizar',
          message: `📊 Já faz ${Math.floor(daysSinceLastDiagnostic / 30)} meses do seu último diagnóstico. Vamos ver como você evoluiu?`,
          priority: 'medium',
          action_url: '/diagnostic'
        });
      }

      // Regra 4: Score crítico em dívidas
      if (current.dimension_scores?.debts < 10) {
        alerts.push({
          user_id: user.id,
          alert_type: 'critical_debt',
          title: 'Dívidas em Nível Crítico',
          message: '⚠️ Seu score de dívidas está crítico. Agende uma consultoria gratuita para criar um plano de ação.',
          priority: 'high',
          action_url: '/consultations'
        });
      }
    }

    // Fetch user's goals
    const { data: goals } = await supabase
      .from('financial_goals')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'in_progress');

    // Regra 5: Meta próxima de ser atingida
    if (goals) {
      for (const goal of goals) {
        const progress = (goal.current_amount / goal.target_amount) * 100;
        if (progress >= 90 && progress < 100) {
          alerts.push({
            user_id: user.id,
            alert_type: 'goal_almost_achieved',
            title: 'Meta Quase Atingida!',
            message: `🎯 Você está a ${100 - Math.round(progress)}% de atingir "${goal.title}"! Faltam apenas R$ ${(goal.target_amount - goal.current_amount).toLocaleString('pt-BR')}!`,
            priority: 'medium',
            action_url: '/goals',
            metadata: { goal_id: goal.id }
          });
        }
      }
    }

    // Insert alerts
    if (alerts.length > 0) {
      const { error: insertError } = await supabase
        .from('financial_alerts')
        .insert(alerts);
      
      if (insertError) {
        console.error('Error inserting alerts:', insertError);
      }
    }

    return new Response(
      JSON.stringify({ success: true, alerts_created: alerts.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in trigger-smart-alerts:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});