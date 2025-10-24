import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";

interface ScoreRevealProps {
  score: number;
  maxScore: number;
}

export default function ScoreReveal({ score, maxScore }: ScoreRevealProps) {
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    const duration = 2000; // 2 seconds animation
    const steps = 60;
    const increment = score / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setCurrentScore(score);
        clearInterval(timer);
      } else {
        setCurrentScore(Math.round(increment * currentStep));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [score]);

  const percentage = (currentScore / maxScore) * 100;
  
  const getScoreColor = () => {
    if (percentage >= 85) return "text-success";
    if (percentage >= 65) return "text-primary";
    if (percentage >= 35) return "text-warning";
    return "text-destructive";
  };

  const getEmoji = () => {
    if (percentage >= 85) return "🚀";
    if (percentage >= 65) return "🌟";
    if (percentage >= 35) return "💪";
    return "🎯";
  };

  return (
    <Card className="p-8 bg-gradient-card shadow-xl border-2 border-primary/20 hover-glow">
      <div className="flex flex-col items-center space-y-4">
        <div className="text-6xl animate-bounce-in">{getEmoji()}</div>
        
        <div className="flex items-baseline gap-2">
          <span className={`text-7xl md:text-8xl font-bold ${getScoreColor()} transition-all duration-300`}>
            {currentScore}
          </span>
          <span className="text-3xl text-muted-foreground">/ {maxScore}</span>
        </div>

        <div className="w-full max-w-md">
          <div className="h-4 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-primary transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">
            {Math.round(percentage)}% de saúde financeira
          </p>
        </div>
      </div>
    </Card>
  );
}
