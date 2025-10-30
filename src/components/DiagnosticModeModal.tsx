import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Zap, Star, Headphones, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface DiagnosticModeModalProps {
  open: boolean;
  onSelect: (turboMode: boolean, voiceMode?: boolean) => void;
}

export default function DiagnosticModeModal({ open, onSelect }: DiagnosticModeModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const diagnosticTypes = [
    {
      id: 'complete',
      title: 'Diagnóstico Completo',
      subtitle: 'Análise profunda e detalhada',
      icon: <Star className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-purple-500" />,
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
      icon: <Zap className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-blue-500" />,
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
      icon: <Headphones className="h-8 w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 text-green-500" />,
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

  // Navigation functions
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % diagnosticTypes.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + diagnosticTypes.length) % diagnosticTypes.length);
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, currentSlide]);

  return (
    <Dialog open={open}>
      <DialogContent className="w-full sm:w-[90vw] max-w-5xl h-[95vh] sm:h-[85vh] p-0 grid grid-rows-[auto_1fr_auto] overflow-hidden">
        {/* Header */}
        <DialogHeader className="px-4 py-3 md:px-6 md:py-4 border-b bg-background/95 backdrop-blur z-10">
          <DialogTitle className="text-lg md:text-xl lg:text-2xl text-center">
            Escolha o Tipo de Diagnóstico
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground text-xs md:text-sm">
            Selecione a experiência que melhor se adapta às suas necessidades
          </DialogDescription>
        </DialogHeader>
        
        {/* Content Area - Carousel */}
        <div 
          ref={containerRef}
          className="relative overflow-hidden flex items-center justify-center px-0 sm:px-4 md:px-6 py-2 sm:py-6 md:py-8"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Slides Container */}
          <div 
            className="flex transition-transform duration-300 ease-in-out w-full"
            style={{ 
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            {diagnosticTypes.map((diagnostic, index) => (
              <div 
                key={diagnostic.id} 
                className="min-w-full flex items-stretch justify-center px-3 sm:px-2 md:px-4 h-full"
              >
                <Card 
                  className={`
                    w-full sm:max-w-sm md:max-w-md lg:max-w-lg
                    flex flex-col
                    border cursor-pointer transition-all relative overflow-hidden
                    ${currentSlide === index 
                      ? 'border-primary shadow-2xl scale-100' 
                      : 'border-muted opacity-70 scale-95'
                    }
                    bg-gradient-to-br ${diagnostic.bgGradient}
                    hover:shadow-xl
                  `}
                  onClick={diagnostic.onClick}
                >
                  <CardHeader className="space-y-2 md:space-y-3 p-5 md:p-5 lg:p-6 pb-3 md:pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3 md:gap-4 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                          {diagnostic.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg md:text-xl lg:text-2xl leading-tight">
                            {diagnostic.title}
                          </CardTitle>
                          <p className="text-xs md:text-sm text-muted-foreground mt-1">
                            {diagnostic.subtitle}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs md:text-sm whitespace-nowrap flex-shrink-0">
                        {diagnostic.time}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4 md:space-y-4 p-5 md:p-5 lg:p-6 pt-0 flex-1 flex flex-col justify-between">
                    <div className="space-y-3 md:space-y-2.5">
                      {diagnostic.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-sm md:text-base">
                          <CheckCircle2 className="h-5 w-5 md:h-5 md:w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-purple-500 hover:from-primary/90 hover:to-purple-500/90 text-white shadow-lg hover:shadow-xl transition-all text-base md:text-base h-12 md:h-11 mt-4"
                      onClick={diagnostic.onClick}
                    >
                      Começar Agora
                      <ChevronRight className="ml-2 h-5 w-5 md:h-5 md:w-5" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

        </div>

        {/* Navigation Arrows + Dots */}
        <div className="flex items-center justify-center gap-4 pb-4 md:pb-6 px-4">
          <button
            onClick={prevSlide}
            className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-r from-primary to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center disabled:opacity-30 disabled:hover:scale-100"
            aria-label="Slide anterior"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </button>
          
          <div className="flex justify-center gap-2">
            {diagnosticTypes.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 md:h-3 rounded-full transition-all ${
                  currentSlide === index 
                    ? 'w-8 md:w-10 bg-primary' 
                    : 'w-2 md:w-3 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                aria-label={`Ir para diagnóstico ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-gradient-to-r from-primary to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center disabled:opacity-30 disabled:hover:scale-100"
            aria-label="Próximo slide"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
