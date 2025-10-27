import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AudioPlayerProps {
  text: string;
  autoPlay?: boolean;
}

export default function AudioPlayer({ text, autoPlay = false }: AudioPlayerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (autoPlay && text && !audioUrl) {
      generateAndPlayAudio();
    }
  }, [autoPlay, text]);

  useEffect(() => {
    // Cleanup audio URL on unmount
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const generateAndPlayAudio = async () => {
    if (isLoading) return;
    
    setIsLoading(true);

    try {
      // Call text-to-voice function
      const { data, error } = await supabase.functions.invoke('text-to-voice', {
        body: { text, voice: 'alloy' }
      });

      if (error) throw error;

      if (data?.audioContent) {
        // Convert base64 to blob
        const binaryString = atob(data.audioContent);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(audioBlob);
        
        setAudioUrl(url);

        // Play audio
        const audio = new Audio(url);
        audioRef.current = audio;
        
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => {
          toast({
            title: "Erro ao reproduzir áudio",
            description: "Tente novamente.",
            variant: "destructive",
          });
          setIsPlaying(false);
        };

        await audio.play();
        setIsPlaying(true);
      }
    } catch (error: any) {
      console.error('Error generating audio:', error);
      toast({
        title: "Erro ao gerar áudio",
        description: "Não foi possível converter texto em voz.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      generateAndPlayAudio();
    }
  };

  return (
    <Button
      onClick={toggleAudio}
      disabled={isLoading}
      size="sm"
      variant="ghost"
      className="h-8 w-8 p-0"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isPlaying ? (
        <VolumeX className="w-4 h-4" />
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
    </Button>
  );
}
