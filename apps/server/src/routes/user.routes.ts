import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/:userId/elderly-profile', (req, res, next) => userController.getElderlyProfile(req, res, next));
router.post('/:userId/elderly-profile', (req, res, next) => userController.createElderlyProfile(req, res, next));
router.put('/:userId/elderly-profile', (req, res, next) => userController.updateElderlyProfile(req, res, next));
router.post('/:userId/family-relations', (req, res, next) => userController.addFamilyRelation(req, res, next));
router.get('/family-relations/:elderlyProfileId', (req, res, next) => userController.getFamilyRelations(req, res, next));
router.delete('/family-relations/:relationId', (req, res, next) => userController.removeFamilyRelation(req, res, next));

export default router;
