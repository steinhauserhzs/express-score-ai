import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Target, Eye, Heart, Award, Users, TrendingUp, Shield, Sparkles } from "lucide-react";

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Sobre a Firece
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              9 anos transformando vidas através da educação e consultoria financeira
            </p>
          </div>
        </div>
      </section>

      {/* História */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">Nossa História</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Fundada em 2015, a <strong>Firece</strong> nasceu com uma missão clara: democratizar o acesso à educação financeira de qualidade no Brasil. Ao longo de 9 anos de atuação, já ajudamos mais de 1.000 clientes a transformarem suas vidas financeiras.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Nosso nome, <strong>Firece</strong>, representa a união entre "Fire" (fogo, paixão) e "CE" (consultoria e educação). Acreditamos que a transformação financeira começa com conhecimento e é alimentada pela paixão de fazer diferente.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Hoje, com R$ 70 milhões sob administração e uma equipe de consultores certificados (CFP, CGA), continuamos inovando com tecnologia de ponta, como nosso Diagnóstico IA Gratuito, para tornar a consultoria financeira mais acessível e eficiente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Missão, Visão e Valores */}
      <section className="py-16 bg-secondary/5">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Missão</h3>
              <p className="text-muted-foreground">
                Empoderar pessoas e empresas através da educação e consultoria financeira, promovendo independência e prosperidade.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Visão</h3>
              <p className="text-muted-foreground">
                Ser referência nacional em educação financeira, reconhecida pela excelência, inovação e impacto positivo na vida de milhões de brasileiros.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Valores</h3>
              <ul className="text-muted-foreground space-y-2">
                <li>✓ Ética e Transparência</li>
                <li>✓ Excelência</li>
                <li>✓ Inovação</li>
                <li>✓ Empatia</li>
                <li>✓ Educação Contínua</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Números da Firece */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Firece em Números</h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">9</div>
              <div className="text-sm text-muted-foreground">Anos de Mercado</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">1000+</div>
              <div className="text-sm text-muted-foreground">Clientes Atendidos</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">R$ 70M</div>
              <div className="text-sm text-muted-foreground">Sob Administração</div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <div className="text-4xl font-bold text-primary mb-2">5.0</div>
              <div className="text-sm text-muted-foreground">Avaliação Google</div>
            </div>
          </div>
        </div>
      </section>

      {/* Certificações */}
      <section className="py-16 bg-secondary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Certificações e Qualificações</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-6 bg-card rounded-lg border">
                <Sparkles className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">CFP® (Certified Financial Planner)</h3>
                  <p className="text-sm text-muted-foreground">
                    Certificação internacional reconhecida mundialmente em planejamento financeiro.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 bg-card rounded-lg border">
                <Sparkles className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">CGA (Certificado de Gestão de Ativos)</h3>
                  <p className="text-sm text-muted-foreground">
                    Certificação ANBIMA para gestão profissional de investimentos.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 bg-card rounded-lg border">
                <Sparkles className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">CPA-20 e CPA-10</h3>
                  <p className="text-sm text-muted-foreground">
                    Certificações ANBIMA para assessoria de investimentos.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-6 bg-card rounded-lg border">
                <Sparkles className="w-8 h-8 text-primary flex-shrink-0" />
                <div>
                  <h3 className="font-bold mb-2">Associação Planejar</h3>
                  <p className="text-sm text-muted-foreground">
                    Membros ativos da principal associação de planejadores financeiros do Brasil.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Faça Parte da Nossa História
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Junte-se aos milhares de clientes que já transformaram suas vidas financeiras com a Firece.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/diagnostic">
                <Button size="lg">
                  Fazer Diagnóstico Gratuito
                </Button>
              </Link>
              <Link to="/contato">
                <Button size="lg" variant="outline">
                  Falar com Especialista
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
