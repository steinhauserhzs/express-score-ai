import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Handshake, Building, GraduationCap, Users, TrendingUp, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";

const Partnerships = () => {
  const navigate = useNavigate();

  const partnershipTypes = [
    {
      icon: Building,
      title: "Parceiros Institucionais",
      description: "Bancos, corretoras, seguradoras e fintechs",
      benefits: [
        "Complementação de serviços",
        "Cross-selling estratégico",
        "Expansão de portfolio",
        "Acordos comerciais mútuos"
      ]
    },
    {
      icon: Users,
      title: "Afiliados e Indicadores",
      description: "Programa de afiliação com comissões recorrentes",
      benefits: [
        "Comissões competitivas",
        "Sistema de tracking completo",
        "Material de divulgação profissional",
        "Suporte dedicado"
      ]
    },
    {
      icon: GraduationCap,
      title: "Parcerias Educacionais",
      description: "Universidades, escolas e instituições de ensino",
      benefits: [
        "Programas customizados",
        "Certificações reconhecidas",
        "Eventos conjuntos",
        "Pesquisa e desenvolvimento"
      ]
    },
    {
      icon: Award,
      title: "Parcerias Corporativas",
      description: "Convênios e programas de benefícios empresariais",
      benefits: [
        "Descontos exclusivos",
        "Condições especiais",
        "Programas sob medida",
        "Gestão simplificada"
      ]
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-accent/10 via-background to-primary/10">
        <div className="container mx-auto max-w-6xl text-center">
          <Handshake className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Cresça com a Firece
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto mb-8">
            Construa uma parceria estratégica conosco e faça parte da transformação 
            financeira de milhares de pessoas no Brasil.
          </p>
          <Button size="lg" onClick={() => navigate("/contato")}>
            Propor Parceria
          </Button>
        </div>
      </section>

      {/* Tipos de Parceria */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            Tipos de Parceria
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {partnershipTypes.map((type) => (
              <Card key={type.title} className="hover-scale">
                <CardHeader>
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <type.icon className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-foreground">{type.title}</CardTitle>
                  <p className="text-sm text-foreground/60">{type.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {type.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2 text-sm text-foreground/80">
                        <span className="text-primary mt-1">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Programa de Afiliados - Destaque */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              ⭐ Programa em Destaque
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Programa de Afiliados Firece
            </h2>
            <p className="text-lg text-foreground/70">
              Ganhe indicando nossos serviços para amigos, familiares e sua rede de contatos
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Como Funciona
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-foreground/70">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <p>Cadastre-se no programa gratuitamente</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <p>Receba seu link exclusivo de afiliado</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <p>Compartilhe com sua rede</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <p>Ganhe comissões recorrentes</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Award className="w-5 h-5 text-primary" />
                  Benefícios do Programa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-foreground/70">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    Comissões de até 30% por venda
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    Ganhos recorrentes mensais
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    Dashboard para acompanhamento
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    Material de marketing profissional
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    Sem limite de indicações
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button size="lg" onClick={() => navigate("/refer")}>
              Começar a Indicar Agora
            </Button>
          </div>
        </div>
      </section>

      {/* Como se Tornar Parceiro */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            Como se Tornar Parceiro
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="font-semibold text-foreground mb-2">Entre em Contato</h3>
              <p className="text-sm text-foreground/70">
                Preencha o formulário ou envie um WhatsApp
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                2
              </div>
              <h3 className="font-semibold text-foreground mb-2">Reunião Estratégica</h3>
              <p className="text-sm text-foreground/70">
                Alinhamos expectativas e oportunidades
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                3
              </div>
              <h3 className="font-semibold text-foreground mb-2">Proposta Customizada</h3>
              <p className="text-sm text-foreground/70">
                Elaboramos um acordo sob medida
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                4
              </div>
              <h3 className="font-semibold text-foreground mb-2">Início da Parceria</h3>
              <p className="text-sm text-foreground/70">
                Começamos a trabalhar juntos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Por que ser Parceiro Firece */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            Por que ser Parceiro Firece?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">9 Anos</div>
              <div className="text-foreground/70">de Mercado</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">R$ 70M+</div>
              <div className="text-foreground/70">sob Administração</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-primary mb-2">1000+</div>
              <div className="text-foreground/70">Clientes Satisfeitos</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Vamos Crescer Juntos?
          </h2>
          <p className="text-lg text-foreground/70 mb-8">
            Entre em contato e descubra como uma parceria com a Firece pode 
            impulsionar seus resultados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/contato")}>
              Propor Parceria
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://wa.me/5511987201303?text=Olá! Gostaria de ser parceiro da Firece" target="_blank" rel="noopener noreferrer">
                WhatsApp Direto
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Partnerships;
