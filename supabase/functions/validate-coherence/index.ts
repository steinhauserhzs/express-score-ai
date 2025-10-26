import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ConversationContext {
  renda_mensal?: number;
  dividas_total?: number;
  gastos_mensais?: number;
  idade?: number;
  tempo_emprego_anos?: number;
  reserva_emergencia?: number;
  investimentos_total?: number;
}

interface ValidationAlert {
  type: 'warning' | 'error' | 'info';
  message: string;
  field: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { context } = await req.json() as { context: ConversationContext };
    const alerts: ValidationAlert[] = [];

    // Regra 1: Dívida > 36x renda mensal
    if (context.dividas_total && context.renda_mensal) {
      if (context.dividas_total > (context.renda_mensal * 36)) {
        alerts.push({
          type: 'warning',
          field: 'dividas_total',
          message: `⚠️ ALERTA: Dívida de R$ ${context.dividas_total.toLocaleString('pt-BR')} com renda de R$ ${context.renda_mensal.toLocaleString('pt-BR')}/mês parece muito alta. Confirme se está correto.`
        });
      }
    }

    // Regra 2: Gastos > Renda
    if (context.gastos_mensais && context.renda_mensal) {
      if (context.gastos_mensais > context.renda_mensal) {
        alerts.push({
          type: 'warning',
          field: 'gastos_mensais',
          message: `⚠️ ALERTA: Gastos de R$ ${context.gastos_mensais.toLocaleString('pt-BR')} excedem renda de R$ ${context.renda_mensal.toLocaleString('pt-BR')}. Como você cobre essa diferença?`
        });
      }
    }

    // Regra 3: Idade vs Tempo de Emprego
    if (context.idade && context.tempo_emprego_anos) {
      if (context.tempo_emprego_anos > (context.idade - 15)) {
        alerts.push({
          type: 'error',
          field: 'tempo_emprego_anos',
          message: `⚠️ ALERTA: ${context.tempo_emprego_anos} anos no emprego mas só tem ${context.idade} anos de idade? Por favor, confirme.`
        });
      }
    }

    // Regra 4: Dívidas > Patrimônio total
    if (context.dividas_total && context.reserva_emergencia && context.investimentos_total) {
      const patrimonio = (context.reserva_emergencia || 0) + (context.investimentos_total || 0);
      if (context.dividas_total > patrimonio * 2) {
        alerts.push({
          type: 'warning',
          field: 'dividas_total',
          message: `💡 OBSERVAÇÃO: Suas dívidas (R$ ${context.dividas_total.toLocaleString('pt-BR')}) são significativamente maiores que seu patrimônio. Vamos priorizar a quitação.`
        });
      }
    }

    // Regra 5: Sem reserva de emergência
    if (context.renda_mensal && (!context.reserva_emergencia || context.reserva_emergencia === 0)) {
      alerts.push({
        type: 'info',
        field: 'reserva_emergencia',
        message: `💡 DICA: Você ainda não tem reserva de emergência. Ideal é ter 6 meses de despesas (aprox. R$ ${(context.renda_mensal * 6).toLocaleString('pt-BR')}).`
      });
    }

    return new Response(
      JSON.stringify({ alerts, valid: alerts.filter(a => a.type === 'error').length === 0 }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in validate-coherence:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});