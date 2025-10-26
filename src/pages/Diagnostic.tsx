import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Loader2, Send, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Diagnostic() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosticId, setDiagnosticId] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [turboMode, setTurboMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    initDiagnostic();
    trackEvent('diagnostic_started');
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Warn user before leaving if diagnostic is in progress
    if (!isComplete && messages.length > 5) {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = 'Seu diagnóstico será perdido. Deseja realmente sair?';
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [isComplete, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const trackEvent = async (eventName: string, properties?: Record<string, any>) => {
    try {
      await supabase.functions.invoke('track-event', {
        body: {
          eventName,
          eventCategory: 'diagnostic',
          pagePath: '/diagnostic',
          properties: {
            diagnosticId,
            turboMode,
            ...properties
          }
        }
      });
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  const initDiagnostic = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Create new diagnostic
      const { data, error } = await supabase
        .from("diagnostics")
        .insert({
          user_id: user.id,
          responses_json: { messages: [] },
          total_score: 0,
          dimension_scores: {},
          completed: false,
        })
        .select()
        .single();

      if (error) throw error;
      setDiagnosticId(data.id);

      // Start conversation
      const initialMessage = turboMode
        ? "Olá! 👋 Vou fazer um diagnóstico TURBO da sua saúde financeira. São apenas 10 perguntas essenciais que levam cerca de 5 minutos. Será rápido e direto! Vamos começar?"
        : "Olá! Sou seu assistente financeiro virtual. Vou te ajudar a fazer um diagnóstico completo da sua vida financeira. Será uma conversa tranquila, sem julgamentos. Vamos começar?";
      
      setMessages([
        {
          role: "assistant",
          content: initialMessage,
        },
      ]);
    } catch (error: any) {
      console.error("Error initializing diagnostic:", error);
      toast({
        title: "Erro",
        description: "Não foi possível iniciar o diagnóstico.",
        variant: "destructive",
      });
    }
  };

  const streamChat = async (userMessage: string) => {
    const newMessages = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-diagnostic`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            messages: newMessages,
            diagnosticId,
            turboMode,
          }),
        }
      );

      if (!response.ok || !response.body) {
        throw new Error("Failed to stream response");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";
      let textBuffer = "";

      // Add placeholder for assistant message
      setMessages([...newMessages, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantMessage += content;
              setMessages([
                ...newMessages,
                { role: "assistant", content: assistantMessage },
              ]);
            }
          } catch (e) {
            console.error("Parse error:", e);
          }
        }
      }

      // Save conversation to database
      const updatedMessages = [...newMessages, { role: "assistant", content: assistantMessage }];
      await supabase
        .from("diagnostics")
        .update({
          responses_json: { messages: updatedMessages },
        })
        .eq("id", diagnosticId);

      // Track milestone events
      const userMessageCount = updatedMessages.filter(m => m.role === 'user').length;
      if (userMessageCount === 5) {
        trackEvent('diagnostic_milestone_5', { totalMessages: updatedMessages.length });
        toast({
          title: "🎯 Ótimo progresso!",
          description: "Você já está 25% completo!",
        });
      } else if (userMessageCount === 10) {
        trackEvent('diagnostic_milestone_10', { totalMessages: updatedMessages.length });
        toast({
          title: "🚀 Metade do caminho!",
          description: "Continue assim!",
        });
      } else if (userMessageCount === 20) {
        trackEvent('diagnostic_milestone_20', { totalMessages: updatedMessages.length });
        toast({
          title: "🏆 Quase lá!",
          description: "Faltam poucas perguntas!",
        });
      }

      // Check if diagnostic is complete - improved detection
      const completionPhrases = [
        'DIAGNÓSTICO_COMPLETO',
        'diagnóstico_completo',
        'diagnóstico completo',
        'finalizamos',
        'concluímos',
        'finalizar',
        'está tudo correto',
        'tudo certo',
        'resumo confirmado',
        'pode finalizar'
      ];
      
      const isComplete = completionPhrases.some(phrase => 
        assistantMessage.toLowerCase().includes(phrase.toLowerCase())
      );
      
      if (isComplete) {
        setIsComplete(true);
        trackEvent('diagnostic_completed', { 
          totalMessages: updatedMessages.length
        });
        
        // Show toast notification
        toast({
          title: "🎉 Diagnóstico Concluído!",
          description: "Calculando seu score... aguarde.",
          duration: 3000,
        });
        
        // Auto-finalize after 2 seconds
        setTimeout(() => {
          handleFinalize();
        }, 2000);
      }
    } catch (error: any) {
      console.error("Error streaming chat:", error);
      trackEvent('diagnostic_error', { error: error.message });
      toast({
        title: "Erro",
        description: "Ocorreu um erro na conversa. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput("");
    await streamChat(userMessage);
  };

  const handleFinalize = async () => {
    if (!diagnosticId) return;
    setIsCalculating(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/calculate-score`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({ diagnosticId }),
        }
      );

      if (!response.ok) throw new Error("Failed to calculate score");

      const result = await response.json();
      
      // Auto-tag user after completing diagnostic
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        supabase.functions.invoke('auto-tag-leads', {
          body: { userId: user.id }
        }).catch(err => console.error('Auto-tag error:', err));
      }

      toast({
        title: "Diagnóstico Concluído! 🎉",
        description: `Seu Score Express: ${result.totalScore}/150`,
      });

      navigate(`/diagnostic/results/${diagnosticId}`);
    } catch (error: any) {
      console.error("Error finalizing diagnostic:", error);
      toast({
        title: "Erro",
        description: "Não foi possível calcular seu score. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const userMessages = messages.filter(m => m.role === 'user').length;
  const expectedQuestions = turboMode ? 10 : 38;
  const progress = Math.min((userMessages / expectedQuestions) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-subtle p-3 md:p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="p-4 md:p-6 mb-4 bg-card/95 backdrop-blur">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 md:gap-3">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-lg md:text-2xl font-bold text-foreground break-words">
                  Diagnóstico Financeiro {turboMode && "⚡ TURBO"}
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {turboMode ? "Modo rápido - 10 perguntas essenciais" : "Conversa guiada por IA"}
                </p>
              </div>
            </div>
            {messages.length === 0 && (
              <Button
                variant={turboMode ? "default" : "outline"}
                size="sm"
                onClick={() => setTurboMode(!turboMode)}
              >
                {turboMode ? "Modo Completo" : "⚡ Modo Turbo"}
              </Button>
            )}
            {isComplete && (
              <Button
                onClick={handleFinalize}
                disabled={isCalculating}
              >
                {isCalculating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Calculando...
                  </>
                ) : (
                  "Finalizar Diagnóstico"
                )}
              </Button>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs md:text-sm">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 md:h-3" />
            <div className="flex justify-between text-[10px] md:text-xs text-muted-foreground">
              <span>Início</span>
              <span className="hidden sm:inline">
                {userMessages}/{expectedQuestions} perguntas
              </span>
              <span>Completo</span>
            </div>
            {!isComplete && userMessages > 0 && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                Faltam aproximadamente {expectedQuestions - userMessages} perguntas
              </p>
            )}
          </div>
        </Card>

        <Card className="h-[500px] md:h-[600px] flex flex-col bg-card/95 backdrop-blur">
          <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[80%] rounded-2xl p-3 md:p-4 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-xs md:text-sm whitespace-pre-wrap font-medium break-words">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl p-4">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 md:p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Digite sua resposta..."
                disabled={isLoading || isComplete}
                className="flex-1 text-sm"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading || isComplete}
                size="icon"
                className="flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {isCalculating && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <Card className="p-8 max-w-md mx-4">
              <div className="text-center space-y-4">
                <Loader2 className="w-16 h-16 animate-spin mx-auto text-primary" />
                <h3 className="text-xl font-bold">Calculando seu Score Express</h3>
                <p className="text-sm text-muted-foreground">
                  Analisando suas respostas e gerando seu diagnóstico personalizado...
                </p>
                <Progress value={66} className="h-2" />
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
