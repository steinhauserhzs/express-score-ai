import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";
import Confetti from "react-confetti";

interface UpdateResult {
  oldScore: number;
  newScore: number;
  dimension: string;
  dimensionOldScore: number;
  dimensionNewScore: number;
  improvement: number;
}

export default function QuickUpdateResult() {
  const { diagnosticId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState<UpdateResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    loadResult();
  }, [diagnosticId]);

  const loadResult = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Buscar os dois últimos diagnósticos
      const { data: diagnostics } = await supabase
        .from("diagnostics")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(2);

      if (diagnostics && diagnostics.length >= 2) {
        const newDiag = diagnostics[0];
        const oldDiag = diagnostics[1];

        // Identificar qual dimensão foi atualizada (a que teve maior mudança)
        const dimensions = ["debts", "behavior", "spending", "goals", "reserves", "income"];
        let maxChange = 0;
        let changedDimension = dimensions[0];

        dimensions.forEach((dim) => {
          const change = Math.abs(
            newDiag.dimension_scores[dim] - oldDiag.dimension_scores[dim]
          );
          if (change > maxChange) {
            maxChange = change;
            changedDimension = dim;
          }
        });

        const improvement = newDiag.total_score - oldDiag.total_score;

        setResult({
          oldScore: oldDiag.total_score,
          newScore: newDiag.total_score,
          dimension: changedDimension,
          dimensionOldScore: oldDiag.dimension_scores[changedDimension],
          dimensionNewScore: newDiag.dimension_scores[changedDimension],
          improvement,
        });

        // Confetti se melhorou
        if (improvement > 0) {
          setTimeout(() => {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
          }, 500);
        }
      }
    } catch (error) {
      console.error("Error loading result:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDimensionLabel = (dimension: string) => {
    const labels: Record<string, string> = {
      debts: "Dívidas",
      behavior: "Comportamento",
      spending: "Gastos",
      goals: "Metas",
      reserves: "Reservas",
      income: "Renda",
    };
    return labels[dimension] || dimension;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Não foi possível carregar os resultados</p>
            <Button onClick={() => navigate("/dashboard")} className="mt-4 w-full">
              Voltar ao Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getTrendIcon = () => {
    if (result.improvement > 0) return <TrendingUp className="h-8 w-8 text-success" />;
    if (result.improvement < 0) return <TrendingDown className="h-8 w-8 text-destructive" />;
    return <Minus className="h-8 w-8 text-muted-foreground" />;
  };

  const getResultMessage = () => {
    if (result.improvement > 5) return "Parabéns! Grande evolução! 🎉";
    if (result.improvement > 0) return "Boa! Você melhorou! 👏";
    if (result.improvement === 0) return "Sua pontuação se manteve estável";
    return "Houve uma pequena queda, mas continue tentando!";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">{getTrendIcon()}</div>
            <CardTitle className="text-3xl">{getResultMessage()}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Total */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Score Total</p>
              <div className="flex items-center justify-center gap-4">
                <span className="text-4xl font-bold text-muted-foreground line-through">
                  {result.oldScore}
                </span>
                <ArrowRight className="h-6 w-6" />
                <span className="text-5xl font-bold text-primary">{result.newScore}</span>
              </div>
              <p className="text-lg font-medium">
                {result.improvement > 0 ? "+" : ""}
                {result.improvement} pontos
              </p>
            </div>

            {/* Dimensão Atualizada */}
            <div className="bg-muted/50 rounded-lg p-6 space-y-2">
              <p className="text-sm text-muted-foreground text-center">
                Dimensão Atualizada: {getDimensionLabel(result.dimension)}
              </p>
              <div className="flex items-center justify-center gap-4">
                <span className="text-2xl font-semibold text-muted-foreground">
                  {result.dimensionOldScore}
                </span>
                <ArrowRight className="h-5 w-5" />
                <span className="text-3xl font-bold text-primary">{result.dimensionNewScore}</span>
              </div>
            </div>

            {/* Ações */}
            <div className="space-y-3">
              <Button onClick={() => navigate("/dashboard")} className="w-full" size="lg">
                Voltar ao Dashboard
              </Button>
              <Button
                onClick={() => navigate("/dashboard/evolution")}
                variant="outline"
                className="w-full"
              >
                Ver Minha Evolução Completa
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
