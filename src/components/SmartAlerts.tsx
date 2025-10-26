import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, AlertCircle, Info, TrendingUp, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Alert {
  id: string;
  alert_type: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  action_url: string;
  created_at: string;
}

export default function SmartAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchAlerts();
    subscribeToAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("financial_alerts")
        .select("*")
        .eq("user_id", user.id)
        .eq("read", false)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      setAlerts((data || []) as Alert[]);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToAlerts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const channel = supabase
      .channel('financial_alerts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'financial_alerts',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const newAlert = payload.new as Alert;
          setAlerts(prev => [newAlert, ...prev].slice(0, 5));
          
          toast({
            title: newAlert.title,
            description: newAlert.message,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const markAsRead = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from("financial_alerts")
        .update({ read: true, read_at: new Date().toISOString() })
        .eq("id", alertId);

      if (error) throw error;
      setAlerts(prev => prev.filter(a => a.id !== alertId));
    } catch (error) {
      console.error("Error marking alert as read:", error);
    }
  };

  const handleAlertClick = (alert: Alert) => {
    markAsRead(alert.id);
    if (alert.action_url) {
      navigate(alert.action_url);
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'score_drop':
      case 'critical_debt':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'score_improvement':
        return <TrendingUp className="h-5 w-5 text-success" />;
      case 'goal_almost_achieved':
        return <Target className="h-5 w-5 text-primary" />;
      default:
        return <Info className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  if (loading || alerts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <Card
          key={alert.id}
          className="p-4 cursor-pointer hover:shadow-md transition-shadow border-l-4"
          style={{
            borderLeftColor: alert.priority === 'high' 
              ? 'hsl(var(--destructive))' 
              : alert.priority === 'medium' 
              ? 'hsl(var(--warning))' 
              : 'hsl(var(--muted))'
          }}
          onClick={() => handleAlertClick(alert)}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              {getAlertIcon(alert.alert_type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-sm truncate">{alert.title}</h4>
                <Badge variant={getPriorityColor(alert.priority) as any} className="text-xs">
                  {alert.priority === 'high' ? 'Urgente' : alert.priority === 'medium' ? 'Importante' : 'Info'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {alert.message}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                markAsRead(alert.id);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}