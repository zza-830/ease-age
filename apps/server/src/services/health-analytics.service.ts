import prisma from '../config/database';

// 健康阈值配置
const HEALTH_THRESHOLDS = {
  blood_pressure: { systolic: { min: 90, max: 140 }, diastolic: { min: 60, max: 90 } },
  heart_rate: { min: 50, max: 100 },
  blood_sugar: { min: 3.9, max: 7.0 },
  body_temperature: { min: 36.0, max: 37.5 },
  blood_oxygen: { min: 95, max: 100 },
};

export class HealthAnalyticsService {
  // 健康趋势分析（最近N天）
  async getTrends(elderlyProfileId: string, days = 30) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const records = await prisma.healthRecord.findMany({
      where: {
        elderlyProfileId,
        measuredAt: { gte: since },
      },
      orderBy: { measuredAt: 'asc' },
    });

    // 按类型分组
    const grouped: Record<string, any[]> = {};
    for (const r of records) {
      const values = JSON.parse(r.measurementValueJson);
      if (!grouped[r.recordType]) grouped[r.recordType] = [];
      grouped[r.recordType].push({
        date: r.measuredAt.toISOString().split('T')[0],
        values,
        unit: r.measurementUnit,
      });
    }

    // 计算每种类型的统计信息
    const stats: Record<string, any> = {};
    for (const [type, data] of Object.entries(grouped)) {
      stats[type] = this.calculateStats(type, data);
    }

    return { trends: grouped, stats };
  }

  // 计算统计数据
  private calculateStats(type: string, data: any[]) {
    if (data.length === 0) return null;

    if (type === 'blood_pressure') {
      const systolics = data.map((d) => d.values.systolic);
      const diastolics = data.map((d) => d.values.diastolic);
      return {
        systolic: { avg: this.avg(systolics), min: Math.min(...systolics), max: Math.max(...systolics) },
        diastolic: { avg: this.avg(diastolics), min: Math.min(...diastolics), max: Math.max(...diastolics) },
        count: data.length,
        latest: data[data.length - 1],
      };
    }

    const values = data.map((d) => d.values.value || d.values);
    return {
      avg: this.avg(values),
      min: Math.min(...values),
      max: Math.max(...values),
      count: data.length,
      latest: data[data.length - 1],
    };
  }

  private avg(arr: number[]) {
    return arr.length ? +(arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : 0;
  }

  // 健康异常检测
  async detectAnomalies(elderlyProfileId: string) {
    const recentRecords = await prisma.healthRecord.findMany({
      where: { elderlyProfileId },
      orderBy: { measuredAt: 'desc' },
      take: 30,
    });

    const anomalies: Array<{
      type: string;
      severity: 'warning' | 'critical';
      message: string;
      value: any;
      threshold: any;
      measuredAt: Date;
    }> = [];

    for (const record of recentRecords) {
      const values = JSON.parse(record.measurementValueJson);
      const anomaly = this.checkThreshold(record.recordType, values);
      if (anomaly) {
        anomalies.push({
          ...anomaly,
          measuredAt: record.measuredAt,
        });
      }
    }

    return anomalies;
  }

  private checkThreshold(type: string, values: any): { type: string; severity: 'warning' | 'critical'; message: string; value: any; threshold: any } | null {
    switch (type) {
      case 'blood_pressure': {
        const t = HEALTH_THRESHOLDS.blood_pressure;
        if (values.systolic > t.systolic.max || values.diastolic > t.diastolic.max) {
          return {
            type,
            severity: values.systolic > 160 ? 'critical' : 'warning',
            message: `血压偏高: ${values.systolic}/${values.diastolic} mmHg`,
            value: values,
            threshold: t,
          };
        }
        if (values.systolic < t.systolic.min || values.diastolic < t.diastolic.min) {
          return {
            type,
            severity: 'warning',
            message: `血压偏低: ${values.systolic}/${values.diastolic} mmHg`,
            value: values,
            threshold: t,
          };
        }
        break;
      }
      case 'heart_rate': {
        const t = HEALTH_THRESHOLDS.heart_rate;
        if (values.value > t.max) return { type, severity: values.value > 120 ? 'critical' : 'warning', message: `心率偏快: ${values.value} bpm`, value: values, threshold: t };
        if (values.value < t.min) return { type, severity: values.value < 40 ? 'critical' : 'warning', message: `心率偏慢: ${values.value} bpm`, value: values, threshold: t };
        break;
      }
      case 'blood_sugar': {
        const t = HEALTH_THRESHOLDS.blood_sugar;
        if (values.value > t.max) return { type, severity: values.value > 10 ? 'critical' : 'warning', message: `血糖偏高: ${values.value} mmol/L`, value: values, threshold: t };
        if (values.value < t.min) return { type, severity: 'critical', message: `血糖偏低: ${values.value} mmol/L`, value: values, threshold: t };
        break;
      }
      case 'body_temperature': {
        const t = HEALTH_THRESHOLDS.body_temperature;
        if (values.value > t.max) return { type, severity: values.value > 38.5 ? 'critical' : 'warning', message: `体温偏高: ${values.value}°C`, value: values, threshold: t };
        break;
      }
      case 'blood_oxygen': {
        const t = HEALTH_THRESHOLDS.blood_oxygen;
        if (values.value < t.min) return { type, severity: values.value < 90 ? 'critical' : 'warning', message: `血氧偏低: ${values.value}%`, value: values, threshold: t };
        break;
      }
    }
    return null;
  }

  // 生成健康报告摘要
  async generateSummary(elderlyProfileId: string) {
    const [trends, anomalies, medications, checkups] = await Promise.all([
      this.getTrends(elderlyProfileId, 30),
      this.detectAnomalies(elderlyProfileId),
      prisma.medication.findMany({ where: { elderlyProfileId, isActive: true } }),
      prisma.medicalCheckup.findMany({
        where: { elderlyProfileId },
        orderBy: { checkupDate: 'desc' },
        take: 1,
      }),
    ]);

    return {
      period: '近30天',
      trends: trends.stats,
      anomalyCount: anomalies.length,
      anomalies: anomalies.slice(0, 5),
      medicationCount: medications.length,
      latestCheckup: checkups[0] || null,
    };
  }
}

export const healthAnalyticsService = new HealthAnalyticsService();
