import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Phone, Mail, Calendar, Search } from "lucide-react";
import { formatCPF, formatPhone } from "@/utils/formatters";

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

interface LeadsTableProps {
  leads: Lead[];
  onViewDetails: (lead: Lead) => void;
}

export default function LeadsTable({ leads, onViewDetails }: LeadsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [scoreFilter, setScoreFilter] = useState<string>("all");

  const getLeadStatus = (lead: Lead) => {
    if (lead.completed && lead.total_score && lead.total_score <= 40) {
      return { label: "Hot Lead", color: "bg-red-500" };
    }
    if (lead.completed === false) {
      return { label: "Warm Lead", color: "bg-yellow-500" };
    }
    return { label: "Cold Lead", color: "bg-blue-500" };
  };

  const getScoreBadgeColor = (score: number | null) => {
    if (!score) return "bg-gray-500";
    if (score <= 40) return "bg-red-500";
    if (score <= 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.phone && lead.phone.includes(searchTerm));

    const status = getLeadStatus(lead).label;
    const matchesStatus = statusFilter === "all" || status === statusFilter;

    let matchesScore = true;
    if (scoreFilter !== "all" && lead.total_score) {
      if (scoreFilter === "low") matchesScore = lead.total_score <= 40;
      else if (scoreFilter === "medium") matchesScore = lead.total_score > 40 && lead.total_score <= 70;
      else if (scoreFilter === "high") matchesScore = lead.total_score > 70;
    } else if (scoreFilter !== "all" && !lead.total_score) {
      matchesScore = false;
    }

    return matchesSearch && matchesStatus && matchesScore;
  });

  const maskCPF = (cpf: string | null) => {
    if (!cpf) return "Não informado";
    return `***.***.${ cpf.slice(-6, -3)}-${cpf.slice(-2)}`;
  };

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    window.open(`https://wa.me/55${cleanPhone}`, "_blank");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hoje";
    if (diffDays === 1) return "Há 1 dia";
    if (diffDays < 30) return `Há ${diffDays} dias`;
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, email ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Status do Lead" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Status</SelectItem>
            <SelectItem value="Hot Lead">Hot Lead</SelectItem>
            <SelectItem value="Warm Lead">Warm Lead</SelectItem>
            <SelectItem value="Cold Lead">Cold Lead</SelectItem>
          </SelectContent>
        </Select>
        <Select value={scoreFilter} onValueChange={setScoreFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Score" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os Scores</SelectItem>
            <SelectItem value="low">Baixo (0-40)</SelectItem>
            <SelectItem value="medium">Médio (41-70)</SelectItem>
            <SelectItem value="high">Alto (71-100)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Contato</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Perfil</TableHead>
              <TableHead>Cadastro</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Nenhum lead encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredLeads.map((lead) => {
                const status = getLeadStatus(lead);
                return (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.full_name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {lead.email}
                        </span>
                        {lead.phone && (
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {formatPhone(lead.phone)}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {maskCPF(lead.cpf)}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${status.color} text-white`}>
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {lead.total_score ? (
                        <Badge className={`${getScoreBadgeColor(lead.total_score)} text-white`}>
                          {lead.total_score}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {lead.profile || "N/A"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(lead.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onViewDetails(lead)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {lead.phone && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleWhatsApp(lead.phone!)}
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Mostrando {filteredLeads.length} de {leads.length} leads
      </div>
    </div>
  );
}
