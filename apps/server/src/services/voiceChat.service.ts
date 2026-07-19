import { Server, Socket } from 'socket.io';
import { transcribeAudio, synthesizeSpeech, chatCompletion } from './mimo.service';
import prisma from '../config/database';

interface VoiceSession {
  userId: string;
  elderlyProfileId: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  audioChunks: string[];
  isProcessing: boolean;
}

const sessions = new Map<string, VoiceSession>();

async function getElderlyProfileId(userId: string): Promise<string> {
  const profile = await prisma.elderlyProfile.findUnique({
    where: { userId },
    select: { id: true },
  });
  return profile?.id || '';
}

// 流式发送文字（模拟打字效果）
async function streamText(socket: Socket, text: string, chunkSize = 3, delayMs = 30) {
  for (let i = 0; i < text.length; i += chunkSize) {
    const chunk = text.substring(i, i + chunkSize);
    socket.emit('ai:stream', { chunk, done: false });
    await new Promise((r) => setTimeout(r, delayMs));
  }
  socket.emit('ai:stream', { chunk: '', done: true });
}

// 核心处理流程
async function processVoiceInput(socket: Socket, session: VoiceSession, userText: string) {
  // 用户文本
  socket.emit('voice:transcript', { text: userText, isFinal: true });
  session.messages.push({ role: 'user', content: userText });

  // LLM 生成回复
  socket.emit('ai:status', { status: 'thinking' });
  const aiReply = await chatCompletion(session.messages, session.elderlyProfileId);
  session.messages.push({ role: 'assistant', content: aiReply });

  // 流式发送文字
  socket.emit('ai:reply_start');
  await streamText(socket, aiReply);
  socket.emit('ai:reply', { text: aiReply });

  // TTS 合成语音
  socket.emit('ai:status', { status: 'speaking' });
  try {
    const ttsAudio = await synthesizeSpeech(aiReply, '冰糖');
    if (ttsAudio) {
      socket.emit('ai:audio', { audio: ttsAudio, format: 'wav' });
    }
  } catch (err) {
    console.error('[VoiceChat] TTS 错误:', err);
  }

  socket.emit('ai:done');
  socket.emit('ai:status', { status: 'listening' });
}

export function setupVoiceChat(io: Server) {
  const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('未提供认证令牌'));
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      (socket as any).userId = decoded.userId || decoded.id;
      next();
    } catch {
      next(new Error('认证失败'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = (socket as any).userId;
    console.log(`[VoiceChat] 用户 ${userId} 已连接`);

    // 开始语音会话
    socket.on('voice:start', async () => {
      const elderlyProfileId = await getElderlyProfileId(userId);
      sessions.set(socket.id, {
        userId,
        elderlyProfileId,
        messages: [],
        audioChunks: [],
        isProcessing: false,
      });
      socket.emit('session:started');
    });

    // 接收音频
    socket.on('voice:audio', (base64Data: string) => {
      const session = sessions.get(socket.id);
      if (!session) return;
      session.audioChunks.push(base64Data);
    });

    // 停止录音并处理
    socket.on('voice:stop', async () => {
      const session = sessions.get(socket.id);
      if (!session || session.isProcessing) return;
      session.isProcessing = true;

      try {
        if (session.audioChunks.length === 0) {
          socket.emit('voice:transcript', { text: '', isFinal: true });
          session.isProcessing = false;
          return;
        }

        const audioBase64 = session.audioChunks.join('');
        session.audioChunks = [];

        // ASR
        socket.emit('ai:status', { status: 'transcribing' });
        let userText = '';
        try {
          userText = await transcribeAudio(audioBase64, 'audio/wav', 'zh');
        } catch (err) {
          console.error('[VoiceChat] ASR 错误:', err);
          socket.emit('error:asr', { message: '语音识别失败，请重试' });
          session.isProcessing = false;
          return;
        }

        if (!userText.trim()) {
          socket.emit('voice:transcript', { text: '', isFinal: true });
          socket.emit('ai:status', { status: 'listening' });
          session.isProcessing = false;
          return;
        }

        await processVoiceInput(socket, session, userText);
      } catch (err) {
        console.error('[VoiceChat] 处理错误:', err);
        socket.emit('error:process', { message: '处理失败，请重试' });
      } finally {
        session.isProcessing = false;
      }
    });

    // 文本输入
    socket.on('voice:text', async (data: { text: string }) => {
      const session = sessions.get(socket.id);
      if (!session || session.isProcessing) return;
      session.isProcessing = true;

      const userText = data.text.trim();
      if (!userText) {
        session.isProcessing = false;
        return;
      }

      try {
        await processVoiceInput(socket, session, userText);
      } catch (err) {
        console.error('[VoiceChat] 处理错误:', err);
        socket.emit('error:process', { message: '处理失败，请重试' });
      } finally {
        session.isProcessing = false;
      }
    });

    socket.on('session:end', () => {
      sessions.delete(socket.id);
      socket.emit('session:ended');
    });

    socket.on('disconnect', () => {
      sessions.delete(socket.id);
    });
  });
}
