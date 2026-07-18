import { Router } from 'express';
import { settingsController } from '../controllers/settings.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/', (req, res, next) => settingsController.getPreferences(req, res, next));
router.put('/', (req, res, next) => settingsController.updatePreference(req, res, next));
router.put('/bulk', (req, res, next) => settingsController.updateMultiple(req, res, next));
router.post('/reset', (req, res, next) => settingsController.resetToDefault(req, res, next));
router.get('/health-thresholds', (req, res, next) => settingsController.getHealthThresholds(req, res, next));

export default router;
