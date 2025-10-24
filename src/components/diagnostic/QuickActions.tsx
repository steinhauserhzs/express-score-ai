import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      icon: BookOpen,
      title: "Educação Financeira",
      description: "Aprenda a melhorar sua saúde financeira",
      color: "bg-primary/10 text-primary",
      action: () => navigate("/education"),
    },
    {
      icon: Users,
      title: "Programa de Indicação",
      description: "Ganhe recompensas indicando amigos",
      color: "bg-success/10 text-success",
      action: () => navigate("/refer"),
    },
    {
      icon: BarChart3,
      title: "Ver Evolução",
      description: "Acompanhe seu progresso ao longo do tempo",
      color: "bg-warning/10 text-warning",
      action: () => navigate("/dashboard"),
    },
  ];

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-foreground">
        🎯 Ações Rápidas
      </h2>
      <div className="grid md:grid-cols-3 gap-4">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <button
              key={idx}
              onClick={action.action}
              className="flex flex-col items-center gap-3 p-6 bg-muted/50 rounded-lg hover-scale cursor-pointer transition-all text-center"
            >
              <div className={`w-16 h-16 rounded-full ${action.color} flex items-center justify-center`}>
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}
