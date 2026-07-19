import { create } from 'zustand';

export type VoiceStatus = 'idle' | 'listening' | 'transcribing' | 'thinking' | 'speaking';

export interface VoiceMessage {
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}

interface PendingAudio {
  audio: string;
  format: string;
}

interface VoiceChatState {
  status: VoiceStatus;
  messages: VoiceMessage[];
  currentTranscript: string;
  streamingText: string; // 流式接收中的文字
  pendingAudio: PendingAudio | null;
  isMuted: boolean;

  setStatus: (status: VoiceStatus) => void;
  addMessage: (msg: Omit<VoiceMessage, 'timestamp'>) => void;
  setCurrentTranscript: (text: string) => void;
  appendStreamChunk: (chunk: string) => void;
  finishStream: () => void;
  setPendingAudio: (audio: PendingAudio | null) => void;
  toggleMute: () => void;
  clearMessages: () => void;
  reset: () => void;
}

export const useVoiceChatStore = create<VoiceChatState>((set, get) => ({
  status: 'idle',
  messages: [],
  currentTranscript: '',
  streamingText: '',
  pendingAudio: null,
  isMuted: false,

  setStatus: (status) => set({ status }),

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, { ...msg, timestamp: Date.now() }],
    })),

  setCurrentTranscript: (text) => set({ currentTranscript: text }),

  appendStreamChunk: (chunk) =>
    set((state) => ({ streamingText: state.streamingText + chunk })),

  finishStream: () => {
    const { streamingText, messages } = get();
    if (streamingText) {
      set({
        messages: [...messages, { role: 'assistant', text: streamingText, timestamp: Date.now() }],
        streamingText: '',
      });
    } else {
      set({ streamingText: '' });
    }
  },

  setPendingAudio: (audio) => set({ pendingAudio: audio }),

  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

  clearMessages: () => set({ messages: [], currentTranscript: '', streamingText: '' }),

  reset: () =>
    set({
      status: 'idle',
      messages: [],
      currentTranscript: '',
      streamingText: '',
      pendingAudio: null,
    }),
}));
