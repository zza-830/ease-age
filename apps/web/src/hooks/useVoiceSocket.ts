import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/useAuthStore';
import { useVoiceChatStore, VoiceStatus } from '@/stores/useVoiceChatStore';

export function useVoiceSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { accessToken } = useAuthStore();
  const store = useVoiceChatStore();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      console.log('[VoiceSocket] 无 token，跳过连接');
      return;
    }

    const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:4000';
    console.log('[VoiceSocket] 连接到:', wsUrl);

    const socket = io(wsUrl, {
      auth: { token: accessToken },
      transports: ['polling', 'websocket'],
    });

    socket.on('connect', () => {
      console.log('[VoiceSocket] 已连接, id:', socket.id);
      setIsConnected(true);
    });

    socket.on('connect_error', (err) => {
      console.error('[VoiceSocket] 连接错误:', err.message);
      setIsConnected(false);
    });

    socket.on('disconnect', (reason) => {
      console.log('[VoiceSocket] 已断开:', reason);
      setIsConnected(false);
      store.setStatus('idle');
    });

    socket.on('session:started', () => {
      store.setStatus('listening');
      store.clearMessages();
    });

    socket.on('voice:transcript', (data: { text: string; isFinal: boolean }) => {
      if (data.isFinal && data.text) {
        store.addMessage({ role: 'user', text: data.text });
        store.setCurrentTranscript('');
      } else {
        store.setCurrentTranscript(data.text);
      }
    });

    socket.on('ai:status', (data: { status: VoiceStatus }) => {
      store.setStatus(data.status);
    });

    socket.on('ai:reply', (data: { text: string }) => {
      store.addMessage({ role: 'assistant', text: data.text });
    });

    socket.on('ai:audio', (data: { audio: string; format: string }) => {
      store.setPendingAudio(data);
    });

    socket.on('ai:done', () => {
      store.setStatus('listening');
    });

    socket.on('session:ended', () => {
      store.setStatus('idle');
    });

    socket.on('error:asr', (data: { message: string }) => {
      console.error('[VoiceSocket] ASR 错误:', data.message);
      store.setStatus('listening');
    });

    socket.on('error:process', (data: { message: string }) => {
      console.error('[VoiceSocket] 处理错误:', data.message);
      store.setStatus('listening');
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [accessToken]);

  const startSession = useCallback(() => {
    socketRef.current?.emit('voice:start');
  }, []);

  const sendAudio = useCallback((base64: string) => {
    socketRef.current?.emit('voice:audio', base64);
  }, []);

  const stopAndProcess = useCallback(() => {
    socketRef.current?.emit('voice:stop');
  }, []);

  const sendText = useCallback((text: string) => {
    socketRef.current?.emit('voice:text', { text });
  }, []);

  const endSession = useCallback(() => {
    socketRef.current?.emit('session:end');
    store.reset();
  }, []);

  return {
    startSession,
    sendAudio,
    stopAndProcess,
    sendText,
    endSession,
    isConnected,
  };
}
