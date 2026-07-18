import prisma from '../config/database';

export class CheckinService {
  // 每日签到
  async checkin(data: {
    elderlyProfileId: string;
    moodScore?: number;
    sleepQuality?: number;
    appetiteLevel?: number;
    activityLevel?: number;
    notes?: string;
  }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return prisma.dailyCheckin.upsert({
      where: {
        elderlyProfileId_checkinDate: {
          elderlyProfileId: data.elderlyProfileId,
          checkinDate: today,
        },
      },
      update: {
        moodScore: data.moodScore,
        sleepQuality: data.sleepQuality,
        appetiteLevel: data.appetiteLevel,
        activityLevel: data.activityLevel,
        notes: data.notes,
      },
      create: {
        elderlyProfileId: data.elderlyProfileId,
        checkinDate: today,
        moodScore: data.moodScore,
        sleepQuality: data.sleepQuality,
        appetiteLevel: data.appetiteLevel,
        activityLevel: data.activityLevel,
        notes: data.notes,
      },
    });
  }

  // 获取签到历史
  async getHistory(elderlyProfileId: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    return prisma.dailyCheckin.findMany({
      where: {
        elderlyProfileId,
        checkinDate: { gte: since },
      },
      orderBy: { checkinDate: 'desc' },
    });
  }

  // 获取签到统计
  async getStats(elderlyProfileId: string, days = 30) {
    const records = await this.getHistory(elderlyProfileId, days);
    if (records.length === 0) return null;

    const avg = (arr: (number | null)[]) => {
      const valid = arr.filter((v): v is number => v !== null);
      return valid.length ? +(valid.reduce((a, b) => a + b, 0) / valid.length).toFixed(1) : 0;
    };

    return {
      totalDays: records.length,
      avgMood: avg(records.map((r) => r.moodScore)),
      avgSleep: avg(records.map((r) => r.sleepQuality)),
      avgAppetite: avg(records.map((r) => r.appetiteLevel)),
      avgActivity: avg(records.map((r) => r.activityLevel)),
      streak: this.calculateStreak(records),
    };
  }

  private calculateStreak(records: { checkinDate: Date }[]) {
    if (records.length === 0) return 0;
    let streak = 1;
    for (let i = 1; i < records.length; i++) {
      const diff = records[i - 1].checkinDate.getTime() - records[i].checkinDate.getTime();
      if (diff <= 86400000) streak++;
      else break;
    }
    return streak;
  }
}

// 情绪记录服务
export class MoodService {
  async record(data: {
    elderlyProfileId: string;
    moodType: string;
    intensity: number;
    trigger?: string;
    notes?: string;
  }) {
    return prisma.moodRecord.create({
      data: {
        elderlyProfileId: data.elderlyProfileId,
        moodType: data.moodType,
        intensity: Math.min(5, Math.max(1, data.intensity)),
        trigger: data.trigger,
        notes: data.notes,
      },
    });
  }

  async getHistory(elderlyProfileId: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    return prisma.moodRecord.findMany({
      where: { elderlyProfileId, recordedAt: { gte: since } },
      orderBy: { recordedAt: 'desc' },
    });
  }

  async getDistribution(elderlyProfileId: string, days = 30) {
    const records = await this.getHistory(elderlyProfileId, days);
    const dist: Record<string, number> = {};
    for (const r of records) {
      dist[r.moodType] = (dist[r.moodType] || 0) + 1;
    }
    return dist;
  }
}

export const checkinService = new CheckinService();
export const moodService = new MoodService();
