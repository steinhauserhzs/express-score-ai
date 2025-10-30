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
import SmartAlerts from "@/components/SmartAlerts";
import WeeklyChallenges from "@/components/WeeklyChallenges";
import GoalsWidget from "@/components/GoalsWidget";
import OnboardingTour from "@/components/OnboardingTour";
import { toast } from "sonner";
import ScoreComparison from "@/components/ScoreComparison";
import QuickUpdateModal from "@/components/QuickUpdateModal";
import AreasToImprove from "@/components/AreasToImprove";
import EvolutionChart from "@/components/EvolutionChart";
import NextSteps from "@/components/NextSteps";
import { Download, FileText, TrendingUp, Calendar, BookOpen, Users, Award, Zap, LogOut, Loader2, Shield, Target } from "lucide-react";
import Layout from "@/components/Layout";
import { DashboardSkeleton } from "@/components/ui/skeleton-group";

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
  const [showQuickUpdateModal, setShowQuickUpdateModal] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      navigate('/auth');
      return;
    }

    setSession(session);

    // Check if user is admin
    const { data: adminCheck } = await supabase.rpc('has_role', {
      _user_id: session.user.id,
      _role: 'admin'
    });
    setIsAdmin(adminCheck || false);

    // Load all dashboard data with new optimized function
    await loadDashboardData(session.user.id);
  }

  async function loadDashboardData(userId: string) {
    try {
      setLoading(true);
      
      // Try to use cached data first (5 min cache)
      const cacheKey = `dashboard_${userId}`;
      const cachedData = localStorage.getItem(cacheKey);
      const cacheTime = localStorage.getItem(`${cacheKey}_time`);
      const now = Date.now();
      
      if (cachedData && cacheTime && (now - parseInt(cacheTime)) < 5 * 60 * 1000) {
        const data = JSON.parse(cachedData);
        setDiagnostic(data.diagnostic);
        setHistory(data.history);
        setBadges(data.badges);
        setGamification(data.gamification);
        setLoading(false);
        
        // Refresh in background
        loadDashboardDataFromServer(userId, cacheKey);
        return;
      }
      
      // Load from server
      await loadDashboardDataFromServer(userId, cacheKey);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Erro ao carregar dashboard');
      setLoading(false);
    }
  }

  async function loadDashboardDataFromServer(userId: string, cacheKey: string) {
    try {
      const { data, error } = await supabase.functions.invoke('get-dashboard-data');
      
      if (error) throw error;
      
      setDiagnostic(data.diagnostic);
      setHistory(data.history);
      setBadges(data.badges);
      setGamification(data.gamification);
      
      // Cache the data
      localStorage.setItem(cacheKey, JSON.stringify(data));
      localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
    } catch (error) {
      console.error('Error loading from server:', error);
      throw error;
    } finally {
      setLoading(false);
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
    return <DashboardSkeleton />;
  }

  if (!diagnostic) {
    return (
      <Layout showSidebar={true}>
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
          <div className="container max-w-5xl mx-auto py-12 px-4">
            <Card className="border-2">
              <CardHeader className="text-center space-y-4 pb-8">
                <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-10 h-10 text-primary" />
                </div>
                <CardTitle className="text-3xl">
                  Bem-vindo ao Pleno, {session?.user?.user_metadata?.full_name || 'Investidor'}!
                </CardTitle>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Descubra sua saúde financeira em apenas 10 minutos através do nosso diagnóstico inteligente por IA
                </p>
              </CardHeader>
              
              <CardContent className="space-y-8">
                {/* CTA Principal */}
                <div className="flex flex-col items-center gap-4">
                  <Button 
                    size="lg" 
                    className="w-full max-w-md h-14 text-lg"
                    onClick={() => navigate('/diagnostic')}
                  >
                    <Zap className="mr-2 h-5 w-5" />
                    Fazer Diagnóstico Gratuito (10 min)
                  </Button>
                  
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Seus dados são 100% seguros e confidenciais
                  </p>
                </div>
                
                {/* O que você vai descobrir */}
                <div className="pt-8">
                  <h3 className="text-center text-lg font-semibold mb-6">📊 O que você vai descobrir:</h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    <Card className="border-dashed">
                      <CardContent className="pt-6 text-center">
                        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                          <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <h4 className="font-semibold mb-1">Seu Score</h4>
                        <p className="text-xs text-muted-foreground">De 0 a 150 pontos</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-dashed">
                      <CardContent className="pt-6 text-center">
                        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                          <Award className="w-6 h-6 text-primary" />
                        </div>
                        <h4 className="font-semibold mb-1">Seu Perfil</h4>
                        <p className="text-xs text-muted-foreground">Investidor, Poupador...</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-dashed">
                      <CardContent className="pt-6 text-center">
                        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                          <Target className="w-6 h-6 text-primary" />
                        </div>
                        <h4 className="font-semibold mb-1">Áreas Críticas</h4>
                        <p className="text-xs text-muted-foreground">Onde melhorar</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-dashed">
                      <CardContent className="pt-6 text-center">
                        <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                          <BookOpen className="w-6 h-6 text-primary" />
                        </div>
                        <h4 className="font-semibold mb-1">Plano de Ação</h4>
                        <p className="text-xs text-muted-foreground">Dicas personalizadas</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                {/* Opções Secundárias */}
                <div className="pt-4 space-y-3">
                  <p className="text-center text-sm text-muted-foreground mb-4">Ou explore outras opções:</p>
                  <div className="flex flex-col md:flex-row gap-3">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate('/consultations')}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Agendar Consultoria
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => navigate('/education')}
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Explorar Educação
                    </Button>
                    
                    {isAdmin && (
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => navigate('/admin/dashboard')}
                      >
                        Painel Admin
                      </Button>
                    )}
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
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
      <OnboardingTour />
      {/* Header Fixo */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50 mb-4 md:mb-6">
        <div className="max-w-7xl mx-auto px-3 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <Logo size="sm" />
            
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

      <div className="container max-w-7xl mx-auto px-3 md:px-4 lg:px-6 py-4 md:py-6 lg:py-8">
        {/* Meu Score Atual - Destaque no topo */}
        <Card className="mb-4 md:mb-6 lg:mb-8 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-xl md:text-2xl">📊 Meu Score Atual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
              <div className="flex-1 w-full min-w-0">
                <div className={`text-4xl md:text-5xl font-bold break-words ${getScoreColor(diagnostic.total_score)}`}>
                  {diagnostic.total_score}/150
                </div>
                <div className={`inline-block mt-2 px-3 md:px-4 py-1 rounded-full border text-sm ${getClassificationColor(diagnostic.score_classification)}`}>
                  {diagnostic.score_classification}
                </div>
                <p className="text-xs md:text-sm text-muted-foreground mt-2">
                  Última atualização: {new Date(diagnostic.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full md:w-auto md:min-w-[200px]">
                <Button onClick={() => navigate('/diagnostic')} variant="default" className="gap-2 w-full text-sm md:text-base">
                  <TrendingUp className="h-4 w-4" />
                  Atualizar Diagnóstico Completo
                </Button>
                <Button onClick={() => setShowQuickUpdateModal(true)} variant="outline" className="gap-2 w-full text-sm md:text-base">
                  <Zap className="h-4 w-4" />
                  Atualização Rápida (5 min)
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Evolution Chart */}
        <div className="mb-4 md:mb-6 lg:mb-8">
          <EvolutionChart history={history} />
        </div>

        {/* Areas to Improve & Next Steps */}
        <div className="grid lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mb-4 md:mb-6 lg:mb-8">
          <AreasToImprove 
            dimensionScores={dimensionScores}
            onQuickUpdate={(dim) => navigate(`/dashboard/update/${dim}`)}
          />
          <NextSteps 
            score={diagnostic.total_score} 
            profile={diagnostic.profile || ""} 
          />
        </div>

        {/* Score Comparison - se houver histórico */}
        {history && history.length >= 2 && (
          <div className="mb-4 md:mb-6 lg:mb-8">
            <ScoreComparison 
              currentDiagnostic={diagnostic}
              previousDiagnostic={history[history.length - 2]}
            />
          </div>
        )}

        {/* Radar Chart */}
        <div className="mb-4 md:mb-6 lg:mb-8">
          <ScoreRadar dimensionScores={dimensionScores} />
        </div>

        {/* Score Cards e Perfil */}
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 mb-4 md:mb-6 lg:mb-8" data-tour="score-card">
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
              <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full min-w-0">
                <Button 
                  onClick={() => handleGenerateReport('client')} 
                  disabled={generatingReport}
                  className="flex-1 text-xs md:text-sm min-w-0"
                  variant="default"
                  size="sm"
                >
                  <Download className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Meu Relatório</span>
                </Button>
                <Button 
                  onClick={() => navigate('/consultations')} 
                  className="flex-1 text-xs md:text-sm min-w-0"
                  variant="outline"
                  size="sm"
                >
                  <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Consultoria</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Smart Alerts and Challenges */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6 lg:mb-8" data-tour="alerts-section">
          <SmartAlerts />
          <WeeklyChallenges />
        </div>

        {/* Goals Widget */}
        <div className="mb-4 md:mb-6 lg:mb-8" data-tour="goals-section">
          <GoalsWidget />
        </div>

        {/* Individual Scores */}
        <div className="mb-4 md:mb-6 lg:mb-8">
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
        <div className="mb-4 md:mb-6 lg:mb-8">
          <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 break-words">
            Suas Recomendações Personalizadas
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
            Marque as ações conforme você as completar para acompanhar seu progresso
          </p>
          <div className="space-y-3 md:space-y-4">
            {getRecommendations().map((rec, index) => (
              <RecommendationCard key={index} {...rec} />
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-2 md:flex gap-2 mb-4 md:mb-6 md:border-b md:pb-2">
          <Button 
            variant={activeTab === "overview" ? "default" : "ghost"} 
            onClick={() => setActiveTab("overview")}
            size="sm"
            className="text-xs md:text-sm w-full md:w-auto"
          >
            Visão Geral
          </Button>
          <Button 
            variant={activeTab === "comparison" ? "default" : "ghost"} 
            onClick={() => setActiveTab("comparison")}
            size="sm"
            className="text-xs md:text-sm w-full md:w-auto"
          >
            Comparação
          </Button>
          <Button 
            variant={activeTab === "journey" ? "default" : "ghost"} 
            onClick={() => setActiveTab("journey")}
            size="sm"
            className="text-xs md:text-sm w-full md:w-auto"
          >
            Jornada
          </Button>
          <Button 
            variant={activeTab === "gamification" ? "default" : "ghost"} 
            onClick={() => setActiveTab("gamification")}
            size="sm"
            className="text-xs md:text-sm w-full md:w-auto"
          >
            <Award className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
            Conquistas
          </Button>
        </div>

        {activeTab === "comparison" && history.length > 1 && <DiagnosticComparison />}
        {activeTab === "journey" && <CustomerJourney />}
        {activeTab === "gamification" && (
          <div className="space-y-4 md:space-y-6 mt-4 md:mt-6">
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
        <div className="mt-4 md:mt-6 lg:mt-8">
          <DiagnosticChatbot />
        </div>
      </div>
      
      {/* Quick Update Modal */}
      <QuickUpdateModal 
        open={showQuickUpdateModal}
        onClose={() => setShowQuickUpdateModal(false)}
      />
    </div>
  );
}
