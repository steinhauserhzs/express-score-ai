import { useEffect, useState } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminLayout from "@/components/admin/AdminLayout";
import LeadsTable from "@/components/admin/LeadsTable";
import LeadDetailModal from "@/components/admin/LeadDetailModal";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  cpf: string | null;
  created_at: string;
  total_score: number | null;
  score_classification: string | null;
  profile: string | null;
  completed: boolean | null;
  last_activity: string | null;
}

export default function AdminLeads() {
  const { loading } = useAdminAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!loading) {
      loadLeads();
    }
  }, [loading]);

  const loadLeads = async () => {
    try {
      setLoadingLeads(true);

      // Get all clients with their latest diagnostic info
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "client")
        .order("created_at", { ascending: false });

      if (!profiles) {
        setLeads([]);
        return;
      }

      // For each profile, get their latest diagnostic
      const leadsWithDiagnostics = await Promise.all(
        profiles.map(async (profile) => {
          const { data: diagnostic } = await supabase
            .from("diagnostics")
            .select("total_score, score_classification, profile, completed, created_at")
            .eq("user_id", profile.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          return {
            id: profile.id,
            full_name: profile.full_name,
            email: profile.email,
            phone: profile.phone,
            cpf: profile.cpf,
            created_at: profile.created_at,
            total_score: diagnostic?.total_score || null,
            score_classification: diagnostic?.score_classification || null,
            profile: diagnostic?.profile || null,
            completed: diagnostic?.completed || null,
            last_activity: diagnostic?.created_at || profile.created_at,
            tags: profile.tags || [],
          };
        })
      );

      setLeads(leadsWithDiagnostics);
    } catch (error) {
      console.error("Error loading leads:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os leads.",
        variant: "destructive",
      });
    } finally {
      setLoadingLeads(false);
    }
  };

  const handleExportCSV = () => {
    const csv = [
      ["Nome", "Email", "Telefone", "CPF", "Score", "Perfil", "Cadastro"],
      ...leads.map((lead) => [
        lead.full_name,
        lead.email,
        lead.phone || "",
        lead.cpf || "",
        lead.total_score?.toString() || "",
        lead.profile || "",
        new Date(lead.created_at).toLocaleDateString("pt-BR"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();

    toast({
      title: "Exportado",
      description: "Lista de leads exportada com sucesso.",
    });
  };

  if (loading || loadingLeads) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestão de Leads</h1>
            <p className="text-muted-foreground">
              Visualize e gerencie todos os leads cadastrados
            </p>
          </div>
          <Button onClick={handleExportCSV} className="gap-2">
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>

        <LeadsTable leads={leads} onViewDetails={setSelectedLead} />

        <LeadDetailModal
          lead={selectedLead}
          open={!!selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      </div>
    </AdminLayout>
  );
}
