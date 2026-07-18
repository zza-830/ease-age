import prisma from '../config/database';

export class NotificationService {
  // 创建通知
  async create(data: {
    userId: string;
    notificationType: string;
    title: string;
    content: string;
    priority?: string;
    actionUrl?: string;
    metadataJson?: string;
  }) {
    return prisma.notification.create({
      data: {
        userId: data.userId,
        notificationType: data.notificationType,
        title: data.title,
        content: data.content,
        priority: data.priority || 'normal',
        actionUrl: data.actionUrl,
        metadataJson: data.metadataJson || '{}',
      },
    });
  }

  // 获取用户通知列表
  async getByUser(userId: string, unreadOnly = false, page = 1, pageSize = 20) {
    const where: any = { userId };
    if (unreadOnly) where.isRead = false;

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.notification.count({ where }),
    ]);

    return { notifications, total, page, pageSize };
  }

  // 标记为已读
  async markAsRead(notificationId: string) {
    return prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
  }

  // 标记全部已读
  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  // 获取未读数量
  async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  // 删除通知
  async delete(notificationId: string) {
    return prisma.notification.delete({ where: { id: notificationId } });
  }

  // 批量创建健康预警通知
  async createHealthAlert(userId: string, elderlyProfileId: string, alertType: string, message: string) {
    // 创建预警记录
    await prisma.healthAlert.create({
      data: {
        elderlyProfileId,
        alertType,
        severity: alertType.includes('critical') ? 'critical' : 'warning',
        recordValue: '{}',
        thresholdValue: '{}',
        message,
      },
    });

    // 创建通知
    return this.create({
      userId,
      notificationType: 'health_alert',
      title: '健康预警',
      content: message,
      priority: 'high',
      actionUrl: '/health',
    });
  }
}

export const notificationService = new NotificationService();
