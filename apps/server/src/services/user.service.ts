import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class UserService {
  async getElderlyProfile(userId: string) {
    const profile = await prisma.elderlyProfile.findUnique({
      where: { userId },
      include: {
        familyRelations: { include: { user: true } },
        healthRecords: { orderBy: { measuredAt: 'desc' }, take: 10 },
        medications: { where: { isActive: true } },
      },
    });
    if (!profile) throw new AppError(404, '老人档案不存在');
    return profile;
  }

  async createElderlyProfile(data: {
    userId: string;
    fullName: string;
    gender?: string;
    birthDate?: Date;
    residentialAddress?: string;
    emergencyContactPhone?: string;
    bloodType?: string;
  }) {
    const existing = await prisma.elderlyProfile.findUnique({ where: { userId: data.userId } });
    if (existing) throw new AppError(400, '老人档案已存在');
    return prisma.elderlyProfile.create({ data });
  }

  async updateElderlyProfile(userId: string, data: Partial<{
    fullName: string;
    gender: string;
    birthDate: Date;
    residentialAddress: string;
    emergencyContactPhone: string;
    medicalHistoryJson: Record<string, unknown>;
    allergyDescription: string;
    bloodType: string;
  }>) {
    const profile = await prisma.elderlyProfile.findUnique({ where: { userId } });
    if (!profile) throw new AppError(404, '老人档案不存在');
    return prisma.elderlyProfile.update({ where: { userId }, data });
  }

  async addFamilyRelation(data: {
    userId: string;
    elderlyProfileId: string;
    relationshipType: string;
    isPrimaryContact?: boolean;
  }) {
    const existing = await prisma.familyRelation.findUnique({
      where: {
        userId_elderlyProfileId: {
          userId: data.userId,
          elderlyProfileId: data.elderlyProfileId,
        },
      },
    });
    if (existing) throw new AppError(400, '该家属关系已存在');
    return prisma.familyRelation.create({ data });
  }

  async getFamilyRelations(elderlyProfileId: string) {
    return prisma.familyRelation.findMany({
      where: { elderlyProfileId },
      include: { user: true },
    });
  }

  async removeFamilyRelation(id: string) {
    const relation = await prisma.familyRelation.findUnique({ where: { id } });
    if (!relation) throw new AppError(404, '家属关系不存在');
    return prisma.familyRelation.delete({ where: { id } });
  }
}

export const userService = new UserService();
