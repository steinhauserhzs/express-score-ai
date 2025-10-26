import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ConsultationValue from "@/components/ConsultationValue";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Logo from "@/components/Logo";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Clock, ArrowLeft, Check } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Consultations() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'select' | 'confirm'>('select');

  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }
    setUser(user);
  }

  const availableTimes = [
    "09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"
  ];

  const handleSchedule = async () => {
    if (!date || !time) {
      toast.error('Selecione uma data e horário');
      return;
    }

    setLoading(true);
    try {
      const scheduledDate = new Date(date);
      const [hours, minutes] = time.split(':');
      scheduledDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const { error } = await supabase
        .from('consultations')
        .insert({
          client_id: user.id,
          scheduled_date: scheduledDate.toISOString(),
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Consultoria agendada com sucesso!');
      setStep('confirm');
      
      // Aguarda 2 segundos e redireciona para o dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error scheduling:', error);
      toast.error('Erro ao agendar consultoria');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'confirm') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary/5 to-success/5">
        <Card className="max-w-md w-full animate-bounce-in">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-success" />
            </div>
            <CardTitle className="text-2xl">Consultoria Agendada!</CardTitle>
            <CardDescription>
              Sua consultoria foi confirmada com sucesso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <CalendarIcon className="h-4 w-4 text-primary" />
                <span className="font-medium">
                  {date && format(date, "PPP", { locale: ptBR })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-primary" />
                <span className="font-medium">{time}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Você receberá um email de confirmação em breve com o link da videochamada.
            </p>
            <Button onClick={() => navigate('/dashboard')} className="w-full">
              Ir para o Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-success/5 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <Logo size="sm" />
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Consultoria Financeira Personalizada</h1>
          <p className="text-xl text-muted-foreground">
            Transforme sua vida financeira com orientação profissional
          </p>
        </div>

        {/* Consultation Value Section */}
        <ConsultationValue />

        {/* Main Card - Scheduling */}
        <Card className="hover-lift">
          <CardHeader>
            <CardTitle className="text-3xl">Agendar Consultoria</CardTitle>
            <CardDescription className="text-base">
              Escolha o melhor dia e horário para conversar com nosso especialista
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Informações sobre a consultoria */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <Clock className="h-8 w-8 text-primary mx-auto" />
                    <h3 className="font-semibold text-center">60 minutos</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      Duração da sessão
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-success/5 border-success/20">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <Check className="h-8 w-8 text-success mx-auto" />
                    <h3 className="font-semibold text-center">Personalizada</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      Baseada no seu diagnóstico
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-warning/5 border-warning/20">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <CalendarIcon className="h-8 w-8 text-warning mx-auto" />
                    <h3 className="font-semibold text-center">Online</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      Via Google Meet
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Seleção de data e hora */}
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Escolha uma data</h3>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today || date.getDay() === 0 || date.getDay() === 6;
                  }}
                  className="rounded-md border"
                  locale={ptBR}
                />
                <p className="text-sm text-muted-foreground">
                  * Agendamentos disponíveis apenas em dias úteis
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Escolha um horário</h3>
                <Select value={time} onValueChange={setTime} disabled={!date}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um horário" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTimes.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {date && time && (
                  <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <p className="text-sm font-medium mb-2">Resumo do agendamento:</p>
                    <div className="space-y-1">
                      <p className="text-sm">
                        📅 {format(date, "PPP", { locale: ptBR })}
                      </p>
                      <p className="text-sm">
                        🕐 {time}
                      </p>
                      <p className="text-sm">
                        💰 R$ 47,90
                      </p>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleSchedule} 
                  disabled={!date || !time || loading}
                  className="w-full mt-4"
                  size="lg"
                >
                  {loading ? 'Agendando...' : 'Confirmar Agendamento'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
