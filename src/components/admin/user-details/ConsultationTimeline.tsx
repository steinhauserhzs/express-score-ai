import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface ConsultationTimelineProps {
  consultations: any[];
}

export function ConsultationTimeline({ consultations }: ConsultationTimelineProps) {
  if (!consultations || consultations.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Nenhuma consulta registrada</p>
        </div>
      </Card>
    );
  }

  const statusConfig: Record<string, { icon: any; color: string; label: string; variant: any }> = {
    'pending': { icon: Clock, color: 'text-yellow-500', label: 'Pendente', variant: 'secondary' },
    'scheduled': { icon: Calendar, color: 'text-blue-500', label: 'Agendada', variant: 'default' },
    'completed': { icon: CheckCircle2, color: 'text-green-500', label: 'Realizada', variant: 'default' },
    'cancelled': { icon: XCircle, color: 'text-red-500', label: 'Cancelada', variant: 'destructive' }
  };

  const nextConsultation = consultations.find(c => 
    ['pending', 'scheduled'].includes(c.status) && 
    (!c.scheduled_date || new Date(c.scheduled_date) > new Date())
  );

  const statusCounts = consultations.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-semibold mb-4">📅 Resumo de Consultações</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{consultations.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Realizadas</p>
            <p className="text-2xl font-bold">{statusCounts.completed || 0}</p>
          </div>
        </div>
      </Card>

      {nextConsultation && (
        <Card className="p-4 border-primary">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            Próxima Consulta
          </h3>
          <div className="space-y-3">
            {nextConsultation.scheduled_date && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Data</span>
                <span className="text-sm font-medium">
                  {new Date(nextConsultation.scheduled_date).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge variant={statusConfig[nextConsultation.status]?.variant}>
                {statusConfig[nextConsultation.status]?.label}
              </Badge>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-4">
        <h3 className="font-semibold mb-4">📝 Histórico</h3>
        <div className="space-y-3">
          {consultations.slice(0, 10).map((consultation) => {
            const config = statusConfig[consultation.status] || statusConfig.pending;
            const Icon = config.icon;
            
            return (
              <div key={consultation.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                <Icon className={`h-5 w-5 mt-0.5 ${config.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant={config.variant} className="text-xs">
                      {config.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(consultation.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  {consultation.scheduled_date && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Agendada: {new Date(consultation.scheduled_date).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                  {consultation.notes && (
                    <p className="text-xs mt-1 line-clamp-2">{consultation.notes}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
