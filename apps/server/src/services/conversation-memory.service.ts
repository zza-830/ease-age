import prisma from '../config/database';

// 对话记忆管理 - 让AI记住老人的偏好和上下文
export class ConversationMemoryService {
  // 获取老人的对话上下文摘要
  async getMemoryContext(elderlyProfileId: string): Promise<string> {
    const [recentLogs, preferences, familyInfo, healthSummary, routines] = await Promise.all([
      // 最近的对话记录
      prisma.aiConversationLog.findMany({
        where: { elderlyProfileId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      // 知识图谱偏好节点
      prisma.kgNode.findMany({
        where: { elderlyProfileId, nodeType: 'preference' },
        take: 10,
      }),
      // 家属信息
      prisma.familyRelation.findMany({
        where: { elderlyProfileId },
        include: { user: { select: { fullName: true } } },
      }),
      // 最新健康数据
      prisma.healthRecord.findMany({
        where: { elderlyProfileId },
        orderBy: { measuredAt: 'desc' },
        take: 6,
      }),
      // 日常作息
      prisma.dailyRoutine.findMany({
        where: { elderlyProfileId, isActive: true },
        orderBy: { timeOfDay: 'asc' },
      }),
    ]);

    const parts: string[] = [];

    // 家庭信息
    if (familyInfo.length > 0) {
      const family = familyInfo.map((f) => `${f.user.fullName}(${f.relationshipType})`).join('、');
      parts.push(`【家庭】${family}`);
    }

    // 个人偏好
    if (preferences.length > 0) {
      const prefs = preferences.map((p) => p.label).join('、');
      parts.push(`【喜好】${prefs}`);
    }

    // 健康概况
    if (healthSummary.length > 0) {
      const summary = healthSummary.map((r) => {
        const values = JSON.parse(r.measurementValueJson);
        if (r.recordType === 'blood_pressure') return `血压${values.systolic}/${values.diastolic}`;
        if (r.recordType === 'heart_rate') return `心率${values.value}`;
        if (r.recordType === 'blood_sugar') return `血糖${values.value}`;
        return null;
      }).filter(Boolean).join('、');
      if (summary) parts.push(`【最新体征】${summary}`);
    }

    // 日常作息
    if (routines.length > 0) {
      const schedule = routines.slice(0, 8).map((r) => `${r.timeOfDay}${r.activity}`).join('、');
      parts.push(`【作息】${schedule}`);
    }

    // 最近对话主题
    if (recentLogs.length > 0) {
      const recentTopics = recentLogs
        .filter((l) => l.role === 'user')
        .slice(0, 5)
        .map((l) => l.contentText.substring(0, 30))
        .join('；');
      if (recentTopics) parts.push(`【最近话题】${recentTopics}`);
    }

    return parts.join('\n');
  }

  // 记录对话
  async logConversation(elderlyProfileId: string, sessionId: string, role: string, content: string) {
    return prisma.aiConversationLog.create({
      data: {
        elderlyProfileId,
        sessionId,
        role,
        contentText: content,
      },
    });
  }

  // 获取对话历史
  async getHistory(elderlyProfileId: string, sessionId?: string, limit = 50) {
    const where: any = { elderlyProfileId };
    if (sessionId) where.sessionId = sessionId;

    return prisma.aiConversationLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  // 获取会话列表
  async getSessions(elderlyProfileId: string) {
    const logs = await prisma.aiConversationLog.findMany({
      where: { elderlyProfileId },
      orderBy: { createdAt: 'desc' },
      select: { sessionId: true, createdAt: true, contentText: true, role: true },
    });

    // 按sessionId分组
    const sessionMap = new Map<string, { firstMessage: string; lastTime: Date; count: number }>();
    for (const log of logs) {
      if (!sessionMap.has(log.sessionId)) {
        sessionMap.set(log.sessionId, {
          firstMessage: log.contentText.substring(0, 50),
          lastTime: log.createdAt,
          count: 1,
        });
      } else {
        const session = sessionMap.get(log.sessionId)!;
        session.count++;
      }
    }

    return Array.from(sessionMap.entries()).map(([id, info]) => ({
      sessionId: id,
      ...info,
    }));
  }

  // 清理旧对话（保留最近N天）
  async cleanup(elderlyProfileId: string, keepDays = 90) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - keepDays);

    return prisma.aiConversationLog.deleteMany({
      where: {
        elderlyProfileId,
        createdAt: { lt: cutoff },
      },
    });
  }
}

export const conversationMemoryService = new ConversationMemoryService();
