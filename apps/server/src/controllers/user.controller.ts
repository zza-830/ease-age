import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';

export class UserController {
  async getElderlyProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await userService.getElderlyProfile(req.params.userId);
      res.json({ success: true, data: profile });
    } catch (error) { next(error); }
  }

  async createElderlyProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await userService.createElderlyProfile({
        ...req.body,
        userId: req.params.userId,
      });
      res.status(201).json({ success: true, data: profile });
    } catch (error) { next(error); }
  }

  async updateElderlyProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = await userService.updateElderlyProfile(req.params.userId, req.body);
      res.json({ success: true, data: profile });
    } catch (error) { next(error); }
  }

  async addFamilyRelation(req: Request, res: Response, next: NextFunction) {
    try {
      const relation = await userService.addFamilyRelation({
        ...req.body,
        userId: req.params.userId,
      });
      res.status(201).json({ success: true, data: relation });
    } catch (error) { next(error); }
  }

  async getFamilyRelations(req: Request, res: Response, next: NextFunction) {
    try {
      const relations = await userService.getFamilyRelations(req.params.elderlyProfileId);
      res.json({ success: true, data: relations });
    } catch (error) { next(error); }
  }

  async removeFamilyRelation(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.removeFamilyRelation(req.params.relationId);
      res.json({ success: true, message: '删除成功' });
    } catch (error) { next(error); }
  }
}

export const userController = new UserController();
