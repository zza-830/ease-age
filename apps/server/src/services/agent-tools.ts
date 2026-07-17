import prisma from '../config/database';

// ─── 工具定义 ───
export const AGENT_TOOLS = [
  {
    type: 'function' as const,
    function: {
      name: 'get_weather',
      description: '查询指定城市的天气信息',
      parameters: {
        type: 'object',
        properties: {
          city: { type: 'string', description: '城市名称，如"广州"' },
        },
        required: ['city'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_health_records',
      description: '查询老人的最新健康体征数据（血压、心率、血糖等）',
      parameters: {
        type: 'object',
        properties: {
          recordType: {
            type: 'string',
            enum: ['blood_pressure', 'heart_rate', 'blood_sugar', 'body_temperature', 'blood_oxygen', 'weight', 'all'],
            description: '体征类型，all表示全部',
          },
        },
        required: ['recordType'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_daily_routine',
      description: '查询老人的日常作息安排',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_important_dates',
      description: '查询老人的重要日期（生日、纪念日、节日等）',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_medications',
      description: '查询老人的用药信息',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_family_info',
      description: '查询老人的家属信息',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'get_current_time',
      description: '获取当前日期和时间',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
];

// ─── 工具执行器 ───
export async function executeTool(
  toolName: string,
  args: Record<string, any>,
  elderlyProfileId: string
): Promise<string> {
  switch (toolName) {
    case 'get_weather':
      return getWeather(args.city);

    case 'get_health_records':
      return getHealthRecords(elderlyProfileId, args.recordType);

    case 'get_daily_routine':
      return getDailyRoutine(elderlyProfileId);

    case 'get_important_dates':
      return getImportantDates(elderlyProfileId);

    case 'get_medications':
      return getMedications(elderlyProfileId);

    case 'get_family_info':
      return getFamilyInfo(elderlyProfileId);

    case 'get_current_time':
      return getCurrentTime();

    default:
      return JSON.stringify({ error: `未知工具: ${toolName}` });
  }
}

// ─── 天气查询（使用和风天气免费API） ───
async function getWeather(city: string): Promise<string> {
  try {
    // 使用 wttr.in 免费天气API
    const resp = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1&lang=zh`);
    if (!resp.ok) return JSON.stringify({ error: '天气查询失败' });
    const data = await resp.json() as any;
    const current = data.current_condition?.[0];
    if (!current) return JSON.stringify({ error: '未获取到天气数据' });

    const desc = current.lang_zh?.[0]?.value || current.weatherDesc?.[0]?.value || '未知';
    return JSON.stringify({
      city,
      temperature: current.temp_C + '°C',
      feelsLike: current.FeelsLikeC + '°C',
      humidity: current.humidity + '%',
      windSpeed: current.windspeedKmph + 'km/h',
      description: desc,
      advice: Number(current.temp_C) < 15 ? '天气较冷，注意保暖' : Number(current.temp_C) > 35 ? '天气炎热，注意防暑' : '天气不错，适合活动',
    });
  } catch (e) {
    return JSON.stringify({ error: '天气查询失败', detail: String(e) });
  }
}

// ─── 健康记录查询 ───
async function getHealthRecords(elderlyProfileId: string, recordType: string): Promise<string> {
  try {
    const where: any = { elderlyProfileId };
    if (recordType !== 'all') where.recordType = recordType;

    const records = await prisma.healthRecord.findMany({
      where,
      orderBy: { measuredAt: 'desc' },
      take: recordType === 'all' ? 6 : 5,
    });

    const result = records.map((r) => {
      const values = JSON.parse(r.measurementValueJson);
      return {
        type: r.recordType,
        values,
        unit: r.measurementUnit,
        time: r.measuredAt.toISOString(),
      };
    });

    return JSON.stringify({ records: result });
  } catch (e) {
    return JSON.stringify({ error: '查询健康数据失败' });
  }
}

// ─── 日常作息 ───
async function getDailyRoutine(elderlyProfileId: string): Promise<string> {
  try {
    const routines = await prisma.dailyRoutine.findMany({
      where: { elderlyProfileId, isActive: true },
      orderBy: { timeOfDay: 'asc' },
    });
    return JSON.stringify({
      routines: routines.map((r) => ({
        time: r.timeOfDay,
        activity: r.activity,
      })),
    });
  } catch (e) {
    return JSON.stringify({ error: '查询作息失败' });
  }
}

// ─── 重要日期 ───
async function getImportantDates(elderlyProfileId: string): Promise<string> {
  try {
    const dates = await prisma.importantDate.findMany({
      where: { elderlyProfileId },
    });
    return JSON.stringify({
      dates: dates.map((d) => ({
        label: d.label,
        date: d.monthDay,
        type: d.dateType,
        isLunar: d.isLunar,
        notes: d.notes,
      })),
    });
  } catch (e) {
    return JSON.stringify({ error: '查询重要日期失败' });
  }
}

// ─── 用药信息 ───
async function getMedications(elderlyProfileId: string): Promise<string> {
  try {
    const meds = await prisma.medication.findMany({
      where: { elderlyProfileId, isActive: true },
    });
    return JSON.stringify({
      medications: meds.map((m) => ({
        name: m.medicationName,
        dosage: m.dosageDescription,
        frequency: m.frequencyDescription,
        schedule: JSON.parse(m.reminderScheduleJson || '[]'),
      })),
    });
  } catch (e) {
    return JSON.stringify({ error: '查询用药信息失败' });
  }
}

// ─── 家属信息 ───
async function getFamilyInfo(elderlyProfileId: string): Promise<string> {
  try {
    const relations = await prisma.familyRelation.findMany({
      where: { elderlyProfileId },
      include: { user: { select: { fullName: true, phoneNumber: true } } },
    });
    return JSON.stringify({
      family: relations.map((r) => ({
        name: r.user.fullName,
        relationship: r.relationshipType,
        phone: r.user.phoneNumber,
        isPrimaryContact: r.isPrimaryContact,
      })),
    });
  } catch (e) {
    return JSON.stringify({ error: '查询家属信息失败' });
  }
}

// ─── 当前时间 ───
function getCurrentTime(): string {
  const now = new Date();
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  return JSON.stringify({
    datetime: now.toLocaleString('zh-CN'),
    date: now.toLocaleDateString('zh-CN'),
    time: now.toLocaleTimeString('zh-CN'),
    weekday: '星期' + weekdays[now.getDay()],
  });
}
