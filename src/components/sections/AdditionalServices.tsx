import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, GraduationCap, Users, Building2, Handshake, ArrowRight, Sparkles, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const services = [
  {
    icon: Sparkles,
    title: "Diagnóstico IA Firece",
    description: "Tecnologia proprietária desenvolvida pela Firece. Análise completa em 6 dimensões financeiras com relatório instantâneo. 100% gratuito!",
    cta: "Fazer diagnóstico grátis",
    highlight: true,
    action: "diagnostic"
  },
  {
    icon: UserCheck,
    title: "Consultoria Individual",
    description: "Sessões 1-on-1 com consultores certificados (CFP, CGA). Plano de ação personalizado com acompanhamento mensal.",
    cta: "Agendar consulta",
    action: "consultation"
  },
  {
    icon: Gift,
    title: "Programa de Indicação",
    description: "Ganhe bonificações ao indicar amigos e familiares. Quanto mais você indica, mais benefícios recebe.",
    cta: "Saiba mais"
  },
  {
    icon: GraduationCap,
    title: "Educa Fire",
    description: "Programa completo de formação de educadores financeiros certificados. Transforme sua carreira ajudando outras pessoas.",
    cta: "Conheça o programa"
  },
  {
    icon: Users,
    title: "Palestras e Workshops",
    description: "Eventos personalizados para grupos, empresas e comunidades. Conteúdo adaptado às necessidades específicas do seu público.",
    cta: "Agendar palestra"
  },
  {
    icon: Building2,
    title: "Clube de Benefícios Empresariais",
    description: "Trilhas de educação financeira corporativa que aumentam a retenção de talentos e reduzem o absenteísmo.",
    cta: "Para empresas"
  },
  {
    icon: Handshake,
    title: "Parcerias Estratégicas",
    description: "Trabalhamos com influenciadores e marcas para ampliar o alcance da educação financeira de qualidade.",
    cta: "Seja parceiro"
  }
];

export default function AdditionalServices() {
  const navigate = useNavigate();

  const handleServiceClick = (action?: string) => {
    if (action === "diagnostic" || action === "consultation") {
      navigate('/auth');
    }
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Soluções Completas da Firece
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Descubra todos os serviços e oportunidades que a Firece oferece para transformar sua relação com o dinheiro
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <Card
              key={index}
              className={`p-6 hover-lift border-l-4 ${service.highlight ? 'border-l-primary shadow-lg' : 'border-l-primary'} group ${service.highlight ? 'bg-gradient-to-br from-primary/5 to-background' : ''}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {service.highlight && (
                <div className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold mb-4">
                  <span>🔥</span>
                  <span>Produto Firece</span>
                </div>
              )}
              <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-xl ${service.highlight ? 'bg-primary text-white' : 'bg-primary/10 text-primary'} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <service.icon className="h-6 w-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {service.description}
              </p>

              <Button 
                variant={service.highlight ? "default" : "ghost"} 
                className="w-full group/btn"
                onClick={() => handleServiceClick(service.action)}
              >
                {service.cta}
                <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
