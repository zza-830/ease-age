import { Request, Response, NextFunction } from 'express';
import { knowledgeService } from '../services/knowledge.service';

export class KnowledgeController {
  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await knowledgeService.getCategories();
      res.json({ success: true, data: categories });
    } catch (error) { next(error); }
  }

  async getArticles(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId, page, pageSize, search } = req.query;
      const result = await knowledgeService.getArticles(
        categoryId as string,
        parseInt(page as string) || 1,
        parseInt(pageSize as string) || 20,
        search as string
      );
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async getArticleById(req: Request, res: Response, next: NextFunction) {
    try {
      const article = await knowledgeService.getArticleById(req.params.id);
      res.json({ success: true, data: article });
    } catch (error) { next(error); }
  }

  async getFamilyMemories(req: Request, res: Response, next: NextFunction) {
    try {
      const memories = await knowledgeService.getFamilyMemories(req.params.elderlyProfileId);
      res.json({ success: true, data: memories });
    } catch (error) { next(error); }
  }

  async createFamilyMemory(req: Request, res: Response, next: NextFunction) {
    try {
      const memory = await knowledgeService.createFamilyMemory({
        ...req.body,
        familyUserId: req.userId,
      });
      res.status(201).json({ success: true, data: memory });
    } catch (error) { next(error); }
  }

  async deleteFamilyMemory(req: Request, res: Response, next: NextFunction) {
    try {
      await knowledgeService.deleteFamilyMemory(req.params.id);
      res.json({ success: true, message: '删除成功' });
    } catch (error) { next(error); }
  }
}

export const knowledgeController = new KnowledgeController();
