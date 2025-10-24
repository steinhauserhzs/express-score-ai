import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, Users, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AdminConsultations() {
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({
    pending: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    if (isAdmin) {
      loadConsultations();
    }
  }, [isAdmin]);

  const loadConsultations = async () => {
    try {
      const { data, error } = await supabase
        .from("consultations")
        .select(`
          *,
          profiles:client_id (
            full_name,
            email,
            phone
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setConsultations(data || []);
      
      // Calculate stats
      const pending = data?.filter((c) => c.status === "pending").length || 0;
      const scheduled = data?.filter((c) => c.status === "scheduled").length || 0;
      const completed = data?.filter((c) => c.status === "completed").length || 0;
      const cancelled = data?.filter((c) => c.status === "cancelled").length || 0;

      setStats({ pending, scheduled, completed, cancelled });
    } catch (error) {
      console.error("Error loading consultations:", error);
      toast.error("Erro ao carregar consultorias");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("consultations")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      toast.success("Status atualizado com sucesso!");
      loadConsultations();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Erro ao atualizar status");
    }
  };

  const filteredConsultations = consultations.filter((c) => {
    if (statusFilter === "all") return true;
    return c.status === statusFilter;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      pending: { label: "Pendente", className: "bg-yellow-500 text-white" },
      scheduled: { label: "Agendada", className: "bg-blue-500 text-white" },
      in_progress: { label: "Em Andamento", className: "bg-purple-500 text-white" },
      completed: { label: "Concluída", className: "bg-green-500 text-white" },
      cancelled: { label: "Cancelada", className: "bg-red-500 text-white" },
    };

    const variant = variants[status] || variants.pending;
    return (
      <Badge className={variant.className}>
        {variant.label}
      </Badge>
    );
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Consultorias</h1>
          <p className="text-muted-foreground">
            Gestão completa de todas as consultorias
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats.pending}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Agendadas</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats.scheduled}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats.completed}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Canceladas</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{stats.cancelled}</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="scheduled">Agendadas</SelectItem>
                <SelectItem value="in_progress">Em Andamento</SelectItem>
                <SelectItem value="completed">Concluídas</SelectItem>
                <SelectItem value="cancelled">Canceladas</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Consultations List */}
        <div className="grid gap-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            ))
          ) : filteredConsultations.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma consultoria encontrada</p>
              </CardContent>
            </Card>
          ) : (
            filteredConsultations.map((consultation) => (
              <Card key={consultation.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-4">
                        <h3 className="text-lg font-semibold">
                          {consultation.profiles?.full_name || "Cliente"}
                        </h3>
                        {getStatusBadge(consultation.status)}
                      </div>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>📧 {consultation.profiles?.email}</p>
                        {consultation.profiles?.phone && (
                          <p>📱 {consultation.profiles.phone}</p>
                        )}
                        {consultation.scheduled_date && (
                          <p>
                            📅{" "}
                            {format(
                              new Date(consultation.scheduled_date),
                              "PPP 'às' HH:mm",
                              { locale: ptBR }
                            )}
                          </p>
                        )}
                        {consultation.notes && (
                          <p className="mt-2 text-foreground">
                            📝 {consultation.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {consultation.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => updateStatus(consultation.id, "scheduled")}
                        >
                          Confirmar
                        </Button>
                      )}
                      {consultation.status === "scheduled" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateStatus(consultation.id, "in_progress")
                            }
                          >
                            Iniciar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateStatus(consultation.id, "completed")
                            }
                          >
                            Concluir
                          </Button>
                        </>
                      )}
                      {consultation.status !== "cancelled" &&
                        consultation.status !== "completed" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              updateStatus(consultation.id, "cancelled")
                            }
                          >
                            Cancelar
                          </Button>
                        )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <div className="text-sm text-muted-foreground">
          Mostrando {filteredConsultations.length} de {consultations.length}{" "}
          consultorias
        </div>
      </div>
    </AdminLayout>
  );
}
