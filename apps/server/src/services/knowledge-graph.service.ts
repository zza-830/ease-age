import prisma from '../config/database';

export class KnowledgeGraphService {
  // 获取老人的全部知识图谱节点
  async getNodes(elderlyProfileId: string, nodeType?: string) {
    const where: any = { elderlyProfileId };
    if (nodeType) where.nodeType = nodeType;
    return prisma.kgNode.findMany({
      where,
      orderBy: { importance: 'desc' },
    });
  }

  // 获取节点的关系
  async getEdges(elderlyProfileId: string, nodeId?: string) {
    if (nodeId) {
      return prisma.kgEdge.findMany({
        where: {
          OR: [{ sourceId: nodeId }, { targetId: nodeId }],
        },
        include: { sourceNode: true, targetNode: true },
      });
    }
    // 返回该老人所有边
    const nodes = await prisma.kgNode.findMany({
      where: { elderlyProfileId },
      select: { id: true },
    });
    const nodeIds = nodes.map((n) => n.id);
    return prisma.kgEdge.findMany({
      where: {
        sourceId: { in: nodeIds },
      },
      include: { sourceNode: true, targetNode: true },
    });
  }

  // 获取完整的知识图谱（节点 + 边）
  async getFullGraph(elderlyProfileId: string) {
    const [nodes, edges] = await Promise.all([
      this.getNodes(elderlyProfileId),
      this.getEdges(elderlyProfileId),
    ]);
    return { nodes, edges };
  }

  // 按类型分组获取节点
  async getNodesGrouped(elderlyProfileId: string) {
    const nodes = await this.getNodes(elderlyProfileId);
    const grouped: Record<string, any[]> = {};
    for (const node of nodes) {
      if (!grouped[node.nodeType]) grouped[node.nodeType] = [];
      grouped[node.nodeType].push(node);
    }
    return grouped;
  }

  // 日常作息
  async getRoutines(elderlyProfileId: string) {
    return prisma.dailyRoutine.findMany({
      where: { elderlyProfileId, isActive: true },
      orderBy: { timeOfDay: 'asc' },
    });
  }

  // 重要日期
  async getImportantDates(elderlyProfileId: string) {
    return prisma.importantDate.findMany({
      where: { elderlyProfileId },
      orderBy: { monthDay: 'asc' },
    });
  }

  // 生活事件
  async getLifeEvents(elderlyProfileId: string) {
    return prisma.lifeEvent.findMany({
      where: { elderlyProfileId },
      orderBy: { eventDate: 'desc' },
    });
  }

  // AI 对话日志
  async getAiConversationLogs(elderlyProfileId: string, sessionId?: string) {
    const where: any = { elderlyProfileId };
    if (sessionId) where.sessionId = sessionId;
    return prisma.aiConversationLog.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });
  }
}

export const knowledgeGraphService = new KnowledgeGraphService();
