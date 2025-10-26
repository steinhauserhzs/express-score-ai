import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const PWAInstallButton = () => {
  const { canInstall, promptInstall } = usePWAInstall();
  const { trackEvent } = useAnalytics();
  const [isHovered, setIsHovered] = useState(false);

  if (!canInstall) return null;

  const handleClick = async () => {
    trackEvent("pwa_install_button_clicked", "conversion", { source: "floating_button" });
    const installed = await promptInstall();
    
    if (installed) {
      trackEvent("pwa_installed", "conversion", { 
        method: "floating_button"
      });
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button
            onClick={handleClick}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className="fixed bottom-24 right-6 z-40 bg-gradient-to-br from-primary to-primary/80 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            aria-label="Instalar App"
          >
            <div className="p-4 relative">
              <Download className="w-6 h-6" />
              
              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary"
                animate={{
                  scale: [1, 1.5],
                  opacity: [0.5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            </div>
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-primary text-white border-primary">
          <p className="font-semibold">Instalar App Firece</p>
          <p className="text-sm opacity-90">Acesse rapidamente da tela inicial</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
