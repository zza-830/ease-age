import { Router } from 'express';
import { auditLogController } from '../controllers/notification.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/', (req, res, next) => auditLogController.getLogs(req, res, next));
router.get('/stats', (req, res, next) => auditLogController.getStats(req, res, next));

export default router;
