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
    if (!accessToken) return;

    const wsUrl = import.meta.env.VITE_WS_URL || 'http://localhost:4000';
    const socket = io(wsUrl, {
      auth: { token: accessToken },
      transports: ['polling', 'websocket'],
    });

    socket.on('connect', () => setIsConnected(true));
    socket.on('connect_error', () => setIsConnected(false));
    socket.on('disconnect', () => {
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

    // 流式文字 chunk
    socket.on('ai:stream', (data: { chunk: string; done: boolean }) => {
      if (!data.done) {
        store.appendStreamChunk(data.chunk);
      }
    });

    // 回复开始（清空流式缓冲）
    socket.on('ai:reply_start', () => {
      useVoiceChatStore.setState({ streamingText: '' });
    });

    // 回复完成（最终文本）
    socket.on('ai:reply', () => {
      store.finishStream();
    });

    socket.on('ai:audio', (data: { audio: string; format: string }) => {
      store.setPendingAudio(data);
    });

    socket.on('ai:done', () => {
      store.setStatus('listening');
    });

    socket.on('session:ended', () => store.setStatus('idle'));
    socket.on('error:asr', () => store.setStatus('listening'));
    socket.on('error:process', () => store.setStatus('listening'));

    socketRef.current = socket;
    return () => { socket.disconnect(); socketRef.current = null; };
  }, [accessToken]);

  const startSession = useCallback(() => socketRef.current?.emit('voice:start'), []);
  const sendAudio = useCallback((base64: string) => socketRef.current?.emit('voice:audio', base64), []);
  const stopAndProcess = useCallback(() => socketRef.current?.emit('voice:stop'), []);
  const sendText = useCallback((text: string) => socketRef.current?.emit('voice:text', { text }), []);
  const endSession = useCallback(() => { socketRef.current?.emit('session:end'); store.reset(); }, []);

  return { startSession, sendAudio, stopAndProcess, sendText, endSession, isConnected };
}
