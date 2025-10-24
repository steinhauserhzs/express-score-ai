import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Sparkles, 
  RefreshCw, 
  TrendingUp, 
  AlertTriangle,
  Lightbulb,
  Target
} from "lucide-react";
import { toast } from "sonner";

interface Insight {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  action: string;
  metric: string;
}

interface InsightsData {
  insights: Insight[];
  summary: string;
  alerts: string[];
  opportunities: string[];
  data: any;
  generatedAt: string;
}

export default function AdminInsights() {
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      loadInsights();
    }
  }, [isAdmin]);

  const loadInsights = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-insights');

      if (error) throw error;
      setInsights(data);
      toast.success('Insights atualizados!');
    } catch (error: any) {
      console.error('Error loading insights:', error);
      toast.error('Erro ao carregar insights');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: "bg-red-500 text-white",
      medium: "bg-yellow-500 text-white",
      low: "bg-blue-500 text-white",
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      high: "Alta Prioridade",
      medium: "Média Prioridade",
      low: "Baixa Prioridade",
    };
    return labels[priority as keyof typeof labels] || priority;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Insights com IA
              </h1>
              <p className="text-muted-foreground">
                Análises estratégicas geradas por inteligência artificial
              </p>
            </div>
          </div>
          <Button onClick={loadInsights} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar Insights
          </Button>
        </div>

        {loading && !insights ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : insights ? (
          <>
            {/* Summary Card */}
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Resumo Executivo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{insights.summary}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Gerado em: {new Date(insights.generatedAt).toLocaleString('pt-BR')}
                </p>
              </CardContent>
            </Card>

            {/* Alerts */}
            {insights.alerts && insights.alerts.length > 0 && (
              <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                    <AlertTriangle className="h-5 w-5" />
                    Alertas Críticos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {insights.alerts.map((alert, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>{alert}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Opportunities */}
            {insights.opportunities && insights.opportunities.length > 0 && (
              <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                    <Lightbulb className="h-5 w-5" />
                    Oportunidades Identificadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {insights.opportunities.map((opportunity, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>{opportunity}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Insights Cards */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                Insights Estratégicos
              </h2>
              {insights.insights.map((insight, index) => (
                <Card key={index} className="hover-lift">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl">{insight.title}</CardTitle>
                      <Badge className={getPriorityColor(insight.priority)}>
                        {getPriorityLabel(insight.priority)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{insight.description}</p>
                    
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">📊 Métrica:</span>
                        <span>{insight.metric}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-semibold">🎯 Ação:</span>
                        <span className="flex-1">{insight.action}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Data Summary */}
            {insights.data && (
              <Card>
                <CardHeader>
                  <CardTitle>Dados Analisados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total de Leads</p>
                      <p className="text-2xl font-bold">{insights.data.totalLeads}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Diagnósticos Completos</p>
                      <p className="text-2xl font-bold">{insights.data.completedDiagnostics}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Score Médio</p>
                      <p className="text-2xl font-bold">{insights.data.avgScore}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Consultorias</p>
                      <p className="text-2xl font-bold">{insights.data.totalConsultations}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhum insight carregado
              </h3>
              <p className="text-muted-foreground mb-4">
                Clique em "Atualizar Insights" para gerar análises com IA
              </p>
              <Button onClick={loadInsights}>
                Gerar Insights
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
