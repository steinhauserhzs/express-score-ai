import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Como funciona o diagnóstico?",
    answer: "O diagnóstico é uma conversa interativa com nossa IA especializada. Você responde perguntas sobre diferentes aspectos da sua vida financeira (renda, gastos, dívidas, investimentos, etc.) e, em cerca de 5 minutos, recebe uma análise completa com seu score e recomendações personalizadas."
  },
  {
    question: "O diagnóstico é realmente gratuito?",
    answer: "Sim! O diagnóstico inicial é 100% gratuito e você pode fazê-lo quantas vezes quiser. Você só paga se quiser contratar uma consultoria personalizada com um de nossos especialistas."
  },
  {
    question: "Meus dados estão seguros?",
    answer: "Absolutamente. Utilizamos criptografia de ponta a ponta e não compartilhamos seus dados com terceiros. Todas as informações são armazenadas de forma segura e você pode deletar seus dados a qualquer momento."
  },
  {
    question: "Como o score é calculado?",
    answer: "Analisamos 6 dimensões da sua saúde financeira: Renda e Ganhos, Controle de Gastos, Dívidas e Compromissos, Reserva de Emergência, Investimentos e Planejamento Futuro, e Mindset Financeiro. Cada dimensão recebe uma pontuação que é ponderada para gerar seu score total de 0 a 100."
  },
  {
    question: "Como funciona o programa de indicação?",
    answer: "A cada amigo ou familiar que você indicar e que fechar consultoria, você recebe uma bonificação especial. Quanto mais indicações, maiores os benefícios. Entre em contato conosco para conhecer os detalhes do programa."
  },
  {
    question: "Vocês oferecem serviços para empresas?",
    answer: "Sim! Oferecemos o Clube de Benefícios Empresariais com trilhas de educação financeira corporativa, palestras personalizadas e workshops. Nossos programas aumentam a retenção de talentos e reduzem o absenteísmo. Entre em contato para uma proposta personalizada."
  },
  {
    question: "O que é o Educa Fire?",
    answer: "O Educa Fire é nosso programa completo de formação de educadores financeiros certificados. Se você tem paixão por ajudar pessoas e quer transformar isso em uma carreira, esta é a oportunidade ideal. Conheça mais sobre o programa em nosso site."
  },
  {
    question: "Como agendar uma palestra ou workshop?",
    answer: "Entre em contato com nosso time através do formulário no site ou WhatsApp. Personalizamos o conteúdo de acordo com as necessidades do seu grupo, empresa ou comunidade. Temos experiência com eventos de 10 a 500+ participantes."
  },
  {
    question: "Posso refazer o diagnóstico?",
    answer: "Sim! Recomendamos que você refaça o diagnóstico mensalmente para acompanhar sua evolução e ajustar suas estratégias. Você verá seu progresso ao longo do tempo no seu histórico."
  },
  {
    question: "O que está incluído na consultoria premium?",
    answer: "A consultoria premium inclui sessões individuais com especialistas certificados, plano de ação personalizado, acompanhamento mensal, suporte via chat, acesso a materiais exclusivos e revisão trimestral de estratégias."
  }
];

export default function FAQ() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
      <div className="text-center mb-12 animate-fade-in">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
          Perguntas Frequentes
        </h2>
        <p className="text-foreground/70 max-w-2xl mx-auto">
          Tire suas dúvidas sobre a Firece
        </p>
      </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border rounded-lg px-6 bg-card"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
