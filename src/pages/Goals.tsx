import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Target, TrendingUp, Trash2, Edit, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FinancialGoal {
  id: string;
  title: string;
  description: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  category: 'emergency' | 'investment' | 'debt' | 'purchase' | 'retirement';
  status: 'not_started' | 'in_progress' | 'achieved' | 'cancelled';
  created_at: string;
  achieved_at?: string;
}

import { GoalsSkeleton } from "@/components/ui/skeleton-group";

export default function Goals() {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_amount: '',
    current_amount: '0',
    deadline: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    category: 'emergency' as 'emergency' | 'investment' | 'debt' | 'purchase' | 'retirement',
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("financial_goals")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setGoals((data || []) as FinancialGoal[]);
    } catch (error) {
      console.error("Error fetching goals:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar suas metas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async () => {
    try {
      // Validation
      if (!formData.title.trim()) {
        toast({
          title: "Erro de Validação",
          description: "O título da meta é obrigatório.",
          variant: "destructive",
        });
        return;
      }

      if (!formData.target_amount || parseFloat(formData.target_amount) <= 0) {
        toast({
          title: "Erro de Validação",
          description: "O valor da meta deve ser maior que zero.",
          variant: "destructive",
        });
        return;
      }

      const targetAmount = parseFloat(formData.target_amount);
      const currentAmount = formData.current_amount ? parseFloat(formData.current_amount) : 0;

      if (currentAmount < 0) {
        toast({
          title: "Erro de Validação",
          description: "O valor atual não pode ser negativo.",
          variant: "destructive",
        });
        return;
      }

      if (currentAmount > targetAmount) {
        toast({
          title: "Erro de Validação",
          description: "O valor atual não pode ser maior que a meta.",
          variant: "destructive",
        });
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { error } = await supabase
        .from("financial_goals")
        .insert({
          user_id: session.user.id,
          ...formData,
          target_amount: targetAmount,
          current_amount: currentAmount,
          status: currentAmount > 0 ? 'in_progress' : 'not_started'
        });

      if (error) throw error;

      toast({
        title: "Meta Criada!",
        description: "Sua nova meta foi adicionada com sucesso.",
      });

      setShowCreateDialog(false);
      resetForm();
      fetchGoals();
    } catch (error) {
      console.error("Error creating goal:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a meta.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProgress = async (goalId: string, newAmount: number, targetAmount: number) => {
    try {
      const updateData: any = {
        current_amount: newAmount,
        status: newAmount >= targetAmount ? 'achieved' : newAmount > 0 ? 'in_progress' : 'not_started'
      };

      if (newAmount >= targetAmount) {
        updateData.achieved_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("financial_goals")
        .update(updateData)
        .eq("id", goalId);

      if (error) throw error;

      if (newAmount >= targetAmount) {
        toast({
          title: "🎉 Parabéns!",
          description: "Você atingiu sua meta!",
        });
      } else {
        toast({
          title: "Progresso Atualizado",
          description: "O progresso da meta foi atualizado.",
        });
      }

      fetchGoals();
    } catch (error) {
      console.error("Error updating goal:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a meta.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta meta?")) return;

    try {
      const { error } = await supabase
        .from("financial_goals")
        .delete()
        .eq("id", goalId);

      if (error) throw error;

      toast({
        title: "Meta Excluída",
        description: "A meta foi removida com sucesso.",
      });

      fetchGoals();
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a meta.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      target_amount: '',
      current_amount: '0',
      deadline: '',
      priority: 'medium',
      category: 'emergency',
    });
    setEditingGoal(null);
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      emergency: 'Reserva de Emergência',
      investment: 'Investimento',
      debt: 'Quitação de Dívida',
      purchase: 'Compra',
      retirement: 'Aposentadoria'
    };
    return labels[category] || category;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: 'destructive',
      medium: 'warning',
      low: 'secondary'
    };
    return colors[priority] || 'secondary';
  };

  if (loading) {
    return <GoalsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Minhas Metas Financeiras</h1>
            <p className="text-muted-foreground">Defina e acompanhe seus objetivos</p>
          </div>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Meta
          </Button>
        </div>

        {/* Goals Grid */}
        {goals.length === 0 ? (
          <Card className="p-12 text-center">
            <Target className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Nenhuma Meta Criada</h2>
            <p className="text-muted-foreground mb-6">
              Defina suas primeiras metas financeiras para começar a acompanhar seu progresso
            </p>
            <Button size="lg" onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-5 w-5" />
              Criar Primeira Meta
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {goals.map((goal) => {
              const progress = (goal.current_amount / goal.target_amount) * 100;
              const daysUntilDeadline = goal.deadline
                ? Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                : null;

              return (
                <Card key={goal.id} className={goal.status === 'achieved' ? 'border-success' : ''}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">{goal.title}</CardTitle>
                          {goal.status === 'achieved' && (
                            <CheckCircle2 className="h-5 w-5 text-success" />
                          )}
                        </div>
                        <CardDescription>{goal.description}</CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteGoal(goal.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Badge variant={getPriorityColor(goal.priority) as any}>
                        {goal.priority === 'high' ? 'Alta' : goal.priority === 'medium' ? 'Média' : 'Baixa'}
                      </Badge>
                      <Badge variant="outline">{getCategoryLabel(goal.category)}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">Progresso</span>
                        <span className="text-muted-foreground">{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>R$ {goal.current_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        <span>R$ {goal.target_amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>

                    {daysUntilDeadline !== null && goal.status !== 'achieved' && (
                      <div className="flex items-center gap-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {daysUntilDeadline > 0 
                            ? `${daysUntilDeadline} dias restantes`
                            : daysUntilDeadline === 0
                            ? 'Prazo hoje!'
                            : `${Math.abs(daysUntilDeadline)} dias atrasado`
                          }
                        </span>
                      </div>
                    )}

                    {goal.status !== 'achieved' && (
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Novo valor"
                          className="flex-1"
                          min="0"
                          step="0.01"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const input = e.target as HTMLInputElement;
                              const value = parseFloat(input.value);
                              if (isNaN(value) || value < 0) {
                                toast({
                                  title: "Valor Inválido",
                                  description: "Digite um valor válido maior ou igual a zero.",
                                  variant: "destructive",
                                });
                                return;
                              }
                              handleUpdateProgress(goal.id, value, goal.target_amount);
                              input.value = '';
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                            const value = parseFloat(input.value);
                            if (isNaN(value) || value < 0) {
                              toast({
                                title: "Valor Inválido",
                                description: "Digite um valor válido maior ou igual a zero.",
                                variant: "destructive",
                              });
                              return;
                            }
                            handleUpdateProgress(goal.id, value, goal.target_amount);
                            input.value = '';
                          }}
                        >
                          Atualizar
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Create Goal Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nova Meta Financeira</DialogTitle>
              <DialogDescription>
                Defina uma meta SMART (Específica, Mensurável, Atingível, Relevante, Temporal)
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Título da Meta</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Reserva de Emergência"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva sua meta..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emergency">Reserva de Emergência</SelectItem>
                      <SelectItem value="investment">Investimento</SelectItem>
                      <SelectItem value="debt">Quitação de Dívida</SelectItem>
                      <SelectItem value="purchase">Compra</SelectItem>
                      <SelectItem value="retirement">Aposentadoria</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="low">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="target_amount">Valor da Meta (R$)</Label>
                  <Input
                    id="target_amount"
                    type="number"
                    value={formData.target_amount}
                    onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="current_amount">Valor Atual (R$)</Label>
                  <Input
                    id="current_amount"
                    type="number"
                    value={formData.current_amount}
                    onChange={(e) => setFormData({ ...formData, current_amount: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="deadline">Prazo</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => { setShowCreateDialog(false); resetForm(); }}>
                Cancelar
              </Button>
              <Button onClick={handleCreateGoal}>
                Criar Meta
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}