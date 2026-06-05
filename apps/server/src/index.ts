import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'express-async-errors';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import healthRoutes from './routes/health.routes';
import serviceRoutes from './routes/service.routes';
import knowledgeRoutes from './routes/knowledge.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? 'https://easeage.com'
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/knowledge', knowledgeRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 EaseAge API server running on port ${PORT}`);
});

export default app;
