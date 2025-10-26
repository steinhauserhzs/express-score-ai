import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, TrendingUp, Users, Award, Building, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";

const CodeCapital = () => {
  const navigate = useNavigate();

  const differentials = [
    {
      icon: Shield,
      title: "Gestão Patrimonial Personalizada",
      description: "Estratégias sob medida para preservação e crescimento do seu patrimônio"
    },
    {
      icon: Users,
      title: "Consultores Dedicados",
      description: "Equipe exclusiva focada nas suas necessidades e objetivos"
    },
    {
      icon: TrendingUp,
      title: "Estratégias Avançadas",
      description: "Acesso a investimentos sofisticados e diversificação global"
    },
    {
      icon: Building,
      title: "Family Office",
      description: "Gestão completa do patrimônio familiar e estruturação sucessória"
    },
    {
      icon: FileText,
      title: "Assessoria Jurídica e Tributária",
      description: "Otimização fiscal e proteção patrimonial com especialistas"
    },
    {
      icon: Award,
      title: "Excelência Comprovada",
      description: "R$ 70M sob administração com resultados consistentes"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-secondary via-background to-primary/10">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            Gestão Patrimonial Premium
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Code Capital
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto mb-8">
            Serviço premium da Firece para gestão patrimonial de alto padrão. 
            Soluções personalizadas para quem busca excelência na administração do patrimônio.
          </p>
          <Button size="lg" onClick={() => navigate("/contato")}>
            Solicitar Contato Exclusivo
          </Button>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            Diferenciais Code Capital
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {differentials.map((item) => (
              <Card key={item.title} className="hover-scale">
                <CardHeader>
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-foreground">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Por que Code Capital */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            Por que Code Capital?
          </h2>
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Gestão Patrimonial Completa</CardTitle>
              </CardHeader>
              <CardContent className="text-foreground/70">
                <p>
                  Cuidamos de todos os aspectos do seu patrimônio: investimentos, imóveis, 
                  previdência, seguros, planejamento sucessório e otimização tributária. 
                  Uma visão integrada para decisões mais inteligentes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Time de Especialistas</CardTitle>
              </CardHeader>
              <CardContent className="text-foreground/70">
                <p>
                  Consultores certificados CFP, CGA e CEA com décadas de experiência em 
                  mercado financeiro. Acesso a uma rede de especialistas em direito, 
                  contabilidade e planejamento tributário.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">Tecnologia e Transparência</CardTitle>
              </CardHeader>
              <CardContent className="text-foreground/70">
                <p>
                  Plataforma exclusiva para acompanhamento em tempo real do seu patrimônio. 
                  Relatórios detalhados, dashboards intuitivos e total transparência em 
                  todas as operações e custos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Nossos Resultados */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-12">
            Nossos Resultados
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">R$ 70M+</div>
              <div className="text-foreground/70">Sob Administração</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">9 Anos</div>
              <div className="text-foreground/70">de Experiência</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">100+</div>
              <div className="text-foreground/70">Famílias Atendidas</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Pronto para Elevar sua Gestão Patrimonial?
          </h2>
          <p className="text-lg text-foreground/70 mb-8">
            Entre em contato com nosso time Code Capital e descubra como podemos 
            ajudar você a alcançar seus objetivos financeiros mais ambiciosos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/contato")}>
              Solicitar Contato Exclusivo
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://wa.me/5511987201303?text=Olá! Gostaria de conhecer o Code Capital" target="_blank" rel="noopener noreferrer">
                WhatsApp Direto
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CodeCapital;
