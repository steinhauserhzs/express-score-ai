import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";
import { Loader2, Send, Sparkles, Headphones, Keyboard, Volume2, Home, Save, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DiagnosticModeModal from "@/components/DiagnosticModeModal";
import VoiceRecorder from "@/components/diagnostic/VoiceRecorder";
import AudioPlayer from "@/components/diagnostic/AudioPlayer";
import Logo from "@/components/Logo";

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
  const [showModeSelection, setShowModeSelection] = useState(true);
  const [voiceMode, setVoiceMode] = useState(false);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [showManualFinalize, setShowManualFinalize] = useState(false);
  const [showErrorOptions, setShowErrorOptions] = useState(false);
  const [calculatingProgress, setCalculatingProgress] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load voice mode preference from localStorage
  useEffect(() => {
    const savedVoiceMode = localStorage.getItem('diagnostic-voice-mode');
    if (savedVoiceMode !== null) {
      setVoiceMode(savedVoiceMode === 'true');
    }
  }, []);

  useEffect(() => {
    // Don't initialize until mode is selected
    if (!showModeSelection && !diagnosticId) {
      initDiagnostic();
      trackEvent('diagnostic_started');
    }
  }, [showModeSelection]);

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

  const handleModeSelection = (isTurbo: boolean, startVoiceMode = false) => {
    setTurboMode(isTurbo);
    setVoiceMode(startVoiceMode);
    localStorage.setItem('diagnostic-voice-mode', String(startVoiceMode));
    setShowModeSelection(false);
    trackEvent('diagnostic_mode_selected', { turboMode: isTurbo, voiceMode: startVoiceMode });
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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/auth");
        return;
      }

      // Create new diagnostic
      const { data, error } = await supabase
        .from("diagnostics")
        .insert({
          user_id: session.user.id,
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
      let initialMessage = turboMode
        ? "Olá! 👋 Vou fazer um diagnóstico TURBO da sua saúde financeira. São apenas 10 perguntas essenciais que levam cerca de 5 minutos. Será rápido e direto! Vamos começar?"
        : "Olá! Sou seu assistente financeiro virtual. Vou te ajudar a fazer um diagnóstico completo da sua vida financeira. Será uma conversa tranquila, sem julgamentos. Vamos começar?";
      
      if (voiceMode) {
        initialMessage = "Olá! 🎤 Bem-vindo ao diagnóstico por voz! Vou te fazer algumas perguntas e você pode respondê-las falando. É só clicar no botão do microfone e falar naturalmente. Vamos começar?";
      }
      
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

      // Check if diagnostic is complete - IMPROVED flexible detection
      const hasCompleteMarker = 
        assistantMessage.includes('<!-- DIAGNOSTIC_COMPLETE -->') ||
        assistantMessage.includes('DIAGNOSTIC_COMPLETE') ||
        assistantMessage.includes('DIAGNÓSTICO_COMPLETO') ||
        assistantMessage.toLowerCase().includes('diagnóstico completo') ||
        assistantMessage.toLowerCase().includes('diagnostic complete');

      if (hasCompleteMarker) {
        // Remove any variation of the marker
        const cleanMessage = assistantMessage
          .replace(/<!--\s*DIAGNOSTIC[_\s]COMPLETE\s*-->/gi, '')
          .replace(/DIAGNOSTIC[_\s]COMPLETE/gi, '')
          .replace(/DIAGNÓSTICO\s+COMPLETO/gi, '')
          .trim();
        
        setMessages(prev => 
          prev.map((m, i) => 
            i === prev.length - 1 ? { ...m, content: cleanMessage } : m
          )
        );
        
        // Show manual finalize button as fallback
        setShowManualFinalize(true);
        
        // Flexible validation - allow completion even if some questions were skipped
        const userMessagesCount = updatedMessages.filter(m => m.role === 'user').length;
        const minimumQuestionsRequired = Math.floor(expectedQuestions * 0.75); // At least 75% answered
        
        if (userMessagesCount < minimumQuestionsRequired) {
          console.warn(`⚠️ Diagnostic incomplete: ${userMessagesCount}/${expectedQuestions} questions (min: ${minimumQuestionsRequired})`);
          toast({
            title: "Diagnóstico Incompleto",
            description: `Por favor, responda mais algumas perguntas para completar o diagnóstico.`,
            variant: "destructive",
          });
          setShowManualFinalize(false);
          return;
        }
        
        console.log(`✅ Diagnostic valid: ${userMessagesCount} questions answered (min: ${minimumQuestionsRequired})`);
        setIsComplete(true);
        trackEvent('diagnostic_completed');
        
        // Show success toast
        toast({
          title: "🎉 Diagnóstico Completo!",
          description: "Clique no botão abaixo para ver seus resultados",
        });
      }

      // Auto-save progress every few messages
      if (updatedMessages.length % 5 === 0) {
        await supabase
          .from('diagnostics')
          .update({
            responses_json: { messages: updatedMessages },
            progress_percentage: Math.min((updatedMessages.length / 50) * 100, 95),
            last_question: updatedMessages.length
          })
          .eq('id', diagnosticId);
      }

    } catch (error: any) {
      console.error("Error streaming chat:", error);
      trackEvent('diagnostic_error', { error: error.message });
      
      const errorMessage = error.message || "Erro desconhecido";
      const isNetworkError = errorMessage.includes('fetch') || errorMessage.includes('network');
      
      toast({
        title: isNetworkError ? "Erro de Conexão" : "Erro",
        description: isNetworkError 
          ? "Verifique sua conexão e tente novamente." 
          : "Ocorreu um erro na conversa. Tente enviar novamente.",
        variant: "destructive",
      });
      
      // Show retry button separately
      setTimeout(() => {
        if (input.trim()) {
          toast({
            title: "Tentar Novamente?",
            description: "Clique no botão de enviar para tentar novamente.",
          });
        }
      }, 2000);
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

  const handleVoiceTranscript = async (text: string) => {
    setInput(text);
    // Auto-send after transcription
    setTimeout(async () => {
      if (text.trim()) {
        setInput("");
        await streamChat(text.trim());
      }
    }, 500);
  };

  const toggleVoiceMode = () => {
    const newMode = !voiceMode;
    setVoiceMode(newMode);
    localStorage.setItem('diagnostic-voice-mode', String(newMode));
    
    toast({
      title: newMode ? "🎤 Modo Voz Ativado" : "⌨️ Modo Texto Ativado",
      description: newMode 
        ? "Você pode falar suas respostas agora" 
        : "Você pode digitar suas respostas agora",
    });
  };

  const handleSaveAndExit = async () => {
    if (diagnosticId && messages.length > 1) {
      try {
      await supabase
        .from('diagnostics')
        .update({ 
          responses_json: { messages } as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', diagnosticId);
        
        toast({
          title: "Progresso salvo! 💾",
          description: "Você pode continuar de onde parou quando voltar.",
        });
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
    
    navigate('/dashboard');
  };

  const handleFinalize = async () => {
    if (!diagnosticId) return;
    
    setIsCalculating(true);
    setCalculatingProgress(0);
    setShowManualFinalize(false);

    // Fake progress animation
    const progressInterval = setInterval(() => {
      setCalculatingProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 1500);

    // Timeout controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45 segundos

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
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);
      clearInterval(progressInterval);
      setCalculatingProgress(100);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to calculate score");
      }

      const result = await response.json();
      
      // Auto-tag user after completing diagnostic
      if (session?.user) {
        supabase.functions.invoke('auto-tag-leads', {
          body: { userId: session.user.id }
        }).catch(err => console.error('Auto-tag error:', err));
      }

      toast({
        title: "Diagnóstico Concluído! 🎉",
        description: `Seu Score Express: ${result.totalScore}/150`,
      });

      navigate(`/diagnostic/results/${diagnosticId}`);
    } catch (error: any) {
      clearTimeout(timeoutId);
      clearInterval(progressInterval);
      
      console.error("Error finalizing diagnostic:", error);
      
      // Handle timeout specifically
      if (error.name === 'AbortError') {
        toast({
          title: "Tempo Esgotado",
          description: "O cálculo está demorando muito. Vamos tentar novamente automaticamente.",
        });
        // Auto-retry after 2 seconds
        setTimeout(() => {
          setIsCalculating(false);
          handleFinalize();
        }, 2000);
        return;
      }
      
      // Show error and options
      toast({
        title: "Erro ao Calcular Score",
        description: "Não foi possível calcular seu score automaticamente.",
        variant: "destructive",
      });
      
      // Show error dialog with options after a brief delay
      setTimeout(() => {
        setShowErrorOptions(true);
      }, 1000);
      
    } finally {
      setIsCalculating(false);
      setCalculatingProgress(0);
    }
  };

  const TURBO_QUESTIONS = 10;
  const COMPLETE_QUESTIONS = 39;
  
  const userMessages = messages.filter(m => m.role === 'user').length;
  const expectedQuestions = turboMode ? TURBO_QUESTIONS : COMPLETE_QUESTIONS;
  const progress = Math.min((userMessages / expectedQuestions) * 100, 100);

  return (
    <div className="min-h-screen flex flex-col">
      <DiagnosticModeModal 
        open={showModeSelection} 
        onSelect={handleModeSelection}
      />
      
      {/* Header fixo */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container flex h-14 items-center justify-between px-4">
          <Logo size="sm" />
          
          <div className="flex items-center gap-2 md:gap-4">
            {/* Indicador de Progresso */}
            <span className="text-xs md:text-sm text-muted-foreground whitespace-nowrap">
              {userMessages}/{expectedQuestions} {turboMode ? "🚀" : ""}
            </span>
            
            {/* Botão Minha Área */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="gap-1 md:gap-2"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Minha Área</span>
            </Button>
            
            {/* Botão Salvar e Sair */}
            {messages.length > 1 && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleSaveAndExit}
                className="gap-1 md:gap-2"
              >
                <Save className="w-4 h-4" />
                <span className="hidden sm:inline">Salvar</span>
              </Button>
            )}
          </div>
        </div>
      </header>
      
      <div className="flex-1 bg-gradient-subtle p-3 md:p-4">
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
            <div className="flex items-center gap-3">
              <Button
                variant={voiceMode ? "default" : "outline"}
                size="sm"
                onClick={toggleVoiceMode}
                className="flex items-center gap-2"
              >
                {voiceMode ? (
                  <>
                    <Headphones className="w-4 h-4" />
                    <span className="hidden sm:inline">Modo Voz</span>
                    <span className="sm:hidden">Voz</span>
                  </>
                ) : (
                  <>
                    <Keyboard className="w-4 h-4" />
                    <span className="hidden sm:inline">Modo Texto</span>
                    <span className="sm:hidden">Texto</span>
                  </>
                )}
              </Button>
              {voiceMode && (
                <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="hidden sm:inline">Conversação ativa</span>
                </div>
              )}
              {messages.length === 0 && (
                <Button
                  variant={turboMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTurboMode(!turboMode)}
                >
                  {turboMode ? "Modo Completo" : "⚡ Modo Turbo"}
                </Button>
              )}
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
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 md:p-6 space-y-3 md:space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} w-full`}
              >
                <div
                  className={`max-w-[90%] md:max-w-[80%] rounded-2xl p-3 md:p-4 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-muted text-foreground"
                  }`}
                 >
                   <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                   {msg.role === "assistant" && voiceMode && (
                     <div className="mt-3">
                       <AudioPlayer 
                         text={msg.content} 
                         autoPlay={idx === messages.length - 1}
                         onStart={() => {
                           setIsAISpeaking(true);
                           if (idx === messages.length - 1) {
                             toast({
                               title: "🔊 IA falando...",
                               description: "Aguarde o fim da resposta para falar",
                             });
                           }
                         }}
                         onEnd={() => {
                           setIsAISpeaking(false);
                           if (idx === messages.length - 1) {
                             toast({
                               title: "🎤 Sua vez!",
                               description: "Clique no microfone para responder",
                             });
                           }
                         }}
                       />
                     </div>
                   )}
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
            {voiceMode ? (
              // Voice mode layout
              <div className="space-y-3">
                {isAISpeaking ? (
                  <div className="flex flex-col items-center gap-3 py-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Volume2 className="w-5 h-5 animate-pulse" />
                      <span className="text-sm">IA está falando... Aguarde para responder</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsAISpeaking(false);
                        toast({
                          title: "Áudio interrompido",
                          description: "Você pode responder agora",
                        });
                      }}
                    >
                      Pular resposta
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center">
                      <VoiceRecorder
                        onTranscript={handleVoiceTranscript}
                        disabled={isLoading || isComplete}
                        large
                      />
                    </div>
                    <p className="text-xs text-center text-muted-foreground">
                      {isLoading ? "Processando..." : "Clique no microfone e fale sua resposta"}
                    </p>
                  </>
                )}
                <details className="text-xs text-muted-foreground">
                  <summary className="cursor-pointer text-center hover:text-foreground">
                    Prefere digitar esta resposta?
                  </summary>
                  <div className="flex gap-2 mt-2">
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
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </details>
              </div>
            ) : (
              // Text mode layout
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
            )}
          </div>
        </Card>

        {/* Manual Finalize Button */}
        {showManualFinalize && !isCalculating && (
          <Card className="mt-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-500">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-green-800 dark:text-green-200">
                      🎉 Diagnóstico Completo!
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Clique no botão para ver seus resultados
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleFinalize}
                  size="lg"
                  className="flex-shrink-0"
                >
                  Ver Resultados
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Improved Calculating Overlay */}
        {isCalculating && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="p-8 max-w-md w-full">
              <CardContent className="space-y-4 p-0">
                <div className="flex justify-center">
                  <Loader2 className="w-16 h-16 animate-spin text-primary" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold">Calculando seu Score Express...</h3>
                  <p className="text-sm text-muted-foreground">
                    Estamos analisando suas respostas com IA
                  </p>
                  <Progress value={calculatingProgress} className="w-full h-2" />
                  <p className="text-xs text-muted-foreground">
                    Isso pode levar até 30 segundos
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Error Options Dialog */}
        <AlertDialog open={showErrorOptions} onOpenChange={setShowErrorOptions}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Erro ao Finalizar Diagnóstico</AlertDialogTitle>
              <AlertDialogDescription>
                Não conseguimos calcular seu score automaticamente. 
                O que você gostaria de fazer?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2">
              <AlertDialogAction
                onClick={() => {
                  setShowErrorOptions(false);
                  handleFinalize();
                }}
                className="w-full sm:w-auto"
              >
                Tentar Novamente
              </AlertDialogAction>
              <Button
                onClick={() => {
                  setShowErrorOptions(false);
                  navigate('/dashboard');
                }}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Voltar ao Dashboard
              </Button>
              <Button
                onClick={() => {
                  setShowErrorOptions(false);
                  navigate('/consultations');
                }}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Falar com Consultor
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </div>
      </div>
    </div>
  );
}
