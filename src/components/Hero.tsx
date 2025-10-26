import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, CheckCircle, Clock, Target, Shield, TrendingUp } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
      {/* Background effects Firece */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-glow-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          {/* Left side - Content */}
          <div className="text-center lg:text-left">
            {/* Badge Produto Firece */}
            <div className="inline-flex items-center gap-2 firece-highlight rounded-full mb-4 animate-bounce-in shadow-glow">
              <span className="text-xl">🔥</span>
              <span className="text-xs md:text-sm font-bold">Tecnologia IA desenvolvida pela Firece</span>
            </div>
            
            {/* Badge Diagnóstico */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-full px-3 py-2 mb-6 animate-bounce-in">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-bold">Diagnóstico Gratuito com IA</span>
            </div>
            
            {/* Main heading Firece */}
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-extrabold mb-4 md:mb-6 animate-slide-up text-white break-words">
              Transforme sua{" "}
              <span className="firece-text-highlight">
                Vida Financeira
              </span>
            </h1>
            
            {/* Description Firece */}
            <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-4 animate-fade-in font-medium">
              Educação financeira e planejamento estratégico em 5 minutos
            </p>
            
            <p className="text-sm md:text-base text-white/70 mb-6 md:mb-8 animate-fade-in italic">
              Diagnóstico financeiro inteligente desenvolvido pela Firece - 9 anos transformando vidas
            </p>
            
            {/* CTA Buttons Firece */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start mb-6 md:mb-8 animate-scale-in">
              <Button 
                size="lg"
                variant="fire"
                className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6 w-full sm:w-auto font-bold"
                onClick={() => navigate('/auth')}
              >
                <span className="hidden sm:inline">Começar Diagnóstico Gratuito</span>
                <span className="sm:hidden">Diagnóstico Gratuito</span>
                <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-base md:text-lg px-6 md:px-8 py-4 md:py-6 w-full sm:w-auto bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white hover:text-secondary font-semibold"
                onClick={() => navigate('/auth')}
              >
                Já tenho conta
              </Button>
            </div>
            
            {/* Trust indicators Firece */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-6 text-xs md:text-sm text-white/80 animate-fade-in">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full">
                <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                <span className="font-semibold">100% Online</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full">
                <Clock className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                <span className="font-semibold">5 minutos</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 rounded-full">
                <Target className="h-4 w-4 md:h-5 md:w-5 text-primary flex-shrink-0" />
                <span className="font-semibold">Personalizado</span>
              </div>
            </div>
            
            {/* Security badge Firece */}
            <div className="mt-6 md:mt-8 inline-flex items-center gap-2 text-xs md:text-sm text-white bg-white/10 backdrop-blur-sm border border-white/20 px-4 md:px-6 py-2 md:py-3 rounded-full">
              <Shield className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="break-words font-semibold">Seus dados estão protegidos e criptografados</span>
            </div>
          </div>

          {/* Right side - Illustration Firece */}
          <div className="hidden lg:flex justify-center items-center animate-fade-in">
            <div className="relative w-full max-w-lg">
              {/* Dashboard Illustration com cores Firece */}
              <div className="relative bg-white border-4 border-primary rounded-2xl p-6 shadow-2xl hover-lift">
                {/* Mini header */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <div className="w-3 h-3 rounded-full bg-success" />
                </div>
                
                {/* Score display com gradiente Firece */}
                <div className="bg-gradient-fire rounded-xl p-6 mb-6 text-white text-center shadow-glow">
                  <div className="text-sm mb-2 font-bold opacity-90">Seu Score Financeiro</div>
                  <div className="text-5xl font-extrabold mb-1">78</div>
                  <div className="text-sm opacity-90 font-semibold">Bom</div>
                </div>
                
                {/* Mini charts */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-muted rounded-lg p-4 border-2 border-primary/20">
                    <div className="text-xs text-secondary font-semibold mb-2">Evolução</div>
                    <div className="h-16 flex items-end gap-1">
                      <div className="bg-primary/40 w-full h-[40%] rounded-t" />
                      <div className="bg-primary/60 w-full h-[60%] rounded-t" />
                      <div className="bg-primary/80 w-full h-[80%] rounded-t" />
                      <div className="bg-primary w-full h-[100%] rounded-t shadow-glow" />
                    </div>
                  </div>
                  <div className="bg-muted rounded-lg p-4 border-2 border-primary/20 flex flex-col items-center justify-center">
                    <div className="text-xs text-secondary font-semibold mb-2">Progresso</div>
                    <div className="relative w-14 h-14">
                      <svg className="transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="10" className="text-muted" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="10" className="text-primary" strokeDasharray="251" strokeDashoffset="75" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-secondary">78%</div>
                    </div>
                  </div>
                </div>
                
                {/* Stats com cores Firece */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-success/10 text-success rounded p-2 text-center border-2 border-success/30">
                    <div className="text-xs mb-1 font-bold">↑ 12pts</div>
                    <div className="text-[10px] opacity-80 font-semibold">30 dias</div>
                  </div>
                  <div className="bg-primary/10 text-primary rounded p-2 text-center border-2 border-primary/30 shadow-glow">
                    <div className="text-xs mb-1 font-bold">6/6</div>
                    <div className="text-[10px] opacity-80 font-semibold">áreas</div>
                  </div>
                  <div className="bg-secondary/10 text-secondary rounded p-2 text-center border-2 border-secondary/30">
                    <div className="text-xs mb-1 font-bold">Top 15%</div>
                    <div className="text-[10px] opacity-80 font-semibold">usuários</div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements com cores Firece */}
              <div className="absolute -top-4 -right-4 bg-primary text-white rounded-full p-3 shadow-glow animate-bounce-in">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-secondary text-white rounded-full p-3 shadow-lg animate-bounce-in" style={{ animationDelay: '200ms' }}>
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
