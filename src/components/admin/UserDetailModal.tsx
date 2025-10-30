import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Mail, Phone, CreditCard, MapPin, Calendar, IdCard, TrendingUp, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DiagnosticSummaryCard } from "./user-details/DiagnosticSummaryCard";
import { GamificationSummaryCard } from "./user-details/GamificationSummaryCard";
import { ConsultationTimeline } from "./user-details/ConsultationTimeline";
import { GoalsProgressCard } from "./user-details/GoalsProgressCard";
import { formatCPF, formatPhone } from "@/utils/formatters";
import { formatCEP } from "@/utils/cep";

interface UserDetailModalProps {
  user: {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
    cpf: string | null;
    rg: string | null;
    cep: string | null;
    street: string | null;
    city: string | null;
    state: string | null;
    created_at: string;
    last_login_at: string | null;
    roles: string[];
    lead_score?: number | null;
    churn_risk?: string | null;
    tags?: string[] | null;
  } | null;
  open: boolean;
  onClose: () => void;
}

export default function UserDetailModal({ user, open, onClose }: UserDetailModalProps) {
  const { data: enrichedData, isLoading } = useQuery({
    queryKey: ["user-details-enriched", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const [
        { data: diagnostics },
        { data: gamification },
        { data: badges },
        { data: consultations },
        { data: goals },
      ] = await Promise.all([
        supabase
          .from("diagnostics")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("user_gamification")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle(),
        supabase
          .from("user_badges")
          .select("*")
          .eq("user_id", user.id)
          .order("earned_at", { ascending: false })
          .limit(5),
        supabase
          .from("consultations")
          .select("*")
          .eq("client_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("financial_goals")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

      return {
        diagnostics: diagnostics || [],
        gamification,
        badges: badges || [],
        consultations: consultations || [],
        goals: goals || [],
      };
    },
    enabled: !!user?.id && open,
  });

  if (!user) return null;

  const getChurnRiskColor = (risk: string) => {
    if (risk === 'high') return 'text-red-500';
    if (risk === 'medium') return 'text-yellow-500';
    return 'text-green-500';
  };

  const getChurnRiskLabel = (risk: string) => {
    if (risk === 'high') return 'Alto';
    if (risk === 'medium') return 'Médio';
    return 'Baixo';
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {user.full_name}
          </DialogTitle>
          <DialogDescription>
            Visão completa do cliente
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="geral" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="diagnosticos">Diagnósticos</TabsTrigger>
            <TabsTrigger value="gamificacao">Gamificação</TabsTrigger>
            <TabsTrigger value="consultations">Consultas</TabsTrigger>
            <TabsTrigger value="metas">Metas</TabsTrigger>
          </TabsList>

          <TabsContent value="geral" className="space-y-6 mt-4">
            {/* Lead Score & Churn Risk */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Lead Score</span>
                </div>
                <p className="text-3xl font-bold">{user.lead_score || 50}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {user.lead_score && user.lead_score >= 70 ? 'Cliente Quente' : 
                   user.lead_score && user.lead_score >= 40 ? 'Cliente Morno' : 'Cliente Frio'}
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Risco de Churn</span>
                </div>
                <p className={`text-3xl font-bold ${getChurnRiskColor(user.churn_risk || 'low')}`}>
                  {getChurnRiskLabel(user.churn_risk || 'low')}
                </p>
              </div>
            </div>

            {/* Tags */}
            {user.tags && user.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground">TAGS</h3>
                <div className="flex flex-wrap gap-2">
                  {user.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Informações Pessoais */}
            <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
              INFORMAÇÕES PESSOAIS
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 mt-1 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Nome Completo</p>
                  <p className="font-medium">{user.full_name}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 mt-1 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              {user.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Telefone</p>
                    <p className="font-medium">{formatPhone(user.phone)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Documentos */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
              DOCUMENTOS
            </h3>
            <div className="space-y-3">
              {user.cpf && (
                <div className="flex items-start gap-3">
                  <CreditCard className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">CPF</p>
                    <p className="font-medium font-mono">{formatCPF(user.cpf)}</p>
                  </div>
                </div>
              )}

              {user.rg && (
                <div className="flex items-start gap-3">
                  <IdCard className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">RG</p>
                    <p className="font-medium font-mono">{user.rg}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {user.cep && (
            <>
              <Separator />
              {/* Endereço */}
              <div>
                <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
                  ENDEREÇO
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-xs text-muted-foreground">CEP</p>
                      <p className="font-medium font-mono">{formatCEP(user.cep)}</p>
                    </div>
                  </div>

                  {user.street && (
                    <div className="flex items-start gap-3">
                      <div className="h-4 w-4" /> {/* Spacer */}
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Logradouro</p>
                        <p className="font-medium">{user.street}</p>
                      </div>
                    </div>
                  )}

                  {(user.city || user.state) && (
                    <div className="flex items-start gap-3">
                      <div className="h-4 w-4" /> {/* Spacer */}
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground">Cidade/Estado</p>
                        <p className="font-medium">
                          {user.city}{user.state && ` - ${user.state}`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Informações do Sistema */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-muted-foreground">
              INFORMAÇÕES DO SISTEMA
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Data de Cadastro</p>
                  <p className="font-medium">
                    {new Date(user.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>

              {user.last_login_at && (
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Último Acesso</p>
                    <p className="font-medium">
                      {new Date(user.last_login_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="h-4 w-4" /> {/* Spacer */}
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Roles/Permissões</p>
                  <div className="flex gap-2 mt-1">
                    {user.roles.map((role) => (
                      <Badge key={role} variant={role === 'admin' ? 'default' : 'secondary'}>
                        {role === 'admin' ? 'Administrador' : 'Cliente'}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          </TabsContent>

          <TabsContent value="diagnosticos" className="mt-4">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : (
              <DiagnosticSummaryCard diagnostics={enrichedData?.diagnostics || []} />
            )}
          </TabsContent>

          <TabsContent value="gamificacao" className="mt-4">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : (
              <GamificationSummaryCard 
                gamification={enrichedData?.gamification} 
                badges={enrichedData?.badges || []} 
              />
            )}
          </TabsContent>

          <TabsContent value="consultations" className="mt-4">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : (
              <ConsultationTimeline consultations={enrichedData?.consultations || []} />
            )}
          </TabsContent>

          <TabsContent value="metas" className="mt-4">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            ) : (
              <GoalsProgressCard goals={enrichedData?.goals || []} />
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
