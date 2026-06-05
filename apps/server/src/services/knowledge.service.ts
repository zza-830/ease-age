import prisma from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class KnowledgeService {
  async getCategories() {
    return prisma.knowledgeCategory.findMany({
      orderBy: { displayOrder: 'asc' },
      include: { children: true },
    });
  }

  async getArticles(categoryId?: string, page = 1, pageSize = 20, search?: string) {
    const where: any = { isPublished: true };
    if (categoryId) where.categoryId = categoryId;
    if (search) where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { summaryText: { contains: search, mode: 'insensitive' } },
    ];

    const [articles, total] = await Promise.all([
      prisma.knowledgeArticle.findMany({
        where,
        include: { category: true },
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.knowledgeArticle.count({ where }),
    ]);
    return { items: articles, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async getArticleById(id: string) {
    const article = await prisma.knowledgeArticle.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
      include: { category: true },
    });
    if (!article || !article.isPublished) throw new AppError(404, '文章不存在');
    return article;
  }

  async getFamilyMemories(elderlyProfileId: string) {
    return prisma.familyMemory.findMany({
      where: { elderlyProfileId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createFamilyMemory(data: {
    elderlyProfileId: string;
    familyUserId: string;
    memoryType: string;
    contentText?: string;
    fileUrl?: string;
    descriptionText?: string;
  }) {
    return prisma.familyMemory.create({ data });
  }

  async deleteFamilyMemory(id: string) {
    const memory = await prisma.familyMemory.findUnique({ where: { id } });
    if (!memory) throw new AppError(404, '记忆不存在');
    return prisma.familyMemory.delete({ where: { id } });
  }
}

export const knowledgeService = new KnowledgeService();
