import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ScoreCardProps {
  title: string;
  score: number;
  maxScore: number;
  description?: string;
}

export default function ScoreCard({ title, score, maxScore, description }: ScoreCardProps) {
  const percentage = (score / maxScore) * 100;
  const getScoreColor = (pct: number) => {
    if (pct >= 80) return "text-success";
    if (pct >= 50) return "text-warning";
    return "text-destructive";
  };

  return (
    <Card className="hover-scale">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <span className={`text-3xl font-bold ${getScoreColor(percentage)}`}>
              {score}
            </span>
            <span className="text-muted-foreground">/ {maxScore}</span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
