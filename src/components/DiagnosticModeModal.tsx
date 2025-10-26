import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Star, Clock, Check } from "lucide-react";

interface DiagnosticModeModalProps {
  open: boolean;
  onSelect: (turboMode: boolean) => void;
}

export default function DiagnosticModeModal({ open, onSelect }: DiagnosticModeModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Escolha o Tipo de Diagnóstico</DialogTitle>
          <DialogDescription>
            Ambos são gratuitos e você receberá seu score completo
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Turbo Mode */}
          <Card 
            className="border-2 hover:border-primary cursor-pointer transition-all hover:shadow-lg"
            onClick={() => onSelect(true)}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle>Diagnóstico Turbo</CardTitle>
                  <CardDescription>Rápido e eficiente</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Clock className="h-5 w-5" />
                <span>10-15 minutos</span>
              </div>
              
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-success flex-shrink-0" />
                  <span>10 perguntas essenciais</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-success flex-shrink-0" />
                  <span>Score completo de 0-150</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-success flex-shrink-0" />
                  <span>Análise básica por dimensão</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-success flex-shrink-0" />
                  <span>Top 5 recomendações</span>
                </li>
              </ul>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  <strong>Ideal para:</strong> Quem quer uma avaliação rápida e objetiva
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Complete Mode */}
          <Card 
            className="border-2 border-primary hover:shadow-xl cursor-pointer transition-all bg-primary/5"
            onClick={() => onSelect(false)}
          >
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary rounded-full">
                  <Star className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    Diagnóstico Completo
                    <Badge className="bg-success">Recomendado</Badge>
                  </CardTitle>
                  <CardDescription>Análise profunda e detalhada</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <Clock className="h-5 w-5" />
                <span>20-30 minutos</span>
              </div>
              
              <ul className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-success flex-shrink-0" />
                  <span>39 perguntas detalhadas</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-success flex-shrink-0" />
                  <span>Score completo + subscore por dimensão</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-success flex-shrink-0" />
                  <span>Análise comportamental aprofundada</span>
                </li>
                <li className="flex gap-2">
                  <Check className="h-5 w-5 text-success flex-shrink-0" />
                  <span>Plano de ação com 15+ recomendações</span>
                </li>
                <li className="flex gap-2">
                  <Star className="h-5 w-5 text-warning flex-shrink-0" />
                  <span className="font-semibold">Relatório PDF completo GRÁTIS</span>
                </li>
              </ul>
              
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  <strong>Ideal para:</strong> Quem quer um diagnóstico preciso e um plano de ação detalhado
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6 p-4 bg-muted rounded-lg text-sm text-center">
          💡 <strong>Dica:</strong> O diagnóstico completo fornece insights muito mais profundos 
          e é o que nossos consultores usam para criar seu plano personalizado.
        </div>
      </DialogContent>
    </Dialog>
  );
}