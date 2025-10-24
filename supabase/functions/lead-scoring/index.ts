import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadScoringCriteria {
  hasCompletedDiagnostic: boolean;
  diagnosticScore: number;
  hasScheduledConsultation: boolean;
  contentEngagement: number;
  daysSinceSignup: number;
  lastActivityDays: number;
}

function calculateLeadScore(criteria: LeadScoringCriteria): number {
  let score = 0;

  // Completou diagnóstico: +30 pontos
  if (criteria.hasCompletedDiagnostic) {
    score += 30;
  }

  // Score baixo indica urgência: +25 pontos
  if (criteria.diagnosticScore < 60) {
    score += 25;
  }

  // Agendou consultoria: +20 pontos
  if (criteria.hasScheduledConsultation) {
    score += 20;
  }

  // Engajamento com conteúdo: até +10 pontos
  score += Math.min(criteria.contentEngagement * 2, 10);

  // Penalidade por tempo desde cadastro: -5 por mês
  const monthsSinceSignup = Math.floor(criteria.daysSinceSignup / 30);
  score -= monthsSinceSignup * 5;

  // Penalidade por inatividade: -10 se > 30 dias
  if (criteria.lastActivityDays > 30) {
    score -= 10;
  }

  // Garantir score entre 0 e 100
  return Math.max(0, Math.min(100, score));
}

function classifyLeadScore(score: number): string {
  if (score >= 80) return "hot";
  if (score >= 50) return "warm";
  return "cold";
}

function assessChurnRisk(criteria: LeadScoringCriteria): string {
  // Alto risco se:
  // - Não faz login há 30+ dias
  // - Score está baixo e não agendou consultoria
  // - Cadastrado há muito tempo mas baixo engajamento
  
  if (criteria.lastActivityDays > 30) {
    return "high";
  }

  if (criteria.diagnosticScore < 50 && !criteria.hasScheduledConsultation && criteria.daysSinceSignup > 14) {
    return "high";
  }

  if (criteria.contentEngagement === 0 && criteria.daysSinceSignup > 7) {
    return "medium";
  }

  return "low";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { userId } = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "userId is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Calculating lead score for user ${userId}`);

    // Fetch user data
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("created_at")
      .eq("id", userId)
      .single();

    if (profileError || !profile) {
      throw new Error("User not found");
    }

    // Check if completed diagnostic
    const { data: diagnostics } = await supabase
      .from("diagnostics")
      .select("completed, total_score")
      .eq("user_id", userId)
      .eq("completed", true)
      .order("created_at", { ascending: false })
      .limit(1);

    // Check if has scheduled consultation
    const { data: consultations } = await supabase
      .from("consultations")
      .select("id")
      .eq("client_id", userId)
      .in("status", ["pending", "scheduled"])
      .limit(1);

    // Check content engagement
    const { count: contentCount } = await supabase
      .from("user_content_progress")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    // Check last activity
    const { data: lastJourneyEvent } = await supabase
      .from("customer_journey_events")
      .select("created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // Calculate criteria
    const now = new Date();
    const signupDate = new Date(profile.created_at);
    const daysSinceSignup = Math.floor((now.getTime() - signupDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const lastActivityDate = lastJourneyEvent ? new Date(lastJourneyEvent.created_at) : signupDate;
    const lastActivityDays = Math.floor((now.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24));

    const criteria: LeadScoringCriteria = {
      hasCompletedDiagnostic: (diagnostics && diagnostics.length > 0) || false,
      diagnosticScore: diagnostics && diagnostics.length > 0 ? diagnostics[0].total_score : 0,
      hasScheduledConsultation: (consultations && consultations.length > 0) || false,
      contentEngagement: contentCount || 0,
      daysSinceSignup,
      lastActivityDays,
    };

    // Calculate scores
    const leadScore = calculateLeadScore(criteria);
    const churnRisk = assessChurnRisk(criteria);

    // Update profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        lead_score: leadScore,
        churn_risk: churnRisk,
      })
      .eq("id", userId);

    if (updateError) {
      console.error("Failed to update lead score:", updateError);
    }

    console.log(`Lead score calculated: ${leadScore} (${classifyLeadScore(leadScore)}), Churn risk: ${churnRisk}`);

    return new Response(
      JSON.stringify({
        success: true,
        leadScore,
        classification: classifyLeadScore(leadScore),
        churnRisk,
        criteria,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in lead-scoring function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
