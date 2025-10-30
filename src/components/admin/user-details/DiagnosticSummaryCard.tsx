import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface DiagnosticSummaryCardProps {
  diagnostics: any[];
}

export function DiagnosticSummaryCard({ diagnostics }: DiagnosticSummaryCardProps) {
  if (!diagnostics || diagnostics.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Activity className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhum diagnóstico realizado ainda</p>
        </div>
      </Card>
    );
  }

  const completed = diagnostics.filter(d => d.completed);
  const lastDiagnostic = completed[0];
  const firstDiagnostic = completed[completed.length - 1];
  
  const scoreEvolution = completed.map(d => ({
    date: new Date(d.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    score: d.total_score
  })).reverse();

  const scoreDiff = lastDiagnostic && firstDiagnostic 
    ? lastDiagnostic.total_score - firstDiagnostic.total_score 
    : 0;

  const getTrendIcon = () => {
    if (scoreDiff > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (scoreDiff < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getClassificationColor = (classification: string): "default" | "destructive" | "secondary" => {
    const colors: Record<string, "default" | "destructive" | "secondary"> = {
      'Crítico': 'destructive',
      'Atenção': 'secondary',
      'Intermediário': 'default',
      'Bom': 'default',
      'Excelente': 'default'
    };
    return colors[classification] || 'secondary';
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-semibold mb-4">📊 Resumo de Diagnósticos</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{diagnostics.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Completados</p>
            <p className="text-2xl font-bold">{completed.length}</p>
          </div>
        </div>
      </Card>

      {lastDiagnostic && (
        <>
          <Card className="p-4">
            <h3 className="font-semibold mb-4">🎯 Último Diagnóstico</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Score Total</span>
                <span className="text-2xl font-bold">{lastDiagnostic.total_score}/100</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Classificação</span>
                <Badge variant={getClassificationColor(lastDiagnostic.score_classification)}>
                  {lastDiagnostic.score_classification}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Data</span>
                <span className="text-sm">
                  {new Date(lastDiagnostic.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          </Card>

          {completed.length > 1 && (
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">📈 Evolução de Score</h3>
                <div className="flex items-center gap-2">
                  {getTrendIcon()}
                  <span className={`text-sm font-medium ${scoreDiff > 0 ? 'text-green-500' : scoreDiff < 0 ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {scoreDiff > 0 ? '+' : ''}{scoreDiff} pontos
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={scoreEvolution}>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    domain={[0, 100]}
                    tick={{ fontSize: 10 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "6px"
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
