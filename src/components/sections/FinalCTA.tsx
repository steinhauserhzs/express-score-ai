import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, TrendingUp } from "lucide-react";

export default function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-primary opacity-10" />
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 animate-bounce-in">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-semibold">100% Gratuito</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 animate-slide-up text-foreground">
            Pronto para transformar sua vida financeira?
          </h2>
          
          <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '100ms' }}>
            Junte-se a milhares de pessoas que já descobriram sua saúde financeira e estão no caminho da prosperidade.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in">
            <Button 
              size="lg"
              variant="flare"
              className="text-lg px-8 py-6 shadow-glow hover-scale"
              onClick={() => navigate('/auth')}
            >
              Começar Meu Diagnóstico Gratuito
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => navigate('/auth')}
            >
              Já tenho conta
            </Button>
          </div>
          
          <p className="text-sm text-foreground/60 mt-8">
            ⏱️ Leva apenas 5 minutos • 🔒 100% seguro e confidencial
          </p>
        </div>
      </div>
    </section>
  );
}
