import { Server, Socket } from 'socket.io';
import { transcribeAudio, synthesizeSpeech, chatCompletion } from './mimo.service';
import prisma from '../config/database';

interface VoiceSession {
  userId: string;
  elderlyProfileId: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  audioChunks: string[]; // base64 WAV chunks
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

export function setupVoiceChat(io: Server) {
  // 认证中间件
  const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    console.log(`[VoiceChat] 认证请求, token: ${token ? token.substring(0, 20) + '...' : '无'}`);
    if (!token) {
      console.log('[VoiceChat] 拒绝: 无token');
      return next(new Error('未提供认证令牌'));
    }
    try {
      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      (socket as any).userId = decoded.userId || decoded.id;
      console.log(`[VoiceChat] 认证成功: userId=${(socket as any).userId}`);
      next();
    } catch (e: any) {
      console.log(`[VoiceChat] 拒绝: JWT验证失败 - ${e.message}`);
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
      console.log(`[VoiceChat] 用户 ${userId} 开始语音会话, profileId: ${elderlyProfileId}`);
    });

    // 接收 base64 WAV 音频
    socket.on('voice:audio', (base64Data: string) => {
      const session = sessions.get(socket.id);
      if (!session) return;
      session.audioChunks.push(base64Data);
    });

    // 停止录音，处理 ASR + LLM + TTS
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

        // 合并所有 base64 chunks（取最后一个大的 chunk，前端已合并 PCM）
        // 前端已将完整录音编码为单个 WAV blob，所以通常只有一个 chunk
        const audioBase64 = session.audioChunks.join('');
        session.audioChunks = [];

        // ASR - 语音识别
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

        socket.emit('voice:transcript', { text: userText, isFinal: true });
        session.messages.push({ role: 'user', content: userText });

        // LLM - 生成回复
        socket.emit('ai:status', { status: 'thinking' });
        const aiReply = await chatCompletion(session.messages, session.elderlyProfileId);
        session.messages.push({ role: 'assistant', content: aiReply });

        socket.emit('ai:reply', { text: aiReply });

        // TTS - 语音合成
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
      } catch (err) {
        console.error('[VoiceChat] 处理错误:', err);
        socket.emit('error:process', { message: '处理失败，请重试' });
      } finally {
        session.isProcessing = false;
      }
    });

    // 直接发送文本（跳过 ASR）
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
        socket.emit('voice:transcript', { text: userText, isFinal: true });
        session.messages.push({ role: 'user', content: userText });

        socket.emit('ai:status', { status: 'thinking' });
        const aiReply = await chatCompletion(session.messages, session.elderlyProfileId);
        session.messages.push({ role: 'assistant', content: aiReply });

        socket.emit('ai:reply', { text: aiReply });

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
      } catch (err) {
        console.error('[VoiceChat] 处理错误:', err);
        socket.emit('error:process', { message: '处理失败，请重试' });
      } finally {
        session.isProcessing = false;
      }
    });

    // 结束会话
    socket.on('session:end', () => {
      sessions.delete(socket.id);
      socket.emit('session:ended');
      console.log(`[VoiceChat] 用户 ${userId} 结束语音会话`);
    });

    socket.on('disconnect', () => {
      sessions.delete(socket.id);
      console.log(`[VoiceChat] 用户 ${userId} 断开连接`);
    });
  });
}
