import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LearningRecommendation {
  content_id: string;
  title: string;
  category: string;
  relevance_score: number;
  reason: string;
}

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
    const supabase = createClient(supabaseUrl, supabaseKey);

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    // Get user's latest diagnostic
    const { data: diagnostic } = await supabase
      .from('diagnostics')
      .select('*')
      .eq('user_id', user.id)
      .eq('completed', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (!diagnostic) {
      throw new Error('No diagnostic found');
    }

    // Analyze weak dimensions
    const dimensionScores = diagnostic.dimension_scores || {};
    const weakDimensions: string[] = [];
    
    Object.entries(dimensionScores).forEach(([dimension, score]) => {
      const maxScores: Record<string, number> = {
        debts: 25,
        behavior: 20,
        spending: 15,
        goals: 15,
        reserves: 15,
        income: 10
      };
      
      const percentage = ((score as number) / maxScores[dimension]) * 100;
      if (percentage < 60) {
        weakDimensions.push(dimension);
      }
    });

    // Get all educational content
    const { data: allContent } = await supabase
      .from('educational_content')
      .select('*')
      .eq('is_published', true);

    if (!allContent) {
      return new Response(
        JSON.stringify({ recommendations: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Map categories to weak dimensions
    const categoryMapping: Record<string, string[]> = {
      'Gestão de Dívidas': ['debts'],
      'Controle Financeiro': ['behavior', 'spending'],
      'Planejamento': ['goals', 'behavior'],
      'Investimentos': ['reserves', 'income'],
      'Renda Extra': ['income']
    };

    const recommendations: LearningRecommendation[] = [];

    allContent.forEach((content) => {
      const relevantDimensions = categoryMapping[content.category] || [];
      const matchingDimensions = relevantDimensions.filter(d => weakDimensions.includes(d));
      
      if (matchingDimensions.length > 0) {
        recommendations.push({
          content_id: content.id,
          title: content.title,
          category: content.category,
          relevance_score: (matchingDimensions.length / relevantDimensions.length) * 100,
          reason: `Recomendado para melhorar: ${matchingDimensions.map(d => {
            const names: Record<string, string> = {
              debts: 'Dívidas',
              behavior: 'Comportamento',
              spending: 'Gastos',
              goals: 'Metas',
              reserves: 'Reservas',
              income: 'Renda'
            };
            return names[d];
          }).join(', ')}`
        });
      }
    });

    // Sort by relevance
    recommendations.sort((a, b) => b.relevance_score - a.relevance_score);

    return new Response(
      JSON.stringify({ 
        recommendations: recommendations.slice(0, 10),
        weak_dimensions: weakDimensions
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in recommend-learning-path:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});