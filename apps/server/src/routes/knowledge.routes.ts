import { Router } from 'express';
import { knowledgeController } from '../controllers/knowledge.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/categories', (req, res, next) => knowledgeController.getCategories(req, res, next));
router.get('/articles', (req, res, next) => knowledgeController.getArticles(req, res, next));
router.get('/articles/:id', (req, res, next) => knowledgeController.getArticleById(req, res, next));

router.use(authenticate);
router.get('/memories/:elderlyProfileId', (req, res, next) => knowledgeController.getFamilyMemories(req, res, next));
router.post('/memories', (req, res, next) => knowledgeController.createFamilyMemory(req, res, next));
router.delete('/memories/:id', (req, res, next) => knowledgeController.deleteFamilyMemory(req, res, next));

export default router;
