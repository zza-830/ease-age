import { Request, Response, NextFunction } from 'express';
import { notificationService } from '../services/notification.service';
import { auditLogService } from '../services/audit-log.service';

export class NotificationController {
  async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId;
      const unreadOnly = req.query.unreadOnly === 'true';
      const page = parseInt(req.query.page as string) || 1;
      const result = await notificationService.getByUser(userId, unreadOnly, page);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId;
      const count = await notificationService.getUnreadCount(userId);
      res.json({ success: true, data: { count } });
    } catch (error) { next(error); }
  }

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await notificationService.markAsRead(id);
      res.json({ success: true, message: '已标记为已读' });
    } catch (error) { next(error); }
  }

  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).userId;
      await notificationService.markAllAsRead(userId);
      res.json({ success: true, message: '全部已读' });
    } catch (error) { next(error); }
  }

  async deleteNotification(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await notificationService.delete(id);
      res.json({ success: true, message: '已删除' });
    } catch (error) { next(error); }
  }
}

export class AuditLogController {
  async getLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, action, resource, page, pageSize } = req.query;
      const result = await auditLogService.query({
        userId: userId as string,
        action: action as string,
        resource: resource as string,
        page: parseInt(page as string) || 1,
        pageSize: parseInt(pageSize as string) || 50,
      });
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, days } = req.query;
      const stats = await auditLogService.getActionStats(
        userId as string,
        parseInt(days as string) || 7
      );
      res.json({ success: true, data: stats });
    } catch (error) { next(error); }
  }
}

export const notificationController = new NotificationController();
export const auditLogController = new AuditLogController();
