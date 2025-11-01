import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface ScoreRadarProps {
  dimensionScores: {
    debts: number;
    behavior: number;
    spending: number;
    goals: number;
    reserves: number;
    income: number;
    protections: number;
    quality_of_life: number;
  };
}

const dimensionLabels = {
  debts: "Dívidas",
  behavior: "Comportamento",
  spending: "Gastos",
  goals: "Metas",
  reserves: "Reservas",
  income: "Renda",
  protections: "Proteções",
  quality_of_life: "Qualidade",
};

const dimensionMaxScores = {
  debts: 25,
  behavior: 20,
  spending: 20,
  goals: 15,
  reserves: 20,
  income: 15,
  protections: 15,
  quality_of_life: 20,
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
        <div className="h-[320px] md:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis
                dataKey="dimension"
                tick={{ 
                  fill: "hsl(var(--foreground))", 
                  fontSize: 12,
                  fontWeight: 500
                }}
                tickLine={false}
                className="text-[10px] md:text-xs font-medium"
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ 
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 11
                }}
                tickCount={5}
                tickFormatter={(value) => `${value}%`}
              />
              <Radar
                name="Score"
                dataKey="percentage"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.5}
              />
              <Tooltip
                formatter={(value: number) => `${value.toFixed(1)}%`}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px"
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
