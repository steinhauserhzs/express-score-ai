import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, Target, AlertTriangle } from "lucide-react";

interface ClassificationBadgeProps {
  classification: string;
  score: number;
}

export default function ClassificationBadge({ classification, score }: ClassificationBadgeProps) {
  const getBadgeConfig = () => {
    switch (classification.toLowerCase()) {
      case "avançado":
        return {
          icon: Trophy,
          color: "bg-success text-success-foreground",
          label: "Avançado",
          description: "Excelente saúde financeira!",
        };
      case "saudável":
        return {
          icon: TrendingUp,
          color: "bg-primary text-primary-foreground",
          label: "Saudável",
          description: "Boa gestão financeira",
        };
      case "em evolução":
        return {
          icon: Target,
          color: "bg-warning text-warning-foreground",
          label: "Em Evolução",
          description: "Continue melhorando",
        };
      default:
        return {
          icon: AlertTriangle,
          color: "bg-destructive text-destructive-foreground",
          label: "Crítico",
          description: "Requer atenção urgente",
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center gap-3 animate-scale-in">
      <div className={`flex items-center gap-3 px-6 py-3 rounded-full ${config.color} shadow-lg`}>
        <Icon className="w-6 h-6" />
        <span className="text-2xl font-bold">{config.label}</span>
      </div>
      <p className="text-muted-foreground">{config.description}</p>
    </div>
  );
}
