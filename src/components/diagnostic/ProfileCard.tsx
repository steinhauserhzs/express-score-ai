import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, TrendingDown, AlertCircle, Wallet, TrendingUp } from "lucide-react";

interface ProfileCardProps {
  profile: string;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const getProfileConfig = () => {
    switch (profile.toLowerCase()) {
      case "investidor":
        return {
          icon: TrendingUp,
          color: "text-success",
          bgColor: "bg-success/10",
          title: "🏆 Investidor",
          description: "Parabéns! Você tem excelente saúde financeira e diversifica seus investimentos.",
          traits: [
            "Poupa consistentemente",
            "Diversifica investimentos",
            "Controla bem os gastos",
            "Está no caminho da independência financeira"
          ]
        };
      case "poupador":
        return {
          icon: Wallet,
          color: "text-primary",
          bgColor: "bg-primary/10",
          title: "💰 Poupador",
          description: "Você guarda dinheiro e tem disciplina, mas pode investir melhor.",
          traits: [
            "Guarda dinheiro regularmente",
            "Tem reserva de emergência",
            "É conservador demais",
            "Precisa diversificar investimentos"
          ]
        };
      case "desorganizado":
        return {
          icon: AlertCircle,
          color: "text-warning",
          bgColor: "bg-warning/10",
          title: "📊 Desorganizado",
          description: "Você tem renda mas não controla seus gastos adequadamente.",
          traits: [
            "Não controla gastos",
            "Usa crédito em excesso",
            "Dinheiro 'some' no mês",
            "Precisa criar orçamento"
          ]
        };
      default:
        return {
          icon: TrendingDown,
          color: "text-destructive",
          bgColor: "bg-destructive/10",
          title: "⚠️ Endividado",
          description: "Situação financeira crítica. Foque em renegociação e educação financeira.",
          traits: [
            "Dívidas comprometem renda",
            "Precisa renegociar débitos",
            "Cortar gastos urgente",
            "Buscar aumento de renda"
          ]
        };
    }
  };

  const config = getProfileConfig();
  const Icon = config.icon;

  return (
    <Card className="overflow-hidden border-2 border-primary/20 shadow-lg hover-scale">
      <div className={`h-2 ${config.bgColor.replace('/10', '')}`} />
      <CardHeader className={config.bgColor}>
        <CardTitle className="flex items-center gap-3">
          <div className={`p-3 rounded-full bg-card ${config.color}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">{config.title}</h3>
            <p className="text-sm text-muted-foreground font-normal mt-1">
              Seu perfil financeiro identificado
            </p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <p className="text-foreground mb-6 text-lg">
          {config.description}
        </p>
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">Características:</h4>
          <div className="grid gap-2">
            {config.traits.map((trait, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
              >
                <div className={`w-2 h-2 rounded-full ${config.bgColor.replace('/10', '')}`} />
                <span className="text-sm text-foreground">{trait}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
