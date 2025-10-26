import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, TrendingDown, Heart, Users, Target } from "lucide-react";

const benefits = [
  {
    icon: TrendingDown,
    title: "Redução do Absenteísmo",
    description: "Colaboradores financeiramente saudáveis faltam menos e são mais produtivos"
  },
  {
    icon: Users,
    title: "Retenção de Talentos",
    description: "Aumente a satisfação e lealdade dos seus melhores profissionais"
  },
  {
    icon: Heart,
    title: "Saúde Mental",
    description: "Redução do estresse financeiro melhora o bem-estar geral da equipe"
  },
  {
    icon: Target,
    title: "Programas Personalizados",
    description: "Trilhas de educação financeira adaptadas à realidade da sua empresa"
  }
];

export default function CorporateBenefits() {
  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Conteúdo esquerdo */}
          <div className="animate-fade-in">
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-4">
              Para Empresas
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Educação Financeira que Transforma sua Empresa
            </h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              Invista no bem-estar financeiro dos seus colaboradores e veja resultados tangíveis em produtividade, engajamento e retenção de talentos.
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-foreground">
                  <strong>Workshops personalizados</strong> para diferentes níveis e perfis de colaboradores
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-foreground">
                  <strong>Acompanhamento contínuo</strong> com relatórios de progresso e engajamento
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-foreground">
                  <strong>Palestras motivacionais</strong> com especialistas certificados
                </p>
              </div>
            </div>

            <Button size="lg" variant="fire" className="font-bold">
              Fale com Nosso Time Empresarial
            </Button>
          </div>

          {/* Cards de benefícios à direita */}
          <div className="grid sm:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="p-6 hover-lift"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-3 rounded-xl bg-primary/10 inline-flex mb-4">
                  <benefit.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
