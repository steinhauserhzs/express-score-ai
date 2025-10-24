import { MessageSquare, BarChart3, FileCheck, Rocket } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "Responda o SmartForm",
    description: "Converse com nossa IA sobre sua vida financeira atual"
  },
  {
    icon: BarChart3,
    title: "Receba seu Score",
    description: "Veja sua pontuação em 6 dimensões financeiras"
  },
  {
    icon: FileCheck,
    title: "Análise Detalhada",
    description: "Relatório completo com diagnóstico e recomendações"
  },
  {
    icon: Rocket,
    title: "Comece a Melhorar",
    description: "Siga o plano personalizado e acompanhe sua evolução"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold">
            Como funciona?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Apenas 4 passos simples para transformar suas finanças
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center text-white text-2xl font-bold">
                {index + 1}
              </div>
              
              <div className="w-12 h-12 mx-auto rounded-lg bg-primary/10 flex items-center justify-center">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent -translate-x-1/2" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
