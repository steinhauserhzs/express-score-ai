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

    // Verify admin access
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    const { data: hasAdminRole } = await supabaseClient.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });

    if (!hasAdminRole) {
      throw new Error('Admin access required');
    }

    // Fetch analytics data
    const [
      { data: diagnostics },
      { data: profiles },
      { data: consultations },
    ] = await Promise.all([
      supabaseClient.from('diagnostics').select('*'),
      supabaseClient.from('profiles').select('*').eq('role', 'client'),
      supabaseClient.from('consultations').select('*'),
    ]);

    // Prepare data summary for AI analysis
    const dataSummary = {
      totalLeads: profiles?.length || 0,
      totalDiagnostics: diagnostics?.length || 0,
      completedDiagnostics: diagnostics?.filter(d => d.completed).length || 0,
      avgScore: (() => {
        const completed = diagnostics?.filter(d => d.completed) || [];
        return completed.length > 0
          ? Math.round(completed.reduce((acc, d) => acc + d.total_score, 0) / completed.length)
          : 0;
      })(),
      totalConsultations: consultations?.length || 0,
      profileDistribution: diagnostics?.reduce((acc, d) => {
        if (d.profile) {
          acc[d.profile] = (acc[d.profile] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>),
      scoreRanges: {
        critical: diagnostics?.filter(d => d.completed && d.total_score <= 50).length || 0,
        attention: diagnostics?.filter(d => d.completed && d.total_score > 50 && d.total_score <= 90).length || 0,
        good: diagnostics?.filter(d => d.completed && d.total_score > 90).length || 0,
      },
      recentTrends: {
        last7Days: diagnostics?.filter(d => {
          const date = new Date(d.created_at);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return date >= weekAgo;
        }).length || 0,
      }
    };

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Generate insights with AI
    const aiPrompt = `Você é um analista financeiro especializado. Analise os seguintes dados de uma plataforma de diagnóstico financeiro e forneça 3-5 insights estratégicos ACIONÁVEIS em português:

Dados:
- Total de Leads: ${dataSummary.totalLeads}
- Diagnósticos Completados: ${dataSummary.completedDiagnostics} de ${dataSummary.totalDiagnostics}
- Score Médio: ${dataSummary.avgScore}/150
- Consultorias: ${dataSummary.totalConsultations}
- Distribuição de Perfis: ${JSON.stringify(dataSummary.profileDistribution)}
- Scores Críticos: ${dataSummary.scoreRanges.critical}
- Scores Atenção: ${dataSummary.scoreRanges.attention}
- Scores Bons: ${dataSummary.scoreRanges.good}
- Novos na última semana: ${dataSummary.recentTrends.last7Days}

Forneça insights no formato JSON:
{
  "insights": [
    {
      "title": "Título curto e impactante",
      "description": "Descrição detalhada do insight",
      "priority": "high" | "medium" | "low",
      "action": "Ação específica recomendada",
      "metric": "Métrica relevante"
    }
  ],
  "summary": "Resumo executivo em 2-3 frases",
  "alerts": ["Alerta 1 se houver algo crítico", "Alerta 2"],
  "opportunities": ["Oportunidade 1", "Oportunidade 2"]
}

Foque em insights PRÁTICOS que ajudem o administrador a tomar decisões estratégicas.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'Você é um analista financeiro especializado em dados de diagnóstico financeiro.'
          },
          {
            role: 'user',
            content: aiPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', errorText);
      throw new Error(`AI Gateway request failed: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices[0].message.content;
    
    // Extract JSON from markdown code blocks if present
    let jsonContent = content;
    if (content.includes('```json')) {
      jsonContent = content.split('```json')[1].split('```')[0].trim();
    } else if (content.includes('```')) {
      jsonContent = content.split('```')[1].split('```')[0].trim();
    }

    const insights = JSON.parse(jsonContent);

    return new Response(
      JSON.stringify({
        ...insights,
        data: dataSummary,
        generatedAt: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error: any) {
    console.error('Error in ai-insights function:', error);
    return new Response(
      JSON.stringify({ 
        error: error?.message || 'An error occurred processing your request',
        insights: [],
        summary: 'Não foi possível gerar insights no momento.',
        alerts: [],
        opportunities: []
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
