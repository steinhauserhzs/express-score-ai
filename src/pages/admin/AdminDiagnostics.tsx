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
import { Input } from "@/components/ui/input";
import { Download, TrendingUp, Users, Target, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function AdminDiagnostics() {
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const [diagnostics, setDiagnostics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [scoreFilter, setScoreFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    avgScore: 0,
    conversionRate: 0,
  });

  useEffect(() => {
    if (isAdmin) {
      loadDiagnostics();
      loadStats();
    }
  }, [isAdmin]);

  const loadDiagnostics = async () => {
    try {
      // Buscar diagnósticos primeiro
      const { data: diagnosticsData, error: diagError } = await supabase
        .from("diagnostics")
        .select("*")
        .order("created_at", { ascending: false });

      if (diagError) throw diagError;

      console.log("🔍 Diagnósticos carregados:", diagnosticsData?.length);

      // Buscar profiles separadamente para garantir dados
      const userIds = diagnosticsData?.map(d => d.user_id) || [];
      
      if (userIds.length > 0) {
        const { data: profilesData, error: profileError } = await supabase
          .from("profiles")
          .select("id, full_name, email")
          .in("id", userIds);

        if (profileError) {
          console.error("⚠️ Erro ao carregar profiles:", profileError);
        }

        console.log("🔍 Profiles encontrados:", profilesData?.length);

        // Mapear profiles manualmente
        const diagnosticsWithProfiles = diagnosticsData?.map(d => ({
          ...d,
          profiles: profilesData?.find(p => p.id === d.user_id) || null
        }));

        setDiagnostics(diagnosticsWithProfiles || []);

        // Logar acesso de admin aos diagnósticos
        await supabase.rpc('log_admin_action', {
          p_action: 'VIEW_DIAGNOSTICS',
          p_table_name: 'diagnostics',
          p_record_id: null
        });
      } else {
        setDiagnostics([]);
      }
    } catch (error) {
      console.error("❌ ERRO ao carregar diagnósticos:", error);
      toast.error("Erro ao carregar diagnósticos. Dados parciais podem ser exibidos.");
      // Mesmo com erro, mostrar o que foi carregado
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data: allDiagnostics, error } = await supabase
        .from("diagnostics")
        .select("total_score, completed");

      if (error) throw error;

      const total = allDiagnostics?.length || 0;
      const completed = allDiagnostics?.filter((d) => d.completed).length || 0;
      const avgScore =
        completed > 0
          ? allDiagnostics
              ?.filter((d) => d.completed)
              .reduce((acc, d) => acc + d.total_score, 0) / completed
          : 0;
      const conversionRate = total > 0 ? (completed / total) * 100 : 0;

      setStats({
        total,
        completed,
        avgScore: Math.round(avgScore),
        conversionRate: Math.round(conversionRate),
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const exportToCSV = () => {
    const headers = ["Nome", "Email", "Score", "Perfil", "Status", "Data"];
    const rows = filteredDiagnostics.map((d) => [
      d.profiles?.full_name,
      d.profiles?.email,
      d.total_score,
      d.profile,
      d.completed ? "Completo" : "Incompleto",
      new Date(d.created_at).toLocaleDateString("pt-BR"),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `diagnosticos_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    toast.success("CSV exportado com sucesso!");
  };

  const filteredDiagnostics = diagnostics.filter((d) => {
    const matchesSearch =
      d.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "completed" && d.completed) ||
      (statusFilter === "incomplete" && !d.completed);

    let matchesScore = true;
    if (scoreFilter !== "all" && d.total_score) {
      if (scoreFilter === "low") matchesScore = d.total_score <= 50;
      else if (scoreFilter === "medium")
        matchesScore = d.total_score > 50 && d.total_score <= 100;
      else if (scoreFilter === "high") matchesScore = d.total_score > 100;
    }

    return matchesSearch && matchesStatus && matchesScore;
  });

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
            <h1 className="text-3xl font-bold text-foreground">Diagnósticos</h1>
            <p className="text-muted-foreground">
              Análise agregada de todos os diagnósticos
            </p>
          </div>
          <Button onClick={exportToCSV}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Diagnósticos
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stats.total}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Completados</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">{stats.completed}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Score Médio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">
                  {stats.avgScore}
                  <span className="text-sm text-muted-foreground">/150</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Taxa de Conversão
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">
                  {stats.conversionRate}%
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="completed">Completados</SelectItem>
                  <SelectItem value="incomplete">Incompletos</SelectItem>
                </SelectContent>
              </Select>
              <Select value={scoreFilter} onValueChange={setScoreFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Score" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Scores</SelectItem>
                  <SelectItem value="low">Baixo (0-50)</SelectItem>
                  <SelectItem value="medium">Médio (51-100)</SelectItem>
                  <SelectItem value="high">Alto (101+)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="pt-6">
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
                    <TableHead>Cliente</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Perfil</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDiagnostics.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Nenhum diagnóstico encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredDiagnostics.map((diagnostic) => (
                      <TableRow key={diagnostic.id}>
                        <TableCell className="font-medium">
                          {diagnostic.profiles?.full_name || "N/A"}
                        </TableCell>
                        <TableCell>
                          {diagnostic.profiles?.email || "N/A"}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`font-bold ${
                              diagnostic.total_score <= 50
                                ? "text-red-500"
                                : diagnostic.total_score <= 100
                                ? "text-yellow-500"
                                : "text-green-500"
                            }`}
                          >
                            {diagnostic.total_score || "N/A"}
                          </span>
                        </TableCell>
                        <TableCell>{diagnostic.profile || "N/A"}</TableCell>
                        <TableCell>
                          {diagnostic.completed ? (
                            <span className="text-green-600">Completo</span>
                          ) : (
                            <span className="text-yellow-600">Incompleto</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(diagnostic.created_at).toLocaleDateString(
                            "pt-BR"
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
            <div className="mt-4 text-sm text-muted-foreground">
              Mostrando {filteredDiagnostics.length} de {diagnostics.length}{" "}
              diagnósticos
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
