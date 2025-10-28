import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DiagnosticData {
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
}

interface ScoreComparisonProps {
  currentDiagnostic: DiagnosticData;
  previousDiagnostic: DiagnosticData;
}

const dimensionLabels = {
  debts: { label: "Dívidas", max: 25, icon: "💳" },
  behavior: { label: "Comportamento", max: 20, icon: "🎯" },
  spending: { label: "Gastos", max: 15, icon: "💸" },
  goals: { label: "Metas", max: 15, icon: "🎯" },
  reserves: { label: "Reservas", max: 15, icon: "🏦" },
  income: { label: "Renda", max: 10, icon: "📈" },
};

export default function ScoreComparison({ currentDiagnostic, previousDiagnostic }: ScoreComparisonProps) {
  const scoreDiff = currentDiagnostic.total_score - previousDiagnostic.total_score;
  const percentChange = ((scoreDiff / previousDiagnostic.total_score) * 100).toFixed(1);

  const getTrendIcon = (diff: number) => {
    if (diff > 0) return <TrendingUp className="w-5 h-5 text-success" />;
    if (diff < 0) return <TrendingDown className="w-5 h-5 text-destructive" />;
    return <Minus className="w-5 h-5 text-muted-foreground" />;
  };

  const getTrendColor = (diff: number) => {
    if (diff > 0) return "text-success";
    if (diff < 0) return "text-destructive";
    return "text-muted-foreground";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📊 Sua Evolução
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score Comparison */}
        <div className="flex items-center gap-6 p-6 bg-muted/50 rounded-lg">
          <div className="flex-1 space-y-2">
            <div className="text-sm text-muted-foreground">
              Score Total
            </div>
            <div className={`text-4xl font-bold ${getTrendColor(scoreDiff)}`}>
              {scoreDiff > 0 ? '+' : ''}{scoreDiff}
            </div>
            <div className="text-sm text-muted-foreground">
              desde {format(new Date(previousDiagnostic.created_at), "dd/MM/yyyy", { locale: ptBR })}
            </div>
            {scoreDiff !== 0 && (
              <div className={`text-sm font-medium ${getTrendColor(scoreDiff)}`}>
                {scoreDiff > 0 ? '+' : ''}{percentChange}% de melhora
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-background">
            {getTrendIcon(scoreDiff)}
          </div>
        </div>

        {/* Dimension Comparison */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">Comparação por Dimensão</h3>
          
          {Object.entries(dimensionLabels).map(([key, config]) => {
            const dimKey = key as keyof typeof dimensionLabels;
            const before = previousDiagnostic.dimension_scores[dimKey];
            const after = currentDiagnostic.dimension_scores[dimKey];
            const diff = after - before;
            
            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {config.icon} {config.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className={getTrendColor(diff)}>
                      {diff > 0 ? '+' : ''}{diff}
                    </span>
                    <span className="text-muted-foreground">
                      {after}/{config.max}
                    </span>
                  </div>
                </div>
                
                {/* Comparison Bar */}
                <div className="relative h-8 bg-background rounded-lg overflow-hidden">
                  {/* Previous score (lighter) */}
                  <div
                    className="absolute inset-y-0 left-0 bg-muted transition-all"
                    style={{ width: `${(before / config.max) * 100}%` }}
                  />
                  
                  {/* Current score (primary) */}
                  <div
                    className="absolute inset-y-0 left-0 bg-primary/50 transition-all"
                    style={{ width: `${(after / config.max) * 100}%` }}
                  />
                  
                  {/* Labels */}
                  <div className="relative h-full flex items-center justify-between px-3 text-xs">
                    <span className="text-foreground/80">Anterior: {before}</span>
                    <span className={`font-semibold ${diff > 0 ? 'text-success' : diff < 0 ? 'text-destructive' : 'text-foreground'}`}>
                      Atual: {after}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Insights */}
        {scoreDiff > 0 && (
          <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
            <p className="text-sm text-success-foreground">
              🎉 <strong>Parabéns!</strong> Você melhorou {scoreDiff} pontos no seu score financeiro. Continue assim!
            </p>
          </div>
        )}
        
        {scoreDiff < 0 && (
          <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <p className="text-sm text-warning-foreground">
              ⚠️ <strong>Atenção!</strong> Seu score diminuiu {Math.abs(scoreDiff)} pontos. Veja as recomendações para melhorar.
            </p>
          </div>
        )}
        
        {scoreDiff === 0 && (
          <div className="p-4 bg-muted/50 border border-border rounded-lg">
            <p className="text-sm text-muted-foreground">
              ℹ️ Seu score se manteve estável. Continue acompanhando seu progresso!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
