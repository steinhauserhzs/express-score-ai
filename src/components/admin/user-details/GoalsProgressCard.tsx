import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, CheckCircle2 } from "lucide-react";

interface GoalsProgressCardProps {
  goals: any[];
}

export function GoalsProgressCard({ goals }: GoalsProgressCardProps) {
  if (!goals || goals.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Target className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhuma meta financeira criada</p>
        </div>
      </Card>
    );
  }

  const activeGoals = goals.filter(g => g.status === 'in_progress' || g.status === 'not_started');
  const completedGoals = goals.filter(g => g.status === 'achieved');
  
  const averageProgress = goals.length > 0 
    ? goals.reduce((acc, g) => {
        const progress = (Number(g.current_amount) / Number(g.target_amount)) * 100;
        return acc + Math.min(progress, 100);
      }, 0) / goals.length
    : 0;

  const categoryEmojis: Record<string, string> = {
    'emergency_fund': '🛡️',
    'investment': '💰',
    'debt_payment': '💳',
    'purchase': '🛒',
    'travel': '✈️',
    'education': '📚',
    'other': '🎯'
  };

  const statusConfig: Record<string, { color: string; label: string; variant: any }> = {
    'not_started': { color: 'text-gray-500', label: 'Não Iniciada', variant: 'secondary' },
    'in_progress': { color: 'text-blue-500', label: 'Em Progresso', variant: 'default' },
    'achieved': { color: 'text-green-500', label: 'Concluída', variant: 'default' },
    'abandoned': { color: 'text-red-500', label: 'Abandonada', variant: 'destructive' }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-semibold mb-4">🎯 Resumo de Metas</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{goals.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Concluídas</p>
            <p className="text-2xl font-bold">{completedGoals.length}</p>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Progresso Médio</span>
            <span className="text-sm font-medium">{averageProgress.toFixed(0)}%</span>
          </div>
          <Progress value={averageProgress} className="h-2" />
        </div>
      </Card>

      {activeGoals.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-4">📊 Metas Ativas</h3>
          <div className="space-y-4">
            {activeGoals.map((goal) => {
              const progress = (Number(goal.current_amount) / Number(goal.target_amount)) * 100;
              const config = statusConfig[goal.status] || statusConfig.not_started;
              
              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                      <span className="text-lg">{categoryEmojis[goal.category] || '🎯'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{goal.title}</p>
                        <Badge variant={config.variant} className="text-xs mt-1">
                          {config.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">
                        R$ {Number(goal.current_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        R$ {Number(goal.target_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <Progress value={Math.min(progress, 100)} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {progress.toFixed(0)}% concluído
                    </p>
                  </div>

                  {goal.deadline && (
                    <p className="text-xs text-muted-foreground">
                      Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {completedGoals.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            Metas Concluídas
          </h3>
          <div className="space-y-2">
            {completedGoals.slice(0, 5).map((goal) => (
              <div key={goal.id} className="flex items-center gap-2 pb-2 border-b last:border-0">
                <span className="text-lg">{categoryEmojis[goal.category] || '🎯'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{goal.title}</p>
                  <p className="text-xs text-muted-foreground">
                    R$ {Number(goal.target_amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                {goal.achieved_at && (
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(goal.achieved_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                  </span>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
