import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Zap, Crown, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PLANS = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 'R$ 0',
    period: '/mês',
    icon: Zap,
    description: 'Para quem está começando',
    features: [
      '1 diagnóstico por mês',
      'Relatório básico em PDF',
      'Acesso ao conteúdo gratuito',
      'Suporte por email (48h)',
      'Dashboard básico'
    ],
    cta: 'Começar Grátis',
    popular: false,
    color: 'from-gray-500/10 to-gray-600/10'
  },
  {
    id: 'basic',
    name: 'Básico',
    price: 'R$ 29,90',
    period: '/mês',
    icon: Star,
    description: 'Para quem quer se organizar',
    features: [
      'Diagnósticos ilimitados',
      'Relatórios detalhados em PDF',
      'Todo conteúdo educacional',
      'Assistente financeiro com IA',
      'Suporte prioritário (24h)',
      'Dashboard de evolução',
      'Sistema de metas SMART',
      'Alertas inteligentes'
    ],
    cta: 'Assinar Agora',
    popular: false,
    color: 'from-blue-500/10 to-blue-600/10'
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'R$ 79,90',
    period: '/mês',
    icon: Sparkles,
    description: 'Para quem quer crescer',
    features: [
      'Tudo do Básico +',
      '1 consultoria mensal incluída',
      'Planejamento financeiro personalizado',
      'Alertas via WhatsApp',
      'Acesso ao grupo VIP',
      'Certificados de conclusão',
      'Suporte premium (2h)',
      'Desafios semanais gamificados',
      'Calculadoras financeiras avançadas'
    ],
    cta: 'Começar Agora',
    popular: true,
    color: 'from-primary/10 to-primary/20'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 'R$ 149,90',
    period: '/mês',
    icon: Crown,
    description: 'Para quem quer excelência',
    features: [
      'Tudo do Pro +',
      '2 consultorias mensais',
      'Coach financeiro dedicado',
      'Revisão de contratos e investimentos',
      'Planejamento tributário',
      'Acesso vitalício ao conteúdo',
      'Suporte VIP (1h) + WhatsApp direto',
      'Análise mensal de patrimônio',
      'Participação em eventos exclusivos'
    ],
    cta: 'Falar com Especialista',
    popular: false,
    color: 'from-yellow-500/10 to-yellow-600/10'
  }
];

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSelectPlan = (planId: string) => {
    if (planId === 'free') {
      navigate('/dashboard');
      return;
    }

    if (planId === 'premium') {
      navigate('/consultations');
      return;
    }

    toast({
      title: "Em Breve",
      description: "Sistema de pagamentos em desenvolvimento. Entre em contato para mais informações.",
    });
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Escolha Seu Plano</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Invista no seu futuro financeiro
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-2 p-1 bg-muted rounded-lg">
            <Button
              variant={billingPeriod === 'monthly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setBillingPeriod('monthly')}
            >
              Mensal
            </Button>
            <Button
              variant={billingPeriod === 'yearly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setBillingPeriod('yearly')}
            >
              Anual
              <Badge className="ml-2 bg-success">-20%</Badge>
            </Button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {PLANS.map((plan) => {
            const Icon = plan.icon;
            const yearlyPrice = billingPeriod === 'yearly' && plan.id !== 'free'
              ? `R$ ${(parseFloat(plan.price.replace('R$ ', '').replace(',', '.')) * 12 * 0.8).toFixed(2).replace('.', ',')}`
              : plan.price;

            return (
              <Card 
                key={plan.id}
                className={`relative ${
                  plan.popular 
                    ? 'border-primary shadow-lg scale-105' 
                    : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary">Mais Popular</Badge>
                  </div>
                )}

                <CardHeader>
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="pt-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">
                        {billingPeriod === 'yearly' && plan.id !== 'free' ? yearlyPrice : plan.price}
                      </span>
                      <span className="text-muted-foreground">
                        {billingPeriod === 'yearly' && plan.id !== 'free' ? '/ano' : plan.period}
                      </span>
                    </div>
                    {billingPeriod === 'yearly' && plan.id !== 'free' && (
                      <p className="text-sm text-success mt-1">
                        Economize R$ {(parseFloat(plan.price.replace('R$ ', '').replace(',', '.')) * 12 * 0.2).toFixed(2).replace('.', ',')}
                      </p>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button 
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {plan.cta}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <Card className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Perguntas Frequentes</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Posso cancelar a qualquer momento?</h3>
              <p className="text-sm text-muted-foreground">
                Sim! Você pode cancelar sua assinatura a qualquer momento sem taxas ou multas.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Como funcionam as consultorias?</h3>
              <p className="text-sm text-muted-foreground">
                As consultorias são agendadas por videochamada com nossos especialistas certificados.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Posso mudar de plano depois?</h3>
              <p className="text-sm text-muted-foreground">
                Claro! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Quais formas de pagamento?</h3>
              <p className="text-sm text-muted-foreground">
                Aceitamos cartão de crédito, boleto e Pix. Pagamento 100% seguro.
              </p>
            </div>
          </div>
        </Card>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold mb-4">Ainda com dúvidas?</h3>
          <p className="text-muted-foreground mb-6">
            Nossa equipe está pronta para ajudar você a escolher o melhor plano
          </p>
          <Button size="lg" onClick={() => navigate('/consultations')}>
            Falar com Especialista
          </Button>
        </div>
      </div>
    </div>
  );
}