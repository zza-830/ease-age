import { Router } from 'express';
import { knowledgeGraphController } from '../controllers/knowledge-graph.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

// 知识图谱
router.get('/:elderlyProfileId/graph', (req, res, next) => knowledgeGraphController.getFullGraph(req, res, next));
router.get('/:elderlyProfileId/nodes', (req, res, next) => knowledgeGraphController.getNodes(req, res, next));
router.get('/:elderlyProfileId/nodes-grouped', (req, res, next) => knowledgeGraphController.getNodesGrouped(req, res, next));
router.get('/:elderlyProfileId/edges', (req, res, next) => knowledgeGraphController.getEdges(req, res, next));

// 日常作息
router.get('/:elderlyProfileId/routines', (req, res, next) => knowledgeGraphController.getRoutines(req, res, next));

// 重要日期
router.get('/:elderlyProfileId/important-dates', (req, res, next) => knowledgeGraphController.getImportantDates(req, res, next));

// 生活事件
router.get('/:elderlyProfileId/life-events', (req, res, next) => knowledgeGraphController.getLifeEvents(req, res, next));

// AI 对话日志
router.get('/:elderlyProfileId/ai-logs', (req, res, next) => knowledgeGraphController.getAiLogs(req, res, next));

export default router;
