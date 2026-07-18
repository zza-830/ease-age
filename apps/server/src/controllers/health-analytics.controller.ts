import { Request, Response, NextFunction } from 'express';
import { healthAnalyticsService } from '../services/health-analytics.service';
import { checkinService, moodService } from '../services/checkin.service';

export class HealthAnalyticsController {
  async getTrends(req: Request, res: Response, next: NextFunction) {
    try {
      const { elderlyProfileId } = req.params;
      const days = parseInt(req.query.days as string) || 30;
      const result = await healthAnalyticsService.getTrends(elderlyProfileId, days);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async getAnomalies(req: Request, res: Response, next: NextFunction) {
    try {
      const { elderlyProfileId } = req.params;
      const anomalies = await healthAnalyticsService.detectAnomalies(elderlyProfileId);
      res.json({ success: true, data: anomalies });
    } catch (error) { next(error); }
  }

  async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const { elderlyProfileId } = req.params;
      const summary = await healthAnalyticsService.generateSummary(elderlyProfileId);
      res.json({ success: true, data: summary });
    } catch (error) { next(error); }
  }
}

export class CheckinController {
  async checkin(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await checkinService.checkin(req.body);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { elderlyProfileId } = req.params;
      const days = parseInt(req.query.days as string) || 30;
      const history = await checkinService.getHistory(elderlyProfileId, days);
      res.json({ success: true, data: history });
    } catch (error) { next(error); }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { elderlyProfileId } = req.params;
      const stats = await checkinService.getStats(elderlyProfileId);
      res.json({ success: true, data: stats });
    } catch (error) { next(error); }
  }
}

export class MoodController {
  async record(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await moodService.record(req.body);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { elderlyProfileId } = req.params;
      const days = parseInt(req.query.days as string) || 30;
      const history = await moodService.getHistory(elderlyProfileId, days);
      res.json({ success: true, data: history });
    } catch (error) { next(error); }
  }

  async getDistribution(req: Request, res: Response, next: NextFunction) {
    try {
      const { elderlyProfileId } = req.params;
      const days = parseInt(req.query.days as string) || 30;
      const dist = await moodService.getDistribution(elderlyProfileId, days);
      res.json({ success: true, data: dist });
    } catch (error) { next(error); }
  }
}

export const healthAnalyticsController = new HealthAnalyticsController();
export const checkinController = new CheckinController();
export const moodController = new MoodController();
