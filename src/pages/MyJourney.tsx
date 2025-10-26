import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  Award,
  Target,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function MyJourney() {
  const [diagnostics, setDiagnostics] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Fetch diagnostics
      const { data: diagData } = await supabase
        .from("diagnostics")
        .select("*")
        .eq("user_id", user.id)
        .eq("completed", true)
        .order("created_at", { ascending: true });

      setDiagnostics(diagData || []);

      // Fetch milestones
      const { data: milestoneData } = await supabase
        .from("financial_milestones")
        .select("*")
        .eq("user_id", user.id)
        .order("achieved_at", { ascending: false })
        .limit(10);

      setMilestones(milestoneData || []);

      // Fetch goals
      const { data: goalsData } = await supabase
        .from("financial_goals")
        .select("*")
        .eq("user_id", user.id)
        .in("status", ["in_progress", "achieved"])
        .order("created_at", { ascending: false });

      setGoals(goalsData || []);

    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus dados.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const chartData = diagnostics.map((d) => ({
    date: new Date(d.created_at).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
    score: d.total_score,
    debts: d.dimension_scores?.debts || 0,
    behavior: d.dimension_scores?.behavior || 0,
    spending: d.dimension_scores?.spending || 0,
    goals: d.dimension_scores?.goals || 0,
    reserves: d.dimension_scores?.reserves || 0,
    income: d.dimension_scores?.income || 0,
  }));

  const latestDiagnostic = diagnostics[diagnostics.length - 1];
  const previousDiagnostic = diagnostics[diagnostics.length - 2];
  const scoreDifference = previousDiagnostic 
    ? latestDiagnostic.total_score - previousDiagnostic.total_score 
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="h-8 bg-muted animate-pulse rounded" />
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (diagnostics.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="p-12 text-center">
            <Sparkles className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Sua Jornada Começa Aqui</h2>
            <p className="text-muted-foreground mb-6">
              Faça seu primeiro diagnóstico para começar a acompanhar sua evolução financeira
            </p>
            <Button size="lg" onClick={() => navigate("/diagnostic")}>
              Fazer Diagnóstico
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Minha Jornada Financeira</h1>
            <p className="text-muted-foreground">Acompanhe sua evolução ao longo do tempo</p>
          </div>
          <Button onClick={() => navigate("/diagnostic")}>
            Novo Diagnóstico
          </Button>
        </div>

        {/* Score Overview */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Score Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{latestDiagnostic.total_score}/150</div>
              {scoreDifference !== 0 && (
                <div className={`flex items-center gap-1 text-sm mt-2 ${scoreDifference > 0 ? 'text-success' : 'text-destructive'}`}>
                  {scoreDifference > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span>{scoreDifference > 0 ? '+' : ''}{scoreDifference} pontos</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Classificação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{latestDiagnostic.score_classification}</div>
              <p className="text-sm text-muted-foreground mt-2">
                {latestDiagnostic.profile}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Diagnósticos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">{diagnostics.length}</div>
              <p className="text-sm text-muted-foreground mt-2">
                Último há {formatDistanceToNow(new Date(latestDiagnostic.created_at), { addSuffix: true, locale: ptBR })}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Evolution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Evolução do Score</CardTitle>
            <CardDescription>Acompanhe o progresso do seu score ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 150]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="score" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  name="Score Total"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Goals Progress */}
        {goals.length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Minhas Metas</CardTitle>
                <CardDescription>Progresso das suas metas financeiras</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate("/goals")}>
                Ver Todas <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {goals.slice(0, 3).map((goal) => (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{goal.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {Math.round((goal.current_amount / goal.target_amount) * 100)}%
                      </span>
                      {goal.status === 'achieved' && (
                        <Badge variant="default" className="bg-success">Conquistada</Badge>
                      )}
                    </div>
                  </div>
                  <Progress value={(goal.current_amount / goal.target_amount) * 100} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>R$ {goal.current_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    <span>Meta: R$ {goal.target_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Milestones Timeline */}
        {milestones.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Conquistas e Marcos
              </CardTitle>
              <CardDescription>Sua linha do tempo de sucesso</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {milestones.map((milestone, index) => (
                  <div key={milestone.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      {index < milestones.length - 1 && (
                        <div className="w-0.5 h-full bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">{milestone.description}</h4>
                        {milestone.value && (
                          <Badge variant="secondary">
                            R$ {milestone.value.toLocaleString('pt-BR')}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(milestone.achieved_at), { addSuffix: true, locale: ptBR })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}