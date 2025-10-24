import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  UserPlus,
  LogIn,
  ClipboardList,
  FileText,
  Calendar,
  CheckCircle,
  Mail,
  MessageSquare,
  Award,
  TrendingUp,
  DollarSign,
  BookOpen,
} from "lucide-react";

interface JourneyEvent {
  id: string;
  event_type: string;
  event_title: string;
  event_description: string | null;
  created_at: string;
  metadata: any;
}

const EVENT_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
  signup: { icon: UserPlus, color: "text-blue-500", label: "Cadastro" },
  login: { icon: LogIn, color: "text-green-500", label: "Login" },
  diagnostic_started: { icon: ClipboardList, color: "text-yellow-500", label: "Diagnóstico Iniciado" },
  diagnostic_completed: { icon: CheckCircle, color: "text-green-600", label: "Diagnóstico Completo" },
  report_generated: { icon: FileText, color: "text-purple-500", label: "Relatório Gerado" },
  report_viewed: { icon: FileText, color: "text-purple-600", label: "Relatório Visualizado" },
  consultation_scheduled: { icon: Calendar, color: "text-orange-500", label: "Consultoria Agendada" },
  consultation_completed: { icon: CheckCircle, color: "text-green-700", label: "Consultoria Realizada" },
  email_opened: { icon: Mail, color: "text-blue-400", label: "Email Aberto" },
  email_clicked: { icon: Mail, color: "text-blue-600", label: "Email Clicado" },
  whatsapp_received: { icon: MessageSquare, color: "text-green-500", label: "WhatsApp Recebido" },
  whatsapp_replied: { icon: MessageSquare, color: "text-green-600", label: "WhatsApp Respondido" },
  badge_earned: { icon: Award, color: "text-yellow-600", label: "Badge Conquistado" },
  level_up: { icon: TrendingUp, color: "text-indigo-500", label: "Subiu de Nível" },
  referral_made: { icon: UserPlus, color: "text-pink-500", label: "Indicação Feita" },
  content_viewed: { icon: BookOpen, color: "text-cyan-500", label: "Conteúdo Visualizado" },
  payment_made: { icon: DollarSign, color: "text-emerald-500", label: "Pagamento Realizado" },
};

export default function CustomerJourney() {
  const [events, setEvents] = useState<JourneyEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJourney();
  }, []);

  const loadJourney = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("customer_journey_events")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Error loading journey:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando jornada...</div>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-6">Sua Jornada Financeira</h2>
      <ScrollArea className="h-[600px] pr-4">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-border" />

          {/* Events */}
          <div className="space-y-6">
            {events.map((event, index) => {
              const config = EVENT_CONFIG[event.event_type] || {
                icon: ClipboardList,
                color: "text-gray-500",
                label: event.event_type,
              };
              const Icon = config.icon;

              return (
                <div key={event.id} className="relative flex gap-4 items-start">
                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full bg-background border-2 border-border flex items-center justify-center z-10 ${config.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {config.label}
                        </Badge>
                        <h3 className="font-semibold">{event.event_title}</h3>
                        {event.event_description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {event.event_description}
                          </p>
                        )}
                      </div>
                      <time className="text-xs text-muted-foreground whitespace-nowrap">
                        {format(new Date(event.created_at), "dd MMM yyyy, HH:mm", {
                          locale: ptBR,
                        })}
                      </time>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {events.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum evento registrado ainda</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
