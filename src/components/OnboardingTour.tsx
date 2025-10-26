import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Step {
  target: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const ONBOARDING_STEPS: Step[] = [
  {
    target: '[data-tour="diagnostic-button"]',
    title: '👋 Bem-vindo ao Pleno!',
    content: 'Comece fazendo seu diagnóstico financeiro gratuito. Leva apenas 20 minutos!',
    position: 'bottom'
  },
  {
    target: '[data-tour="score-card"]',
    title: '📊 Seu Score Financeiro',
    content: 'Aqui você verá seu score de 0 a 150 pontos, baseado em 6 dimensões da sua saúde financeira.',
    position: 'top'
  },
  {
    target: '[data-tour="recommendations"]',
    title: '💡 Recomendações Personalizadas',
    content: 'Receba dicas práticas e acionáveis baseadas no seu perfil financeiro.',
    position: 'left'
  },
  {
    target: '[data-tour="goals"]',
    title: '🎯 Defina suas Metas',
    content: 'Crie metas financeiras SMART e acompanhe seu progresso em tempo real.',
    position: 'top'
  },
  {
    target: '[data-tour="education"]',
    title: '📚 Aprenda Sempre',
    content: 'Acesse conteúdo educacional gratuito personalizado para seu perfil.',
    position: 'bottom'
  }
];

export default function OnboardingTour() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition);
      };
    }
  }, [isVisible, currentStep]);

  const checkOnboardingStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user has seen onboarding
      const hasSeenOnboarding = localStorage.getItem(`onboarding_completed_${user.id}`);
      
      if (!hasSeenOnboarding) {
        // Wait a bit for page to load
        setTimeout(() => {
          setIsVisible(true);
        }, 1000);
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  };

  const updatePosition = () => {
    const step = ONBOARDING_STEPS[currentStep];
    const targetElement = document.querySelector(step.target);
    
    if (!targetElement) return;

    const rect = targetElement.getBoundingClientRect();
    const cardWidth = 320;
    const cardHeight = 150;
    const spacing = 20;

    let top = 0;
    let left = 0;

    switch (step.position) {
      case 'bottom':
        top = rect.bottom + spacing;
        left = rect.left + (rect.width / 2) - (cardWidth / 2);
        break;
      case 'top':
        top = rect.top - cardHeight - spacing;
        left = rect.left + (rect.width / 2) - (cardWidth / 2);
        break;
      case 'left':
        top = rect.top + (rect.height / 2) - (cardHeight / 2);
        left = rect.left - cardWidth - spacing;
        break;
      case 'right':
        top = rect.top + (rect.height / 2) - (cardHeight / 2);
        left = rect.right + spacing;
        break;
    }

    // Keep within viewport
    top = Math.max(20, Math.min(top, window.innerHeight - cardHeight - 20));
    left = Math.max(20, Math.min(left, window.innerWidth - cardWidth - 20));

    setPosition({ top, left });

    // Highlight target element
    targetElement.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'relative', 'z-50');
  };

  const handleNext = () => {
    // Remove highlight from current target
    const currentTarget = document.querySelector(ONBOARDING_STEPS[currentStep].target);
    currentTarget?.classList.remove('ring-2', 'ring-primary', 'ring-offset-2', 'relative', 'z-50');

    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    // Remove highlight from current target
    const currentTarget = document.querySelector(ONBOARDING_STEPS[currentStep].target);
    currentTarget?.classList.remove('ring-2', 'ring-primary', 'ring-offset-2', 'relative', 'z-50');
    
    completeOnboarding();
  };

  const completeOnboarding = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        localStorage.setItem(`onboarding_completed_${user.id}`, 'true');
      }
    } catch (error) {
      console.error('Error completing onboarding:', error);
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const step = ONBOARDING_STEPS[currentStep];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={handleSkip}
      />

      {/* Tour Card */}
      <Card
        className="fixed z-50 w-80 shadow-2xl border-primary"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          transition: 'all 0.3s ease-in-out'
        }}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.content}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 -mt-2 -mr-2"
              onClick={handleSkip}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between mt-6">
            <div className="flex gap-1">
              {ONBOARDING_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentStep 
                      ? 'w-6 bg-primary' 
                      : 'w-1.5 bg-muted'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleSkip}>
                Pular
              </Button>
              <Button size="sm" onClick={handleNext}>
                {currentStep === ONBOARDING_STEPS.length - 1 ? 'Concluir' : 'Próximo'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
