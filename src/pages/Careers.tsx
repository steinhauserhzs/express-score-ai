import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, TrendingUp, Users, Award, MapPin, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";

const Careers = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: Heart,
      title: "Bem-estar Completo",
      description: "Plano de saúde, vale refeição e alimentação"
    },
    {
      icon: TrendingUp,
      title: "Crescimento",
      description: "Plano de carreira estruturado e treinamentos contínuos"
    },
    {
      icon: Users,
      title: "Cultura Colaborativa",
      description: "Ambiente inclusivo, respeitoso e de alta performance"
    },
    {
      icon: Award,
      title: "Reconhecimento",
      description: "Meritocracia e bonificações por resultados"
    }
  ];

  // Vagas de exemplo - em produção, viriam do banco de dados
  const openings = [
    {
      id: 1,
      title: "Consultor Financeiro Pleno",
      area: "Consultoria",
      location: "São Paulo - Híbrido",
      type: "CLT",
      description: "Buscamos consultor experiente para atendimento de clientes e elaboração de planejamentos financeiros personalizados."
    },
    {
      id: 2,
      title: "Analista de Marketing Digital",
      area: "Marketing",
      location: "São Paulo - Remoto",
      type: "CLT",
      description: "Profissional para gerenciar campanhas digitais, SEO, redes sociais e análise de métricas."
    },
    {
      id: 3,
      title: "Desenvolvedor Full Stack",
      area: "Tecnologia",
      location: "Remoto",
      type: "PJ",
      description: "Desenvolvimento e manutenção das plataformas digitais da Firece com foco em React e Node.js."
    },
    {
      id: 4,
      title: "Assistente Administrativo",
      area: "Administrativo",
      location: "São Paulo - Presencial",
      type: "CLT",
      description: "Suporte administrativo geral, atendimento ao cliente e organização de documentos."
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-accent/10 via-background to-primary/10">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Trabalhe Conosco
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 max-w-3xl mx-auto mb-8">
            Faça parte da transformação financeira do Brasil. Junte-se a um time apaixonado 
            por educação financeira e impacto social positivo.
          </p>
          <Button size="lg" onClick={() => document.getElementById("vagas")?.scrollIntoView({ behavior: "smooth" })}>
            Ver Vagas Abertas
          </Button>
        </div>
      </section>

      {/* Por que Trabalhar na Firece */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            Por que Trabalhar na Firece?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="text-center hover-scale">
                <CardHeader>
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-7 h-7 text-primary" />
                  </div>
                  <CardTitle className="text-lg text-foreground">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground/70">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Nossa Cultura */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            Nossa Cultura e Valores
          </h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">🎯 Missão</CardTitle>
              </CardHeader>
              <CardContent className="text-foreground/70">
                <p>
                  Transformar a relação das pessoas com o dinheiro através de educação 
                  financeira de qualidade e consultoria personalizada.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">🔭 Visão</CardTitle>
              </CardHeader>
              <CardContent className="text-foreground/70">
                <p>
                  Ser a referência em educação financeira no Brasil, reconhecida pela 
                  excelência técnica e impacto social positivo.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-foreground">💎 Valores</CardTitle>
              </CardHeader>
              <CardContent className="text-foreground/70">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span><strong>Transparência:</strong> Comunicação clara e honesta em todas as relações</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span><strong>Educação:</strong> Compromisso com o conhecimento e desenvolvimento contínuo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span><strong>Transformação:</strong> Impacto real na vida das pessoas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span><strong>Inovação:</strong> Busca constante por melhores soluções</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Vagas Abertas */}
      <section className="py-20 px-4" id="vagas">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            Vagas Abertas
          </h2>
          <div className="space-y-6">
            {openings.map((opening) => (
              <Card key={opening.id} className="hover-scale">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl text-foreground mb-2">
                        {opening.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-3 text-sm text-foreground/60">
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {opening.area}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {opening.location}
                        </span>
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                          {opening.type}
                        </span>
                      </div>
                    </div>
                    <Button onClick={() => navigate("/contato")}>
                      Candidatar-se
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground/70">{opening.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-12 bg-gradient-to-br from-primary/10 to-accent/10">
            <CardHeader>
              <CardTitle className="text-center text-foreground">
                Não encontrou a vaga ideal?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-foreground/70 mb-6">
                Cadastre seu currículo no nosso banco de talentos e seja considerado 
                para futuras oportunidades.
              </p>
              <Button variant="outline" onClick={() => navigate("/contato")}>
                Enviar Currículo
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Processo Seletivo */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            Nosso Processo Seletivo
          </h2>
          <div className="grid md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="font-semibold text-foreground mb-2">Candidatura</h3>
              <p className="text-sm text-foreground/70">Envio do currículo</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                2
              </div>
              <h3 className="font-semibold text-foreground mb-2">Triagem</h3>
              <p className="text-sm text-foreground/70">Análise de perfil</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                3
              </div>
              <h3 className="font-semibold text-foreground mb-2">Entrevista RH</h3>
              <p className="text-sm text-foreground/70">Fit cultural</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                4
              </div>
              <h3 className="font-semibold text-foreground mb-2">Entrevista Técnica</h3>
              <p className="text-sm text-foreground/70">Avaliação prática</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary-foreground">
                5
              </div>
              <h3 className="font-semibold text-foreground mb-2">Proposta</h3>
              <p className="text-sm text-foreground/70">Bem-vindo(a)!</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Careers;
