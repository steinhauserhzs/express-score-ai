import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScoreDimensions {
  debts: number;
  behavior: number;
  spending: number;
  goals: number;
  reserves: number;
  income: number;
}

const ANALYSIS_PROMPT = `Analise as respostas do diagnóstico financeiro e extraia as informações estruturadas sobre cada dimensão.

Para cada dimensão, retorne um objeto JSON com os dados relevantes:

1. **debts** (dívidas): valor_total, tipos[], tem_atraso, meses_atraso
2. **behavior** (comportamento): controla_gastos, compras_impulso_frequencia, usa_credito_rotativo, consulta_extratos
3. **spending** (gastos vs renda): renda_mensal, gasto_medio, categorias_principais[], sabe_quanto_gasta
4. **goals** (metas): tem_objetivos, objetivos[], tem_plano, acompanha_progresso
5. **reserves** (reserva): valor_reserva, investe, investimentos[], patrimonio_aproximado
6. **income** (renda): tipo_trabalho, renda_fixa_variavel, tempo_situacao, tem_renda_extra

Retorne APENAS o JSON estruturado, sem texto adicional.`;

function calculateDimensionScores(analysis: any): ScoreDimensions {
  const scores: ScoreDimensions = {
    debts: 0,
    behavior: 0,
    spending: 0,
    goals: 0,
    reserves: 0,
    income: 0,
  };

  // Dívidas e Inadimplência (25 pontos)
  if (analysis.debts) {
    let debtScore = 25;
    if (analysis.debts.valor_total > 0) {
      const ratio = analysis.debts.valor_total / (analysis.spending?.renda_mensal || 1);
      if (ratio > 3) debtScore -= 15;
      else if (ratio > 1) debtScore -= 10;
      else if (ratio > 0.5) debtScore -= 5;
    }
    if (analysis.debts.tem_atraso) debtScore -= 5;
    if (analysis.debts.meses_atraso > 3) debtScore -= 5;
    scores.debts = Math.max(0, debtScore);
  }

  // Comportamento Financeiro (20 pontos)
  if (analysis.behavior) {
    let behaviorScore = 20;
    if (!analysis.behavior.controla_gastos) behaviorScore -= 7;
    if (analysis.behavior.compras_impulso_frequencia === 'alta') behaviorScore -= 5;
    else if (analysis.behavior.compras_impulso_frequencia === 'média') behaviorScore -= 3;
    if (analysis.behavior.usa_credito_rotativo) behaviorScore -= 5;
    if (!analysis.behavior.consulta_extratos) behaviorScore -= 3;
    scores.behavior = Math.max(0, behaviorScore);
  }

  // Gastos vs Renda (15 pontos)
  if (analysis.spending) {
    let spendingScore = 15;
    const ratio = analysis.spending.gasto_medio / analysis.spending.renda_mensal;
    if (ratio > 1) spendingScore -= 10;
    else if (ratio > 0.8) spendingScore -= 5;
    else if (ratio > 0.7) spendingScore -= 3;
    if (!analysis.spending.sabe_quanto_gasta) spendingScore -= 5;
    scores.spending = Math.max(0, spendingScore);
  }

  // Metas e Planejamento (15 pontos)
  if (analysis.goals) {
    let goalsScore = 0;
    if (analysis.goals.tem_objetivos) goalsScore += 5;
    if (analysis.goals.objetivos?.length > 0) goalsScore += 5;
    if (analysis.goals.tem_plano) goalsScore += 3;
    if (analysis.goals.acompanha_progresso) goalsScore += 2;
    scores.goals = Math.min(15, goalsScore);
  }

  // Reserva e Patrimônio (15 pontos)
  if (analysis.reserves) {
    let reservesScore = 0;
    const monthsReserve = analysis.reserves.valor_reserva / (analysis.spending?.renda_mensal || 1);
    if (monthsReserve >= 6) reservesScore += 8;
    else if (monthsReserve >= 3) reservesScore += 5;
    else if (monthsReserve > 0) reservesScore += 3;
    if (analysis.reserves.investe) reservesScore += 5;
    if (analysis.reserves.patrimonio_aproximado > 0) reservesScore += 2;
    scores.reserves = Math.min(15, reservesScore);
  }

  // Renda e Estabilidade (10 pontos)
  if (analysis.income) {
    let incomeScore = 0;
    if (analysis.income.tipo_trabalho === 'CLT') incomeScore += 4;
    else if (analysis.income.tipo_trabalho === 'empresário') incomeScore += 3;
    else incomeScore += 2;
    if (analysis.income.renda_fixa_variavel === 'fixa') incomeScore += 3;
    else incomeScore += 1;
    if (analysis.income.tem_renda_extra) incomeScore += 3;
    scores.income = Math.min(10, incomeScore);
  }

  return scores;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { diagnosticId } = await req.json();
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get diagnostic data
    const { data: diagnostic, error: fetchError } = await supabaseClient
      .from('diagnostics')
      .select('responses_json')
      .eq('id', diagnosticId)
      .single();

    if (fetchError) throw fetchError;

    console.log('Analyzing diagnostic:', diagnosticId);

    // Use AI to extract structured data from conversation
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const conversationText = JSON.stringify(diagnostic.responses_json);

    const analysisResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: ANALYSIS_PROMPT },
          { role: 'user', content: conversationText },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!analysisResponse.ok) {
      throw new Error(`AI analysis failed: ${analysisResponse.status}`);
    }

    const analysisData = await analysisResponse.json();
    const analysis = JSON.parse(analysisData.choices[0].message.content);

    // Calculate scores
    const dimensionScores = calculateDimensionScores(analysis);
    const totalScore = Object.values(dimensionScores).reduce((sum, score) => sum + score, 0);

    console.log('Calculated scores:', { totalScore, dimensionScores });

    // Update diagnostic
    const { error: updateError } = await supabaseClient
      .from('diagnostics')
      .update({
        total_score: Math.round(totalScore),
        dimension_scores: dimensionScores,
        completed: true,
      })
      .eq('id', diagnosticId);

    if (updateError) throw updateError;

    return new Response(
      JSON.stringify({ 
        success: true,
        totalScore: Math.round(totalScore),
        dimensionScores,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in calculate-score:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
