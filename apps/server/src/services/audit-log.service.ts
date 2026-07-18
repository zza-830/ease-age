import prisma from '../config/database';

export class AuditLogService {
  // 记录审计日志
  async log(data: {
    userId?: string;
    action: string;
    resource: string;
    resourceId?: string;
    detail?: Record<string, any>;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        resource: data.resource,
        resourceId: data.resourceId,
        detailJson: JSON.stringify(data.detail || {}),
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
      },
    });
  }

  // 查询审计日志
  async query(filters: {
    userId?: string;
    action?: string;
    resource?: string;
    startDate?: Date;
    endDate?: Date;
    page?: number;
    pageSize?: number;
  }) {
    const where: any = {};
    if (filters.userId) where.userId = filters.userId;
    if (filters.action) where.action = filters.action;
    if (filters.resource) where.resource = filters.resource;
    if (filters.startDate || filters.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    const page = filters.page || 1;
    const pageSize = filters.pageSize || 50;

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { logs, total, page, pageSize };
  }

  // 统计操作频率
  async getActionStats(userId?: string, days = 7) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const where: any = { createdAt: { gte: since } };
    if (userId) where.userId = userId;

    const logs = await prisma.auditLog.findMany({
      where,
      select: { action: true },
    });

    const stats: Record<string, number> = {};
    for (const log of logs) {
      stats[log.action] = (stats[log.action] || 0) + 1;
    }

    return stats;
  }
}

export const auditLogService = new AuditLogService();
