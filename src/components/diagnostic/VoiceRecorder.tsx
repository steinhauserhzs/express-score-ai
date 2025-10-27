import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  large?: boolean;
}

export default function VoiceRecorder({ onTranscript, disabled, large = false }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);

      toast({
        title: "🎤 Gravando...",
        description: "Fale sua resposta. Clique novamente para parar.",
      });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Erro ao acessar microfone",
        description: "Verifique as permissões do navegador.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);

    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];

        // Send to voice-to-text function
        const { data, error } = await supabase.functions.invoke('voice-to-text', {
          body: { audio: base64Audio }
        });

        if (error) throw error;

        if (data?.text) {
          onTranscript(data.text);
          toast({
            title: "✅ Transcrição concluída",
            description: `"${data.text.substring(0, 50)}${data.text.length > 50 ? '...' : ''}"`,
          });
        } else {
          throw new Error('No transcription received');
        }
      };
    } catch (error: any) {
      console.error('Error processing audio:', error);
      toast({
        title: "Erro ao processar áudio",
        description: "Tente novamente ou use o modo texto.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isProcessing}
      size={large ? "lg" : "icon"}
      variant={isRecording ? "destructive" : large ? "default" : "outline"}
      className={`relative ${large ? 'h-20 w-20 rounded-full shadow-lg hover:scale-105 transition-transform' : ''}`}
    >
      {isProcessing ? (
        <Loader2 className={`${large ? 'w-8 h-8' : 'w-4 h-4'} animate-spin`} />
      ) : isRecording ? (
        <>
          <MicOff className={`${large ? 'w-8 h-8' : 'w-4 h-4'}`} />
          <span className={`absolute ${large ? '-top-2 -right-2 w-5 h-5' : '-top-1 -right-1 w-3 h-3'} bg-red-500 rounded-full animate-ping`} />
          <span className={`absolute ${large ? '-top-2 -right-2 w-5 h-5' : '-top-1 -right-1 w-3 h-3'} bg-red-500 rounded-full`} />
        </>
      ) : (
        <Mic className={`${large ? 'w-8 h-8' : 'w-4 h-4'}`} />
      )}
    </Button>
  );
}
