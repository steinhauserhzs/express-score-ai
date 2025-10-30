import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from "@/components/ui/carousel";
import { Zap, Star, Clock, Check, Mic, Volume2, Headphones } from "lucide-react";
import { useState, useEffect } from "react";

interface DiagnosticModeModalProps {
  open: boolean;
  onSelect: (turboMode: boolean, voiceMode?: boolean) => void;
}

export default function DiagnosticModeModal({ open, onSelect }: DiagnosticModeModalProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const diagnosticTypes = [
    {
      id: 'complete',
      title: 'Diagnóstico Completo',
      subtitle: 'Análise profunda e detalhada',
      icon: Star,
      time: '20-30 minutos',
      gradient: 'from-purple-500 via-pink-500 to-orange-500',
      bgGradient: 'from-purple-500/10 to-pink-500/5',
      iconBg: 'bg-gradient-to-br from-purple-500 to-pink-500',
      features: [
        { icon: Check, text: '39 perguntas detalhadas', color: 'text-success' },
        { icon: Check, text: 'Score completo + subscore por dimensão', color: 'text-success' },
        { icon: Check, text: 'Análise comportamental aprofundada', color: 'text-success' },
        { icon: Check, text: 'Plano de ação com 15+ recomendações', color: 'text-success' },
        { icon: Star, text: 'Relatório PDF completo GRÁTIS', color: 'text-warning' }
      ],
      idealFor: 'Quem quer um diagnóstico preciso e um plano de ação detalhado',
      badge: { text: 'Recomendado', gradient: 'from-yellow-500 to-orange-500' },
      onClick: () => onSelect(false, false)
    },
    {
      id: 'turbo',
      title: 'Diagnóstico Turbo',
      subtitle: 'Rápido e eficiente',
      icon: Zap,
      time: '10-15 minutos',
      gradient: 'from-blue-500 via-cyan-500 to-teal-500',
      bgGradient: 'from-blue-500/10 to-cyan-500/5',
      iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      features: [
        { icon: Check, text: '10 perguntas essenciais', color: 'text-success' },
        { icon: Check, text: 'Score completo de 0-150', color: 'text-success' },
        { icon: Check, text: 'Análise básica por dimensão', color: 'text-success' },
        { icon: Check, text: 'Top 5 recomendações', color: 'text-success' }
      ],
      idealFor: 'Quem quer uma avaliação rápida e objetiva',
      onClick: () => onSelect(true, false)
    },
    {
      id: 'voice',
      title: 'Por Voz',
      subtitle: 'Conversação natural',
      icon: Headphones,
      time: '20-30 minutos',
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      bgGradient: 'from-green-500/10 to-emerald-500/5',
      iconBg: 'bg-gradient-to-br from-green-500 to-emerald-500',
      features: [
        { icon: Mic, text: 'Fale suas respostas', color: 'text-green-500' },
        { icon: Volume2, text: 'Ouça as perguntas da IA', color: 'text-blue-500' },
        { icon: Check, text: 'Experiência hands-free', color: 'text-success' },
        { icon: Check, text: 'Diagnóstico completo', color: 'text-success' }
      ],
      idealFor: 'Quem prefere conversar ao invés de digitar',
      badge: { text: 'Novo', gradient: 'from-blue-500 to-purple-500' },
      onClick: () => onSelect(false, true)
    }
  ];

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl text-center">
            Escolha o Tipo de Diagnóstico
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Ambos são gratuitos e você receberá seu score completo
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative py-8">
          <Carousel
            setApi={setApi}
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {diagnosticTypes.map((diagnostic, index) => (
                <CarouselItem key={diagnostic.id} className="basis-full">
                  <div className="px-2 md:px-6">
                    <Card 
                      className={`
                        border-2 cursor-pointer transition-all relative overflow-hidden
                        ${current === index 
                          ? 'border-primary shadow-2xl' 
                          : 'border-muted opacity-70 hover:opacity-90'
                        }
                        bg-gradient-to-br ${diagnostic.bgGradient}
                        hover:shadow-xl
                      `}
                      onClick={diagnostic.onClick}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${diagnostic.gradient} opacity-0 hover:opacity-5 transition-opacity duration-500`} />
                      
                      <CardHeader className="relative z-10">
                        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4">
                          <div className={`p-3 md:p-5 ${diagnostic.iconBg} rounded-2xl shadow-lg`}>
                            <diagnostic.icon className="h-10 w-10 md:h-14 md:w-14 text-white" />
                          </div>
                          <div className="text-center md:text-left flex-1">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                              <CardTitle className="text-xl md:text-2xl">{diagnostic.title}</CardTitle>
                              {diagnostic.badge && (
                                <Badge className={`bg-gradient-to-r ${diagnostic.badge.gradient} text-white border-0`}>
                                  {diagnostic.badge.text}
                                </Badge>
                              )}
                            </div>
                            <CardDescription className="text-base">{diagnostic.subtitle}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4 md:space-y-6 relative z-10">
                        <div className="flex items-center justify-center md:justify-start gap-2 text-primary font-bold text-base md:text-lg">
                          <Clock className="h-5 w-5 md:h-6 md:w-6" />
                          <span>{diagnostic.time}</span>
                        </div>
                        
                        <ul className="space-y-2 md:space-y-3">
                          {diagnostic.features.map((feature, idx) => (
                            <li 
                              key={idx}
                              className="flex gap-2 md:gap-3 items-start"
                            >
                              <feature.icon className={`h-5 w-5 md:h-6 md:w-6 ${feature.color} flex-shrink-0 mt-0.5`} />
                              <span className="text-sm md:text-base">{feature.text}</span>
                            </li>
                          ))}
                        </ul>
                        
                        <div className="pt-6 border-t border-border/50">
                          <p className="text-sm md:text-base">
                            <strong className="text-primary">Ideal para:</strong> {diagnostic.idealFor}
                          </p>
                        </div>
                        
                        {current === index && (
                          <button
                            className={`
                              w-full py-3 md:py-4 rounded-lg font-bold text-white text-base md:text-lg
                              bg-gradient-to-r ${diagnostic.gradient}
                              hover:shadow-lg transition-all
                            `}
                            onClick={diagnostic.onClick}
                          >
                            Começar Agora
                          </button>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <CarouselPrevious className="left-1 md:left-2 h-10 w-10 md:h-12 md:w-12 bg-gradient-to-r from-primary to-purple-500 text-white border-0 hover:scale-110 shadow-lg" />
            <CarouselNext className="right-1 md:right-2 h-10 w-10 md:h-12 md:w-12 bg-gradient-to-r from-primary to-purple-500 text-white border-0 hover:scale-110 shadow-lg" />
          </Carousel>
          
          <div className="flex justify-center gap-2 mt-8">
            {diagnosticTypes.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`
                  h-3 w-3 rounded-full transition-all duration-300
                  ${current === index 
                    ? 'bg-primary w-8' 
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }
                `}
                aria-label={`Ir para diagnóstico ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        <div className="p-4 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 rounded-lg text-sm text-center border border-primary/20">
          💡 <strong>Dica:</strong> O diagnóstico completo fornece insights muito mais profundos 
          e é o que nossos consultores usam para criar seu plano personalizado.
        </div>
      </DialogContent>
    </Dialog>
  );
}