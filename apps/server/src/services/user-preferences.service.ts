import prisma from '../config/database';

// 用户偏好设置服务
export class UserPreferencesService {
  // 获取用户设置（存储在 user.avatarUrl 字段的 JSON 中，或新建表）
  // 这里使用一个简单的 key-value 方式存储在 ElderlyProfile 的 medicalHistoryJson 字段中
  // 实际生产环境应该有单独的 UserPreferences 表

  private defaultPreferences: Record<string, any> = {
    // 通知设置
    notification_enabled: true,
    notification_health_alert: true,
    notification_medication_reminder: true,
    notification_family_message: true,
    notification_service_update: true,
    notification_community: false,

    // 用药提醒
    medication_reminder_enabled: true,
    medication_reminder_advance_minutes: 15,
    medication_reminder_sound: true,

    // 健康预警阈值
    health_bp_systolic_max: 140,
    health_bp_systolic_min: 90,
    health_bp_diastolic_max: 90,
    health_bp_diastolic_min: 60,
    health_heart_rate_max: 100,
    health_heart_rate_min: 50,
    health_blood_sugar_max: 7.0,
    health_blood_sugar_min: 3.9,
    health_temperature_max: 37.5,
    health_oxygen_min: 95,

    // 显示设置
    display_font_size: 'medium', // small | medium | large
    display_high_contrast: false,
    display_language: 'zh-CN',

    // 隐私设置
    privacy_share_health_with_family: true,
    privacy_share_location_with_family: true,
    privacy_allow_data_export: true,

    // AI 助手设置
    ai_voice_enabled: true,
    ai_voice_name: '冰糖',
    ai_auto_greeting: true,
    ai_health_report_daily: true,
  };

  async getPreferences(userId: string): Promise<Record<string, any>> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return this.defaultPreferences;

    try {
      // 尝试从 avatarUrl 字段读取 JSON 配置（临时方案）
      const saved = user.avatarUrl ? JSON.parse(user.avatarUrl) : {};
      return { ...this.defaultPreferences, ...saved };
    } catch {
      return this.defaultPreferences;
    }
  }

  async updatePreference(userId: string, key: string, value: any) {
    const current = await this.getPreferences(userId);
    current[key] = value;

    // 临时存储到 avatarUrl 字段（生产环境应使用单独的表）
    return prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: JSON.stringify(current) },
    });
  }

  async updateMultiple(userId: string, updates: Record<string, any>) {
    const current = await this.getPreferences(userId);
    const merged = { ...current, ...updates };

    return prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: JSON.stringify(merged) },
    });
  }

  async resetToDefault(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { avatarUrl: JSON.stringify(this.defaultPreferences) },
    });
  }

  // 获取健康预警配置
  async getHealthThresholds(userId: string) {
    const prefs = await this.getPreferences(userId);
    return {
      blood_pressure: {
        systolic: { min: prefs.health_bp_systolic_min, max: prefs.health_bp_systolic_max },
        diastolic: { min: prefs.health_bp_diastolic_min, max: prefs.health_bp_diastolic_max },
      },
      heart_rate: { min: prefs.health_heart_rate_min, max: prefs.health_heart_rate_max },
      blood_sugar: { min: prefs.health_blood_sugar_min, max: prefs.health_blood_sugar_max },
      temperature: { max: prefs.health_temperature_max },
      blood_oxygen: { min: prefs.health_oxygen_min },
    };
  }
}

export const userPreferencesService = new UserPreferencesService();
