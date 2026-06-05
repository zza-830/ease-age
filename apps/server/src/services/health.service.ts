import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class HealthService {
  // Health Records
  async getHealthRecords(elderlyProfileId: string, page = 1, pageSize = 20) {
    const [records, total] = await Promise.all([
      prisma.healthRecord.findMany({
        where: { elderlyProfileId },
        orderBy: { measuredAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.healthRecord.count({ where: { elderlyProfileId } }),
    ]);

    return {
      items: records,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async createHealthRecord(data: {
    elderlyProfileId: string;
    recordType: string;
    measurementValueJson: Record<string, number>;
    measurementUnit: string;
    measuredAt: Date;
    notes?: string;
  }) {
    return prisma.healthRecord.create({ data });
  }

  // Medications
  async getMedications(elderlyProfileId: string) {
    return prisma.medication.findMany({
      where: { elderlyProfileId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createMedication(data: {
    elderlyProfileId: string;
    medicationName: string;
    dosageDescription: string;
    frequencyDescription: string;
    startDate?: Date;
    endDate?: Date;
    reminderScheduleJson?: string[];
  }) {
    return prisma.medication.create({ data });
  }

  async updateMedication(id: string, data: Partial<{
    medicationName: string;
    dosageDescription: string;
    frequencyDescription: string;
    isActive: boolean;
  }>) {
    const medication = await prisma.medication.findUnique({ where: { id } });
    if (!medication) throw new AppError(404, '用药记录不存在');
    return prisma.medication.update({ where: { id }, data });
  }

  async deleteMedication(id: string) {
    const medication = await prisma.medication.findUnique({ where: { id } });
    if (!medication) throw new AppError(404, '用药记录不存在');
    return prisma.medication.update({ where: { id }, data: { isActive: false } });
  }

  // Medical Checkups
  async getMedicalCheckups(elderlyProfileId: string) {
    return prisma.medicalCheckup.findMany({
      where: { elderlyProfileId },
      orderBy: { checkupDate: 'desc' },
    });
  }

  async createMedicalCheckup(data: {
    elderlyProfileId: string;
    hospitalName: string;
    checkupDate: Date;
    reportFileUrl?: string;
    summaryText?: string;
    resultsJson?: Record<string, unknown>;
  }) {
    return prisma.medicalCheckup.create({ data });
  }
}

export const healthService = new HealthService();
