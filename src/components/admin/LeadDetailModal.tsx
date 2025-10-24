import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  Phone,
  Calendar,
  FileText,
  MessageSquare,
  TrendingUp,
  Clock,
} from "lucide-react";
import { formatCPF, formatPhone } from "@/utils/formatters";
import ScoreRadar from "@/components/ScoreRadar";

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
}

interface LeadDetailModalProps {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
}

export default function LeadDetailModal({ lead, open, onClose }: LeadDetailModalProps) {
  const [diagnostics, setDiagnostics] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (lead && open) {
      loadLeadDetails();
    }
  }, [lead, open]);

  const loadLeadDetails = async () => {
    if (!lead) return;

    try {
      // Load diagnostics
      const { data: diagData } = await supabase
        .from("diagnostics")
        .select("*")
        .eq("user_id", lead.id)
        .order("created_at", { ascending: false });

      setDiagnostics(diagData || []);

      // Load notes
      const { data: notesData } = await supabase
        .from("admin_notes")
        .select("*, admin:profiles!admin_id(*)")
        .eq("client_id", lead.id)
        .order("created_at", { ascending: false });

      setNotes(notesData || []);
    } catch (error) {
      console.error("Error loading lead details:", error);
    }
  };

  const handleAddNote = async () => {
    if (!lead || !newNote.trim()) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase.from("admin_notes").insert({
        client_id: lead.id,
        admin_id: user!.id,
        note: newNote.trim(),
      });

      if (error) throw error;

      toast({
        title: "Nota adicionada",
        description: "A nota foi salva com sucesso.",
      });

      setNewNote("");
      loadLeadDetails();
    } catch (error) {
      console.error("Error adding note:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a nota.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!lead) return null;

  const latestDiagnostic = diagnostics.find(d => d.completed);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Detalhes do Lead</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Info */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Informações Pessoais</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Nome Completo</p>
                <p className="font-medium">{lead.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <p className="font-medium">{lead.email}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Telefone</p>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <p className="font-medium">
                    {lead.phone ? formatPhone(lead.phone) : "Não informado"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CPF</p>
                <p className="font-medium">
                  {lead.cpf ? formatCPF(lead.cpf) : "Não informado"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Data de Cadastro</p>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <p className="font-medium">
                    {new Date(lead.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Latest Diagnostic */}
          {latestDiagnostic && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Último Diagnóstico</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Score Total</p>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      <span className="text-3xl font-bold">{latestDiagnostic.total_score}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Classificação</p>
                    <Badge className="mt-1">{latestDiagnostic.score_classification}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Perfil</p>
                    <Badge variant="outline" className="mt-1">{latestDiagnostic.profile}</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Dimensões</p>
                  <ScoreRadar dimensionScores={latestDiagnostic.dimension_scores} />
                </div>
              </div>
            </Card>
          )}

          {/* Diagnostics History */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Histórico de Diagnósticos ({diagnostics.length})
            </h3>
            <div className="space-y-3">
              {diagnostics.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhum diagnóstico realizado</p>
              ) : (
                diagnostics.map((diag) => (
                  <div key={diag.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          {new Date(diag.created_at).toLocaleDateString("pt-BR")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {diag.completed ? "Completo" : "Incompleto"}
                        </p>
                      </div>
                    </div>
                    {diag.completed && (
                      <Badge>{diag.total_score} pontos</Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Admin Notes */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Notas Internas
            </h3>
            
            <div className="space-y-3 mb-4">
              {notes.length === 0 ? (
                <p className="text-sm text-muted-foreground">Nenhuma nota adicionada</p>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="p-3 border rounded-lg">
                    <p className="text-sm mb-2">{note.note}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{note.admin?.full_name}</span>
                      <span>•</span>
                      <span>{new Date(note.created_at).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <Separator className="my-4" />

            <div className="space-y-3">
              <Textarea
                placeholder="Adicionar nova nota interna..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
              />
              <Button onClick={handleAddNote} disabled={loading || !newNote.trim()}>
                Adicionar Nota
              </Button>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
