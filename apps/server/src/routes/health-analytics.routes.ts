import { Router } from 'express';
import { healthAnalyticsController, checkinController, moodController } from '../controllers/health-analytics.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

// 健康分析
router.get('/:elderlyProfileId/trends', (req, res, next) => healthAnalyticsController.getTrends(req, res, next));
router.get('/:elderlyProfileId/anomalies', (req, res, next) => healthAnalyticsController.getAnomalies(req, res, next));
router.get('/:elderlyProfileId/summary', (req, res, next) => healthAnalyticsController.getSummary(req, res, next));

// 每日签到
router.post('/checkin', (req, res, next) => checkinController.checkin(req, res, next));
router.get('/:elderlyProfileId/checkin/history', (req, res, next) => checkinController.getHistory(req, res, next));
router.get('/:elderlyProfileId/checkin/stats', (req, res, next) => checkinController.getStats(req, res, next));

// 情绪记录
router.post('/mood', (req, res, next) => moodController.record(req, res, next));
router.get('/:elderlyProfileId/mood/history', (req, res, next) => moodController.getHistory(req, res, next));
router.get('/:elderlyProfileId/mood/distribution', (req, res, next) => moodController.getDistribution(req, res, next));

export default router;
