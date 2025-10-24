import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";

interface ScorePreviewProps {
  currentScore: number;
  totalQuestions: number;
  answeredQuestions: number;
}

export default function ScorePreview({ currentScore, totalQuestions, answeredQuestions }: ScorePreviewProps) {
  const progress = (answeredQuestions / totalQuestions) * 100;
  const estimatedFinalScore = Math.round((currentScore / answeredQuestions) * totalQuestions);

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5" />
          Preview do Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-4xl font-bold text-primary">
            {estimatedFinalScore}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Score Estimado Final
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">{answeredQuestions}/{totalQuestions}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="text-center text-sm text-muted-foreground">
          {progress < 50 ? "Você está indo bem! Continue!" : 
           progress < 100 ? "Quase lá! Mantenha o foco!" : 
           "Parabéns por completar!"}
        </div>
      </CardContent>
    </Card>
  );
}
