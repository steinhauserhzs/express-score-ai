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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    initDiagnostic();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
      setMessages([
        {
          role: "assistant",
          content:
            "Olá! Sou seu assistente financeiro virtual. Vou te ajudar a fazer um diagnóstico completo da sua vida financeira. Será uma conversa tranquila, sem julgamentos. Vamos começar?",
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
      await supabase
        .from("diagnostics")
        .update({
          responses_json: { messages: [...newMessages, { role: "assistant", content: assistantMessage }] },
        })
        .eq("id", diagnosticId);

      // Check if diagnostic is complete
      if (
        assistantMessage.toLowerCase().includes("diagnóstico completo") ||
        assistantMessage.toLowerCase().includes("finalizamos") ||
        assistantMessage.toLowerCase().includes("concluímos")
      ) {
        setIsComplete(true);
      }
    } catch (error: any) {
      console.error("Error streaming chat:", error);
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
      
      toast({
        title: "Diagnóstico Concluído! 🎉",
        description: `Seu Score Express: ${result.totalScore}/100`,
      });

      navigate("/dashboard");
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

  const progress = Math.min((messages.length / 30) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 mb-4 bg-card/95 backdrop-blur">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Diagnóstico Financeiro</h1>
                <p className="text-sm text-muted-foreground">
                  Conversa guiada por IA
                </p>
              </div>
            </div>
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
          <Progress value={progress} className="h-2" />
        </Card>

        <Card className="h-[600px] flex flex-col bg-card/95 backdrop-blur">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap font-medium">{msg.content}</p>
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

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Digite sua resposta..."
                disabled={isLoading || isComplete}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading || isComplete}
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
