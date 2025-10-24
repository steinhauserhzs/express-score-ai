import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface LevelProgressProps {
  currentLevel: string;
  levelPoints: number;
  totalPoints: number;
}

const LEVEL_CONFIG = {
  bronze: { name: "Bronze", icon: "🥉", max: 500, color: "text-orange-600" },
  silver: { name: "Prata", icon: "🥈", max: 1000, color: "text-gray-400" },
  gold: { name: "Ouro", icon: "🥇", max: 1500, color: "text-yellow-500" },
  platinum: { name: "Platina", icon: "💎", max: 2000, color: "text-blue-400" },
  diamond: { name: "Diamante", icon: "💠", max: Infinity, color: "text-cyan-400" },
};

export default function LevelProgress({
  currentLevel,
  levelPoints,
  totalPoints,
}: LevelProgressProps) {
  const config = LEVEL_CONFIG[currentLevel as keyof typeof LEVEL_CONFIG];
  const nextLevelPoints = config.max;
  const progress = config.max === Infinity ? 100 : (levelPoints / nextLevelPoints) * 100;

  return (
    <Card className="p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="text-5xl">{config.icon}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`font-bold text-xl ${config.color}`}>
              Nível {config.name}
            </h3>
            <div className="flex items-center gap-1 text-sm font-medium">
              <Trophy className="h-4 w-4" />
              {totalPoints} pts totais
            </div>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{levelPoints} pts</span>
            {config.max !== Infinity && <span>{nextLevelPoints} pts para próximo nível</span>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {Object.entries(LEVEL_CONFIG).map(([key, level]) => {
          const isActive = key === currentLevel;
          const levels = Object.keys(LEVEL_CONFIG);
          const currentIndex = levels.indexOf(currentLevel);
          const thisIndex = levels.indexOf(key);
          const isPast = thisIndex < currentIndex;

          return (
            <div
              key={key}
              className={`text-center p-2 rounded-lg transition-all ${
                isActive
                  ? "bg-primary/10 scale-110"
                  : isPast
                  ? "opacity-50"
                  : "opacity-30"
              }`}
            >
              <div className="text-2xl mb-1">{level.icon}</div>
              <div className={`text-xs font-medium ${level.color}`}>
                {level.name}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
