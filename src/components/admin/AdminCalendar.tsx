import { useEffect, useState } from "react";
import { Calendar, momentLocalizer, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: any;
  type: "consultation" | "followup";
}

export default function AdminCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [view, setView] = useState<View>("month");

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      // Carregar consultorias
      const { data: consultations } = await supabase
        .from("consultations")
        .select(`
          *,
          client:profiles!consultations_client_id_fkey(full_name, email),
          consultant:profiles!consultations_consultant_id_fkey(full_name)
        `)
        .not("scheduled_date", "is", null)
        .order("scheduled_date", { ascending: true });

      // Carregar follow-ups
      const { data: followups } = await supabase
        .from("follow_ups")
        .select(`
          *,
          client:profiles!follow_ups_client_id_fkey(full_name, email),
          consultant:profiles!follow_ups_consultant_id_fkey(full_name)
        `)
        .order("scheduled_date", { ascending: true });

      const consultationEvents: CalendarEvent[] = (consultations || []).map(c => ({
        id: c.id,
        title: `Consultoria - ${(c as any).client?.full_name || "Cliente"}`,
        start: new Date(c.scheduled_date),
        end: new Date(new Date(c.scheduled_date).getTime() + 60 * 60 * 1000), // +1 hora
        resource: { ...c, type: "consultation" },
        type: "consultation" as const
      }));

      const followupEvents: CalendarEvent[] = (followups || []).map(f => ({
        id: f.id,
        title: `Follow-up - ${(f as any).client?.full_name || "Cliente"}`,
        start: new Date(f.scheduled_date),
        end: new Date(new Date(f.scheduled_date).getTime() + 30 * 60 * 1000), // +30 min
        resource: { ...f, type: "followup" },
        type: "followup" as const
      }));

      setEvents([...consultationEvents, ...followupEvents]);
    } catch (error) {
      console.error("Error loading calendar events:", error);
    }
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const eventStyleGetter = (event: CalendarEvent) => {
    const style: any = {
      borderRadius: "4px",
      opacity: 0.9,
      border: "none",
      display: "block",
    };

    if (event.type === "consultation") {
      style.backgroundColor = "hsl(var(--primary))";
    } else {
      style.backgroundColor = "hsl(var(--secondary))";
    }

    return { style };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "scheduled": return "bg-blue-500";
      case "completed": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <>
      <div className="h-[600px] bg-card rounded-lg p-4">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={setView}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          style={{ height: "100%" }}
        />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Tipo</p>
                <Badge variant="outline">
                  {selectedEvent.type === "consultation" ? "Consultoria" : "Follow-up"}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium">Cliente</p>
                <p className="text-sm text-muted-foreground">
                  {selectedEvent.resource.client?.full_name || "N/A"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedEvent.resource.client?.email || ""}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Consultor</p>
                <p className="text-sm text-muted-foreground">
                  {selectedEvent.resource.consultant?.full_name || "Não atribuído"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Data/Hora</p>
                <p className="text-sm text-muted-foreground">
                  {moment(selectedEvent.start).format("DD/MM/YYYY HH:mm")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Status</p>
                <Badge className={getStatusColor(selectedEvent.resource.status)}>
                  {selectedEvent.resource.status}
                </Badge>
              </div>
              {selectedEvent.resource.notes && (
                <div>
                  <p className="text-sm font-medium">Notas</p>
                  <p className="text-sm text-muted-foreground">{selectedEvent.resource.notes}</p>
                </div>
              )}
              <Button className="w-full">Ver Detalhes Completos</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
