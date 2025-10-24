import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Download,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Activity,
} from "lucide-react";
import { toast } from "sonner";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function AdminReports() {
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalLeads: 0,
    activeLeads: 0,
    avgScore: 0,
    totalRevenue: 0,
    conversionRate: 0,
    completedDiagnostics: 0,
  });
  const [registrationTrend, setRegistrationTrend] = useState<any[]>([]);
  const [scoreDistribution, setScoreDistribution] = useState<any[]>([]);
  const [profileDistribution, setProfileDistribution] = useState<any[]>([]);

  useEffect(() => {
    if (isAdmin) {
      loadReportData();
    }
  }, [isAdmin]);

  const loadReportData = async () => {
    try {
      // Load all data in parallel
      const [
        { data: profiles },
        { data: diagnostics },
        { data: consultations },
      ] = await Promise.all([
        supabase.from("profiles").select("id, created_at, role"),
        supabase.from("diagnostics").select("*"),
        supabase.from("consultations").select("*"),
      ]);

      // Calculate KPIs
      const totalLeads = profiles?.filter((p) => p.role === "client").length || 0;
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const activeLeads =
        diagnostics?.filter(
          (d) => new Date(d.created_at) >= thirtyDaysAgo
        ).length || 0;

      const completedDiagnostics =
        diagnostics?.filter((d) => d.completed).length || 0;
      const avgScore =
        completedDiagnostics > 0
          ? Math.round(
              diagnostics
                ?.filter((d) => d.completed)
                .reduce((acc, d) => acc + d.total_score, 0) / completedDiagnostics
            )
          : 0;

      const totalRevenue = (consultations?.length || 0) * 47.9; // R$ 47.90 per consultation
      const conversionRate =
        diagnostics && diagnostics.length > 0
          ? Math.round((completedDiagnostics / diagnostics.length) * 100)
          : 0;

      setData({
        totalLeads,
        activeLeads,
        avgScore,
        totalRevenue,
        conversionRate,
        completedDiagnostics,
      });

      // Registration trend (last 30 days)
      const trendData = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        const count =
          profiles?.filter(
            (p) =>
              p.role === "client" &&
              p.created_at.startsWith(dateStr)
          ).length || 0;
        trendData.push({
          date: `${date.getDate()}/${date.getMonth() + 1}`,
          cadastros: count,
        });
      }
      setRegistrationTrend(trendData);

      // Score distribution
      const scoreRanges = [
        { name: "0-30 (Crítico)", count: 0 },
        { name: "31-60 (Atenção)", count: 0 },
        { name: "61-90 (Médio)", count: 0 },
        { name: "91-120 (Bom)", count: 0 },
        { name: "121-150 (Excelente)", count: 0 },
      ];

      diagnostics
        ?.filter((d) => d.completed)
        .forEach((d) => {
          const score = d.total_score;
          if (score <= 30) scoreRanges[0].count++;
          else if (score <= 60) scoreRanges[1].count++;
          else if (score <= 90) scoreRanges[2].count++;
          else if (score <= 120) scoreRanges[3].count++;
          else scoreRanges[4].count++;
        });

      setScoreDistribution(scoreRanges);

      // Profile distribution
      const profileCounts: Record<string, number> = {};
      diagnostics
        ?.filter((d) => d.completed && d.profile)
        .forEach((d) => {
          profileCounts[d.profile] = (profileCounts[d.profile] || 0) + 1;
        });

      const profileData = Object.entries(profileCounts).map(([name, value]) => ({
        name,
        value,
      }));
      setProfileDistribution(profileData);
    } catch (error) {
      console.error("Error loading report data:", error);
      toast.error("Erro ao carregar dados dos relatórios");
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    toast.info("Funcionalidade de exportação em PDF em desenvolvimento");
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
            <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
            <p className="text-muted-foreground">
              Análises e insights estratégicos
            </p>
          </div>
          <Button onClick={exportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{data.totalLeads}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Ativos 30d</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{data.activeLeads}</div>
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
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{data.avgScore}</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Receita</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold">
                  R$ {data.totalRevenue.toFixed(2)}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Taxa Conv.</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">{data.conversionRate}%</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Diagnósticos</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-2xl font-bold">
                  {data.completedDiagnostics}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Cadastros (Últimos 30 dias)</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px]" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={registrationTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="cadastros"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Scores</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px]" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={scoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Perfis Financeiros</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px]" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={profileDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {profileDistribution.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Funil de Conversão</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px]" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { name: "Cadastrados", value: data.totalLeads },
                      { name: "Iniciaram", value: data.activeLeads },
                      { name: "Completaram", value: data.completedDiagnostics },
                    ]}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
