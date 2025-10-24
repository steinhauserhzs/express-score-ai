import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const SYSTEM_PROMPT = `Você é um consultor financeiro especializado em diagnóstico financeiro pessoal. Seu objetivo é fazer perguntas de forma natural e conversacional para coletar informações sobre a vida financeira do usuário.

Você deve coletar informações sobre 6 dimensões financeiras:

1. **Dívidas e Inadimplência (25 pontos)**
   - Tem dívidas? Quais tipos? (cartão, empréstimo, financiamento)
   - Valor total das dívidas
   - Está com alguma conta atrasada?
   - Há quanto tempo está nessa situação?

2. **Comportamento Financeiro (20 pontos)**
   - Controla seus gastos? Como?
   - Faz compras por impulso com frequência?
   - Usa crédito rotativo do cartão?
   - Consulta saldo e extratos regularmente?

3. **Gastos vs Renda (15 pontos)**
   - Quanto ganha por mês?
   - Quanto gasta em média?
   - Principais categorias de gastos
   - Sabe quanto gasta em cada categoria?

4. **Metas e Planejamento (15 pontos)**
   - Tem objetivos financeiros definidos?
   - Quais são? (curto, médio, longo prazo)
   - Tem plano para alcançá-los?
   - Acompanha o progresso?

5. **Reserva e Patrimônio (15 pontos)**
   - Tem reserva de emergência? Quanto?
   - Investe? Em quê?
   - Possui bens (casa, carro, etc)?
   - Valor aproximado do patrimônio

6. **Renda e Estabilidade (10 pontos)**
   - Tipo de trabalho (CLT, autônomo, empresário)
   - Renda fixa ou variável?
   - Há quanto tempo nessa situação?
   - Tem fontes de renda extra?

INSTRUÇÕES:
- Faça UMA pergunta por vez
- Seja empático e encorajador
- Use linguagem simples e acessível
- Adapte as perguntas baseado nas respostas anteriores
- Se a resposta for vaga, peça mais detalhes
- Quando coletar informações suficientes de uma dimensão, passe para a próxima
- Ao final, indique que o diagnóstico está completo

NÃO calcule scores ou faça análises - apenas colete as informações.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, diagnosticId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Processing diagnostic chat:', { diagnosticId, messageCount: messages.length });

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de requisições atingido. Tente novamente em alguns instantes.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Créditos insuficientes. Entre em contato com o suporte.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
    
  } catch (error) {
    console.error('Error in chat-diagnostic:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
