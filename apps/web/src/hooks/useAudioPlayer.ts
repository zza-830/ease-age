import { useState, useRef, useCallback } from 'react';

interface UseAudioPlayerReturn {
  isPlaying: boolean;
  playAudio: (base64: string, format?: string) => Promise<void>;
  stopAudio: () => void;
}

export function useAudioPlayer(): UseAudioPlayerReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentUrlRef = useRef<string | null>(null);

  const playAudio = useCallback(async (base64: string, format: string = 'wav') => {
    // 停止当前播放
    stopAudio();

    try {
      const mimeType = format === 'wav' ? 'audio/wav' : 'audio/mpeg';
      const byteCharacters = atob(base64);
      const byteArray = new Uint8Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i);
      }
      const blob = new Blob([byteArray], { type: mimeType });
      const url = URL.createObjectURL(blob);
      currentUrlRef.current = url;

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => {
        setIsPlaying(false);
        cleanup();
      };
      audio.onerror = () => {
        setIsPlaying(false);
        cleanup();
      };

      await audio.play();
    } catch (err) {
      console.error('音频播放失败:', err);
      setIsPlaying(false);
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    cleanup();
  }, []);

  const cleanup = () => {
    if (currentUrlRef.current) {
      URL.revokeObjectURL(currentUrlRef.current);
      currentUrlRef.current = null;
    }
    audioRef.current = null;
  };

  return { isPlaying, playAudio, stopAudio };
}
