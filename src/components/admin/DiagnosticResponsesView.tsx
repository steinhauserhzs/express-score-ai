import { Bot, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

interface DiagnosticResponsesViewProps {
  diagnostic: {
    responses_json: {
      messages: Message[];
    };
  };
}

export function DiagnosticResponsesView({ diagnostic }: DiagnosticResponsesViewProps) {
  const messages = diagnostic.responses_json?.messages || [];
  
  if (messages.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma resposta disponível para este diagnóstico.
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px] w-full pr-4">
      <div className="space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex gap-3 p-4 rounded-lg",
              message.role === 'assistant' 
                ? "bg-muted/50" 
                : "bg-primary/5 border border-primary/10"
            )}
          >
            <div className="flex-shrink-0 mt-1">
              {message.role === 'assistant' ? (
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-muted-foreground uppercase">
                  {message.role === 'assistant' ? 'Assistente' : 'Usuário'}
                </span>
              </div>
              <p className="text-sm break-words whitespace-pre-wrap leading-relaxed">
                {message.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
