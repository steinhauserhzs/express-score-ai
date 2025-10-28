import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Confetti from "react-confetti";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, ArrowRight, Calendar, Share2 } from "lucide-react";
import ScoreReveal from "@/components/diagnostic/ScoreReveal";
import ClassificationBadge from "@/components/diagnostic/ClassificationBadge";
import ProfileCard from "@/components/diagnostic/ProfileCard";
import BadgeUnlocked from "@/components/diagnostic/BadgeUnlocked";
import QuickActions from "@/components/diagnostic/QuickActions";
import ScoreRadar from "@/components/ScoreRadar";

interface DiagnosticData {
  total_score: number;
  dimension_scores: {
    debts: number;
    behavior: number;
    spending: number;
    goals: number;
    reserves: number;
    income: number;
  };
  profile: string;
  score_classification: string;
  created_at: string;
}

interface BadgeData {
  badge_name: string;
  badge_description: string;
}

export default function DiagnosticResults() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [diagnostic, setDiagnostic] = useState<DiagnosticData | null>(null);
  const [newBadge, setNewBadge] = useState<BadgeData | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    loadResults();
  }, [id]);

  const loadResults = async () => {
    try {
      if (!id) return;

      // Load diagnostic data
      const { data: diagnosticData, error: diagnosticError } = await supabase
        .from("diagnostics")
        .select("total_score, dimension_scores, profile, score_classification, created_at")
        .eq("id", id)
        .single();

      if (diagnosticError) throw diagnosticError;
      setDiagnostic(diagnosticData as DiagnosticData);

      // Award "first_step" badge
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: badgeData, error: badgeError } = await supabase.functions.invoke('award-badge', {
          body: { userId: user.id, badgeType: 'first_step' }
        });

        if (!badgeError && badgeData?.success && badgeData?.badge) {
          setNewBadge({
            badge_name: badgeData.badge.name,
            badge_description: badgeData.badge.description
          });
        }
      }

      // Show confetti based on score
      if (diagnosticData.total_score > 80) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }

    } catch (error: any) {
      console.error("Error loading results:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os resultados.",
        variant: "destructive",
      });
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    const text = `Completei meu diagnóstico financeiro na Pleno! Score: ${diagnostic?.total_score}/150 🎯`;
    const url = window.location.href;
    
    if (navigator.share) {
      navigator.share({ title: "Meu Diagnóstico Pleno", text, url });
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      toast({
        title: "Link copiado!",
        description: "Cole para compartilhar seu resultado.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-16 h-16 animate-spin mx-auto text-primary" />
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">Preparando seus resultados...</h2>
            <p className="text-sm text-muted-foreground animate-pulse">Analisando suas finanças</p>
          </div>
        </div>
      </div>
    );
  }

  if (!diagnostic) {
    return null;
  }

  const getRecommendations = () => {
    const profile = diagnostic.profile.toLowerCase();
    
    const recommendations: Record<string, string[]> = {
      endividado: [
        "Renegocie suas dívidas para obter melhores condições",
        "Corte gastos não essenciais imediatamente",
        "Busque aumentar sua renda com trabalhos extras"
      ],
      desorganizado: [
        "Comece a registrar TODOS os seus gastos",
        "Crie um orçamento mensal realista",
        "Automatize suas contas e investimentos"
      ],
      poupador: [
        "Diversifique seus investimentos além da poupança",
        "Aprenda sobre diferentes classes de ativos",
        "Defina um percentual para investimentos de maior risco"
      ],
      investidor: [
        "Foque em estratégias de liberdade financeira",
        "Considere investimentos internacionais",
        "Otimize sua carga tributária"
      ]
    };

    return recommendations[profile] || recommendations.poupador;
  };

  return (
    <div className="min-h-screen bg-gradient-subtle py-6 md:py-8 px-3 md:px-4">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}

      <div className="max-w-5xl mx-auto space-y-6 md:space-y-8">
        {/* Hero Section with Score */}
        <div className="text-center space-y-4 md:space-y-6 animate-fade-in">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground break-words">
              🎉 Diagnóstico Completo!
            </h1>
            <p className="text-base md:text-lg text-muted-foreground">
              Seu Score Express de Saúde Financeira
            </p>
          </div>

          <ScoreReveal score={diagnostic.total_score} maxScore={150} />
          
          <ClassificationBadge 
            classification={diagnostic.score_classification}
            score={diagnostic.total_score}
          />
        </div>

        {/* Radar Chart */}
        <Card className="p-4 md:p-6 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <ScoreRadar dimensionScores={diagnostic.dimension_scores} />
        </Card>

        {/* Scores por Dimensão */}
        <Card className="p-4 md:p-6 animate-slide-up" style={{ animationDelay: "0.25s" }}>
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground">
            📊 Pontuação Detalhada por Dimensão
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">💳 Dívidas</span>
                <span className="text-lg font-bold text-foreground">
                  {diagnostic.dimension_scores.debts}/25
                </span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all" 
                  style={{ width: `${(diagnostic.dimension_scores.debts / 25) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">🎯 Comportamento</span>
                <span className="text-lg font-bold text-foreground">
                  {diagnostic.dimension_scores.behavior}/20
                </span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all" 
                  style={{ width: `${(diagnostic.dimension_scores.behavior / 20) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">💸 Gastos</span>
                <span className="text-lg font-bold text-foreground">
                  {diagnostic.dimension_scores.spending}/15
                </span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all" 
                  style={{ width: `${(diagnostic.dimension_scores.spending / 15) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">🎯 Metas</span>
                <span className="text-lg font-bold text-foreground">
                  {diagnostic.dimension_scores.goals}/15
                </span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all" 
                  style={{ width: `${(diagnostic.dimension_scores.goals / 15) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">🏦 Reservas</span>
                <span className="text-lg font-bold text-foreground">
                  {diagnostic.dimension_scores.reserves}/15
                </span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all" 
                  style={{ width: `${(diagnostic.dimension_scores.reserves / 15) * 100}%` }}
                />
              </div>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">📈 Renda</span>
                <span className="text-lg font-bold text-foreground">
                  {diagnostic.dimension_scores.income}/10
                </span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all" 
                  style={{ width: `${(diagnostic.dimension_scores.income / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Card */}
        <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
          <ProfileCard profile={diagnostic.profile} />
        </div>

        {/* Badge Unlocked */}
        {newBadge && (
          <div className="animate-bounce-in" style={{ animationDelay: "0.4s" }}>
            <BadgeUnlocked 
              badgeName={newBadge.badge_name}
              badgeDescription={newBadge.badge_description}
            />
          </div>
        )}

        {/* Top Recommendations */}
        <Card className="p-4 md:p-6 animate-slide-up" style={{ animationDelay: "0.5s" }}>
          <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground break-words">
            🎯 Próximos Passos Recomendados
          </h2>
          <div className="space-y-2 md:space-y-3">
            {getRecommendations().map((rec, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-muted/50 rounded-lg hover-scale"
              >
                <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs md:text-sm font-bold">
                  {idx + 1}
                </div>
                <p className="text-sm md:text-base text-foreground break-words">{rec}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="animate-slide-up" style={{ animationDelay: "0.6s" }}>
          <QuickActions />
        </div>

        {/* Consultation CTA with Urgency */}
        <Card className="p-6 md:p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 animate-slide-up" style={{ animationDelay: "0.65s" }}>
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-warning/20 text-warning-foreground px-4 py-2 rounded-full text-sm font-semibold">
              ⏰ OFERTA EXCLUSIVA - Primeiras 24h
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              🎁 Primeira Consultoria GRATUITA
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Agende agora e receba <strong>GRATUITAMENTE</strong> uma sessão de 45 minutos com nossos especialistas para criar seu plano de ação personalizado!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
              <Button
                size="lg"
                className="gap-2 w-full sm:w-auto text-lg px-8 py-6"
                onClick={() => navigate("/consultations")}
              >
                <Calendar className="w-5 h-5" />
                Agendar Minha Consultoria Grátis
              </Button>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  ⭐⭐⭐⭐⭐
                </span>
                <span>98% de satisfação</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              🔒 Apenas <strong className="text-warning">3 vagas</strong> disponíveis esta semana
            </p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.7s" }}>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 w-full sm:w-auto"
            onClick={() => navigate("/dashboard")}
          >
            <span className="hidden sm:inline">Ver Dashboard Completo</span>
            <span className="sm:hidden">Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="gap-2 w-full sm:w-auto"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
            Compartilhar
          </Button>
        </div>
      </div>
    </div>
  );
}
