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

interface ClientProfile {
  type: 'Endividado' | 'Desorganizado' | 'Poupador' | 'Investidor';
  description: string;
  recommendations: string[];
}

interface ScoreClassification {
  range: string;
  label: 'Crítico' | 'Em Evolução' | 'Saudável' | 'Avançado';
  focus: string[];
}

const ANALYSIS_PROMPT = `Analise as respostas do diagnóstico financeiro e extraia as informações estruturadas.

IMPORTANTE: Extraia os dados nas seguintes categorias (retorne JSON):

{
  "debts": {
    "has_debts": boolean,
    "total_debt": number,
    "debt_types": string[],
    "is_overdue": boolean,
    "overdue_months": number,
    "is_negativado": boolean
  },
  "behavior": {
    "tracks_expenses": "rigorous" | "partial" | "approximate" | "none",
    "impulse_buying": "never" | "sometimes" | "frequently" | "very_frequently",
    "credit_card_usage": "no_use" | "full_payment" | "sometimes_installments" | "frequently_installments" | "revolving",
    "lends_money": "never" | "rarely" | "sometimes" | "frequently",
    "banks": string[]
  },
  "spending": {
    "monthly_income": number,
    "fixed_expenses_percentage": number (0-1),
    "spending_categories": object,
    "end_of_month": "save" | "zero" | "lack"
  },
  "goals": {
    "has_defined_goals": boolean,
    "goals_list": string[],
    "has_deadlines": "all" | "some" | "none",
    "tracks_progress": "monthly" | "sometimes" | "never",
    "retirement_age": number,
    "retirement_income_goal": number
  },
  "reserves": {
    "emergency_fund_months": number,
    "invests": boolean,
    "investment_types": string[],
    "investor_profile": "conservative" | "moderate" | "aggressive" | "unknown",
    "investment_experience": "never" | "lost" | "maintained" | "gained",
    "brokers": string[],
    "liquidity": string,
    "has_assets": boolean,
    "assets": object,
    "total_assets": number,
    "has_income_generating_assets": boolean
  },
  "income": {
    "job_type": string,
    "has_multiple_sources": boolean,
    "job_stability_years": number,
    "income_growth": "significant" | "some" | "stable" | "decreased_some" | "decreased_significant",
    "has_passive_income": boolean,
    "income_sources": string[]
  },
  "protections": {
    "has_protections": boolean,
    "protection_types": string[]
  },
  "quality_of_life": number (0-10)
}

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

  // 1. Dívidas e Inadimplência (25 pontos BASE + bonificações)
  if (analysis.debts) {
    if (!analysis.debts.has_debts) {
      scores.debts = 25;
    } else {
      const debtRatio = analysis.debts.total_debt / (analysis.spending?.monthly_income || 1);
      if (debtRatio < 0.3) scores.debts = 20;
      else if (debtRatio < 0.5) scores.debts = 15;
      else if (debtRatio < 1) scores.debts = 10;
      else if (debtRatio < 2) scores.debts = 5;
      else scores.debts = 2;
      
      // Penalidades
      if (analysis.debts.is_overdue) {
        const months = analysis.debts.overdue_months || 0;
        if (months > 6) scores.debts -= 10;
        else if (months > 3) scores.debts -= 7;
        else scores.debts -= 5;
      }
      if (analysis.debts.is_negativado) scores.debts -= 3;
    }
  }
  scores.debts = Math.max(0, scores.debts);

  // 2. Comportamento Financeiro (20 pontos BASE + bonificações)
  if (analysis.behavior) {
    if (analysis.behavior.tracks_expenses === 'rigorous') scores.behavior += 8;
    else if (analysis.behavior.tracks_expenses === 'partial') scores.behavior += 5;
    else if (analysis.behavior.tracks_expenses === 'approximate') scores.behavior += 3;
    
    if (analysis.behavior.impulse_buying === 'never') scores.behavior += 7;
    else if (analysis.behavior.impulse_buying === 'sometimes') scores.behavior += 4;
    else if (analysis.behavior.impulse_buying === 'frequently') scores.behavior += 2;
    
    if (analysis.behavior.credit_card_usage === 'full_payment') scores.behavior += 5;
    else if (analysis.behavior.credit_card_usage === 'sometimes_installments') scores.behavior += 2;
    else if (analysis.behavior.credit_card_usage === 'revolving') scores.behavior -= 5;
  }
  scores.behavior = Math.max(0, scores.behavior);

  // 3. Gastos vs Renda (15 pontos BASE)
  if (analysis.spending) {
    const fixedExpenseRatio = analysis.spending.fixed_expenses_percentage || 0;
    if (fixedExpenseRatio <= 0.3) scores.spending = 15;
    else if (fixedExpenseRatio <= 0.5) scores.spending = 11;
    else if (fixedExpenseRatio <= 0.7) scores.spending = 7;
    else scores.spending = 3;
    
    // Bônus se sobra dinheiro no final do mês
    if (analysis.spending.end_of_month === 'save') scores.spending += 3;
    else if (analysis.spending.end_of_month === 'lack') scores.spending -= 2;
  }
  scores.spending = Math.max(0, scores.spending);

  // 4. Metas e Planejamento (15 pontos BASE)
  if (analysis.goals) {
    if (analysis.goals.has_defined_goals) scores.goals += 6;
    if (analysis.goals.has_deadlines === 'all') scores.goals += 5;
    else if (analysis.goals.has_deadlines === 'some') scores.goals += 3;
    
    if (analysis.goals.tracks_progress === 'monthly') scores.goals += 4;
    else if (analysis.goals.tracks_progress === 'sometimes') scores.goals += 2;
  }
  scores.goals = Math.max(0, scores.goals);

  // 5. Reserva e Patrimônio (15 pontos BASE + bonificações até 35)
  if (analysis.reserves) {
    // Reserva de emergência (10 pts)
    if (analysis.reserves.emergency_fund_months >= 6) scores.reserves += 10;
    else if (analysis.reserves.emergency_fund_months >= 3) scores.reserves += 7;
    else if (analysis.reserves.emergency_fund_months >= 1) scores.reserves += 4;
    else if (analysis.reserves.emergency_fund_months > 0) scores.reserves += 2;
    
    // Investimentos (5 pts base)
    if (analysis.reserves.invests) scores.reserves += 5;
    
    // BONIFICAÇÕES:
    // Diversificação de investimentos (+10 pts)
    const investmentTypes = analysis.reserves.investment_types || [];
    if (investmentTypes.length >= 5) scores.reserves += 10;
    else if (investmentTypes.length >= 3) scores.reserves += 7;
    else if (investmentTypes.length >= 2) scores.reserves += 4;
    
    // Patrimônio líquido positivo (+5 pts)
    const netWorth = (analysis.reserves.total_assets || 0) - (analysis.debts?.total_debt || 0);
    if (netWorth > 0) scores.reserves += 5;
    
    // Bens que geram renda (+5 pts)
    if (analysis.reserves.has_income_generating_assets) scores.reserves += 5;
  }
  scores.reserves = Math.max(0, scores.reserves);

  // 6. Renda e Estabilidade (10 pontos BASE + bonificações até 20)
  if (analysis.income) {
    // Múltiplas fontes de renda (+5 pts)
    if (analysis.income.has_multiple_sources) scores.income += 5;
    
    // Estabilidade profissional (5 pts)
    if (analysis.income.job_stability_years >= 5) scores.income += 5;
    else if (analysis.income.job_stability_years >= 3) scores.income += 4;
    else if (analysis.income.job_stability_years >= 1) scores.income += 3;
    else scores.income += 1;
    
    // BONIFICAÇÕES:
    // Renda passiva (+5 pts)
    if (analysis.income.has_passive_income) scores.income += 5;
    
    // Crescimento de renda (+5 pts)
    if (analysis.income.income_growth === 'significant') scores.income += 5;
    else if (analysis.income.income_growth === 'some') scores.income += 3;
  }
  scores.income = Math.max(0, scores.income);

  // BONIFICAÇÃO ADICIONAL: Proteções (+5 pts no total)
  if (analysis.protections?.has_protections) {
    const protectionCount = (analysis.protections.protection_types || []).length;
    const bonusPoints = Math.min(5, protectionCount);
    scores.reserves += bonusPoints; // Adiciona nas reservas pois está relacionado
  }

  return scores;
}

function classifyProfile(totalScore: number, analysis: any): ClientProfile {
  const hasDebts = analysis.debts?.has_debts;
  const isOverdue = analysis.debts?.is_overdue;
  const debtRatio = hasDebts ? (analysis.debts?.total_debt || 0) / (analysis.spending?.monthly_income || 1) : 0;
  const tracksExpenses = analysis.behavior?.tracks_expenses;
  const hasReserve = (analysis.reserves?.emergency_fund_months || 0) > 0;
  const invests = analysis.reserves?.invests;
  const investmentTypes = (analysis.reserves?.investment_types || []).length;
  const savesAtEndOfMonth = analysis.spending?.end_of_month === 'save';

  // 1. ENDIVIDADO (Score < 60)
  if (totalScore < 60 || (debtRatio > 0.5 && isOverdue)) {
    return {
      type: 'Endividado',
      description: 'Você está em uma situação financeira crítica, com dívidas comprometendo sua renda. É hora de focar em renegociação e educação financeira básica.',
      recommendations: [
        'Renegocie suas dívidas com os credores para obter melhores condições',
        'Corte gastos não essenciais imediatamente',
        'Busque aumentar sua renda com trabalhos extras ou freelances',
        'Evite novos endividamentos e não use crédito rotativo',
        'Considere ajuda de um consultor financeiro especializado',
        'Aprenda o básico de educação financeira (orçamento, controle de gastos)',
        'Estabeleça um plano de quitação de dívidas (método bola de neve ou avalanche)'
      ]
    };
  }

  // 2. DESORGANIZADO (Score 40-80)
  if (totalScore >= 40 && totalScore <= 80 && (!tracksExpenses || tracksExpenses === 'none')) {
    return {
      type: 'Desorganizado',
      description: 'Você tem renda mas não controla seus gastos adequadamente. Seu dinheiro "some" no final do mês e você usa crédito como extensão da renda.',
      recommendations: [
        'Comece a registrar TODOS os seus gastos (use um app de controle financeiro)',
        'Crie um orçamento mensal realista e siga-o',
        'Separe cartões de crédito por categoria de gasto',
        'Estabeleça um dia específico do mês para revisar suas finanças',
        'Automatize suas contas e investimentos (débito automático)',
        'Crie o hábito de "pagar a si mesmo primeiro" (reserve 10% da renda antes de gastar)',
        'Evite compras por impulso: espere 48h antes de comprar algo não planejado'
      ]
    };
  }

  // 3. POUPADOR (Score 75-110)
  if (totalScore >= 75 && totalScore <= 110 && hasReserve && (!invests || investmentTypes <= 2)) {
    return {
      type: 'Poupador',
      description: 'Você guarda dinheiro e tem disciplina financeira, mas é muito conservador. Seu dinheiro está "dormindo" e perdendo para a inflação.',
      recommendations: [
        'Diversifique seus investimentos além da poupança (CDB, Tesouro Direto)',
        'Aprenda sobre diferentes classes de ativos (renda fixa, renda variável)',
        'Defina um percentual para investimentos de maior risco (começe com 10-20%)',
        'Estude sobre fundos imobiliários (FIIs) para gerar renda passiva',
        'Considere previdência privada para planejamento de longo prazo',
        'Estabeleça metas claras de rendimento para seu dinheiro',
        'Consulte um especialista para montar uma carteira diversificada'
      ]
    };
  }

  // 4. INVESTIDOR (Score 95+)
  if (totalScore >= 95 && invests && (savesAtEndOfMonth || investmentTypes >= 3)) {
    return {
      type: 'Investidor',
      description: 'Parabéns! Você tem excelente saúde financeira, poupa consistentemente e diversifica investimentos. Está no caminho da independência financeira.',
      recommendations: [
        'Foque em estratégias de liberdade financeira e renda passiva',
        'Considere investimentos internacionais para proteção cambial',
        'Estude sobre planejamento sucessório e proteção patrimonial',
        'Otimize sua carga tributária (planejamento fiscal)',
        'Busque investimentos alternativos (private equity, venture capital)',
        'Mentore outras pessoas em educação financeira',
        'Revise e rebalanceie sua carteira trimestralmente',
        'Considere empreender ou investir em negócios'
      ]
    };
  }

  // FALLBACK (se não se encaixar claramente em nenhum perfil)
  if (totalScore >= 80) {
    return {
      type: 'Poupador',
      description: 'Você tem bom controle financeiro e está construindo patrimônio, mas pode melhorar seus investimentos.',
      recommendations: [
        'Continue poupando regularmente',
        'Diversifique seus investimentos',
        'Estabeleça metas de longo prazo',
        'Busque conhecimento em educação financeira',
        'Considere consultar um especialista para otimizar sua estratégia'
      ]
    };
  } else {
    return {
      type: 'Desorganizado',
      description: 'Você precisa organizar melhor suas finanças para alcançar seus objetivos.',
      recommendations: [
        'Comece a controlar seus gastos',
        'Crie um orçamento mensal',
        'Elimine gastos desnecessários',
        'Estabeleça metas financeiras claras',
        'Busque conhecimento em educação financeira básica'
      ]
    };
  }
}

function classifyScore(totalScore: number): ScoreClassification {
  if (totalScore <= 50) {
    return {
      range: '0-50',
      label: 'Crítico',
      focus: [
        'Educação financeira básica urgente',
        'Renegociação de dívidas imediata',
        'Corte de gastos não essenciais',
        'Busca de aumento de renda'
      ]
    };
  } else if (totalScore <= 100) {
    return {
      range: '51-100',
      label: 'Em Evolução',
      focus: [
        'Aperfeiçoar controle de gastos',
        'Construir reserva de emergência',
        'Quitar dívidas remanescentes',
        'Iniciar investimentos conservadores'
      ]
    };
  } else if (totalScore <= 125) {
    return {
      range: '101-125',
      label: 'Saudável',
      focus: [
        'Otimizar carteira de investimentos',
        'Diversificar classes de ativos',
        'Iniciar construção de renda passiva',
        'Planejamento tributário'
      ]
    };
  } else {
    return {
      range: '126-150',
      label: 'Avançado',
      focus: [
        'Estratégias de liberdade financeira',
        'Sucessão patrimonial',
        'Investimentos alternativos',
        'Otimização fiscal avançada'
      ]
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { diagnosticId, quickUpdate = false, dimension = null } = await req.json();
    console.log('Calculating score for diagnostic:', diagnosticId, 'Quick update:', quickUpdate, 'Dimension:', dimension);
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
      .select('responses_json, dimension_scores')
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
    let dimensionScores = calculateDimensionScores(analysis);
    
    // Se for quick update, manter scores anteriores das outras dimensões
    if (quickUpdate && dimension) {
      const previousScores = diagnostic.dimension_scores || {};
      const dimensionKey = dimension as keyof ScoreDimensions;
      dimensionScores = {
        ...previousScores,
        [dimensionKey]: dimensionScores[dimensionKey],
      } as ScoreDimensions;
    }
    
    const totalScore = Object.values(dimensionScores).reduce((sum, score) => sum + score, 0);

    // Classify profile and score
    const profile = classifyProfile(totalScore, analysis);
    const scoreClassification = classifyScore(totalScore);
    const qualityOfLife = analysis.quality_of_life || 0;

    console.log('Calculated scores:', { totalScore, dimensionScores, profile: profile.type, classification: scoreClassification.label });

    // Update diagnostic with scores
    const { error: updateError } = await supabaseClient
      .from('diagnostics')
      .update({
        total_score: totalScore,
        dimension_scores: dimensionScores,
        profile: profile.type,
        score_classification: scoreClassification.label,
        quality_of_life: qualityOfLife,
        completed: true,
      })
      .eq('id', diagnosticId);

    if (updateError) throw updateError;

    // Save to history
    const { data: userData } = await supabaseClient.auth.getUser();
    if (userData?.user) {
      await supabaseClient
        .from('diagnostic_history')
        .insert({
          user_id: userData.user.id,
          diagnostic_id: diagnosticId,
          total_score: totalScore,
          dimension_scores: dimensionScores,
          profile: profile.type,
          score_classification: scoreClassification.label,
        });
    }

    return new Response(
      JSON.stringify({ 
        totalScore, 
        dimensionScores,
        profile,
        scoreClassification
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
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
