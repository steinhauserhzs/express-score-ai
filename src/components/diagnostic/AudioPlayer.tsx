import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Volume2, VolumeX, Loader2, RotateCcw, Play, Pause } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AudioPlayerProps {
  text: string;
  autoPlay?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
}

// Simple cache for generated audio
const audioCache = new Map<string, string>();

const getCacheKey = (text: string): string => {
  // Use first 200 chars as cache key
  return text.substring(0, 200);
};

export default function AudioPlayer({ text, autoPlay = false, onStart, onEnd }: AudioPlayerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (autoPlay && text && !audioUrl && !isLoading) {
      generateAndPlayAudio();
    }
  }, [autoPlay, text]);

  useEffect(() => {
    // Cleanup audio URL on unmount
    return () => {
      if (audioUrl && !audioCache.has(getCacheKey(text))) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl, text]);

  useEffect(() => {
    // Update progress
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [audioRef.current]);

  const generateAndPlayAudio = async (attempt = 1) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(false);

    try {
      // Check cache first
      const cacheKey = getCacheKey(text);
      const cachedUrl = audioCache.get(cacheKey);
      
      if (cachedUrl) {
        console.log('[AudioPlayer] Using cached audio');
        setAudioUrl(cachedUrl);
        await playAudio(cachedUrl);
        return;
      }

      // Call text-to-voice function
      console.log('[AudioPlayer] Generating new audio...');
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
        
        // Save to cache
        audioCache.set(cacheKey, url);
        setAudioUrl(url);

        // Play audio
        await playAudio(url);
      }
    } catch (error: any) {
      console.error('[AudioPlayer] Error generating audio:', error);
      
      // Retry logic
      if (attempt < 3) {
        console.log(`[AudioPlayer] Retrying... (${attempt}/3)`);
        toast({
          title: "Tentando novamente...",
          description: `Tentativa ${attempt + 1} de 3`,
        });
        await new Promise(resolve => setTimeout(resolve, 2000));
        return generateAndPlayAudio(attempt + 1);
      }
      
      // After 3 failures
      setError(true);
      toast({
        title: "Erro ao gerar áudio",
        description: "Não foi possível converter o texto em voz. Você pode continuar lendo o texto.",
        variant: "destructive",
      });
      onEnd?.();
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = async (url: string) => {
    const audio = new Audio(url);
    audioRef.current = audio;
    
    audio.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      onEnd?.();
    };
    
    audio.onerror = () => {
      console.error('[AudioPlayer] Audio playback error');
      setError(true);
      setIsPlaying(false);
      toast({
        title: "Erro ao reproduzir áudio",
        description: "Tente novamente.",
        variant: "destructive",
      });
      onEnd?.();
    };

    try {
      await audio.play();
      setIsPlaying(true);
      onStart?.();
    } catch (err) {
      console.error('[AudioPlayer] Play error:', err);
      setError(true);
      onEnd?.();
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
        onStart?.();
      }
    } else {
      generateAndPlayAudio();
    }
  };

  const replay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
      onStart?.();
    } else {
      generateAndPlayAudio();
    }
  };

  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (error && !audioUrl) {
    return (
      <Button
        onClick={() => generateAndPlayAudio()}
        size="sm"
        variant="outline"
        className="h-8 w-8 p-0"
      >
        <RotateCcw className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-2 min-w-[200px]">
      <Button
        onClick={toggleAudio}
        disabled={isLoading}
        size="sm"
        variant="ghost"
        className="h-8 w-8 p-0 flex-shrink-0"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </Button>

      {duration > 0 && (
        <>
          <Progress value={(currentTime / duration) * 100} className="flex-1 h-1" />
          <span className="text-xs text-muted-foreground flex-shrink-0 min-w-[60px] text-right">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </>
      )}

      {!isLoading && audioUrl && (
        <Button
          onClick={replay}
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 flex-shrink-0"
        >
          <RotateCcw className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
}
