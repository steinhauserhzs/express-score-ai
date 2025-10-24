import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero opacity-10" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="inline-block">
            <span className="px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
              Diagnóstico Financeiro com IA
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Transforme sua
            <span className="block mt-2 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Vida Financeira
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Descubra em minutos como está sua saúde financeira com nosso diagnóstico inteligente e personalizado
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              size="lg" 
              className="text-lg px-8 h-14 gap-2 group"
              onClick={() => navigate('/auth')}
            >
              Começar Diagnóstico Gratuito
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 h-14"
              onClick={() => navigate('/auth')}
            >
              Já tenho conta
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-12 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <span>100% Online</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <span>Resultados em 5 minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <span>Recomendações personalizadas</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
