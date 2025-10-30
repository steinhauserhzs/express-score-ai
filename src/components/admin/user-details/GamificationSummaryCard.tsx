import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Award, Flame } from "lucide-react";

interface GamificationSummaryCardProps {
  gamification: any;
  badges: any[];
}

export function GamificationSummaryCard({ gamification, badges }: GamificationSummaryCardProps) {
  if (!gamification) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Dados de gamificação não disponíveis</p>
        </div>
      </Card>
    );
  }

  const levelEmojis: Record<string, string> = {
    'bronze': '🥉',
    'prata': '🥈',
    'ouro': '🥇',
    'platina': '💎',
    'diamante': '💠'
  };

  const nextLevelPoints = Math.ceil(gamification.total_points / 1000) * 1000;
  const progressToNextLevel = ((gamification.total_points % 1000) / 1000) * 100;

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-semibold mb-4">🏆 Progresso</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Nível</span>
            <div className="flex items-center gap-2">
              <span className="text-xl">{levelEmojis[gamification.current_level.toLowerCase()] || '🏅'}</span>
              <Badge className="capitalize">{gamification.current_level}</Badge>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Pontos</span>
              <span className="text-sm font-medium">{gamification.total_points} XP</span>
            </div>
            <Progress value={progressToNextLevel} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {nextLevelPoints - gamification.total_points} XP para o próximo nível
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Streak</span>
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-lg font-bold">{gamification.streak_days} dias</span>
            </div>
          </div>
        </div>
      </Card>

      {badges && badges.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-4">🎖️ Badges Recentes</h3>
          <div className="space-y-3">
            {badges.map((badge) => (
              <div key={badge.id} className="flex items-center gap-3">
                <Award className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{badge.badge_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(badge.earned_at).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
