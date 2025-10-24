import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ScoreRadar from "@/components/ScoreRadar";
import ScoreCard from "@/components/ScoreCard";
import ProfileBadge from "@/components/ProfileBadge";
import RecommendationCard from "@/components/RecommendationCard";
import Logo from "@/components/Logo";
import NotificationBell from "@/components/NotificationBell";
import DiagnosticChatbot from "@/components/DiagnosticChatbot";
import DiagnosticComparison from "@/components/DiagnosticComparison";
import BadgeCard from "@/components/gamification/BadgeCard";
import LevelProgress from "@/components/gamification/LevelProgress";
import CustomerJourney from "@/components/CustomerJourney";
import { toast } from "sonner";
import { Download, FileText, TrendingUp, Calendar, BookOpen, Users, Award } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [diagnostic, setDiagnostic] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [badges, setBadges] = useState<any[]>([]);
  const [gamification, setGamification] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "comparison" | "journey" | "gamification">("overview");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate('/auth');
      return;
    }

    // Check if user is admin
    const { data: adminCheck } = await supabase.rpc('has_role', {
      _user_id: user.id,
      _role: 'admin'
    });
    setIsAdmin(adminCheck || false);

    await Promise.all([
      loadDiagnostic(user.id),
      loadHistory(user.id),
      loadBadges(user.id),
      loadGamification(user.id)
    ]);
  }

  async function loadDiagnostic(userId: string) {
    try {
      const { data, error } = await supabase
        .from('diagnostics')
        .select('*')
        .eq('user_id', userId)
        .eq('completed', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setDiagnostic(data);
    } catch (error) {
      console.error('Error loading diagnostic:', error);
      toast.error('Erro ao carregar diagnóstico');
    } finally {
      setLoading(false);
    }
  }

  async function loadHistory(userId: string) {
    try {
      const { data, error } = await supabase
        .from('diagnostic_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  }

  async function loadBadges(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });

      if (error) throw error;
      setBadges(data || []);
    } catch (error) {
      console.error('Error loading badges:', error);
    }
  }

  async function loadGamification(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      setGamification(data);
    } catch (error) {
      console.error('Error loading gamification:', error);
    }
  }

  async function handleGenerateReport(reportType: 'client' | 'consultant') {
    if (!diagnostic) return;

    setGeneratingReport(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-report', {
        body: {
          diagnosticId: diagnostic.id,
          reportType
        }
      });

      if (error) throw error;

      // Auto-tag user after completing diagnostic
      if (diagnostic) {
        supabase.functions.invoke('auto-tag-leads', {
          body: { userId: diagnostic.user_id }
        }).catch(err => console.error('Auto-tag error:', err));
      }

      if (data?.reportUrl) {
        window.open(data.reportUrl, '_blank');
        toast.success('Relatório gerado com sucesso!');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Erro ao gerar relatório');
    } finally {
      setGeneratingReport(false);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate('/auth');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-lg">Carregando seu dashboard...</p>
        </div>
      </div>
    );
  }

  if (!diagnostic) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Bem-vindo ao Pleno!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Você ainda não fez seu diagnóstico financeiro.
            </p>
            {isAdmin && (
              <Button onClick={() => navigate('/admin/dashboard')} variant="default" className="w-full">
                Painel Administrativo
              </Button>
            )}
            <Button onClick={() => navigate('/diagnostic')} className="w-full">
              Fazer Diagnóstico Gratuito
            </Button>
            <Button onClick={handleSignOut} variant="outline" className="w-full">
              Sair
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const dimensionScores = diagnostic.dimension_scores || {
    debts: 0,
    behavior: 0,
    spending: 0,
    goals: 0,
    reserves: 0,
    income: 0,
  };

  const getScoreColor = (score: number) => {
    if (score <= 50) return "text-destructive";
    if (score <= 100) return "text-warning";
    if (score <= 125) return "text-primary";
    return "text-success";
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'Crítico': return 'bg-destructive/10 text-destructive border-destructive';
      case 'Em Evolução': return 'bg-warning/10 text-warning border-warning';
      case 'Saudável': return 'bg-primary/10 text-primary border-primary';
      case 'Avançado': return 'bg-success/10 text-success border-success';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  // Generate recommendations based on profile and scores
  const getRecommendations = () => {
    const recommendations: any[] = [];
    
    if (dimensionScores.debts < 15) {
      recommendations.push({
        title: "Renegocie suas dívidas",
        description: "Entre em contato com credores para buscar melhores condições de pagamento",
        priority: "alta" as const,
        category: "Dívidas"
      });
    }
    
    if (dimensionScores.behavior < 12) {
      recommendations.push({
        title: "Comece a controlar seus gastos",
        description: "Use um aplicativo de finanças ou planilha para registrar todas as suas despesas",
        priority: "alta" as const,
        category: "Comportamento"
      });
    }
    
    if (dimensionScores.reserves < 7) {
      recommendations.push({
        title: "Construa sua reserva de emergência",
        description: "Comece guardando ao menos 10% da sua renda mensal em uma aplicação líquida",
        priority: "média" as const,
        category: "Reservas"
      });
    }
    
    if (dimensionScores.goals < 8) {
      recommendations.push({
        title: "Defina objetivos financeiros claros",
        description: "Estabeleça 3 metas financeiras com valores e prazos definidos",
        priority: "média" as const,
        category: "Planejamento"
      });
    }
    
    if (dimensionScores.spending < 8) {
      recommendations.push({
        title: "Reduza gastos não essenciais",
        description: "Identifique e corte pelo menos 3 despesas desnecessárias este mês",
        priority: "alta" as const,
        category: "Gastos"
      });
    }
    
    if (dimensionScores.income < 6) {
      recommendations.push({
        title: "Busque fontes extras de renda",
        description: "Considere freelances, trabalhos temporários ou venda de itens não utilizados",
        priority: "baixa" as const,
        category: "Renda"
      });
    }

    // Always add these general recommendations
    recommendations.push({
      title: "Eduque-se financeiramente",
      description: "Dedique 30 minutos por semana para ler sobre finanças pessoais",
      priority: "baixa" as const,
      category: "Educação"
    });

    return recommendations.slice(0, 7); // Max 7 recommendations
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header Fixo */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50 mb-4 md:mb-6">
        <div className="max-w-7xl mx-auto px-3 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Logo size="sm" showText={true} />
            
            {/* Desktop: botões visíveis */}
            <div className="hidden lg:flex gap-2 items-center">
              {isAdmin && (
                <Button onClick={() => navigate('/admin/dashboard')} variant="default" size="sm">
                  Painel Admin
                </Button>
              )}
              <Button onClick={() => navigate('/education')} variant="ghost" size="sm">
                <BookOpen className="h-4 w-4 mr-2" />
                Educação
              </Button>
              <Button onClick={() => navigate('/refer')} variant="ghost" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Indicar
              </Button>
              <NotificationBell />
              <Button onClick={() => navigate('/diagnostic')} variant="outline" size="sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                Novo Diagnóstico
              </Button>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                Sair
              </Button>
            </div>
            
            {/* Mobile: menu hamburguer */}
            <div className="lg:hidden flex items-center gap-2">
              <NotificationBell />
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Users className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col gap-4 mt-8">
                    {isAdmin && (
                      <Button onClick={() => navigate('/admin/dashboard')} variant="default" className="justify-start">
                        Painel Admin
                      </Button>
                    )}
                    <Button onClick={() => navigate('/education')} variant="ghost" className="justify-start">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Educação
                    </Button>
                    <Button onClick={() => navigate('/refer')} variant="ghost" className="justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Indicar
                    </Button>
                    <Button onClick={() => navigate('/diagnostic')} variant="outline" className="justify-start">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Novo Diagnóstico
                    </Button>
                    <Button onClick={handleSignOut} variant="outline" className="justify-start">
                      Sair
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-3 md:p-6 space-y-6 md:space-y-8">
        {/* Title Section */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground break-words">
            Dashboard
          </h1>
          <p className="text-sm md:text-base text-foreground/70">
            Seu Score Express da Vida Financeira
          </p>
        </div>

        {/* Score Total e Perfil */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
          <Card className="hover-scale bg-gradient-to-br from-primary/10 to-primary/5">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-center text-xl md:text-2xl">Seu Score Total</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 p-4 md:p-6 pt-0">
              <div className={`text-5xl md:text-6xl font-bold ${getScoreColor(diagnostic.total_score)}`}>
                {diagnostic.total_score}
                <span className="text-2xl md:text-3xl text-muted-foreground">/150</span>
              </div>
              <div className={`px-4 py-2 rounded-full border-2 ${getClassificationColor(diagnostic.score_classification)}`}>
                <span className="font-semibold">{diagnostic.score_classification}</span>
              </div>
              {diagnostic.quality_of_life && (
                <p className="text-sm text-muted-foreground">
                  Qualidade de Vida: {diagnostic.quality_of_life}/10
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="hover-scale">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-xl md:text-2xl break-words">
                Seu Perfil Financeiro
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4 p-4 md:p-6 pt-0">
              {diagnostic.profile && (
                <ProfileBadge profile={diagnostic.profile} />
              )}
              <div className="flex flex-col sm:flex-row gap-2 mt-4 w-full">
                <Button 
                  onClick={() => handleGenerateReport('client')} 
                  disabled={generatingReport}
                  className="flex-1 text-sm"
                  variant="default"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Meu Relatório</span>
                  <span className="sm:hidden">Relatório</span>
                </Button>
                <Button 
                  onClick={() => navigate('/consultations')} 
                  className="flex-1 text-sm"
                  variant="outline"
                  size="sm"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Agendar Consultoria</span>
                  <span className="sm:hidden">Consultoria</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Radar Chart */}
        <ScoreRadar dimensionScores={dimensionScores} />

        {/* Individual Scores */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-4 break-words">
            Análise Detalhada
          </h2>
          <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            <ScoreCard
              title="Dívidas e Inadimplência"
              score={dimensionScores.debts}
              maxScore={25}
              description="Gestão de dívidas e compromissos"
            />
            <ScoreCard
              title="Comportamento Financeiro"
              score={dimensionScores.behavior}
              maxScore={20}
              description="Hábitos e controle de gastos"
            />
            <ScoreCard
              title="Gastos vs Renda"
              score={dimensionScores.spending}
              maxScore={15}
              description="Equilíbrio entre receitas e despesas"
            />
            <ScoreCard
              title="Metas e Planejamento"
              score={dimensionScores.goals}
              maxScore={15}
              description="Objetivos e organização"
            />
            <ScoreCard
              title="Reserva e Patrimônio"
              score={dimensionScores.reserves}
              maxScore={15}
              description="Segurança financeira e investimentos"
            />
            <ScoreCard
              title="Renda e Estabilidade"
              score={dimensionScores.income}
              maxScore={10}
              description="Fontes de renda e estabilidade"
            />
          </div>
        </div>

        {/* Recomendações */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-4 break-words">
            Suas Recomendações Personalizadas
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mb-4">
            Marque as ações conforme você as completar para acompanhar seu progresso
          </p>
          <div className="space-y-4">
            {getRecommendations().map((rec, index) => (
              <RecommendationCard key={index} {...rec} />
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b overflow-x-auto pb-2 -mx-3 px-3 md:mx-0 md:px-0">
          <Button 
            variant={activeTab === "overview" ? "default" : "ghost"} 
            onClick={() => setActiveTab("overview")}
            size="sm"
            className="whitespace-nowrap flex-shrink-0 text-xs md:text-sm"
          >
            Visão Geral
          </Button>
          <Button 
            variant={activeTab === "comparison" ? "default" : "ghost"} 
            onClick={() => setActiveTab("comparison")}
            size="sm"
            className="whitespace-nowrap flex-shrink-0 text-xs md:text-sm"
          >
            Comparação
          </Button>
          <Button 
            variant={activeTab === "journey" ? "default" : "ghost"} 
            onClick={() => setActiveTab("journey")}
            size="sm"
            className="whitespace-nowrap flex-shrink-0 text-xs md:text-sm"
          >
            Jornada
          </Button>
          <Button 
            variant={activeTab === "gamification" ? "default" : "ghost"} 
            onClick={() => setActiveTab("gamification")}
            size="sm"
            className="whitespace-nowrap flex-shrink-0 text-xs md:text-sm"
          >
            <Award className="h-4 w-4 mr-1 md:mr-2" />
            Conquistas
          </Button>
        </div>

        {activeTab === "comparison" && history.length > 1 && <DiagnosticComparison />}
        {activeTab === "journey" && <CustomerJourney />}
        {activeTab === "gamification" && (
          <div className="space-y-4 md:space-y-6">
            {gamification && <LevelProgress currentLevel={gamification.current_level} levelPoints={gamification.level_points} totalPoints={gamification.total_points} />}
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-4 break-words">
                Suas Conquistas
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {badges.map((badge) => (
                  <BadgeCard key={badge.id} badgeName={badge.badge_name} badgeDescription={badge.badge_description} earnedAt={badge.earned_at} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chatbot */}
        <DiagnosticChatbot />
      </div>
    </div>
  );
}
