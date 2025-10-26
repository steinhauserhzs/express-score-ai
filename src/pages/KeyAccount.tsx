import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, TrendingUp, Heart, Award, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";

const KeyAccount = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: Heart,
      title: "Redução do Estresse Financeiro",
      description: "Colaboradores mais tranquilos e focados, com menos preocupações financeiras"
    },
    {
      icon: TrendingUp,
      title: "Aumento de Produtividade",
      description: "Estudos mostram até 30% de aumento na produtividade com programas de bem-estar financeiro"
    },
    {
      icon: Users,
      title: "Retenção de Talentos",
      description: "Benefício diferenciado que aumenta o engajamento e reduz turnover"
    },
    {
      icon: Award,
      title: "Marca Empregadora",
      description: "Destaque-se no mercado como empresa que cuida do bem-estar integral dos colaboradores"
    }
  ];

  const formats = [
    {
      title: "Palestras Pontuais",
      description: "Eventos de impacto para datas especiais ou kickoffs",
      duration: "1-2 horas",
      ideal: "Conscientização inicial"
    },
    {
      title: "Programa Continuado",
      description: "Workshops mensais com temas progressivos",
      duration: "6-12 meses",
      ideal: "Transformação consistente"
    },
    {
      title: "Consultoria Individual",
      description: "Sessões privadas para liderança e executivos",
      duration: "Sob demanda",
      ideal: "Alto escalão"
    },
    {
      title: "Clube de Benefícios",
      description: "Descontos exclusivos em serviços Firece para funcionários",
      duration: "Permanente",
      ideal: "Todas as empresas"
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-accent/10 via-background to-primary/10">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-block bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-semibold mb-6">
            Soluções Corporativas
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Key Account
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto mb-8">
            Programa de educação financeira para empresas que se preocupam com o 
            bem-estar integral de seus colaboradores. Invista no que realmente importa: 
            pessoas mais tranquilas e produtivas.
          </p>
          <Button size="lg" onClick={() => navigate("/contato")}>
            Solicitar Proposta Corporativa
          </Button>
        </div>
      </section>

      {/* Benefícios Corporativos */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            Benefícios para sua Empresa
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="hover-scale">
                <CardHeader>
                  <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center mb-4">
                    <benefit.icon className="w-7 h-7 text-accent" />
                  </div>
                  <CardTitle className="text-xl text-foreground">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Formatos Disponíveis */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            Formatos Disponíveis
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {formats.map((format) => (
              <Card key={format.title}>
                <CardHeader>
                  <CardTitle className="text-foreground">{format.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-foreground/70">{format.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground/60">Duração:</span>
                    <span className="font-semibold text-foreground">{format.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground/60">Ideal para:</span>
                    <span className="font-semibold text-foreground">{format.ideal}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* O que Oferecemos */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            O que Oferecemos
          </h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Workshops In-Company
                </CardTitle>
              </CardHeader>
              <CardContent className="text-foreground/70">
                <p className="mb-4">
                  Sessões práticas e interativas sobre temas essenciais:
                </p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    Organização financeira pessoal
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    Como sair das dívidas de forma inteligente
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    Investimentos para iniciantes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    Planejamento da aposentadoria
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    Mentalidade financeira saudável
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Users className="w-5 h-5 text-primary" />
                  Diagnóstico Financeiro para Colaboradores
                </CardTitle>
              </CardHeader>
              <CardContent className="text-foreground/70">
                <p>
                  Acesso gratuito para todos os funcionários ao nosso Diagnóstico IA Firece, 
                  permitindo que cada um entenda sua situação financeira e receba orientações 
                  personalizadas de forma confidencial.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Building2 className="w-5 h-5 text-primary" />
                  Consultoria Individual para Liderança
                </CardTitle>
              </CardHeader>
              <CardContent className="text-foreground/70">
                <p>
                  Sessões privadas e personalizadas para diretoria e alta liderança, 
                  com estratégias avançadas de gestão patrimonial e planejamento financeiro executivo.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ROI */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            ROI Demonstrado
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">-23%</div>
              <div className="text-foreground/70">Absenteísmo</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">+30%</div>
              <div className="text-foreground/70">Produtividade</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">-18%</div>
              <div className="text-foreground/70">Turnover</div>
            </div>
          </div>
          <p className="text-center text-foreground/70 text-sm">
            *Dados baseados em estudos sobre programas de bem-estar financeiro corporativo
          </p>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Invista no Bem-Estar dos seus Colaboradores
          </h2>
          <p className="text-lg text-foreground/70 mb-8">
            Solicite uma proposta personalizada e descubra como o Key Account pode 
            transformar a cultura financeira da sua empresa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/contato")}>
              Solicitar Proposta
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://wa.me/5511987201303?text=Olá! Gostaria de conhecer o Key Account" target="_blank" rel="noopener noreferrer">
                WhatsApp Direto
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default KeyAccount;
