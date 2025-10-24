import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DiagnosticHistory {
  id: string;
  total_score: number;
  dimension_scores: any;
  created_at: string;
  profile: string;
}

export default function DiagnosticComparison() {
  const [history, setHistory] = useState<DiagnosticHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("diagnostic_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error("Error loading history:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando histórico...</div>;
  }

  if (history.length < 2) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">
          Complete mais diagnósticos para comparar sua evolução
        </p>
      </Card>
    );
  }

  // Prepare data for line chart
  const scoreEvolution = history.map((h) => ({
    date: format(new Date(h.created_at), "dd/MM/yy", { locale: ptBR }),
    score: h.total_score,
  }));

  // Prepare data for radar chart (compare first and last)
  const first = history[0];
  const last = history[history.length - 1];

  const radarData = [
    {
      dimension: "Dívidas",
      primeiro: first.dimension_scores.debts,
      ultimo: last.dimension_scores.debts,
    },
    {
      dimension: "Comportamento",
      primeiro: first.dimension_scores.behavior,
      ultimo: last.dimension_scores.behavior,
    },
    {
      dimension: "Gastos",
      primeiro: first.dimension_scores.spending,
      ultimo: last.dimension_scores.spending,
    },
    {
      dimension: "Objetivos",
      primeiro: first.dimension_scores.goals,
      ultimo: last.dimension_scores.goals,
    },
    {
      dimension: "Reservas",
      primeiro: first.dimension_scores.reserves,
      ultimo: last.dimension_scores.reserves,
    },
    {
      dimension: "Renda",
      primeiro: first.dimension_scores.income,
      ultimo: last.dimension_scores.income,
    },
  ];

  // Calculate overall change
  const totalChange = last.total_score - first.total_score;
  const percentChange = ((totalChange / first.total_score) * 100).toFixed(1);

  const getTrendIcon = () => {
    if (totalChange > 0) return <TrendingUp className="h-5 w-5 text-green-500" />;
    if (totalChange < 0) return <TrendingDown className="h-5 w-5 text-red-500" />;
    return <Minus className="h-5 w-5 text-gray-500" />;
  };

  const getTrendColor = () => {
    if (totalChange > 0) return "text-green-500";
    if (totalChange < 0) return "text-red-500";
    return "text-gray-500";
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Evolução do Score Total</h2>
        
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">Primeiro Diagnóstico</div>
            <div className="text-3xl font-bold">{first.total_score}</div>
          </div>
          
          <div className="flex flex-col items-center">
            {getTrendIcon()}
            <Badge className={getTrendColor()}>
              {totalChange > 0 ? "+" : ""}{totalChange} pts ({percentChange}%)
            </Badge>
          </div>
          
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-1">Último Diagnóstico</div>
            <div className="text-3xl font-bold">{last.total_score}</div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={scoreEvolution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 200]} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="score"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              name="Score Total"
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">Comparação por Dimensões</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Comparando primeiro e último diagnósticos
        </p>

        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="dimension" />
            <PolarRadiusAxis domain={[0, 30]} />
            <Radar
              name="Primeiro"
              dataKey="primeiro"
              stroke="hsl(var(--muted-foreground))"
              fill="hsl(var(--muted-foreground))"
              fillOpacity={0.3}
            />
            <Radar
              name="Último"
              dataKey="ultimo"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.5}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {radarData.map((dim) => {
            const change = dim.ultimo - dim.primeiro;
            return (
              <Card key={dim.dimension} className="p-4">
                <div className="text-sm font-medium mb-2">{dim.dimension}</div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{dim.ultimo}</span>
                  <Badge variant={change > 0 ? "default" : change < 0 ? "destructive" : "outline"}>
                    {change > 0 ? "+" : ""}{change}
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Histórico de Perfis</h2>
        <div className="space-y-3">
          {history.map((h, index) => (
            <div
              key={h.id}
              className="flex items-center justify-between p-4 bg-muted rounded-lg"
            >
              <div>
                <div className="font-medium">{h.profile}</div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(h.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{h.total_score}</div>
                {index > 0 && (
                  <Badge variant="outline">
                    {h.total_score - history[index - 1].total_score > 0 ? "+" : ""}
                    {h.total_score - history[index - 1].total_score}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
