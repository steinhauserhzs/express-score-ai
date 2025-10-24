import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, CheckCircle, Clock, Target, Shield, TrendingUp } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left side - Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6 animate-bounce-in">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">Diagnóstico Gratuito com IA</span>
            </div>
            
            {/* Main heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up text-foreground">
              Descubra a Saúde da Sua{" "}
              <span className="text-primary">
                Vida Financeira
              </span>
            </h1>
            
            {/* Description */}
            <p className="text-xl md:text-2xl text-foreground/80 mb-8 animate-fade-in">
              Score Express em 5 minutos com análise personalizada por IA
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8 animate-scale-in">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 shadow-glow hover-scale"
                onClick={() => navigate('/auth')}
              >
                Começar Diagnóstico Gratuito
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
            
            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm text-foreground/70 animate-fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>100% Online</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <span>5 minutos</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <span>Personalizado</span>
              </div>
            </div>
            
            {/* Security badge */}
            <div className="mt-8 inline-flex items-center gap-2 text-sm text-foreground/70 bg-muted/50 px-6 py-3 rounded-full">
              <Shield className="h-4 w-4 text-primary" />
              <span>Seus dados estão protegidos e criptografados</span>
            </div>
          </div>

          {/* Right side - Illustration */}
          <div className="hidden lg:flex justify-center items-center animate-fade-in">
            <div className="relative w-full max-w-lg">
              {/* Dashboard Illustration */}
              <div className="relative bg-card border-2 border-primary/20 rounded-2xl p-6 shadow-2xl hover-lift">
                {/* Mini header */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <div className="w-3 h-3 rounded-full bg-success" />
                </div>
                
                {/* Score display */}
                <div className="bg-primary rounded-xl p-6 mb-6 text-white text-center shadow-lg">
                  <div className="text-sm mb-2 font-medium opacity-90">Seu Score Financeiro</div>
                  <div className="text-5xl font-bold mb-1">78</div>
                  <div className="text-sm opacity-90">Bom</div>
                </div>
                
                {/* Mini charts */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-muted rounded-lg p-4 border border-border">
                    <div className="text-xs text-muted-foreground mb-2">Evolução</div>
                    <div className="h-16 flex items-end gap-1">
                      <div className="bg-primary/40 w-full h-[40%] rounded-t" />
                      <div className="bg-primary/60 w-full h-[60%] rounded-t" />
                      <div className="bg-primary/80 w-full h-[80%] rounded-t" />
                      <div className="bg-primary w-full h-[100%] rounded-t" />
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg p-4 border border-border flex flex-col items-center justify-center">
                    <div className="text-xs text-muted-foreground mb-2">Progresso</div>
                    <div className="relative w-14 h-14">
                      <svg className="transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="10" className="text-muted" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="10" className="text-primary" strokeDasharray="251" strokeDashoffset="75" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground">78%</div>
                    </div>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-success/10 text-success rounded p-2 text-center border border-success/20">
                    <div className="text-xs mb-1 font-bold">↑ 12pts</div>
                    <div className="text-[10px] opacity-80">30 dias</div>
                  </div>
                  <div className="bg-primary/10 text-primary rounded p-2 text-center border border-primary/20">
                    <div className="text-xs mb-1 font-bold">6/6</div>
                    <div className="text-[10px] opacity-80">áreas</div>
                  </div>
                  <div className="bg-accent/10 text-accent rounded p-2 text-center border border-accent/20">
                    <div className="text-xs mb-1 font-bold">Top 15%</div>
                    <div className="text-[10px] opacity-80">usuários</div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-success text-white rounded-full p-3 shadow-lg animate-bounce-in">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-primary text-white rounded-full p-3 shadow-lg animate-bounce-in" style={{ animationDelay: '200ms' }}>
                <Target className="h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
