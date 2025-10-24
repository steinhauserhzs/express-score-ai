import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertCircle, PiggyBank, Trophy } from "lucide-react";

interface ProfileBadgeProps {
  profile: 'Endividado' | 'Desorganizado' | 'Poupador' | 'Investidor';
  className?: string;
}

const profileConfig = {
  Endividado: {
    icon: AlertCircle,
    color: "bg-destructive text-destructive-foreground",
    description: "Situação crítica - Foco em renegociação de dívidas"
  },
  Desorganizado: {
    icon: AlertCircle,
    color: "bg-warning text-warning-foreground",
    description: "Precisa organizar as finanças e controlar gastos"
  },
  Poupador: {
    icon: PiggyBank,
    color: "bg-primary text-primary-foreground",
    description: "Bom controle financeiro - Pode diversificar investimentos"
  },
  Investidor: {
    icon: Trophy,
    color: "bg-success text-success-foreground",
    description: "Excelente saúde financeira - Rumo à liberdade financeira"
  }
};

export default function ProfileBadge({ profile, className = "" }: ProfileBadgeProps) {
  const config = profileConfig[profile];
  const Icon = config.icon;

  return (
    <div className={`space-y-2 ${className}`}>
      <Badge className={`${config.color} text-lg px-4 py-2 gap-2`}>
        <Icon className="h-5 w-5" />
        {profile}
      </Badge>
      <p className="text-sm text-muted-foreground">{config.description}</p>
    </div>
  );
}
