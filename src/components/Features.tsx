import { Brain, Target, TrendingUp, Shield, Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "Inteligência Artificial",
    description: "Análise avançada com IA que entende seu perfil financeiro único"
  },
  {
    icon: Target,
    title: "Score Personalizado",
    description: "Pontuação de 0 a 100 em 6 dimensões da sua vida financeira"
  },
  {
    icon: TrendingUp,
    title: "Recomendações Práticas",
    description: "Ações concretas para melhorar sua saúde financeira"
  },
  {
    icon: Shield,
    title: "Dados Seguros",
    description: "Suas informações protegidas com criptografia de ponta"
  },
  {
    icon: Clock,
    title: "Rápido e Fácil",
    description: "Complete o diagnóstico em apenas 5 minutos"
  },
  {
    icon: Users,
    title: "Suporte Especializado",
    description: "Acesso a consultores financeiros certificados"
  }
];

const Features = () => {
  return (
    <section className="py-24 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Tudo que você precisa para
            <span className="block mt-2 text-primary font-bold">controlar suas finanças</span>
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Uma plataforma completa para transformar sua relação com o dinheiro
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="border-border/50 hover:border-primary/50 transition-colors duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                <p className="text-foreground/70">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
