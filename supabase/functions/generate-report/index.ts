import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { diagnosticId, reportType } = await req.json();

    if (!diagnosticId || !reportType) {
      throw new Error('diagnosticId and reportType are required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get diagnostic data
    const { data: diagnostic, error: diagError } = await supabase
      .from('diagnostics')
      .select('*, profiles(*)')
      .eq('id', diagnosticId)
      .single();

    if (diagError) throw diagError;

    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Generate report content using AI
    const prompt = reportType === 'client' 
      ? generateClientReportPrompt(diagnostic)
      : generateConsultantReportPrompt(diagnostic);

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'Você é um especialista em relatórios financeiros da Pleno. Gere relatórios claros, objetivos e acionáveis.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI API Error:', errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const reportContent = aiData.choices[0].message.content;

    // Generate HTML report
    const htmlContent = generateHTML(diagnostic, reportContent, reportType);

    // Convert HTML to PDF using a simple approach (for MVP, we'll return HTML)
    // In production, use a proper PDF library
    const fileName = `${reportType}-report-${diagnosticId}.html`;
    const filePath = `${diagnostic.user_id}/${fileName}`;

    // Upload to storage
    const { error: uploadError } = await supabase
      .storage
      .from('diagnostic-reports')
      .upload(filePath, new Blob([htmlContent], { type: 'text/html' }), {
        contentType: 'text/html',
        upsert: true
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase
      .storage
      .from('diagnostic-reports')
      .getPublicUrl(filePath);

    return new Response(
      JSON.stringify({ 
        success: true,
        reportUrl: urlData.publicUrl,
        fileName
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating report:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function generateClientReportPrompt(diagnostic: any): string {
  return `
Gere um relatório financeiro para o CLIENTE com base nos seguintes dados:

DADOS DO DIAGNÓSTICO:
- Nome: ${diagnostic.profiles?.full_name || 'Cliente'}
- Score Total: ${diagnostic.total_score}/150
- Perfil: ${diagnostic.profile}
- Classificação: ${diagnostic.score_classification}
- Qualidade de Vida: ${diagnostic.quality_of_life}/10

SCORES POR DIMENSÃO:
${JSON.stringify(diagnostic.dimension_scores, null, 2)}

RESPOSTAS COMPLETAS:
${JSON.stringify(diagnostic.responses_json, null, 2)}

INSTRUÇÕES PARA O RELATÓRIO:

1. RESUMO EXECUTIVO (2-3 parágrafos):
   - Visão geral da situação financeira
   - Principais conquistas identificadas
   - Áreas que precisam de atenção

2. ANÁLISE POR DIMENSÃO (para cada uma das 8):
   - Pontuação obtida vs máxima
   - O que está indo bem
   - O que precisa melhorar
   - 1-2 dicas práticas

3. TOP 3 PONTOS FORTES:
   - Liste os 3 maiores pontos positivos do cliente
   - Parabenize e encoraje a manter

4. TOP 3 PONTOS DE ATENÇÃO:
   - Liste os 3 pontos que mais precisam de atenção
   - Seja empático, nunca julgue

5. PLANO DE AÇÃO (7 recomendações):
   - Liste 7 ações concretas e práticas
   - Priorize por urgência (alta, média, baixa)
   - Use linguagem simples e motivadora

6. PRÓXIMOS PASSOS:
   - O que fazer nos próximos 30 dias
   - Recursos disponíveis
   - Incentivo para agendar consultoria humana

Use linguagem CLARA, SIMPLES e MOTIVADORA. Seja empático e positivo, mas honesto.
`;
}

function generateConsultantReportPrompt(diagnostic: any): string {
  return `
Gere um relatório TÉCNICO para o CONSULTOR FINANCEIRO com base nos seguintes dados:

DADOS DO CLIENTE:
- Nome: ${diagnostic.profiles?.full_name || 'Cliente'}
- Score Total: ${diagnostic.total_score}/150
- Perfil: ${diagnostic.profile}
- Classificação: ${diagnostic.score_classification}

SCORES POR DIMENSÃO:
${JSON.stringify(diagnostic.dimension_scores, null, 2)}

RESPOSTAS DETALHADAS:
${JSON.stringify(diagnostic.responses_json, null, 2)}

INSTRUÇÕES PARA O RELATÓRIO TÉCNICO:

1. ANÁLISE CRÍTICA:
   - Situação financeira geral (objetiva e técnica)
   - Principais riscos identificados
   - Oportunidades de melhoria

2. BREAKDOWN POR DIMENSÃO (8 dimensões):
   - Análise detalhada de cada dimensão
   - Correlações entre dimensões
   - Insights técnicos

3. ALERTAS DE RISCO:
   - Liste todos os pontos críticos que requerem atenção imediata
   - Classifique por severidade (crítico, alto, médio, baixo)

4. PERFIL COMPORTAMENTAL:
   - Análise do comportamento financeiro do cliente
   - Pontos psicológicos a considerar na consultoria
   - Possíveis objeções ou resistências

5. ESTRATÉGIA DE ABORDAGEM:
   - Como abordar o cliente na consultoria
   - Tópicos prioritários a discutir
   - Sequência recomendada de assuntos

6. OPORTUNIDADES DE UPSELL:
   - Produtos/serviços que o cliente pode se beneficiar
   - Momento ideal para oferta
   - Argumentos de venda baseados no perfil

7. PLANO DE ACOMPANHAMENTO:
   - Frequência ideal de follow-up
   - Métricas a monitorar
   - Próximos diagnósticos sugeridos

Use linguagem TÉCNICA e OBJETIVA. Seja direto e prático.
`;
}

function generateHTML(diagnostic: any, content: string, reportType: string): string {
  const title = reportType === 'client' 
    ? 'Seu Relatório Financeiro Pessoal' 
    : 'Relatório Técnico do Cliente';

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Pleno</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 30px;
            border-bottom: 3px solid #6366f1;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            color: #6366f1;
            margin-bottom: 10px;
        }
        .subtitle {
            color: #666;
            font-size: 14px;
        }
        .score-badge {
            display: inline-block;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: white;
            padding: 15px 30px;
            border-radius: 50px;
            font-size: 24px;
            font-weight: bold;
            margin: 20px 0;
        }
        .profile-badge {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 8px 20px;
            border-radius: 20px;
            font-size: 14px;
            margin: 10px 0;
        }
        .content {
            white-space: pre-wrap;
            line-height: 1.8;
        }
        h1, h2, h3 {
            color: #6366f1;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        .footer {
            margin-top: 50px;
            padding-top: 30px;
            border-top: 2px solid #e5e5e5;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
        .cta {
            background: #6366f1;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            display: inline-block;
            margin-top: 20px;
            font-weight: bold;
        }
        @media print {
            body { background: white; padding: 0; }
            .container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">PLENO</div>
            <div class="subtitle">${title}</div>
            <div class="score-badge">Score: ${diagnostic.total_score}/150</div>
            <div class="profile-badge">Perfil: ${diagnostic.profile}</div>
            <div style="color: #666; margin-top: 10px;">
                Classificação: ${diagnostic.score_classification} | 
                Data: ${new Date().toLocaleDateString('pt-BR')}
            </div>
        </div>
        
        <div class="content">
            ${content.replace(/\n/g, '<br>')}
        </div>
        
        ${reportType === 'client' ? `
        <div style="text-align: center;">
            <a href="#" class="cta">Agendar Consultoria com Especialista</a>
        </div>
        ` : ''}
        
        <div class="footer">
            <p><strong>Pleno - Score Express da Vida Financeira</strong></p>
            <p>Este relatório é confidencial e de uso exclusivo do destinatário.</p>
            <p>© ${new Date().getFullYear()} Pleno. Todos os direitos reservados.</p>
        </div>
    </div>
</body>
</html>
  `;
}
