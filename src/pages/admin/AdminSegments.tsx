import { useEffect, useState } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Users, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminSegments() {
  const { isAdmin, loading: authLoading } = useAdminAuth();
  const [segments, setSegments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSegment, setNewSegment] = useState({ name: "", description: "", filters: "" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isAdmin) {
      loadSegments();
    }
  }, [isAdmin]);

  const loadSegments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("segments")
        .select(`
          *,
          segment_members(count)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSegments(data || []);
    } catch (error) {
      console.error("Error loading segments:", error);
    } finally {
      setLoading(false);
    }
  };

  const createSegment = async () => {
    try {
      let filters;
      try {
        filters = JSON.parse(newSegment.filters || "{}");
      } catch {
        toast({
          title: "Erro",
          description: "Filtros devem estar em formato JSON válido",
          variant: "destructive"
        });
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("segments")
        .insert({
          segment_name: newSegment.name,
          segment_description: newSegment.description,
          filter_conditions: filters,
          created_by: user?.id
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Segmento criado com sucesso"
      });

      setNewSegment({ name: "", description: "", filters: "" });
      setDialogOpen(false);
      loadSegments();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (authLoading || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!isAdmin) return null;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Segmentação de Leads</h1>
            <p className="text-muted-foreground">Crie e gerencie segmentos de clientes</p>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Segmento
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Segmento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome do Segmento</Label>
                  <Input
                    id="name"
                    value={newSegment.name}
                    onChange={(e) => setNewSegment({ ...newSegment, name: e.target.value })}
                    placeholder="Ex: Leads Quentes"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={newSegment.description}
                    onChange={(e) => setNewSegment({ ...newSegment, description: e.target.value })}
                    placeholder="Descreva o segmento..."
                  />
                </div>
                <div>
                  <Label htmlFor="filters">Filtros (JSON)</Label>
                  <Textarea
                    id="filters"
                    value={newSegment.filters}
                    onChange={(e) => setNewSegment({ ...newSegment, filters: e.target.value })}
                    placeholder='{"lead_score": {"$gt": 80}, "churn_risk": "low"}'
                    className="font-mono text-sm"
                  />
                </div>
                <Button onClick={createSegment} className="w-full">
                  Criar Segmento
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Segmentos pré-configurados */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Leads Quentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                Lead score &gt; 80, ativo nos últimos 7 dias
              </p>
              <div className="text-2xl font-bold text-green-600">
                {segments.find(s => s.segment_name === "Leads Quentes")?.member_count || 0}
              </div>
              <p className="text-xs text-muted-foreground">membros</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Leads Mornos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                Lead score 50-80, alguma atividade recente
              </p>
              <div className="text-2xl font-bold text-yellow-600">
                {segments.find(s => s.segment_name === "Leads Mornos")?.member_count || 0}
              </div>
              <p className="text-xs text-muted-foreground">membros</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Risco de Churn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                Sem atividade há 30+ dias, churn_risk = high
              </p>
              <div className="text-2xl font-bold text-red-600">
                {segments.find(s => s.segment_name === "Risco de Churn")?.member_count || 0}
              </div>
              <p className="text-xs text-muted-foreground">membros</p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de segmentos personalizados */}
        <Card>
          <CardHeader>
            <CardTitle>Segmentos Personalizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {segments.filter(s => !["Leads Quentes", "Leads Mornos", "Risco de Churn"].includes(s.segment_name)).map((segment) => (
                <div key={segment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-semibold">{segment.segment_name}</h3>
                    <p className="text-sm text-muted-foreground">{segment.segment_description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {segment.member_count} membros
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver Membros
                  </Button>
                </div>
              ))}
              {segments.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum segmento personalizado criado ainda
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
