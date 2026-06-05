import { Request, Response, NextFunction } from 'express';
import { serviceService } from '../services/service.service';

export class ServiceController {
  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await serviceService.getCategories();
      res.json({ success: true, data: categories });
    } catch (error) { next(error); }
  }

  async getServices(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId, page, pageSize } = req.query;
      const result = await serviceService.getServices(
        categoryId as string,
        parseInt(page as string) || 1,
        parseInt(pageSize as string) || 20
      );
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async getServiceById(req: Request, res: Response, next: NextFunction) {
    try {
      const service = await serviceService.getServiceById(req.params.id);
      res.json({ success: true, data: service });
    } catch (error) { next(error); }
  }

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await serviceService.createOrder({
        ...req.body,
        userId: req.userId,
      });
      res.status(201).json({ success: true, data: order });
    } catch (error) { next(error); }
  }

  async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, pageSize } = req.query;
      const result = await serviceService.getOrders(
        req.userId!,
        parseInt(page as string) || 1,
        parseInt(pageSize as string) || 20
      );
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await serviceService.getOrderById(req.params.id);
      res.json({ success: true, data: order });
    } catch (error) { next(error); }
  }

  async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await serviceService.updateOrderStatus(req.params.id, req.body.status);
      res.json({ success: true, data: order });
    } catch (error) { next(error); }
  }

  async reviewOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await serviceService.reviewOrder(req.params.id, req.body.rating, req.body.reviewText);
      res.json({ success: true, data: order });
    } catch (error) { next(error); }
  }
}

export const serviceController = new ServiceController();
