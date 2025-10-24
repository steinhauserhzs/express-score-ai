import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface ScoreRadarProps {
  dimensionScores: {
    debts: number;
    behavior: number;
    spending: number;
    goals: number;
    reserves: number;
    income: number;
  };
}

const dimensionLabels = {
  debts: "Dívidas",
  behavior: "Comportamento",
  spending: "Gastos",
  goals: "Metas",
  reserves: "Reservas",
  income: "Renda",
};

const dimensionMaxScores = {
  debts: 25,
  behavior: 20,
  spending: 15,
  goals: 15,
  reserves: 15,
  income: 10,
};

export default function ScoreRadar({ dimensionScores }: ScoreRadarProps) {
  const data = Object.entries(dimensionScores).map(([key, value]) => ({
    dimension: dimensionLabels[key as keyof typeof dimensionLabels],
    score: value,
    maxScore: dimensionMaxScores[key as keyof typeof dimensionMaxScores],
    percentage: (value / dimensionMaxScores[key as keyof typeof dimensionMaxScores]) * 100,
  }));

  return (
    <Card>
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-base md:text-lg break-words">
          Análise por Dimensão
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0">
        <ResponsiveContainer width="100%" height={300} className="md:h-[400px]">
          <RadarChart data={data}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis
              dataKey="dimension"
              tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Radar
              name="Score"
              dataKey="percentage"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
