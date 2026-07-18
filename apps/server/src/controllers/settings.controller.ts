import { Request, Response, NextFunction } from 'express';
import { userPreferencesService } from '../services/user-preferences.service';

export class SettingsController {
  async getPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId;
      const preferences = await userPreferencesService.getPreferences(userId);
      res.json({ success: true, data: preferences });
    } catch (error) { next(error); }
  }

  async updatePreference(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId;
      const { key, value } = req.body;
      if (!key) {
        return res.status(400).json({ success: false, message: '缺少设置项名称' });
      }
      await userPreferencesService.updatePreference(userId, key, value);
      res.json({ success: true, message: '设置已更新' });
    } catch (error) { next(error); }
  }

  async updateMultiple(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId;
      const updates = req.body;
      if (!updates || typeof updates !== 'object') {
        return res.status(400).json({ success: false, message: '无效的设置数据' });
      }
      await userPreferencesService.updateMultiple(userId, updates);
      res.json({ success: true, message: '设置已更新' });
    } catch (error) { next(error); }
  }

  async resetToDefault(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId;
      await userPreferencesService.resetToDefault(userId);
      res.json({ success: true, message: '已恢复默认设置' });
    } catch (error) { next(error); }
  }

  async getHealthThresholds(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId;
      const thresholds = await userPreferencesService.getHealthThresholds(userId);
      res.json({ success: true, data: thresholds });
    } catch (error) { next(error); }
  }
}

export const settingsController = new SettingsController();
