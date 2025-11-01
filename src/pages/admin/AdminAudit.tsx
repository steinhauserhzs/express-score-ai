import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Shield, Eye, Download, Activity } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AdminAudit() {
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState("all");
  const [stats, setStats] = useState({
    totalAccesses: 0,
    uniqueAdmins: 0,
    todayAccesses: 0,
  });

  useEffect(() => {
    if (isAdmin) {
      loadAuditLogs();
    }
  }, [isAdmin]);

  const loadAuditLogs = async () => {
    try {
      // Try query with JOIN first
      const { data, error } = await supabase
        .from("admin_audit_logs")
        .select(`
          *,
          admin:admin_id (
            full_name,
            email
          )
        `)
        .order("accessed_at", { ascending: false })
        .limit(100);

      if (error) {
        console.error("Error with JOIN:", error);
        // Fallback: fetch logs and profiles separately
        const { data: logsData } = await supabase
          .from("admin_audit_logs")
          .select("*")
          .order("accessed_at", { ascending: false })
          .limit(100);

        if (logsData && logsData.length > 0) {
          const adminIds = [...new Set(logsData.map((l) => l.admin_id))];
          const { data: adminsData } = await supabase
            .from("profiles")
            .select("id, full_name, email")
            .in("id", adminIds);

          const adminsMap = new Map(adminsData?.map((a) => [a.id, a]));
          const enrichedLogs = logsData.map((log) => ({
            ...log,
            admin: adminsMap.get(log.admin_id),
          }));

          setLogs(enrichedLogs);
        } else {
          setLogs([]);
        }
      } else {
        setLogs(data || []);
      }

      // Calculate stats
      const logs = data || [];
      const totalAccesses = logs.length;
      const uniqueAdmins = new Set(logs.map((log) => log.admin_id)).size;
      const today = new Date().toISOString().split("T")[0];
      const todayAccesses =
        logs.filter((log) => log.accessed_at.startsWith(today)).length;

      setStats({ totalAccesses, uniqueAdmins, todayAccesses });
    } catch (error) {
      console.error("Error loading audit logs:", error);
      toast.error("Erro ao carregar logs de auditoria");
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = [
      "Administrador",
      "Ação",
      "Tabela",
      "ID do Registro",
      "Data/Hora",
      "IP",
    ];
    const rows = filteredLogs.map((log) => [
      log.admin?.full_name || log.admin?.email,
      log.action,
      log.table_name,
      log.record_id,
      format(new Date(log.accessed_at), "PPP HH:mm:ss", { locale: ptBR }),
      log.ip_address || "N/A",
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `auditoria_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("CSV exportado com sucesso!");
  };

  const filteredLogs = logs.filter((log) => {
    if (actionFilter === "all") return true;
    return log.action === actionFilter;
  });

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      SELECT: "text-blue-600",
      INSERT: "text-green-600",
      UPDATE: "text-yellow-600",
      DELETE: "text-red-600",
      ADMIN_VIEW_PROFILE: "text-purple-600",
    };
    return colors[action] || "text-gray-600";
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Auditoria</h1>
            <p className="text-muted-foreground">
              Logs de acesso e conformidade LGPD
            </p>
          </div>
          <Button onClick={exportCSV}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Acessos
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stats.totalAccesses}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Admins Únicos
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stats.uniqueAdmins}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Hoje</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stats.todayAccesses}</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por ação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Ações</SelectItem>
                <SelectItem value="SELECT">Visualização</SelectItem>
                <SelectItem value="INSERT">Criação</SelectItem>
                <SelectItem value="UPDATE">Atualização</SelectItem>
                <SelectItem value="DELETE">Exclusão</SelectItem>
                <SelectItem value="ADMIN_VIEW_PROFILE">
                  Acesso a Perfil
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Audit Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Registro de Acessos</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Administrador</TableHead>
                    <TableHead>Ação</TableHead>
                    <TableHead>Tabela</TableHead>
                    <TableHead>ID do Registro</TableHead>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>IP</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Nenhum log encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">
                          {log.admin?.full_name || log.admin?.email || "N/A"}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`font-semibold ${getActionColor(
                              log.action
                            )}`}
                          >
                            {log.action}
                          </span>
                        </TableCell>
                        <TableCell>{log.table_name}</TableCell>
                        <TableCell className="font-mono text-xs">
                          {log.record_id?.substring(0, 8)}...
                        </TableCell>
                        <TableCell>
                          {format(
                            new Date(log.accessed_at),
                            "dd/MM/yy HH:mm:ss",
                            { locale: ptBR }
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {log.ip_address || "N/A"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
            <div className="mt-4 text-sm text-muted-foreground">
              Mostrando {filteredLogs.length} de {logs.length} registros
            </div>
          </CardContent>
        </Card>

        {/* LGPD Compliance Notice */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Conformidade LGPD</h3>
                <p className="text-sm text-muted-foreground">
                  Todos os acessos a dados pessoais são registrados para
                  garantir a conformidade com a Lei Geral de Proteção de Dados
                  (LGPD). Os logs são mantidos por 6 meses para fins de
                  auditoria e segurança.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
