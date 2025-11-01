import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EvolutionChart from "@/components/EvolutionChart";
import ScoreRadar from "@/components/ScoreRadar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { TrendingUp, TrendingDown, Target, Award, Calendar, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DiagnosticHistory {
  id: string;
  diagnostic_id: string;
  total_score: number;
  dimension_scores: {
    debts: number;
    behavior: number;
    spending: number;
    goals: number;
    reserves: number;
    income: number;
    protections: number;
    quality_of_life: number;
  };
  created_at: string;
  profile: string;
  score_classification: string;
}

export default function Evolution() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [history, setHistory] = useState<DiagnosticHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [compareFrom, setCompareFrom] = useState<string>("");
  const [compareTo, setCompareTo] = useState<string>("");

  useEffect(() => {
    loadHistory();
  }, [user]);

  const loadHistory = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("diagnostic_history")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading history:", error);
    } else if (data) {
      // Normalizar dados antigos que podem não ter as novas dimensões
      const normalizedData = data.map((item: any) => {
        const scores = item.dimension_scores;
        return {
          ...item,
          dimension_scores: {
            debts: scores.debts ?? 0,
            behavior: scores.behavior ?? 0,
            spending: scores.spending ?? 0,
            goals: scores.goals ?? 0,
            reserves: scores.reserves ?? 0,
            income: scores.income ?? 0,
            protections: scores.protections ?? 0,
            quality_of_life: scores.quality_of_life ?? 0,
          }
        };
      });
      setHistory(normalizedData as any);
    }
    setLoading(false);
  };

  const getEvolutionStats = () => {
    if (history.length < 2) return null;

    const latest = history[0];
    const oldest = history[history.length - 1];
    const evolution = latest.total_score - oldest.total_score;

    // Find best and worst dimensions
    const dimensions = Object.entries(latest.dimension_scores) as [string, number][];
    const oldestDimensions = oldest.dimension_scores;
    
    const dimensionEvolution = dimensions.map(([key, value]) => ({
      name: key,
      current: value,
      old: oldestDimensions[key as keyof typeof oldestDimensions],
      diff: value - oldestDimensions[key as keyof typeof oldestDimensions]
    }));

    const best = dimensionEvolution.reduce((prev, curr) => curr.diff > prev.diff ? curr : prev);
    const worst = dimensionEvolution.reduce((prev, curr) => curr.diff < prev.diff ? curr : prev);

    return { evolution, best, worst, streak: history.length };
  };

  const stats = getEvolutionStats();

  const getDimensionName = (key: string) => {
    const names: Record<string, string> = {
      debts: "Dívidas",
      behavior: "Comportamento",
      spending: "Gastos",
      goals: "Metas",
      reserves: "Reservas",
      income: "Renda",
      protections: "Proteções",
      quality_of_life: "Qualidade de Vida"
    };
    return names[key] || key;
  };

  const compareData = () => {
    if (!compareFrom || !compareTo) return null;
    
    const from = history.find(h => h.id === compareFrom);
    const to = history.find(h => h.id === compareTo);
    
    if (!from || !to) return null;
    
    return { from, to };
  };

  const comparison = compareData();

  if (loading) {
    return (
      <Layout showSidebar={true}>
        <div className="container mx-auto py-8 px-4">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </Layout>
    );
  }

  if (history.length === 0) {
    return (
      <Layout showSidebar={true}>
        <div className="container mx-auto py-8 px-4">
          <Card>
            <CardHeader>
              <CardTitle>📈 Minha Evolução</CardTitle>
              <CardDescription>Você ainda não tem diagnósticos suficientes para visualizar sua evolução</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/diagnostic")}>
                Fazer Novo Diagnóstico
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar={true}>
      <div className="container mx-auto py-8 px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">📈 Minha Evolução</h1>
            <p className="text-muted-foreground">Acompanhe seu progresso financeiro ao longo do tempo</p>
          </div>
          <Button onClick={() => navigate("/diagnostic")}>
            Novo Diagnóstico
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Evolução Total</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  {stats.evolution >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={`text-2xl font-bold ${stats.evolution >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stats.evolution >= 0 ? '+' : ''}{stats.evolution}
                  </span>
                  <span className="text-sm text-muted-foreground">pontos</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Melhor Dimensão</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm font-semibold">{getDimensionName(stats.best.name)}</p>
                    <p className="text-xs text-green-500">+{stats.best.diff} pontos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Área de Foco</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-orange-500" />
                  <div>
                    <p className="text-sm font-semibold">{getDimensionName(stats.worst.name)}</p>
                    <p className="text-xs text-orange-500">{stats.worst.diff} pontos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Sequência Atual</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  <span className="text-2xl font-bold">{stats.streak}x</span>
                  <span className="text-sm text-muted-foreground">diagnósticos</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Evolution Chart */}
        <Tabs defaultValue="total" className="w-full">
          <TabsList>
            <TabsTrigger value="total">Score Total</TabsTrigger>
            <TabsTrigger value="dimensions">Por Dimensão</TabsTrigger>
          </TabsList>
          <TabsContent value="total">
            <EvolutionChart history={history} showDimensions={false} />
          </TabsContent>
          <TabsContent value="dimensions">
            <EvolutionChart history={history} showDimensions={true} />
          </TabsContent>
        </Tabs>

        {/* Diagnostic History */}
        <Card>
          <CardHeader>
            <CardTitle>📊 Histórico de Diagnósticos</CardTitle>
            <CardDescription>Todos os seus diagnósticos realizados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {history.map((diagnostic, index) => {
                const previous = history[index + 1];
                const diff = previous ? diagnostic.total_score - previous.total_score : 0;
                
                return (
                  <div key={diagnostic.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-semibold">
                          {format(new Date(diagnostic.created_at), "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                        <p className="text-sm text-muted-foreground">{diagnostic.score_classification}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xl font-bold">{diagnostic.total_score}</p>
                        {previous && (
                          <p className={`text-sm ${diff >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {diff >= 0 ? '+' : ''}{diff} pontos
                          </p>
                        )}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/diagnostic-results?id=${diagnostic.diagnostic_id}`)}
                      >
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Comparison Tool */}
        {history.length >= 2 && (
          <Card>
            <CardHeader>
              <CardTitle>🔍 Comparar Diagnósticos</CardTitle>
              <CardDescription>Compare dois diagnósticos para ver sua evolução em detalhe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Diagnóstico 1</label>
                  <Select value={compareFrom} onValueChange={setCompareFrom}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um diagnóstico" />
                    </SelectTrigger>
                    <SelectContent>
                      {history.map((h) => (
                        <SelectItem key={h.id} value={h.id}>
                          {format(new Date(h.created_at), "dd/MM/yyyy", { locale: ptBR })} - Score: {h.total_score}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Diagnóstico 2</label>
                  <Select value={compareTo} onValueChange={setCompareTo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um diagnóstico" />
                    </SelectTrigger>
                    <SelectContent>
                      {history.map((h) => (
                        <SelectItem key={h.id} value={h.id}>
                          {format(new Date(h.created_at), "dd/MM/yyyy", { locale: ptBR })} - Score: {h.total_score}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {comparison && (
                <div className="space-y-4 pt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <ScoreRadar dimensionScores={comparison.from.dimension_scores} />
                    <ScoreRadar dimensionScores={comparison.to.dimension_scores} />
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-3">Diferenças por Dimensão</h4>
                    <div className="space-y-2">
                      {Object.entries(comparison.from.dimension_scores).map(([key, fromValue]) => {
                        const toValue = comparison.to.dimension_scores[key as keyof typeof comparison.to.dimension_scores];
                        const diff = toValue - fromValue;
                        return (
                          <div key={key} className="flex items-center justify-between">
                            <span className="text-sm">{getDimensionName(key)}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">{fromValue} → {toValue}</span>
                              <span className={`text-sm font-semibold ${diff >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {diff >= 0 ? '+' : ''}{diff}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
