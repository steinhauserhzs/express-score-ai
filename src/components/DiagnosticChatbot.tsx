import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Send, Bot, User } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export default function DiagnosticChatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadConversation();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const loadConversation = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get latest conversation
      const { data: conversation } = await supabase
        .from("chatbot_conversations")
        .select("id")
        .eq("user_id", user.id)
        .eq("conversation_type", "diagnostic_questions")
        .order("started_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (conversation) {
        setConversationId(conversation.id);

        // Load messages
        const { data: msgs } = await supabase
          .from("chatbot_messages")
          .select("*")
          .eq("conversation_id", conversation.id)
          .order("created_at", { ascending: true });

        if (msgs) {
          setMessages(msgs as Message[]);
        }
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);

    // Add user message optimistically
    const tempUserMsg: Message = {
      id: "temp-" + Date.now(),
      role: "user",
      content: userMessage,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const { data, error } = await supabase.functions.invoke("chatbot-assistant", {
        body: {
          message: userMessage,
          conversationId: conversationId,
          conversationType: "diagnostic_questions",
        },
      });

      if (error) throw error;

      if (data.success) {
        setConversationId(data.conversationId);
        
        // Add assistant message
        const assistantMsg: Message = {
          id: "temp-assistant-" + Date.now(),
          role: "assistant",
          content: data.message,
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev.filter((m) => m.id !== tempUserMsg.id), tempUserMsg, assistantMsg]);
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem. Tente novamente.",
        variant: "destructive",
      });
      setMessages((prev) => prev.filter((m) => m.id !== tempUserMsg.id));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-[600px]">
      <div className="p-4 border-b">
        <h3 className="font-semibold flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          Assistente Financeiro
        </h3>
        <p className="text-sm text-muted-foreground">
          Tire suas dúvidas sobre seu diagnóstico financeiro
        </p>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Olá! Como posso ajudar você hoje?</p>
              <p className="text-sm mt-2">
                Pergunte sobre seu score, recomendações ou qualquer dúvida financeira.
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8 bg-primary/10">
                  <Bot className="h-5 w-5 text-primary" />
                </Avatar>
              )}

              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>

              {message.role === "user" && (
                <Avatar className="h-8 w-8 bg-muted">
                  <User className="h-5 w-5" />
                </Avatar>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8 bg-primary/10">
                <Bot className="h-5 w-5 text-primary" />
              </Avatar>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce delay-100" />
                  <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Digite sua pergunta..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <Button onClick={sendMessage} disabled={loading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
