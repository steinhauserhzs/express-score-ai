import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, TrendingUp, Zap, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DimensionScores {
  debts: number;
  behavior: number;
  spending: number;
  goals: number;
  reserves: number;
  income: number;
}

interface AreasToImproveProps {
  dimensionScores: DimensionScores;
  onQuickUpdate: (dimension: string) => void;
}

interface DimensionInfo {
  key: keyof DimensionScores;
  label: string;
  icon: string;
  maxScore: number;
  tips: string[];
}

const dimensions: DimensionInfo[] = [
  {
    key: 'debts',
    label: 'Dívidas',
    icon: '💳',
    maxScore: 25,
    tips: [
      'Renegocie suas dívidas para obter melhores condições',
      'Priorize dívidas com juros mais altos',
      'Evite novas dívidas desnecessárias'
    ]
  },
  {
    key: 'behavior',
    label: 'Comportamento',
    icon: '🎯',
    maxScore: 20,
    tips: [
      'Registre todos os seus gastos diariamente',
      'Crie um orçamento mensal realista',
      'Evite compras por impulso'
    ]
  },
  {
    key: 'spending',
    label: 'Gastos',
    icon: '💸',
    maxScore: 15,
    tips: [
      'Identifique e corte gastos não essenciais',
      'Compare preços antes de comprar',
      'Use a regra 50/30/20 para seu orçamento'
    ]
  },
  {
    key: 'goals',
    label: 'Metas',
    icon: '🎯',
    maxScore: 15,
    tips: [
      'Defina objetivos financeiros claros e mensuráveis',
      'Divida grandes metas em etapas menores',
      'Acompanhe seu progresso mensalmente'
    ]
  },
  {
    key: 'reserves',
    label: 'Reservas',
    icon: '🏦',
    maxScore: 15,
    tips: [
      'Construa uma reserva de emergência de 6 meses',
      'Comece guardando ao menos 10% da renda',
      'Mantenha sua reserva em aplicações líquidas'
    ]
  },
  {
    key: 'income',
    label: 'Renda',
    icon: '📈',
    maxScore: 10,
    tips: [
      'Busque formas de aumentar sua renda',
      'Considere trabalhos extras ou freelances',
      'Invista em sua qualificação profissional'
    ]
  }
];

export default function AreasToImprove({ dimensionScores, onQuickUpdate }: AreasToImproveProps) {
  const navigate = useNavigate();
  
  // Identifica áreas com score baixo (menos de 60% do máximo)
  const areasNeedingImprovement = dimensions
    .map(dim => ({
      ...dim,
      score: dimensionScores[dim.key],
      percentage: (dimensionScores[dim.key] / dim.maxScore) * 100,
      needsImprovement: (dimensionScores[dim.key] / dim.maxScore) < 0.6
    }))
    .filter(area => area.needsImprovement)
    .sort((a, b) => a.percentage - b.percentage);

  // Áreas com bom desempenho
  const areasDoingWell = dimensions
    .map(dim => ({
      ...dim,
      score: dimensionScores[dim.key],
      percentage: (dimensionScores[dim.key] / dim.maxScore) * 100,
      needsImprovement: (dimensionScores[dim.key] / dim.maxScore) < 0.6
    }))
    .filter(area => !area.needsImprovement)
    .sort((a, b) => b.percentage - a.percentage);

  return (
    <Card className="border-2 border-warning/20 bg-gradient-to-br from-warning/5 to-warning/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          🎯 Áreas Prioritárias
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Foque nestas áreas para melhorar sua saúde financeira
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {areasNeedingImprovement.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-4">
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Excelente desempenho! 🎉</h3>
            <p className="text-sm text-muted-foreground">
              Todas as suas áreas financeiras estão com bom desempenho.
              Continue assim e busque sempre melhorar!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {areasNeedingImprovement.map((area) => (
              <div
                key={area.key}
                className="p-4 bg-background rounded-lg border border-warning/20 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{area.icon}</span>
                    <div>
                      <h4 className="font-semibold">{area.label}</h4>
                      <p className="text-sm text-muted-foreground">
                        {area.score}/{area.maxScore} pontos
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      area.percentage < 40 ? 'text-destructive' : 'text-warning'
                    }`}>
                      {Math.round(area.percentage)}%
                    </div>
                  </div>
                </div>

                <Progress value={area.percentage} className="h-2" />

                <div className="bg-muted/50 p-4 rounded-md space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    Dicas Rápidas:
                  </p>
                  <ul className="space-y-1.5">
                    {area.tips.slice(0, 2).map((tip, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span className="break-words">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => onQuickUpdate(area.key)}
                    className="flex-1 gap-2 w-full sm:w-auto"
                  >
                    <Zap className="h-4 w-4" />
                    Atualizar Status
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate('/education')}
                    className="gap-2 w-full sm:w-auto"
                  >
                    <BookOpen className="h-4 w-4" />
                    Ver Dicas
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {areasDoingWell.length > 0 && areasNeedingImprovement.length > 0 && (
          <div className="pt-4 border-t">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              ✅ Áreas com Bom Desempenho
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {areasDoingWell.map((area) => (
                <div
                  key={area.key}
                  className="p-3 bg-success/5 rounded border border-success/20 flex items-center gap-2"
                >
                  <span className="text-lg">{area.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium break-words">{area.label}</p>
                    <p className="text-xs text-success font-semibold">
                      {Math.round(area.percentage)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
