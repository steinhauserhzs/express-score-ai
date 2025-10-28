import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface QuickUpdateModalProps {
  open: boolean;
  onClose: () => void;
}

const dimensions = [
  { id: "debts", label: "💳 Dívidas", description: "Atualize o status das suas dívidas" },
  { id: "behavior", label: "🎯 Comportamento", description: "Como está seu controle financeiro?" },
  { id: "spending", label: "💸 Gastos", description: "Seus gastos mudaram?" },
  { id: "goals", label: "🎯 Metas", description: "Progresso das suas metas" },
  { id: "reserves", label: "🏦 Reservas", description: "Atualize suas reservas e investimentos" },
  { id: "income", label: "📈 Renda", description: "Mudanças na sua renda" },
];

export default function QuickUpdateModal({ open, onClose }: QuickUpdateModalProps) {
  const navigate = useNavigate();

  const handleSelectDimension = (dimensionId: string) => {
    navigate(`/dashboard/update/${dimensionId}`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">⚡ Atualização Rápida</DialogTitle>
          <DialogDescription>
            Escolha qual área você quer atualizar. São apenas 5 perguntas rápidas por dimensão.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {dimensions.map((dimension) => (
            <button
              key={dimension.id}
              onClick={() => handleSelectDimension(dimension.id)}
              className="p-4 text-left border rounded-lg hover:bg-muted/50 hover:border-primary transition-all"
            >
              <div className="text-lg font-semibold mb-1">
                {dimension.label}
              </div>
              <div className="text-sm text-muted-foreground">
                {dimension.description}
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Dica:</strong> A atualização rápida permite que você mantenha seu score atualizado sem refazer todo o diagnóstico. Responda algumas perguntas específicas e veja seu progresso!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
