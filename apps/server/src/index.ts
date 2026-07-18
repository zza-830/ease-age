import path from 'path';
import dotenv from 'dotenv';

// 加载 .env（path 不依赖 env，可以 import）
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
console.log('[ENV] JWT_SECRET:', process.env.JWT_SECRET?.substring(0, 15) + '...');

// 其他模块改为 require，确保在 dotenv 之后加载
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('express-async-errors');
const { errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth.routes').default;
const userRoutes = require('./routes/user.routes').default;
const healthRoutes = require('./routes/health.routes').default;
const serviceRoutes = require('./routes/service.routes').default;
const knowledgeRoutes = require('./routes/knowledge.routes').default;
const knowledgeGraphRoutes = require('./routes/knowledge-graph.routes').default;
const notificationRoutes = require('./routes/notification.routes').default;
const communityRoutes = require('./routes/community.routes').default;
const healthAnalyticsRoutes = require('./routes/health-analytics.routes').default;
const auditLogRoutes = require('./routes/audit-log.routes').default;
const settingsRoutes = require('./routes/settings.routes').default;
const { setupVoiceChat } = require('./services/voiceChat.service');

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 4000;

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? 'https://easeage.com'
      : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  },
  maxHttpBufferSize: 10 * 1024 * 1024,
});

setupVoiceChat(io);

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://easeage.com'
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', (_req: any, res: any) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/knowledge', knowledgeRoutes);
app.use('/api/v1/kg', knowledgeGraphRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/community', communityRoutes);
app.use('/api/v1/analytics', healthAnalyticsRoutes);
app.use('/api/v1/audit-logs', auditLogRoutes);
app.use('/api/v1/settings', settingsRoutes);

app.use(errorHandler);

httpServer.listen(PORT, () => {
  console.log(`🚀 EaseAge API server running on port ${PORT}`);
  console.log(`🔌 WebSocket server ready`);
});

export default app;
