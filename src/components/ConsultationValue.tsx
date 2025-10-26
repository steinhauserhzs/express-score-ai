import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Star } from "lucide-react";

export default function ConsultationValue() {
  const benefits = [
    {
      title: "Análise Detalhada do Seu Score",
      description: "Entenda EXATAMENTE onde você está perdendo pontos e como melhorar"
    },
    {
      title: "Plano de Ação Personalizado",
      description: "Passo a passo para melhorar sua situação financeira em 90 dias"
    },
    {
      title: "Estratégias de Renegociação",
      description: "Scripts prontos para negociar suas dívidas com até 90% de desconto"
    },
    {
      title: "Planilha de Controle Financeiro",
      description: "Template pronto e personalizado para sua situação"
    },
    {
      title: "30 Dias de Suporte via WhatsApp",
      description: "Tire dúvidas direto com seu consultor por 1 mês"
    },
    {
      title: "Acompanhamento de Progresso",
      description: "Refaça o diagnóstico em 30 dias e compare sua evolução"
    }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      profession: "Professora",
      testimonial: "Em 3 meses eliminei R$ 15.000 em dívidas seguindo o plano da consultoria. Hoje consigo poupar 20% da minha renda!",
      result: "Score: 45 → 98 pontos",
      initials: "MS",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria"
    },
    {
      name: "João Santos",
      profession: "Empresário",
      testimonial: "A consultoria me ajudou a reorganizar minhas finanças pessoais e empresariais. Nunca dormi tão tranquilo!",
      result: "Dívidas: R$ 80k → R$ 12k",
      initials: "JS",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=João"
    },
    {
      name: "Ana Costa",
      profession: "Designer",
      testimonial: "Achei que nunca conseguiria juntar uma reserva de emergência. Com as dicas do consultor, atingi minha meta em 6 meses!",
      result: "Reserva: R$ 0 → R$ 18k",
      initials: "AC",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Value Proposition */}
      <Card className="p-8 bg-gradient-to-br from-primary/5 to-success/5">
        <CardHeader className="p-0 mb-6">
          <CardTitle className="text-3xl">
            O Que Você Vai Receber na Consultoria
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-3">
                <CheckCircle className="h-6 w-6 text-success flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Testimonials */}
      <Card className="p-8">
        <CardHeader className="p-0 mb-6">
          <CardTitle className="text-2xl">
            O Que Nossos Clientes Dizem
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 bg-muted/50">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.profession}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star 
                      key={i} 
                      className="h-4 w-4 fill-warning text-warning" 
                    />
                  ))}
                </div>
                <p className="text-sm mb-4">{testimonial.testimonial}</p>
                <div className="pt-3 border-t">
                  <p className="text-sm font-semibold text-primary">
                    {testimonial.result}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}