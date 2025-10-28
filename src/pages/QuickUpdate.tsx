import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface QuickQuestion {
  question: string;
  context: string;
}

const quickQuestions: Record<string, QuickQuestion[]> = {
  debts: [
    { question: "Suas dívidas aumentaram, diminuíram ou se mantiveram nos últimos 3 meses?", context: "debts_trend" },
    { question: "Você conseguiu renegociar alguma dívida recentemente?", context: "debt_renegotiation" },
    { question: "Está conseguindo pagar todas as parcelas em dia?", context: "payment_status" },
    { question: "Tem alguma dívida nova que não tinha antes?", context: "new_debts" },
    { question: "Conseguiu quitar alguma dívida completamente?", context: "debt_payoff" }
  ],
  behavior: [
    { question: "Você tem registrado seus gastos diariamente?", context: "expense_tracking" },
    { question: "Planejou seus gastos antes de comprá-los este mês?", context: "expense_planning" },
    { question: "Conseguiu resistir a compras por impulso?", context: "impulse_control" },
    { question: "Revisou seu orçamento este mês?", context: "budget_review" },
    { question: "Usou cartão de crédito de forma consciente?", context: "credit_usage" }
  ],
  spending: [
    { question: "Seus gastos fixos aumentaram ou diminuíram?", context: "fixed_expenses" },
    { question: "Conseguiu cortar algum gasto desnecessário?", context: "expense_cuts" },
    { question: "Está sobrando dinheiro no final do mês?", context: "end_of_month" },
    { question: "Identificou alguma categoria de gasto que está alta demais?", context: "expense_categories" },
    { question: "Tem economizado em comparação ao mês passado?", context: "savings_trend" }
  ],
  goals: [
    { question: "Você definiu novas metas financeiras recentemente?", context: "new_goals" },
    { question: "Está acompanhando o progresso das suas metas?", context: "goal_tracking" },
    { question: "Conseguiu cumprir alguma meta estabelecida?", context: "goal_achievement" },
    { question: "Suas metas têm prazos definidos?", context: "goal_deadlines" },
    { question: "Você ajustou alguma meta que não estava realista?", context: "goal_adjustment" }
  ],
  reserves: [
    { question: "Sua reserva de emergência aumentou nos últimos meses?", context: "emergency_fund" },
    { question: "Você começou a investir em algo novo?", context: "new_investments" },
    { question: "Diversificou seus investimentos?", context: "investment_diversification" },
    { question: "Está satisfeito com o rendimento dos seus investimentos?", context: "investment_return" },
    { question: "Tem patrimônio que gera renda passiva?", context: "passive_income_assets" }
  ],
  income: [
    { question: "Sua renda aumentou nos últimos meses?", context: "income_growth" },
    { question: "Conseguiu criar novas fontes de renda?", context: "income_diversification" },
    { question: "Tem renda passiva além do salário?", context: "passive_income" },
    { question: "Sua estabilidade profissional melhorou?", context: "job_stability" },
    { question: "Está recebendo benefícios adicionais?", context: "additional_benefits" }
  ]
};

const dimensionLabels: Record<string, string> = {
  debts: "💳 Dívidas",
  behavior: "🎯 Comportamento",
  spending: "💸 Gastos",
  goals: "🎯 Metas",
  reserves: "🏦 Reservas",
  income: "📈 Renda"
};

export default function QuickUpdate() {
  const { dimension } = useParams<{ dimension: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [diagnosticId, setDiagnosticId] = useState<string | null>(null);

  const questions = dimension ? quickQuestions[dimension] || [] : [];
  const progress = ((currentStep + 1) / questions.length) * 100;

  useEffect(() => {
    loadLatestDiagnostic();
  }, []);

  const loadLatestDiagnostic = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('diagnostics')
        .select('id')
        .eq('user_id', user.id)
        .eq('completed', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      setDiagnosticId(data.id);
    } catch (error) {
      console.error('Error loading diagnostic:', error);
    }
  };

  const handleNext = () => {
    if (!currentAnswer.trim()) {
      toast.error("Por favor, responda a pergunta antes de continuar.");
      return;
    }

    setAnswers([...answers, currentAnswer]);
    setCurrentAnswer("");

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit([...answers, currentAnswer]);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setCurrentAnswer(answers[currentStep - 1] || "");
      setAnswers(answers.slice(0, -1));
    }
  };

  const handleSubmit = async (allAnswers: string[]) => {
    if (!diagnosticId || !dimension) return;

    setLoading(true);
    try {
      // Create update context for AI to analyze
      const updateContext = questions.map((q, idx) => ({
        question: q.question,
        answer: allAnswers[idx],
        context: q.context
      }));

      // Call edge function to recalculate just this dimension
      const { data, error } = await supabase.functions.invoke('calculate-score', {
        body: {
          diagnosticId,
          quickUpdate: true,
          dimension,
          responses: updateContext
        }
      });

      if (error) throw error;

      toast.success(`${dimensionLabels[dimension]} atualizado com sucesso!`);
      
      // Redirecionar para página de resultado
      setTimeout(() => {
        navigate(`/dashboard/update-result/${diagnosticId}`);
      }, 1500);
    } catch (error) {
      console.error('Error updating dimension:', error);
      toast.error("Erro ao atualizar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!dimension || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 text-center">
          <p className="text-muted-foreground">Dimensão inválida.</p>
          <Button onClick={() => navigate('/dashboard')} className="mt-4">
            Voltar ao Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            ⚡ Atualização Rápida
          </h1>
          <p className="text-lg text-muted-foreground">
            {dimensionLabels[dimension]}
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Pergunta {currentStep + 1} de {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-xl">
              {questions[currentStep].question}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0 space-y-4">
            <Textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Digite sua resposta..."
              className="min-h-32"
              disabled={loading}
            />

            <div className="flex gap-3">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={loading}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voltar
                </Button>
              )}
              
              <Button
                onClick={handleNext}
                disabled={loading || !currentAnswer.trim()}
                className="gap-2 flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : currentStep < questions.length - 1 ? (
                  <>
                    Próxima
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Finalizar Atualização
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cancel */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            disabled={loading}
          >
            Cancelar e Voltar
          </Button>
        </div>
      </div>
    </div>
  );
}
