import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ScoreRadar from "@/components/ScoreRadar";
import ScoreCard from "@/components/ScoreCard";
import ProfileBadge from "@/components/ProfileBadge";
import RecommendationCard from "@/components/RecommendationCard";
import Logo from "@/components/Logo";
import { toast } from "sonner";
import { Download, FileText, TrendingUp, Calendar } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [diagnostic, setDiagnostic] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate('/auth');
      return;
    }

    await Promise.all([
      loadDiagnostic(user.id),
      loadHistory(user.id)
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
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50 mb-6">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="sm" showText={true} />
          <div className="flex gap-2">
            <Button onClick={() => navigate('/diagnostic')} variant="outline" size="sm">
              <TrendingUp className="h-4 w-4 mr-2" />
              Novo Diagnóstico
            </Button>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Title Section */}
        <div>
          <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
          <p className="text-foreground/70">Seu Score Express da Vida Financeira</p>
        </div>

        {/* Score Total e Perfil */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="hover-scale bg-gradient-to-br from-primary/10 to-primary/5">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Seu Score Total</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <div className={`text-6xl font-bold ${getScoreColor(diagnostic.total_score)}`}>
                {diagnostic.total_score}
                <span className="text-3xl text-muted-foreground">/150</span>
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
            <CardHeader>
              <CardTitle className="text-2xl">Seu Perfil Financeiro</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4">
              {diagnostic.profile && (
                <ProfileBadge profile={diagnostic.profile} />
              )}
              <div className="flex gap-2 mt-4 w-full">
                <Button 
                  onClick={() => handleGenerateReport('client')} 
                  disabled={generatingReport}
                  className="flex-1"
                  variant="default"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Meu Relatório
                </Button>
                <Button 
                  onClick={() => navigate('/consultations')} 
                  className="flex-1"
                  variant="outline"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar Consultoria
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Radar Chart */}
        <ScoreRadar dimensionScores={dimensionScores} />

        {/* Individual Scores */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Análise Detalhada</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
          <h2 className="text-2xl font-bold mb-4">Suas Recomendações Personalizadas</h2>
          <p className="text-muted-foreground mb-4">
            Marque as ações conforme você as completar para acompanhar seu progresso
          </p>
          <div className="space-y-4">
            {getRecommendations().map((rec, index) => (
              <RecommendationCard key={index} {...rec} />
            ))}
          </div>
        </div>

        {/* Histórico */}
        {history.length > 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Evolução do Seu Score</h2>
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  {history.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{item.profile || 'Diagnóstico'}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-2xl font-bold ${getScoreColor(item.total_score)}`}>
                          {item.total_score}
                        </p>
                        {index > 0 && (
                          <p className="text-sm text-muted-foreground">
                            {item.total_score - history[index - 1].total_score > 0 ? '↑' : '↓'} 
                            {Math.abs(item.total_score - history[index - 1].total_score)} pts
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
