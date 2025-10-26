import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UpsellModalProps {
  open: boolean;
  onClose: () => void;
  totalScore: number;
  debtScore: number;
}

export default function UpsellModal({ open, onClose, totalScore, debtScore }: UpsellModalProps) {
  const navigate = useNavigate();

  const calculateLostMoney = () => {
    if (debtScore < 15) return Math.round((25 - debtScore) * 200);
    return Math.round((150 - totalScore) * 50);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <div className="text-center space-y-4">
          <AlertCircle className="h-16 w-16 text-warning mx-auto" />
          <h2 className="text-2xl font-bold">Seu Score Indica Oportunidade de Melhoria</h2>
          <p className="text-lg">
            Com um score de <strong>{totalScore}/150</strong>, você está perdendo aproximadamente{" "}
            <strong className="text-destructive">R$ {calculateLostMoney()}</strong> por mês com juros e má gestão.
          </p>
          
          {debtScore < 15 && (
            <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
              <p className="text-sm">
                <strong>⚠️ CRÍTICO:</strong> Seu score de dívidas está abaixo de 60%. 
                Sem ação imediata, sua situação pode piorar nos próximos meses.
              </p>
            </div>
          )}
          
          <div className="bg-success/10 border border-success/20 p-4 rounded-lg">
            <p className="text-sm">
              <strong>✅ BOA NOTÍCIA:</strong> Clientes com score similar melhoraram em média{" "}
              <strong>45 pontos</strong> em 3 meses com nossa consultoria.
            </p>
          </div>
          
          <div className="pt-4 space-y-3">
            <Button size="lg" className="w-full" onClick={() => navigate('/consultations')}>
              Quero Melhorar Minha Situação - Agendar Consultoria
            </Button>
            <p className="text-xs text-muted-foreground">
              🔒 Primeira sessão com desconto especial • Sem compromisso
            </p>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Continuar sem consultoria
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}