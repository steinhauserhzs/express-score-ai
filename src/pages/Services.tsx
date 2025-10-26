import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Users, TrendingUp, GraduationCap, Target, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Brain,
      title: "Diagnóstico IA Firece",
      description: "Análise inteligente e gratuita da sua saúde financeira em 6 dimensões",
      features: [
        "SmartForm interativo com IA",
        "Score Express completo",
        "Relatório instantâneo",
        "Recomendações personalizadas",
        "100% gratuito"
      ],
      cta: "Fazer Diagnóstico Grátis",
      path: "/diagnostic",
      highlighted: true
    },
    {
      icon: Users,
      title: "Consultoria Individual",
      description: "Acompanhamento personalizado com consultores certificados CFP e CGA",
      features: [
        "Sessões 1-on-1 com especialistas",
        "Plano de ação personalizado",
        "Acompanhamento mensal",
        "Revisão de investimentos",
        "Suporte contínuo"
      ],
      cta: "Agendar Consulta",
      path: "/consultations"
    },
    {
      icon: Target,
      title: "Planejamento Financeiro",
      description: "Organização completa das suas finanças pessoais e familiares",
      features: [
        "Diagnóstico patrimonial completo",
        "Orçamento familiar estruturado",
        "Estratégia de quitação de dívidas",
        "Planejamento de metas",
        "Análise de fluxo de caixa"
      ],
      cta: "Saiba Mais",
      path: "/contato",
      anchor: "planejamento"
    },
    {
      icon: TrendingUp,
      title: "Gestão de Investimentos",
      description: "Portfolio sob medida para seus objetivos e perfil de risco",
      features: [
        "Análise de perfil de investidor",
        "Carteira personalizada",
        "Rebalanceamento estratégico",
        "Acompanhamento mensal",
        "Relatórios de performance"
      ],
      cta: "Conhecer Serviço",
      path: "/contato",
      anchor: "investimentos"
    },
    {
      icon: GraduationCap,
      title: "Educação Financeira (Educa Fire)",
      description: "Programa completo de formação em educação financeira",
      features: [
        "Cursos e workshops",
        "Programa de certificação",
        "Material didático completo",
        "Mentoria especializada",
        "Comunidade exclusiva"
      ],
      cta: "Ver Programas",
      path: "/contato",
      anchor: "educacao"
    },
    {
      icon: UserPlus,
      title: "Programa de Indicação",
      description: "Ganhe indicando amigos e familiares para a Firece",
      features: [
        "Bonificações recorrentes",
        "Sistema de recompensas",
        "Dashboard de indicações",
        "Suporte dedicado",
        "Sem limite de ganhos"
      ],
      cta: "Começar a Indicar",
      path: "/refer"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Soluções Completas para sua Vida Financeira
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto mb-8">
            Da análise inteligente gratuita até a gestão patrimonial completa, 
            temos o serviço ideal para cada momento da sua jornada financeira
          </p>
          <Button size="lg" onClick={() => navigate("/diagnostic")}>
            Começar com Diagnóstico Gratuito
          </Button>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card
                key={service.title}
                className={`hover-scale ${
                  service.highlighted ? "border-2 border-primary shadow-lg" : ""
                }`}
                id={service.anchor}
              >
                {service.highlighted && (
                  <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-semibold rounded-t-lg">
                    ⭐ Comece por aqui - 100% Grátis
                  </div>
                )}
                <CardHeader>
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <service.icon className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-2xl text-foreground">{service.title}</CardTitle>
                  <CardDescription className="text-foreground/70">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-foreground/80">
                        <span className="text-primary mt-1">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={service.highlighted ? "default" : "outline"}
                    onClick={() => navigate(service.path)}
                  >
                    {service.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            Como Funciona
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">Diagnóstico Inicial</h3>
              <p className="text-foreground/70">
                Comece com nosso diagnóstico IA gratuito para entender sua situação atual
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                2
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">Escolha o Serviço</h3>
              <p className="text-foreground/70">
                Com base no seu perfil, recomendamos o serviço ideal para você
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                3
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">Transforme sua Vida</h3>
              <p className="text-foreground/70">
                Receba acompanhamento contínuo e alcance seus objetivos financeiros
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Pronto para Transformar sua Vida Financeira?
          </h2>
          <p className="text-lg text-foreground/70 mb-8">
            Comece agora com nosso diagnóstico gratuito ou fale com um especialista
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/diagnostic")}>
              Fazer Diagnóstico Grátis
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/contato")}>
              Falar com Especialista
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
