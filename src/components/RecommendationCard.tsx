import { memo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface RecommendationCardProps {
  title: string;
  description: string;
  priority: 'alta' | 'média' | 'baixa';
  category: string;
}

const priorityConfig = {
  alta: {
    color: "bg-destructive text-destructive-foreground",
    icon: AlertCircle
  },
  média: {
    color: "bg-warning text-warning-foreground",
    icon: AlertCircle
  },
  baixa: {
    color: "bg-primary text-primary-foreground",
    icon: CheckCircle2
  }
};

const RecommendationCard = memo(function RecommendationCard({ 
  title, 
  description, 
  priority, 
  category 
}: RecommendationCardProps) {
  const [completed, setCompleted] = useState(false);
  const config = priorityConfig[priority];
  const Icon = config.icon;

  return (
    <Card className={`hover-scale ${completed ? 'opacity-60' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox 
              checked={completed}
              onCheckedChange={(checked) => setCompleted(checked as boolean)}
              className="mt-1"
            />
            <div className="space-y-2 flex-1">
              <CardTitle className={`text-lg ${completed ? 'line-through' : ''}`}>
                {title}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={`${config.color} gap-1`}>
              <Icon className="h-3 w-3" />
              {priority}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {category}
            </Badge>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
});

export default RecommendationCard;
