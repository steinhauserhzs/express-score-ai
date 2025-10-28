import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, User, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import ScoreRadar from "@/components/ScoreRadar";
import ClassificationBadge from "@/components/diagnostic/ClassificationBadge";
import { useNavigate } from "react-router-dom";

interface DiagnosticDetailModalProps {
  diagnosticId: string | null;
  open: boolean;
  onClose: () => void;
}

export default function DiagnosticDetailModal({
  diagnosticId,
  open,
  onClose,
}: DiagnosticDetailModalProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [diagnostic, setDiagnostic] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [badges, setBadges] = useState<any[]>([]);

  useEffect(() => {
    if (open && diagnosticId) {
      loadDiagnosticDetails();
    }
  }, [open, diagnosticId]);

  const loadDiagnosticDetails = async () => {
    if (!diagnosticId) return;
    
    setLoading(true);
    try {
      // Buscar diagnóstico completo
      const { data: diagData, error: diagError } = await supabase
        .from("diagnostics")
        .select("*")
        .eq("id", diagnosticId)
        .single();

      if (diagError) throw diagError;
      setDiagnostic(diagData);

      // Buscar perfil do usuário
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", diagData.user_id)
        .single();

      if (profileError) throw profileError;
      setProfile(profileData);

      // Buscar badges do usuário
      const { data: badgesData } = await supabase
        .from("user_badges")
        .select("*")
        .eq("user_id", diagData.user_id)
        .order("earned_at", { ascending: false });

      setBadges(badgesData || []);

      // Logar acesso admin
      await supabase.rpc("log_admin_action", {
        p_action: "VIEW_DIAGNOSTIC_DETAILS",
        p_table_name: "diagnostics",
        p_record_id: diagnosticId,
      });
    } catch (error) {
      console.error("Error loading diagnostic details:", error);
      toast.error("Erro ao carregar detalhes do diagnóstico");
    } finally {
      setLoading(false);
    }
  };

  const generateConsultantReport = async () => {
    if (!diagnosticId) return;
    
    try {
      toast.loading("Gerando relatório técnico...");
      const { data, error } = await supabase.functions.invoke("generate-report", {
        body: {
          diagnosticId,
          reportType: "consultant",
        },
      });

      toast.dismiss();

      if (error) throw error;

      window.open(data.reportUrl, "_blank");
      toast.success("Relatório técnico gerado!");
    } catch (error) {
      toast.error("Erro ao gerar relatório técnico");
    }
  };

  const getProfileDescription = (profile: string) => {
    const descriptions: Record<string, string> = {
      endividado: "Cliente com dívidas significativas que precisam ser priorizadas",
      desorganizado: "Cliente sem controle financeiro adequado, necessita organização",
      poupador: "Cliente conservador que poupa mas não investe adequadamente",
      investidor: "Cliente com boa organização e foco em crescimento patrimonial",
    };
    return descriptions[profile?.toLowerCase()] || "Perfil em análise";
  };

  const getRecommendations = (profile: string) => {
    const recommendations: Record<string, string[]> = {
      endividado: [
        "Renegociar dívidas para reduzir juros",
        "Criar plano de quitação prioritária",
        "Cortar gastos não essenciais",
        "Buscar fontes extras de renda",
      ],
      desorganizado: [
        "Implementar controle diário de gastos",
        "Criar orçamento mensal detalhado",
        "Automatizar pagamentos e investimentos",
        "Estabelecer reserva de emergência",
      ],
      poupador: [
        "Diversificar investimentos além da poupança",
        "Estudar renda fixa (CDB, Tesouro)",
        "Definir metas financeiras claras",
        "Começar investimentos em renda variável",
      ],
      investidor: [
        "Otimizar estratégia de alocação de ativos",
        "Considerar investimentos internacionais",
        "Planejar sucessão patrimonial",
        "Focar em liberdade financeira",
      ],
    };
    return recommendations[profile?.toLowerCase()] || [];
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Diagnóstico Completo - {profile?.full_name || "Carregando..."}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : diagnostic ? (
          <div className="space-y-6">
            {/* Informações do Cliente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informações do Cliente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-semibold text-muted-foreground">Nome:</dt>
                    <dd className="text-base font-medium">{profile?.full_name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-muted-foreground">Email:</dt>
                    <dd className="text-base">{profile?.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-muted-foreground">Telefone:</dt>
                    <dd className="text-base">{profile?.phone || "Não informado"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-muted-foreground">Lead Score:</dt>
                    <dd className="text-base font-bold text-primary">{profile?.lead_score || 50}/100</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-muted-foreground">CPF:</dt>
                    <dd className="text-base">{profile?.cpf || "Não informado"}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-semibold text-muted-foreground">Cidade/Estado:</dt>
                    <dd className="text-base">{profile?.city && profile?.state ? `${profile.city} - ${profile.state}` : "Não informado"}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {/* Score Geral */}
            <Card>
              <CardHeader>
                <CardTitle>📊 Score Geral</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="text-center md:text-left">
                    <div className="text-5xl font-bold text-primary mb-2">
                      {diagnostic.total_score}/150
                    </div>
                    <div className="text-sm text-muted-foreground mb-3">
                      Score Express de Saúde Financeira
                    </div>
                    <ClassificationBadge
                      classification={diagnostic.score_classification}
                      score={diagnostic.total_score}
                    />
                  </div>
                  <div className="w-full md:w-auto">
                    {diagnostic.quality_of_life && (
                      <div className="p-4 bg-muted/50 rounded-lg text-center">
                        <div className="text-sm text-muted-foreground mb-1">Qualidade de Vida</div>
                        <div className="text-3xl font-bold text-primary">
                          {diagnostic.quality_of_life}/10
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scores por Dimensão com Radar */}
            <Card>
              <CardHeader>
                <CardTitle>📈 Análise Detalhada por Dimensão</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <ScoreRadar dimensionScores={diagnostic.dimension_scores} />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">💳 Dívidas</span>
                      <span className="text-lg font-bold">{diagnostic.dimension_scores.debts}/25</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(diagnostic.dimension_scores.debts / 25) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">🎯 Comportamento</span>
                      <span className="text-lg font-bold">{diagnostic.dimension_scores.behavior}/20</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(diagnostic.dimension_scores.behavior / 20) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">💸 Gastos</span>
                      <span className="text-lg font-bold">{diagnostic.dimension_scores.spending}/15</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(diagnostic.dimension_scores.spending / 15) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">🎯 Metas</span>
                      <span className="text-lg font-bold">{diagnostic.dimension_scores.goals}/15</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(diagnostic.dimension_scores.goals / 15) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">🏦 Reservas</span>
                      <span className="text-lg font-bold">{diagnostic.dimension_scores.reserves}/15</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(diagnostic.dimension_scores.reserves / 15) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">📈 Renda</span>
                      <span className="text-lg font-bold">{diagnostic.dimension_scores.income}/10</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(diagnostic.dimension_scores.income / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Perfil e Recomendações */}
            <Card>
              <CardHeader>
                <CardTitle>🎯 Perfil e Estratégia de Abordagem</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-lg mb-2">
                    Perfil: <span className="text-primary">{diagnostic.profile}</span>
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {getProfileDescription(diagnostic.profile)}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Recomendações Prioritárias:</h4>
                  <ul className="space-y-2">
                    {getRecommendations(diagnostic.profile).map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <ArrowRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Badges Conquistados */}
            {badges.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>🏆 Badges Conquistados ({badges.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {badges.map((badge) => (
                      <div
                        key={badge.id}
                        className="flex flex-col items-center p-4 border rounded-lg bg-muted/30"
                      >
                        <span className="text-4xl mb-2">🏅</span>
                        <span className="font-semibold text-sm text-center">
                          {badge.badge_name}
                        </span>
                        <span className="text-xs text-muted-foreground text-center mt-1">
                          {new Date(badge.earned_at).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button onClick={generateConsultantReport} size="lg">
                <Download className="mr-2 h-4 w-4" />
                Gerar Relatório Técnico (PDF)
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  navigate(`/admin/users?search=${profile?.email}`);
                  onClose();
                }}
                size="lg"
              >
                Ver Perfil Completo do Cliente
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum diagnóstico encontrado
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
