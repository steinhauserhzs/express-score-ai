import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, Mail, Phone, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NextBestActionProps {
  leadId: string;
  leadData: any;
}

export default function NextBestAction({ leadId, leadData }: NextBestActionProps) {
  const [action, setAction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateAction = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke("next-best-action", {
        body: { leadId, leadData }
      });

      if (error) throw error;
      setAction(data);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const executeAction = async () => {
    toast({
      title: "Ação Executada",
      description: `${action.action} foi executada com sucesso!`
    });
    // Aqui você pode adicionar a lógica real de execução
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case "email": return <Mail className="h-4 w-4" />;
      case "call": return <Phone className="h-4 w-4" />;
      case "whatsapp": return <MessageSquare className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Próxima Melhor Ação (IA)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!action ? (
          <Button onClick={generateAction} disabled={loading} className="w-full">
            {loading ? "Analisando..." : "Gerar Sugestão"}
          </Button>
        ) : (
          <>
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                {getActionIcon(action.type)}
                <span className="font-semibold">{action.action}</span>
              </div>
              <p className="text-sm text-muted-foreground">{action.reasoning}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-muted-foreground">Confiança:</span>
                <div className="flex-1 bg-background rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${action.confidence}%` }}
                  />
                </div>
                <span className="text-xs font-medium">{action.confidence}%</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={executeAction} className="flex-1">
                Executar Ação
              </Button>
              <Button onClick={generateAction} variant="outline" disabled={loading}>
                Nova Sugestão
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
