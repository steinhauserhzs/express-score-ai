import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, AlertTriangle, TrendingUp, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface NextStepsProps {
  score: number;
  profile: string;
}

interface Step {
  id: string;
  title: string;
  description: string;
  action: string;
  actionUrl: string;
  priority: "high" | "medium" | "low";
}

export default function NextSteps({ score, profile }: NextStepsProps) {
  const navigate = useNavigate();

  const getSteps = (): Step[] => {
    // Score crítico (0-60)
    if (score < 60) {
      return [
        {
          id: "1",
          title: "Renegocie suas dívidas",
          description: "Contate seus credores e busque condições melhores de pagamento",
          action: "Agendar Consultoria",
          actionUrl: "/consultations",
          priority: "high",
        },
        {
          id: "2",
          title: "Corte gastos supérfluos",
          description: "Identifique despesas desnecessárias e reduza-as imediatamente",
          action: "Ver Dicas",
          actionUrl: "/education?category=debt",
          priority: "high",
        },
        {
          id: "3",
          title: "Crie uma reserva de emergência",
          description: "Comece guardando pelo menos R$50 por mês",
          action: "Criar Meta",
          actionUrl: "/goals",
          priority: "medium",
        },
      ];
    }

    // Score em evolução (60-100)
    if (score < 100) {
      return [
        {
          id: "1",
          title: "Construa sua reserva de emergência",
          description: "Acumule 3-6 meses de despesas em aplicações líquidas",
          action: "Criar Meta",
          actionUrl: "/goals",
          priority: "high",
        },
        {
          id: "2",
          title: "Organize seu orçamento",
          description: "Use a regra 50-30-20 para distribuir sua renda",
          action: "Ver Método",
          actionUrl: "/education?category=budget",
          priority: "medium",
        },
        {
          id: "3",
          title: "Comece a investir",
          description: "Explore opções de baixo risco como Tesouro Direto",
          action: "Aprender Mais",
          actionUrl: "/education?category=investment",
          priority: "medium",
        },
      ];
    }

    // Score saudável (100-130)
    if (score < 130) {
      return [
        {
          id: "1",
          title: "Diversifique seus investimentos",
          description: "Explore fundos imobiliários, ações e renda fixa",
          action: "Ver Estratégias",
          actionUrl: "/education?category=investment",
          priority: "high",
        },
        {
          id: "2",
          title: "Planeje seus objetivos de longo prazo",
          description: "Casa própria, aposentadoria, educação dos filhos",
          action: "Definir Metas",
          actionUrl: "/goals",
          priority: "medium",
        },
        {
          id: "3",
          title: "Otimize sua carteira",
          description: "Revise periodicamente e rebalanceie seus ativos",
          action: "Agendar Consultoria",
          actionUrl: "/consultations",
          priority: "low",
        },
      ];
    }

    // Score avançado (130+)
    return [
      {
        id: "1",
        title: "Otimize sua carga tributária",
        description: "Explore estratégias legais de redução de impostos",
        action: "Consultar Especialista",
        actionUrl: "/consultations",
        priority: "high",
      },
      {
        id: "2",
        title: "Planeje sua aposentadoria",
        description: "Garanta independência financeira no futuro",
        action: "Fazer Simulação",
        actionUrl: "/goals",
        priority: "medium",
      },
      {
        id: "3",
        title: "Considere investimentos internacionais",
        description: "Diversifique globalmente sua carteira",
        action: "Aprender Mais",
        actionUrl: "/education?category=investment",
        priority: "low",
      },
    ];
  };

  const steps = getSteps();

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case "medium":
        return <TrendingUp className="h-5 w-5 text-warning" />;
      default:
        return <Sparkles className="h-5 w-5 text-primary" />;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Urgente";
      case "medium":
        return "Importante";
      default:
        return "Recomendado";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximos Passos</CardTitle>
        <CardDescription>Recomendações personalizadas para você</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
              {index + 1}
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                {getPriorityIcon(step.priority)}
                <span className="text-xs font-medium text-muted-foreground">
                  {getPriorityLabel(step.priority)}
                </span>
              </div>
              <h4 className="font-semibold">{step.title}</h4>
              <p className="text-sm text-muted-foreground">{step.description}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(step.actionUrl)}
                className="mt-2"
              >
                {step.action}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
