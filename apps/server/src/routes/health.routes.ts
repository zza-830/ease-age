import { Router } from 'express';
import { healthController } from '../controllers/health.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/records/:elderlyProfileId', (req, res, next) => healthController.getHealthRecords(req, res, next));
router.post('/records', (req, res, next) => healthController.createHealthRecord(req, res, next));
router.get('/medications/:elderlyProfileId', (req, res, next) => healthController.getMedications(req, res, next));
router.post('/medications', (req, res, next) => healthController.createMedication(req, res, next));
router.put('/medications/:id', (req, res, next) => healthController.updateMedication(req, res, next));
router.delete('/medications/:id', (req, res, next) => healthController.deleteMedication(req, res, next));
router.get('/checkups/:elderlyProfileId', (req, res, next) => healthController.getMedicalCheckups(req, res, next));
router.post('/checkups', (req, res, next) => healthController.createMedicalCheckup(req, res, next));

export default router;
