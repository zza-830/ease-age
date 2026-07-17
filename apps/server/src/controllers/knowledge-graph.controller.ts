import { Request, Response, NextFunction } from 'express';
import { knowledgeGraphService } from '../services/knowledge-graph.service';

export class KnowledgeGraphController {
  async getFullGraph(req: Request, res: Response, next: NextFunction) {
    try {
      const { elderlyProfileId } = req.params;
      const graph = await knowledgeGraphService.getFullGraph(elderlyProfileId);
      res.json({ success: true, data: graph });
    } catch (error) { next(error); }
  }

  async getNodes(req: Request, res: Response, next: NextFunction) {
    try {
      const { elderlyProfileId } = req.params;
      const { type } = req.query;
      const nodes = await knowledgeGraphService.getNodes(elderlyProfileId, type as string);
      res.json({ success: true, data: nodes });
    } catch (error) { next(error); }
  }

  async getNodesGrouped(req: Request, res: Response, next: NextFunction) {
    try {
      const { elderlyProfileId } = req.params;
      const grouped = await knowledgeGraphService.getNodesGrouped(elderlyProfileId);
      res.json({ success: true, data: grouped });
    } catch (error) { next(error); }
  }

  async getEdges(req: Request, res: Response, next: NextFunction) {
    try {
      const { elderlyProfileId } = req.params;
      const { nodeId } = req.query;
      const edges = await knowledgeGraphService.getEdges(elderlyProfileId, nodeId as string);
      res.json({ success: true, data: edges });
    } catch (error) { next(error); }
  }

  async getRoutines(req: Request, res: Response, next: NextFunction) {
    try {
      const { elderlyProfileId } = req.params;
      const routines = await knowledgeGraphService.getRoutines(elderlyProfileId);
      res.json({ success: true, data: routines });
    } catch (error) { next(error); }
  }

  async getImportantDates(req: Request, res: Response, next: NextFunction) {
    try {
      const { elderlyProfileId } = req.params;
      const dates = await knowledgeGraphService.getImportantDates(elderlyProfileId);
      res.json({ success: true, data: dates });
    } catch (error) { next(error); }
  }

  async getLifeEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const { elderlyProfileId } = req.params;
      const events = await knowledgeGraphService.getLifeEvents(elderlyProfileId);
      res.json({ success: true, data: events });
    } catch (error) { next(error); }
  }

  async getAiLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const { elderlyProfileId } = req.params;
      const { sessionId } = req.query;
      const logs = await knowledgeGraphService.getAiConversationLogs(elderlyProfileId, sessionId as string);
      res.json({ success: true, data: logs });
    } catch (error) { next(error); }
  }
}

export const knowledgeGraphController = new KnowledgeGraphController();
