import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface PWAInstallState {
  dismissed: boolean;
  dismissedAt: number | null;
  installed: boolean;
  promptShownCount: number;
}

const STORAGE_KEY = "firece_pwa_prompt_state";
const DISMISS_COOLDOWN_DAYS = 3;

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [shouldShowPrompt, setShouldShowPrompt] = useState(false);

  // Detecta iOS
  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);
  }, []);

  // Verifica se já está instalado
  useEffect(() => {
    const checkIfInstalled = () => {
      // Detecta se está rodando como PWA instalado
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      
      if (isStandalone || isInWebAppiOS) {
        setIsInstalled(true);
        updateState({ installed: true });
      }
    };

    checkIfInstalled();
  }, []);

  // Carrega estado do localStorage
  const getState = (): PWAInstallState => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      dismissed: false,
      dismissedAt: null,
      installed: false,
      promptShownCount: 0,
    };
  };

  // Salva estado no localStorage
  const updateState = (updates: Partial<PWAInstallState>) => {
    const current = getState();
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  // Verifica se deve mostrar o prompt
  const checkShouldShow = (): boolean => {
    const state = getState();
    
    if (state.installed || isInstalled) return false;
    
    if (state.dismissed && state.dismissedAt) {
      const daysSinceDismiss = (Date.now() - state.dismissedAt) / (1000 * 60 * 60 * 24);
      if (daysSinceDismiss < DISMISS_COOLDOWN_DAYS) {
        return false;
      }
    }
    
    return true;
  };

  // Captura o evento beforeinstallprompt
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setCanInstall(true);
      
      if (checkShouldShow()) {
        setShouldShowPrompt(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  // Função para instalar
  const promptInstall = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      console.log("No deferred prompt available");
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === "accepted") {
        updateState({ 
          installed: true,
          promptShownCount: getState().promptShownCount + 1
        });
        setIsInstalled(true);
        setShouldShowPrompt(false);
        return true;
      } else {
        updateState({
          dismissed: true,
          dismissedAt: Date.now(),
          promptShownCount: getState().promptShownCount + 1
        });
        setShouldShowPrompt(false);
        return false;
      }
    } catch (error) {
      console.error("Error installing PWA:", error);
      return false;
    }
  };

  // Função para dismissar
  const dismissPrompt = () => {
    updateState({
      dismissed: true,
      dismissedAt: Date.now(),
      promptShownCount: getState().promptShownCount + 1
    });
    setShouldShowPrompt(false);
  };

  // Reativa o prompt manualmente (usado pelo botão fixo)
  const showPrompt = () => {
    if (canInstall && !isInstalled && checkShouldShow()) {
      setShouldShowPrompt(true);
    }
  };

  return {
    canInstall: canInstall && !isInstalled,
    isInstalled,
    isIOS,
    shouldShowPrompt,
    promptInstall,
    dismissPrompt,
    showPrompt,
  };
};
