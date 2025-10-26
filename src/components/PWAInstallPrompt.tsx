import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Smartphone, X, Download, Wifi, Zap, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { useAnalytics } from "@/hooks/useAnalytics";
import { motion, AnimatePresence } from "framer-motion";

export const PWAInstallPrompt = () => {
  const { canInstall, isIOS, shouldShowPrompt, promptInstall, dismissPrompt } = usePWAInstall();
  const { trackEvent } = useAnalytics();
  const location = useLocation();
  const [showPrompt, setShowPrompt] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Mensagens contextuais baseadas na página
  const getContextualMessage = () => {
    const path = location.pathname;
    
    if (path === "/") {
      return {
        title: "Leve a Firece no Bolso!",
        subtitle: "Instale nosso app e tenha consultoria financeira sempre à mão.",
      };
    } else if (path === "/diagnostic" || path.includes("/diagnostic")) {
      return {
        title: "Salve seus Resultados!",
        subtitle: "Instale o app para acompanhar seu score financeiro.",
      };
    } else if (path === "/dashboard") {
      return {
        title: "Acesso Rápido ao Dashboard",
        subtitle: "Acesse suas metas e consultas com um toque.",
      };
    } else if (path.includes("/servicos") || path.includes("/consultations")) {
      return {
        title: "App Oficial Firece",
        subtitle: "Agende consultorias e acompanhe investimentos pelo app.",
      };
    }
    
    return {
      title: "Instale o App Firece",
      subtitle: "Tenha acesso rápido e funcione offline!",
    };
  };

  const message = getContextualMessage();

  // Lógica de timing inteligente para mostrar o prompt
  useEffect(() => {
    if (!shouldShowPrompt || !canInstall || hasInteracted) return;

    let scrollTimer: NodeJS.Timeout;
    let delayTimer: NodeJS.Timeout;
    let scrollThreshold = 0.5;
    let hasScrolled = false;

    const handleScroll = () => {
      const scrollPercent = (window.scrollY + window.innerHeight) / document.body.scrollHeight;
      
      if (scrollPercent >= scrollThreshold && !hasScrolled) {
        hasScrolled = true;
        scrollTimer = setTimeout(() => {
          setShowPrompt(true);
          trackEvent("pwa_prompt_shown", "engagement", { 
            trigger: "scroll",
            location: location.pathname 
          });
        }, 1000);
      }
    };

    // Estratégia: Mostra após 15 segundos OU após scroll de 50%
    delayTimer = setTimeout(() => {
      if (!hasScrolled) {
        setShowPrompt(true);
        trackEvent("pwa_prompt_shown", "engagement", { 
          trigger: "delay",
          location: location.pathname 
        });
      }
    }, 15000);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimer);
      clearTimeout(delayTimer);
    };
  }, [shouldShowPrompt, canInstall, location.pathname, trackEvent, hasInteracted]);

  const handleInstall = async () => {
    setHasInteracted(true);
    trackEvent("pwa_install_clicked", "conversion", { location: location.pathname });
    
    const installed = await promptInstall();
    
    if (installed) {
      trackEvent("pwa_installed", "conversion", { 
        method: "banner",
        location: location.pathname 
      });
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setHasInteracted(true);
    trackEvent("pwa_dismissed", "engagement", { location: location.pathname });
    dismissPrompt();
    setShowPrompt(false);
  };

  // Não mostra se não pode instalar ou se é iOS (terá instruções específicas)
  if (!canInstall || !showPrompt) return null;

  // Para iOS, mostra instruções diferentes
  if (isIOS) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[400px] z-50"
        >
          <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white rounded-xl shadow-2xl p-5 relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{ 
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '20px 20px'
              }} />
            </div>

            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors z-10"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{message.title}</h3>
                  <p className="text-sm text-white/90">{message.subtitle}</p>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
                <p className="text-sm font-semibold mb-2">Para instalar no iPhone/iPad:</p>
                <ol className="text-sm space-y-1 text-white/90">
                  <li>1. Toque no ícone de <strong>Compartilhar</strong> (caixa com seta) ⬆️</li>
                  <li>2. Role para baixo e toque em <strong>"Adicionar à Tela de Início"</strong></li>
                  <li>3. Toque em <strong>"Adicionar"</strong></li>
                </ol>
              </div>

              <Button
                onClick={handleDismiss}
                variant="secondary"
                className="w-full"
              >
                Entendi
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Para Android/Desktop
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[420px] z-50"
      >
        <div className="bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white rounded-xl shadow-2xl p-6 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{ 
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '20px 20px'
            }} />
          </div>

          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 text-white/80 hover:text-white transition-colors z-10"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <motion.div 
                className="bg-white/20 p-3 rounded-xl backdrop-blur-sm"
                animate={{ 
                  y: [0, -5, 0],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Smartphone className="w-8 h-8 text-white" />
              </motion.div>
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-1">{message.title}</h3>
                <p className="text-sm text-white/90">{message.subtitle}</p>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-2 mb-5">
              <div className="flex items-center gap-3 text-sm">
                <div className="bg-white/20 p-1.5 rounded-lg">
                  <Zap className="w-4 h-4" />
                </div>
                <span>Acesso instantâneo</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="bg-white/20 p-1.5 rounded-lg">
                  <Wifi className="w-4 h-4" />
                </div>
                <span>Funciona offline</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="bg-white/20 p-1.5 rounded-lg">
                  <Bell className="w-4 h-4" />
                </div>
                <span>Notificações personalizadas</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleInstall}
                variant="secondary"
                className="flex-1 font-semibold"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Instalar Agora
              </Button>
              <Button
                onClick={handleDismiss}
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                Agora Não
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
