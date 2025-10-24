import { useEffect, useState } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminStatCard from "@/components/admin/AdminStatCard";
import { supabase } from "@/integrations/supabase/client";
import {
  Users,
  Activity,
  TrendingUp,
  CheckCircle,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface DashboardStats {
  totalLeads: number;
  activeLeads: number;
  avgScore: number;
  conversionRate: number;
  scheduledConsultations: number;
  potentialRevenue: number;
}

export default function AdminDashboard() {
  const { loading } = useAdminAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    activeLeads: 0,
    avgScore: 0,
    conversionRate: 0,
    scheduledConsultations: 0,
    potentialRevenue: 0,
  });
  const [registrationData, setRegistrationData] = useState<any[]>([]);
  const [scoreDistribution, setScoreDistribution] = useState<any[]>([]);

  useEffect(() => {
    if (!loading) {
      loadDashboardData();
    }
  }, [loading]);

  const loadDashboardData = async () => {
    try {
      // Total leads
      const { count: totalLeads } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "client");

      // Active leads (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: activeLeadsData } = await supabase
        .from("diagnostics")
        .select("user_id")
        .gte("created_at", thirtyDaysAgo.toISOString());
      
      const activeLeads = new Set(activeLeadsData?.map(d => d.user_id) || []).size;

      // Average score
      const { data: scoresData } = await supabase
        .from("diagnostics")
        .select("total_score")
        .eq("completed", true);

      const avgScore = scoresData && scoresData.length > 0
        ? Math.round(scoresData.reduce((sum, d) => sum + d.total_score, 0) / scoresData.length)
        : 0;

      // Conversion rate
      const { count: totalDiagnostics } = await supabase
        .from("diagnostics")
        .select("*", { count: "exact", head: true });

      const { count: completedDiagnostics } = await supabase
        .from("diagnostics")
        .select("*", { count: "exact", head: true })
        .eq("completed", true);

      const conversionRate = totalDiagnostics && totalDiagnostics > 0
        ? Math.round((completedDiagnostics! / totalDiagnostics) * 100)
        : 0;

      // Scheduled consultations
      const { count: scheduledConsultations } = await supabase
        .from("consultations")
        .select("*", { count: "exact", head: true })
        .in("status", ["pending", "scheduled"]);

      setStats({
        totalLeads: totalLeads || 0,
        activeLeads,
        avgScore,
        conversionRate,
        scheduledConsultations: scheduledConsultations || 0,
        potentialRevenue: (scheduledConsultations || 0) * 500, // R$ 500 por consultoria
      });

      // Load registration trend (last 30 days)
      const registrations = await loadRegistrationTrend();
      setRegistrationData(registrations);

      // Load score distribution
      const distribution = await loadScoreDistribution();
      setScoreDistribution(distribution);

    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  const loadRegistrationTrend = async () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const { count } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("role", "client")
        .gte("created_at", dateStr)
        .lt("created_at", new Date(date.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      data.push({
        date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
        cadastros: count || 0,
      });
    }
    return data;
  };

  const loadScoreDistribution = async () => {
    const { data: diagnostics } = await supabase
      .from("diagnostics")
      .select("total_score")
      .eq("completed", true);

    const low = diagnostics?.filter(d => d.total_score <= 40).length || 0;
    const medium = diagnostics?.filter(d => d.total_score > 40 && d.total_score <= 70).length || 0;
    const high = diagnostics?.filter(d => d.total_score > 70).length || 0;

    return [
      { name: "Baixo (0-40)", value: low, color: "#ef4444" },
      { name: "Médio (41-70)", value: medium, color: "#f59e0b" },
      { name: "Alto (71-100)", value: high, color: "#10b981" },
    ];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const COLORS = ['#ef4444', '#f59e0b', '#10b981'];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
          <p className="text-muted-foreground">Visão geral do sistema de leads</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AdminStatCard
            title="Total de Leads"
            value={stats.totalLeads}
            icon={Users}
            subtitle="Clientes cadastrados"
            iconColor="text-blue-600"
            iconBg="bg-blue-100"
          />
          <AdminStatCard
            title="Leads Ativos"
            value={stats.activeLeads}
            icon={Activity}
            subtitle="Últimos 30 dias"
            iconColor="text-green-600"
            iconBg="bg-green-100"
          />
          <AdminStatCard
            title="Score Médio"
            value={stats.avgScore}
            icon={TrendingUp}
            subtitle="De todos os diagnósticos"
            iconColor="text-purple-600"
            iconBg="bg-purple-100"
          />
          <AdminStatCard
            title="Taxa de Conversão"
            value={`${stats.conversionRate}%`}
            icon={CheckCircle}
            subtitle="Diagnósticos completados"
            iconColor="text-orange-600"
            iconBg="bg-orange-100"
          />
          <AdminStatCard
            title="Consultorias Agendadas"
            value={stats.scheduledConsultations}
            icon={Calendar}
            subtitle="Pendentes/Agendadas"
            iconColor="text-pink-600"
            iconBg="bg-pink-100"
          />
          <AdminStatCard
            title="Receita Potencial"
            value={`R$ ${stats.potentialRevenue.toLocaleString('pt-BR')}`}
            icon={DollarSign}
            subtitle="Consultorias agendadas"
            iconColor="text-emerald-600"
            iconBg="bg-emerald-100"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Evolução de Cadastros (7 dias)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={registrationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="cadastros" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Distribuição de Scores</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={scoreDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {scoreDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
