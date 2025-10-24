import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface Badge {
  type: string;
  name: string;
  description: string;
}

const BADGES: Record<string, Badge> = {
  first_step: {
    type: "first_step",
    name: "🎯 Primeiro Passo",
    description: "Completou seu primeiro diagnóstico financeiro",
  },
  persistent: {
    type: "persistent",
    name: "💪 Persistente",
    description: "Completou 3 diagnósticos em 3 meses",
  },
  evolving: {
    type: "evolving",
    name: "📈 Evoluindo",
    description: "Score aumentou 20+ pontos",
  },
  educated: {
    type: "educated",
    name: "🎓 Educado Financeiramente",
    description: "Completou 5 conteúdos educacionais",
  },
  saver: {
    type: "saver",
    name: "💰 Poupador",
    description: "Manteve reserva financeira por 3 meses",
  },
  investor: {
    type: "investor",
    name: "🚀 Investidor Iniciante",
    description: "Começou a investir seu dinheiro",
  },
  influencer: {
    type: "influencer",
    name: "👥 Influenciador",
    description: "Indicou 5 amigos para a plataforma",
  },
  consultant_ready: {
    type: "consultant_ready",
    name: "🎓 Pronto para Consultoria",
    description: "Agendou primeira consultoria",
  },
  debt_free: {
    type: "debt_free",
    name: "🆓 Livre de Dívidas",
    description: "Zerou todas as dívidas",
  },
  emergency_fund: {
    type: "emergency_fund",
    name: "🛡️ Protegido",
    description: "Construiu fundo de emergência completo",
  },
  consistent: {
    type: "consistent",
    name: "🔥 Consistente",
    description: "30 dias consecutivos de atividade",
  },
};

async function checkBadgeEligibility(userId: string, badgeType: string, supabase: any): Promise<boolean> {
  switch (badgeType) {
    case "first_step": {
      const { count } = await supabase
        .from("diagnostics")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("completed", true);
      return (count || 0) >= 1;
    }

    case "persistent": {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      
      const { count } = await supabase
        .from("diagnostics")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("completed", true)
        .gte("created_at", threeMonthsAgo.toISOString());
      
      return (count || 0) >= 3;
    }

    case "evolving": {
      const { data: history } = await supabase
        .from("diagnostic_history")
        .select("total_score")
        .eq("user_id", userId)
        .order("created_at", { ascending: true })
        .limit(2);

      if (history && history.length >= 2) {
        const improvement = history[1].total_score - history[0].total_score;
        return improvement >= 20;
      }
      return false;
    }

    case "educated": {
      const { count } = await supabase
        .from("user_content_progress")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "completed");
      
      return (count || 0) >= 5;
    }

    case "consultant_ready": {
      const { count } = await supabase
        .from("consultations")
        .select("*", { count: "exact", head: true })
        .eq("client_id", userId);
      
      return (count || 0) >= 1;
    }

    case "influencer": {
      const { count } = await supabase
        .from("referrals")
        .select("*", { count: "exact", head: true })
        .eq("referrer_id", userId)
        .eq("status", "completed");
      
      return (count || 0) >= 5;
    }

    case "consistent": {
      const { data: gamification } = await supabase
        .from("user_gamification")
        .select("streak_days")
        .eq("user_id", userId)
        .single();
      
      return gamification && gamification.streak_days >= 30;
    }

    default:
      return false;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { userId, badgeType } = await req.json();

    if (!userId || !badgeType) {
      return new Response(
        JSON.stringify({ error: "userId and badgeType are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const badge = BADGES[badgeType];
    if (!badge) {
      return new Response(
        JSON.stringify({ error: "Invalid badge type" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Checking badge ${badgeType} for user ${userId}`);

    // Check if user already has this badge
    const { data: existingBadge } = await supabase
      .from("user_badges")
      .select("id")
      .eq("user_id", userId)
      .eq("badge_type", badgeType)
      .maybeSingle();

    if (existingBadge) {
      return new Response(
        JSON.stringify({ success: false, message: "Badge already awarded" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user is eligible
    const isEligible = await checkBadgeEligibility(userId, badgeType, supabase);

    if (!isEligible) {
      return new Response(
        JSON.stringify({ success: false, message: "User not eligible for this badge" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Award badge
    const { error: insertError } = await supabase
      .from("user_badges")
      .insert({
        user_id: userId,
        badge_type: badge.type,
        badge_name: badge.name,
        badge_description: badge.description,
      });

    if (insertError) {
      console.error("Failed to award badge:", insertError);
      throw insertError;
    }

    // Add points to gamification
    const points = 50; // Each badge gives 50 points
    const { data: gamification } = await supabase
      .from("user_gamification")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (gamification) {
      const newTotalPoints = gamification.total_points + points;
      const newLevelPoints = gamification.level_points + points;
      
      // Calculate new level
      let newLevel = gamification.current_level;
      let finalLevelPoints = newLevelPoints;
      
      if (newLevelPoints >= 3001 && gamification.current_level !== "diamond") {
        newLevel = "diamond";
        finalLevelPoints = newLevelPoints - 3001;
      } else if (newLevelPoints >= 1501 && gamification.current_level === "gold") {
        newLevel = "platinum";
        finalLevelPoints = newLevelPoints - 1501;
      } else if (newLevelPoints >= 501 && gamification.current_level === "silver") {
        newLevel = "gold";
        finalLevelPoints = newLevelPoints - 501;
      } else if (newLevelPoints >= 500 && gamification.current_level === "bronze") {
        newLevel = "silver";
        finalLevelPoints = newLevelPoints - 500;
      }

      await supabase
        .from("user_gamification")
        .update({
          total_points: newTotalPoints,
          level_points: finalLevelPoints,
          current_level: newLevel,
        })
        .eq("user_id", userId);
    }

    // Create notification
    await supabase.from("notifications").insert({
      user_id: userId,
      type: "badge_earned",
      title: "🏆 Novo Badge Conquistado!",
      message: `Parabéns! Você ganhou o badge "${badge.name}": ${badge.description}`,
    });

    // Track journey event
    await supabase.from("customer_journey_events").insert({
      user_id: userId,
      event_type: "badge_earned",
      event_title: `Badge Conquistado: ${badge.name}`,
      event_description: badge.description,
      metadata: { badge_type: badgeType },
    });

    console.log(`Badge ${badgeType} awarded to user ${userId}`);

    return new Response(
      JSON.stringify({
        success: true,
        badge: badge,
        pointsEarned: points,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in award-badge function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
