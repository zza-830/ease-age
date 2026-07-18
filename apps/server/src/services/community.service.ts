import prisma from '../config/database';

export class CommunityService {
  // 创建帖子
  async createPost(data: {
    authorId: string;
    postType: string;
    title: string;
    content: string;
    imageUrls?: string[];
    tags?: string[];
  }) {
    return prisma.communityPost.create({
      data: {
        authorId: data.authorId,
        postType: data.postType,
        title: data.title,
        content: data.content,
        imageUrls: JSON.stringify(data.imageUrls || []),
        tagsJson: JSON.stringify(data.tags || []),
      },
    });
  }

  // 获取帖子列表
  async getPosts(filters: {
    postType?: string;
    search?: string;
    page?: number;
    pageSize?: number;
  }) {
    const where: any = { isPublished: true };
    if (filters.postType) where.postType = filters.postType;
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { content: { contains: filters.search } },
      ];
    }

    const page = filters.page || 1;
    const pageSize = filters.pageSize || 20;

    const [posts, total] = await Promise.all([
      prisma.communityPost.findMany({
        where,
        include: {
          author: { select: { id: true, fullName: true, avatarUrl: true } },
          _count: { select: { comments: true } },
        },
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.communityPost.count({ where }),
    ]);

    return { posts, total, page, pageSize };
  }

  // 获取帖子详情
  async getPostById(postId: string) {
    const post = await prisma.communityPost.update({
      where: { id: postId },
      data: { viewCount: { increment: 1 } },
      include: {
        author: { select: { id: true, fullName: true, avatarUrl: true } },
        comments: {
          include: { author: { select: { id: true, fullName: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    return post;
  }

  // 点赞
  async likePost(postId: string) {
    return prisma.communityPost.update({
      where: { id: postId },
      data: { likeCount: { increment: 1 } },
    });
  }

  // 添加评论
  async addComment(postId: string, authorId: string, content: string) {
    return prisma.communityComment.create({
      data: { postId, authorId, content },
      include: { author: { select: { id: true, fullName: true } } },
    });
  }

  // 删除帖子
  async deletePost(postId: string, authorId: string) {
    const post = await prisma.communityPost.findUnique({ where: { id: postId } });
    if (!post || post.authorId !== authorId) throw new Error('无权删除');
    return prisma.communityPost.delete({ where: { id: postId } });
  }

  // 获取帖子类型统计
  async getTypeStats() {
    const posts = await prisma.communityPost.findMany({
      where: { isPublished: true },
      select: { postType: true },
    });
    const stats: Record<string, number> = {};
    for (const p of posts) {
      stats[p.postType] = (stats[p.postType] || 0) + 1;
    }
    return stats;
  }
}

export const communityService = new CommunityService();
