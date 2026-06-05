import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class ServiceService {
  async getCategories() {
    return prisma.serviceCategory.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async getServices(categoryId?: string, page = 1, pageSize = 20) {
    const where = { isActive: true, ...(categoryId && { categoryId }) };
    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        include: { category: true },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.service.count({ where }),
    ]);
    return { items: services, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async getServiceById(id: string) {
    const service = await prisma.service.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!service) throw new AppError(404, '服务不存在');
    return service;
  }

  async createOrder(data: {
    userId: string;
    elderlyProfileId: string;
    serviceId: string;
    totalAmount: number;
    scheduledServiceTime: Date;
    serviceAddress: string;
    specialInstructions?: string;
  }) {
    const orderNumber = `EA${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    return prisma.serviceOrder.create({
      data: { ...data, orderNumber },
      include: { service: true, elderlyProfile: true },
    });
  }

  async getOrders(userId: string, page = 1, pageSize = 20) {
    const [orders, total] = await Promise.all([
      prisma.serviceOrder.findMany({
        where: { userId },
        include: { service: true, elderlyProfile: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.serviceOrder.count({ where: { userId } }),
    ]);
    return { items: orders, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async getOrderById(id: string) {
    const order = await prisma.serviceOrder.findUnique({
      where: { id },
      include: { service: true, elderlyProfile: true, user: true },
    });
    if (!order) throw new AppError(404, '订单不存在');
    return order;
  }

  async updateOrderStatus(id: string, status: string) {
    const order = await prisma.serviceOrder.findUnique({ where: { id } });
    if (!order) throw new AppError(404, '订单不存在');
    return prisma.serviceOrder.update({
      where: { id },
      data: { orderStatus: status },
    });
  }

  async reviewOrder(id: string, rating: number, reviewText: string) {
    const order = await prisma.serviceOrder.findUnique({ where: { id } });
    if (!order) throw new AppError(404, '订单不存在');
    if (order.orderStatus !== 'completed') throw new AppError(400, '只能评价已完成的订单');
    return prisma.serviceOrder.update({
      where: { id },
      data: { customerRating: rating, reviewText },
    });
  }
}

export const serviceService = new ServiceService();
