import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, TrendingUp, Shield, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 gradient-hero opacity-10" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-success/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="inline-block">
            <span className="px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium animate-bounce-in">
              ✨ Diagnóstico Financeiro com IA
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Transforme sua
            <span className="block mt-2 bg-gradient-primary bg-clip-text text-transparent">
              Vida Financeira
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Descubra em <span className="text-primary font-semibold">5 minutos</span> como está sua saúde financeira com nosso <span className="text-primary font-semibold">Score Express</span> inteligente e personalizado
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button 
              size="lg" 
              className="text-lg px-8 h-14 gap-2 group shadow-lg hover-lift"
              onClick={() => navigate('/auth')}
            >
              Começar Diagnóstico Gratuito
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 h-14 hover-lift"
              onClick={() => navigate('/auth')}
            >
              Já tenho conta
            </Button>
          </div>
          
          {/* Benefits */}
          <div className="grid sm:grid-cols-3 gap-6 justify-center items-center pt-12 max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50 border hover-scale">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <span className="font-medium">100% Online</span>
              <span className="text-sm text-muted-foreground">Sem burocracia</span>
            </div>
            
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50 border hover-scale">
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-warning" />
              </div>
              <span className="font-medium">5 minutos</span>
              <span className="text-sm text-muted-foreground">Resultados rápidos</span>
            </div>
            
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50 border hover-scale">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <span className="font-medium">Personalizado</span>
              <span className="text-sm text-muted-foreground">Recomendações sob medida</span>
            </div>
          </div>
          
          {/* Trust Badge */}
          <div className="pt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span>Seus dados estão seguros e protegidos</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
