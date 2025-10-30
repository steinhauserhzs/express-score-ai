import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from "@/components/ui/carousel";
import { Zap, Star, Headphones, CheckCircle2, ChevronRight } from "lucide-react";
import React from "react";
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
      icon: <Star className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-purple-500" />,
      time: '20-30 min',
      bgGradient: 'from-purple-500/10 to-pink-500/5',
      features: [
        '39 perguntas detalhadas',
        'Score completo + subscore',
        'Análise comportamental',
        'Plano com 15+ recomendações',
        'Relatório PDF GRÁTIS'
      ],
      onClick: () => onSelect(false, false)
    },
    {
      id: 'turbo',
      title: 'Diagnóstico Turbo',
      subtitle: 'Rápido e eficiente',
      icon: <Zap className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-blue-500" />,
      time: '10-15 min',
      bgGradient: 'from-blue-500/10 to-cyan-500/5',
      features: [
        '10 perguntas essenciais',
        'Score completo de 0-150',
        'Análise básica por dimensão',
        'Top 5 recomendações'
      ],
      onClick: () => onSelect(true, false)
    },
    {
      id: 'voice',
      title: 'Por Voz',
      subtitle: 'Conversação natural',
      icon: <Headphones className="h-6 w-6 md:h-8 md:w-8 lg:h-10 lg:w-10 text-green-500" />,
      time: '20-30 min',
      bgGradient: 'from-green-500/10 to-emerald-500/5',
      features: [
        'Fale suas respostas',
        'Ouça as perguntas da IA',
        'Experiência hands-free',
        'Diagnóstico completo'
      ],
      onClick: () => onSelect(false, true)
    }
  ];

  return (
    <Dialog open={open}>
      <DialogContent className="w-[90vw] sm:w-[85vw] max-w-4xl max-h-[85vh] p-0 overflow-y-auto">
        <DialogHeader className="px-4 py-3 md:px-6 md:py-4 sticky top-0 bg-background/95 backdrop-blur z-10 border-b">
          <DialogTitle className="text-base md:text-xl lg:text-2xl text-center">
            Escolha o Tipo de Diagnóstico
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground text-xs md:text-sm">
            Selecione a experiência que melhor se adapta às suas necessidades
          </DialogDescription>
        </DialogHeader>
        
        <div className="relative px-3 md:px-6 py-4 md:py-6">
          <Carousel
            setApi={setApi}
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="flex items-center -ml-2 md:-ml-4">
              {diagnosticTypes.map((diagnostic, index) => (
                <CarouselItem key={diagnostic.id} className="pl-2 md:pl-4 basis-full">
                  <div className="flex items-center justify-center py-2 md:py-4">
                    <Card 
                      className={`
                        w-full max-w-sm md:max-w-lg mx-auto
                        border cursor-pointer transition-all relative overflow-hidden
                        ${current === index 
                          ? 'border-primary shadow-2xl scale-100' 
                          : 'border-muted opacity-70 hover:opacity-90 scale-95'
                        }
                        bg-gradient-to-br ${diagnostic.bgGradient}
                        hover:shadow-xl
                      `}
                      onClick={diagnostic.onClick}
                    >
                      <CardHeader className="space-y-2 md:space-y-3 p-3 md:p-4 lg:p-5 pb-2 md:pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
                            <div className="flex-shrink-0">
                              {diagnostic.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <CardTitle className="text-base md:text-xl lg:text-2xl leading-tight">
                                {diagnostic.title}
                              </CardTitle>
                              <p className="text-xs md:text-sm text-muted-foreground mt-0.5 md:mt-1">
                                {diagnostic.subtitle}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs md:text-sm whitespace-nowrap flex-shrink-0">
                            {diagnostic.time}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-3 md:space-y-4 p-3 md:p-4 lg:p-5 pt-0">
                        <div className="space-y-1.5 md:space-y-2">
                          {diagnostic.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs md:text-sm lg:text-base">
                              <CheckCircle2 className="h-3.5 w-3.5 md:h-4 md:w-4 lg:h-5 lg:w-5 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-muted-foreground leading-tight">{feature}</span>
                            </div>
                          ))}
                        </div>
                        
                        <Button 
                          className="w-full bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white shadow-lg hover:shadow-xl transition-all text-xs md:text-sm lg:text-base h-9 md:h-10 lg:h-11"
                          onClick={diagnostic.onClick}
                        >
                          Começar Agora
                          <ChevronRight className="ml-1 md:ml-2 h-3.5 w-3.5 md:h-4 md:w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <CarouselPrevious className="absolute left-1 md:left-2 lg:left-4 top-1/2 -translate-y-1/2 h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 bg-gradient-to-r from-primary to-purple-500 text-white border-0 shadow-lg hover:scale-110 transition-transform disabled:opacity-30 disabled:hover:scale-100" />
            <CarouselNext className="absolute right-1 md:right-2 lg:right-4 top-1/2 -translate-y-1/2 h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 bg-gradient-to-r from-primary to-purple-500 text-white border-0 shadow-lg hover:scale-110 transition-transform disabled:opacity-30 disabled:hover:scale-100" />
          </Carousel>
          
          <div className="flex justify-center gap-2 mt-4 md:mt-6 pb-2">
            {diagnosticTypes.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`h-2 rounded-full transition-all ${
                  current === index 
                    ? 'w-8 bg-primary' 
                    : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Ir para diagnóstico ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}