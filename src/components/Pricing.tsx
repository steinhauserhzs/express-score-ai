import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Pricing = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-4 bg-secondary/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Comece gratuitamente
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Teste completo sem custo. Pague apenas se quiser continuar evoluindo
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Diagnóstico Gratuito</CardTitle>
              <CardDescription className="text-foreground/70">Perfeito para começar</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold text-primary">R$ 0</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-success" />
                  <span className="text-foreground">SmartForm interativo com IA</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-success" />
                  <span className="text-foreground">Score Express completo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-success" />
                  <span className="text-foreground">Relatório básico em PDF</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-success" />
                  <span className="text-foreground">Recomendações personalizadas</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => navigate('/auth')}
              >
                Começar Agora
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="border-2 border-primary relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
              Mais Popular
            </div>
            <CardHeader>
              <CardTitle className="text-2xl text-foreground">Plano Premium</CardTitle>
              <CardDescription className="text-foreground/70">Acompanhamento completo</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold text-primary">R$ 47,90</span>
                <span className="text-foreground/60">/mês</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-success" />
                  <span className="text-foreground font-medium">Tudo do plano gratuito</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-success" />
                  <span className="text-foreground">Relatórios ilimitados</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-success" />
                  <span className="text-foreground">Acompanhamento de evolução</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-success" />
                  <span className="text-foreground">Chat IA ilimitado</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-success" />
                  <span className="text-foreground">1 consultoria com especialista</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                onClick={() => navigate('/auth')}
              >
                Começar Premium
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
