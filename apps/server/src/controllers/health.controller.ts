import { Request, Response, NextFunction } from 'express';
import { healthService } from '../services/health.service';

export class HealthController {
  async getHealthRecords(req: Request, res: Response, next: NextFunction) {
    try {
      const { elderlyProfileId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 20;
      const result = await healthService.getHealthRecords(elderlyProfileId, page, pageSize);
      res.json({ success: true, data: result });
    } catch (error) { next(error); }
  }

  async createHealthRecord(req: Request, res: Response, next: NextFunction) {
    try {
      const record = await healthService.createHealthRecord(req.body);
      res.status(201).json({ success: true, data: record });
    } catch (error) { next(error); }
  }

  async getMedications(req: Request, res: Response, next: NextFunction) {
    try {
      const { elderlyProfileId } = req.params;
      const medications = await healthService.getMedications(elderlyProfileId);
      res.json({ success: true, data: medications });
    } catch (error) { next(error); }
  }

  async createMedication(req: Request, res: Response, next: NextFunction) {
    try {
      const medication = await healthService.createMedication(req.body);
      res.status(201).json({ success: true, data: medication });
    } catch (error) { next(error); }
  }

  async updateMedication(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const medication = await healthService.updateMedication(id, req.body);
      res.json({ success: true, data: medication });
    } catch (error) { next(error); }
  }

  async deleteMedication(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await healthService.deleteMedication(id);
      res.json({ success: true, message: '删除成功' });
    } catch (error) { next(error); }
  }

  async getMedicalCheckups(req: Request, res: Response, next: NextFunction) {
    try {
      const { elderlyProfileId } = req.params;
      const checkups = await healthService.getMedicalCheckups(elderlyProfileId);
      res.json({ success: true, data: checkups });
    } catch (error) { next(error); }
  }

  async createMedicalCheckup(req: Request, res: Response, next: NextFunction) {
    try {
      const checkup = await healthService.createMedicalCheckup(req.body);
      res.status(201).json({ success: true, data: checkup });
    } catch (error) { next(error); }
  }
}

export const healthController = new HealthController();
