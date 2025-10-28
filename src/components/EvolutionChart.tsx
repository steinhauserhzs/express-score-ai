import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DiagnosticHistory {
  id: string;
  total_score: number;
  dimension_scores: {
    debts: number;
    behavior: number;
    spending: number;
    goals: number;
    reserves: number;
    income: number;
  };
  created_at: string;
  profile: string;
}

interface EvolutionChartProps {
  history: DiagnosticHistory[];
  showDimensions?: boolean;
}

export default function EvolutionChart({ history, showDimensions = false }: EvolutionChartProps) {
  if (!history || history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gráfico de Evolução</CardTitle>
          <CardDescription>Complete mais diagnósticos para ver sua evolução</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const chartData = history
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((item) => ({
      date: format(new Date(item.created_at), "dd/MM", { locale: ptBR }),
      "Score Total": item.total_score,
      ...(showDimensions && {
        "Dívidas": item.dimension_scores.debts,
        "Comportamento": item.dimension_scores.behavior,
        "Gastos": item.dimension_scores.spending,
        "Metas": item.dimension_scores.goals,
        "Reservas": item.dimension_scores.reserves,
        "Renda": item.dimension_scores.income,
      }),
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução do Score</CardTitle>
        <CardDescription>
          {showDimensions ? "Comparação por dimensões" : "Seu progresso ao longo do tempo"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="date" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="Score Total"
              stroke="hsl(var(--primary))"
              strokeWidth={3}
              dot={{ fill: "hsl(var(--primary))", r: 5 }}
            />
            {showDimensions && (
              <>
                <Line type="monotone" dataKey="Dívidas" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="Comportamento" stroke="#f59e0b" strokeWidth={2} />
                <Line type="monotone" dataKey="Gastos" stroke="#eab308" strokeWidth={2} />
                <Line type="monotone" dataKey="Metas" stroke="#84cc16" strokeWidth={2} />
                <Line type="monotone" dataKey="Reservas" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="Renda" stroke="#06b6d4" strokeWidth={2} />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
