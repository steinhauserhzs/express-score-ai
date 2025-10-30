import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselApi } from "@/components/ui/carousel";
import { Zap, Star, Clock, Check, Mic, Volume2, Headphones } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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
      <DialogContent className="max-w-5xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl md:text-3xl text-center bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
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
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 md:px-12"
                  >
                    <Card 
                      className={`
                        border-2 cursor-pointer transition-all relative overflow-hidden
                        ${current === index 
                          ? 'border-primary shadow-2xl scale-105' 
                          : 'border-muted opacity-70 hover:opacity-90'
                        }
                        bg-gradient-to-br ${diagnostic.bgGradient}
                        hover:shadow-xl transform hover:scale-[1.02]
                      `}
                      onClick={diagnostic.onClick}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${diagnostic.gradient} opacity-0 hover:opacity-5 transition-opacity duration-500`} />
                      
                      <CardHeader className="relative z-10">
                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                          <motion.div 
                            className={`p-4 md:p-6 ${diagnostic.iconBg} rounded-2xl shadow-lg`}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <diagnostic.icon className="h-12 w-12 md:h-16 md:w-16 text-white" />
                          </motion.div>
                          <div className="text-center md:text-left flex-1">
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                              <CardTitle className="text-2xl md:text-3xl">{diagnostic.title}</CardTitle>
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
                      
                      <CardContent className="space-y-6 relative z-10">
                        <motion.div 
                          className="flex items-center justify-center md:justify-start gap-2 text-primary font-bold text-lg"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Clock className="h-6 w-6" />
                          <span>{diagnostic.time}</span>
                        </motion.div>
                        
                        <ul className="space-y-3">
                          {diagnostic.features.map((feature, idx) => (
                            <motion.li 
                              key={idx}
                              className="flex gap-3 items-start"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                            >
                              <feature.icon className={`h-6 w-6 ${feature.color} flex-shrink-0 mt-0.5`} />
                              <span className="text-base">{feature.text}</span>
                            </motion.li>
                          ))}
                        </ul>
                        
                        <div className="pt-6 border-t border-border/50">
                          <p className="text-sm md:text-base">
                            <strong className="text-primary">Ideal para:</strong> {diagnostic.idealFor}
                          </p>
                        </div>
                        
                        {current === index && (
                          <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`
                              w-full py-4 rounded-lg font-bold text-white text-lg
                              bg-gradient-to-r ${diagnostic.gradient}
                              hover:shadow-lg transform hover:scale-105 transition-all
                            `}
                            onClick={diagnostic.onClick}
                          >
                            Começar Agora
                          </motion.button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <CarouselPrevious className="left-2 md:left-4 h-12 w-12 md:h-14 md:w-14 bg-gradient-to-r from-primary to-purple-500 text-white border-0 hover:scale-110 shadow-lg" />
            <CarouselNext className="right-2 md:right-4 h-12 w-12 md:h-14 md:w-14 bg-gradient-to-r from-primary to-purple-500 text-white border-0 hover:scale-110 shadow-lg" />
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