import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Stats from "@/components/sections/Stats";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/sections/Testimonials";
import AdditionalServices from "@/components/sections/AdditionalServices";
import CorporateBenefits from "@/components/sections/CorporateBenefits";
import FAQ from "@/components/sections/FAQ";
import TrustBadges from "@/components/sections/TrustBadges";
import FinalCTA from "@/components/sections/FinalCTA";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Header/Navbar Firece */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-primary/10 shadow-sm">
        <div className="container mx-auto px-3 md:px-4 h-14 md:h-16 flex items-center justify-between">
          <Logo size="sm" showText={true} />
          <div className="flex items-center gap-2 md:gap-3">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth')}
              size="sm"
              className="text-xs md:text-sm font-semibold"
            >
              Entrar
            </Button>
            <Button 
              variant="fire"
              onClick={() => navigate('/auth')}
              size="sm"
              className="text-xs md:text-sm shadow-md font-bold"
            >
              <span className="hidden sm:inline">Começar Agora</span>
              <span className="sm:hidden">Começar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Espaço para o header fixo */}
      <div className="h-14 md:h-16" />
      
      <Hero />
      <Features />
      <Stats />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <AdditionalServices />
      <CorporateBenefits />
      <FAQ />
      <TrustBadges />
      <FinalCTA />
      
      <footer className="py-8 md:py-12 border-t bg-secondary text-white">
        <div className="container mx-auto px-3 md:px-4">
          <div className="grid gap-6 md:gap-8 grid-cols-2 md:grid-cols-4">
            <div className="space-y-4 col-span-2 md:col-span-1">
              <Logo size="sm" showText={true} variant="white" />
              <p className="text-xs md:text-sm text-white/70 break-words">
                Transforme a relação das pessoas com o dinheiro por meio de educação financeira e planejamento estratégico
              </p>
            </div>
            
            <div>
              <h3 className="text-sm md:text-base font-bold mb-3 firece-text-highlight">Produto</h3>
              <ul className="space-y-2 text-xs md:text-sm text-white/80">
                <li><button onClick={() => navigate('/auth')} className="hover:text-primary transition-colors font-medium">Diagnóstico</button></li>
                <li><button onClick={() => navigate('/auth')} className="hover:text-primary transition-colors font-medium">Consultoria</button></li>
                <li><button className="hover:text-primary transition-colors font-medium">Planos</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm md:text-base font-bold mb-3 firece-text-highlight">Empresa</h3>
              <ul className="space-y-2 text-xs md:text-sm text-white/80">
                <li><button className="hover:text-primary transition-colors font-medium">Sobre</button></li>
                <li><button className="hover:text-primary transition-colors font-medium">Contato</button></li>
                <li><button className="hover:text-primary transition-colors font-medium">Blog</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm md:text-base font-bold mb-3 firece-text-highlight">Legal</h3>
              <ul className="space-y-2 text-xs md:text-sm text-white/80">
                <li><button className="hover:text-primary transition-colors font-medium">Privacidade</button></li>
                <li><button className="hover:text-primary transition-colors font-medium">Termos</button></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-white/20 text-center text-xs md:text-sm text-white/70">
            <p className="font-medium">© {new Date().getFullYear()} Firece. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
