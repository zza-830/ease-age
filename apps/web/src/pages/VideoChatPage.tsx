import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX } from 'lucide-react';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useVoiceSocket } from '@/hooks/useVoiceSocket';
import { useVoiceChatStore, VoiceStatus } from '@/stores/useVoiceChatStore';
import { cn } from '@/lib/utils';

const STATUS_TEXT: Record<VoiceStatus, string> = {
  idle: '点击下方按钮开始通话',
  listening: '正在聆听，请说话...',
  transcribing: '正在识别语音...',
  thinking: '正在思考...',
  speaking: '正在回复...',
};

function VoiceOrb({ status, audioLevel }: { status: VoiceStatus; audioLevel: number }) {
  const baseColor = {
    idle: 'from-stone-400 to-stone-500',
    listening: 'from-blue-400 to-cyan-400',
    transcribing: 'from-amber-400 to-orange-400',
    thinking: 'from-orange-400 to-amber-500',
    speaking: 'from-emerald-400 to-green-500',
  }[status];

  const isActive = status !== 'idle';
  const scale = isActive ? 1 + audioLevel * 0.15 : 1;

  return (
    <div className="relative flex items-center justify-center">
      {isActive && (
        <>
          <motion.div
            className={cn('absolute h-56 w-56 rounded-full bg-gradient-to-br opacity-20 blur-2xl', baseColor)}
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className={cn('absolute h-48 w-48 rounded-full bg-gradient-to-br opacity-20 blur-xl', baseColor)}
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
          />
        </>
      )}

      <motion.div
        className={cn('relative h-40 w-40 rounded-full bg-gradient-to-br shadow-2xl', baseColor)}
        animate={{ scale }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/20 to-transparent" />

        {status === 'thinking' && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-white/40"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        )}

        {status === 'speaking' && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border border-emerald-400/30"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.5 + i * 0.2, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.4 }}
              />
            ))}
          </>
        )}

        <div className="flex h-full items-center justify-center">
          {status === 'idle' ? (
            <Mic className="h-12 w-12 text-white/80" />
          ) : status === 'listening' ? (
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1, repeat: Infinity }}>
              <Mic className="h-12 w-12 text-white" />
            </motion.div>
          ) : status === 'thinking' ? (
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="h-3 w-3 rounded-full bg-white"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <Volume2 className="h-12 w-12 text-white" />
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function VideoChatPage() {
  const { isRecording, startRecording, stopRecording, audioLevel } = useAudioRecorder();
  const { playAudio, stopAudio } = useAudioPlayer();
  const { startSession, sendAudio, stopAndProcess, endSession, isConnected } = useVoiceSocket();
  const { status, messages, currentTranscript, pendingAudio, isMuted, toggleMute } = useVoiceChatStore();

  const [isSessionActive, setIsSessionActive] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentTranscript]);

  useEffect(() => {
    if (pendingAudio && !isMuted) {
      playAudio(pendingAudio.audio, pendingAudio.format);
      useVoiceChatStore.getState().setPendingAudio(null);
    }
  }, [pendingAudio, isMuted, playAudio]);

  const handleStart = async () => {
    if (!isConnected) { alert('正在连接服务器，请稍后再试'); return; }
    startSession();
    setIsSessionActive(true);
    try { await startRecording(); }
    catch { alert('请允许麦克风权限以使用语音功能'); setIsSessionActive(false); }
  };

  const handleStopRecording = async () => {
    const blob = await stopRecording();
    if (blob && blob.size > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = (reader.result as string).split(',')[1];
        sendAudio(base64);
        stopAndProcess();
      };
      reader.readAsDataURL(blob);
    }
  };

  const handleEndSession = () => {
    stopRecording();
    stopAudio();
    endSession();
    setIsSessionActive(false);
  };

  // 取最近的消息（最多显示最近6条）
  const recentMessages = messages.slice(-6);

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      {/* 顶部 */}
      <div className="flex items-center justify-between border-b bg-white px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-stone-900">AI 语音通话</h2>
          <p className="text-sm text-stone-500">
            {isSessionActive ? '通话中' : '点击下方按钮，开始与AI语音通话'}
          </p>
        </div>
        {isSessionActive && (
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
            <span className="text-sm text-green-600">已连接</span>
          </div>
        )}
      </div>

      {/* 主体 */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 bg-gradient-to-b from-stone-50 to-white px-6">
        <VoiceOrb status={status} audioLevel={isRecording ? audioLevel : 0} />

        <AnimatePresence mode="wait">
          <motion.p
            key={status}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-base text-stone-600"
          >
            {STATUS_TEXT[status]}
          </motion.p>
        </AnimatePresence>

        {/* 对话消息 — 紧凑地显示在光球下方 */}
        {(recentMessages.length > 0 || currentTranscript) && (
          <div className="w-full max-w-xl space-y-2 mt-2">
            {recentMessages.map((msg, i) => (
              <motion.div
                key={`${msg.timestamp}-${i}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'flex',
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-2 text-sm leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-orange-500 text-white rounded-br-md'
                      : 'bg-stone-100 text-stone-800 rounded-bl-md'
                  )}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}

            {/* 实时识别中的文本 */}
            {currentTranscript && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-end"
              >
                <div className="max-w-[85%] rounded-2xl rounded-br-md bg-blue-50 px-4 py-2 text-sm text-blue-600">
                  {currentTranscript}...
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 底部控制栏 */}
      <div className="border-t bg-white px-6 py-5">
        <div className="flex items-center justify-center gap-4">
          {!isSessionActive ? (
            <button
              onClick={handleStart}
              className="flex items-center gap-2 rounded-full bg-orange-500 px-8 py-3.5 text-base font-medium text-white shadow-lg shadow-orange-500/25 transition-all hover:bg-orange-600 hover:shadow-xl active:scale-95"
            >
              <Phone className="h-5 w-5" />
              开始通话
            </button>
          ) : (
            <>
              <button
                onClick={toggleMute}
                className={cn(
                  'rounded-full p-3.5 transition-colors',
                  isMuted ? 'bg-red-100 text-red-600' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                )}
              >
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>

              <button
                onClick={isRecording ? handleStopRecording : startRecording}
                disabled={status === 'transcribing' || status === 'thinking' || status === 'speaking'}
                className={cn(
                  'rounded-full p-5 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed',
                  isRecording
                    ? 'bg-red-500 text-white shadow-red-500/30 animate-pulse'
                    : 'bg-orange-500 text-white shadow-orange-500/25 hover:bg-orange-600'
                )}
              >
                {isRecording ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              </button>

              <button
                onClick={handleEndSession}
                className="rounded-full bg-stone-800 p-3.5 text-white transition-colors hover:bg-stone-900"
              >
                <PhoneOff className="h-5 w-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
