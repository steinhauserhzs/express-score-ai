import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/sections/Testimonials";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Header/Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo size="sm" showText={true} />
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/auth')}>
              Entrar
            </Button>
            <Button onClick={() => navigate('/auth')}>
              Começar Agora
            </Button>
          </div>
        </div>
      </header>

      {/* Espaço para o header fixo */}
      <div className="h-16" />
      
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA />
      
      <footer className="py-12 border-t bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <Logo size="sm" showText={true} />
              <p className="text-sm text-muted-foreground">
                Score Express da Vida Financeira - Transforme sua relação com o dinheiro
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Produto</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => navigate('/auth')} className="hover:text-primary transition-colors">Diagnóstico</button></li>
                <li><button onClick={() => navigate('/auth')} className="hover:text-primary transition-colors">Consultoria</button></li>
                <li><button className="hover:text-primary transition-colors">Planos</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Empresa</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button className="hover:text-primary transition-colors">Sobre</button></li>
                <li><button className="hover:text-primary transition-colors">Contato</button></li>
                <li><button className="hover:text-primary transition-colors">Blog</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button className="hover:text-primary transition-colors">Privacidade</button></li>
                <li><button className="hover:text-primary transition-colors">Termos</button></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Pleno. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
