import { useState } from 'react';
import {
  Heart,
  Activity,
  Pill,
  Footprints,
  Moon,
  Droplets,
  Thermometer,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Phone,
  Calendar,
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { cn } from '@/lib/utils';

// ─── 个人健康趋势数据（近7天） ───
const weeklyHealthData = [
  { day: '周一', systolic: 128, diastolic: 82, heartRate: 72, bloodSugar: 5.8 },
  { day: '周二', systolic: 125, diastolic: 80, heartRate: 70, bloodSugar: 6.1 },
  { day: '周三', systolic: 130, diastolic: 84, heartRate: 74, bloodSugar: 5.9 },
  { day: '周四', systolic: 122, diastolic: 78, heartRate: 68, bloodSugar: 5.6 },
  { day: '周五', systolic: 126, diastolic: 81, heartRate: 71, bloodSugar: 6.0 },
  { day: '周六', systolic: 124, diastolic: 79, heartRate: 69, bloodSugar: 5.7 },
  { day: '周日', systolic: 127, diastolic: 82, heartRate: 73, bloodSugar: 5.8 },
];

// 用药记录
const medicationData = [
  { day: '周一', taken: 2, total: 2 },
  { day: '周二', taken: 2, total: 2 },
  { day: '周三', taken: 1, total: 2 },
  { day: '周四', taken: 2, total: 2 },
  { day: '周五', taken: 2, total: 2 },
  { day: '周六', taken: 2, total: 2 },
  { day: '周日', taken: 2, total: 2 },
];

// AI 对话统计
const aiChatData = [
  { day: '周一', duration: 15, topics: 3 },
  { day: '周二', duration: 22, topics: 5 },
  { day: '周三', duration: 8, topics: 2 },
  { day: '周四', duration: 18, topics: 4 },
  { day: '周五', duration: 25, topics: 6 },
  { day: '周六', duration: 30, topics: 7 },
  { day: '周日', duration: 20, topics: 4 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white rounded-lg shadow-lg border p-3">
        <p className="font-medium text-stone-900 mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// 指标卡片
function MetricCard({
  icon: Icon,
  label,
  value,
  unit,
  trend,
  trendLabel,
  color,
}: {
  icon: any;
  label: string;
  value: string | number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendLabel: string;
  color: string;
}) {
  const colorMap: Record<string, { bg: string; text: string }> = {
    red: { bg: 'bg-red-50', text: 'text-red-600' },
    blue: { bg: 'bg-blue-50', text: 'text-blue-600' },
    green: { bg: 'bg-emerald-50', text: 'text-emerald-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600' },
    purple: { bg: 'bg-violet-50', text: 'text-violet-600' },
    teal: { bg: 'bg-teal-50', text: 'text-teal-600' },
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-stone-500">{label}</p>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-stone-900">{value}</span>
            <span className="text-sm text-stone-400">{unit}</span>
          </div>
          <div className="mt-2 flex items-center text-xs">
            {trend === 'up' ? (
              <ArrowUpRight className="mr-0.5 h-3 w-3 text-green-500" />
            ) : trend === 'down' ? (
              <ArrowDownRight className="mr-0.5 h-3 w-3 text-red-500" />
            ) : null}
            <span
              className={cn(
                'font-medium',
                trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-stone-500'
              )}
            >
              {trendLabel}
            </span>
          </div>
        </div>
        <div className={cn('rounded-xl p-3', c.bg)}>
          <Icon className={cn('h-5 w-5', c.text)} />
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">健康总览</h2>
          <p className="text-stone-500">张秀兰 · 近期健康数据与生活分析</p>
        </div>
        <div className="flex rounded-lg border overflow-hidden">
          {(['week', 'month'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors',
                timeRange === range ? 'bg-orange-500 text-white' : 'text-stone-600 hover:bg-stone-50'
              )}
            >
              {range === 'week' ? '本周' : '本月'}
            </button>
          ))}
        </div>
      </div>

      {/* 指标卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          icon={Heart}
          label="今日血压"
          value="124/79"
          unit="mmHg"
          trend="down"
          trendLabel="较昨日 -2"
          color="red"
        />
        <MetricCard
          icon={Activity}
          label="今日心率"
          value="69"
          unit="bpm"
          trend="stable"
          trendLabel="正常范围"
          color="blue"
        />
        <MetricCard
          icon={Droplets}
          label="今日血糖"
          value="5.7"
          unit="mmol/L"
          trend="down"
          trendLabel="控制良好"
          color="amber"
        />
        <MetricCard
          icon={Pill}
          label="今日用药"
          value="2/2"
          unit="次"
          trend="up"
          trendLabel="按时服用"
          color="green"
        />
      </div>

      {/* 血压心率趋势 */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-stone-900">血压趋势</h3>
            <p className="text-sm text-stone-500">近7天收缩压 / 舒张压变化</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={weeklyHealthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} domain={[60, 150]} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="systolic"
                name="收缩压"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="diastolic"
                name="舒张压"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 用药依从性 */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-stone-900">用药记录</h3>
            <p className="text-sm text-stone-500">本周服药情况</p>
          </div>
          <div className="space-y-3">
            {medicationData.map((item) => {
              const rate = item.taken / item.total;
              return (
                <div key={item.day} className="flex items-center gap-3">
                  <span className="w-8 text-xs text-stone-500">{item.day}</span>
                  <div className="flex-1 h-5 rounded-full bg-stone-100 overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        rate === 1 ? 'bg-emerald-500' : rate >= 0.5 ? 'bg-amber-500' : 'bg-red-500'
                      )}
                      style={{ width: `${rate * 100}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-xs font-medium text-stone-600">
                    {item.taken}/{item.total}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-center">
            <p className="text-sm font-medium text-emerald-700">本周服药率 93%</p>
            <p className="text-xs text-emerald-600">周三漏服一次降压药</p>
          </div>
        </div>
      </div>

      {/* 血糖趋势 + AI对话 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 血糖趋势 */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-stone-900">血糖趋势</h3>
            <p className="text-sm text-stone-500">近7天空腹血糖变化</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyHealthData}>
              <defs>
                <linearGradient id="sugarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} domain={[4, 8]} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="bloodSugar"
                name="血糖(mmol/L)"
                stroke="#f59e0b"
                fill="url(#sugarGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="mt-3 flex items-center justify-between text-xs text-stone-500">
            <span>正常范围: 3.9-6.1 mmol/L</span>
            <span className="font-medium text-emerald-600">本周平均: 5.84</span>
          </div>
        </div>

        {/* AI 对话统计 */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="font-semibold text-stone-900">AI 对话统计</h3>
            <p className="text-sm text-stone-500">与AI助手的互动情况</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={aiChatData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="duration" name="对话时长(分钟)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-violet-50 p-2">
              <p className="text-lg font-bold text-violet-700">138</p>
              <p className="text-xs text-violet-600">本周总分钟</p>
            </div>
            <div className="rounded-lg bg-violet-50 p-2">
              <p className="text-lg font-bold text-violet-700">31</p>
              <p className="text-xs text-violet-600">对话话题</p>
            </div>
            <div className="rounded-lg bg-violet-50 p-2">
              <p className="text-lg font-bold text-violet-700">20分</p>
              <p className="text-xs text-violet-600">日均时长</p>
            </div>
          </div>
        </div>
      </div>

      {/* 生活摘要 */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-stone-900 mb-4">本周生活摘要</h3>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Footprints, label: '日均步数', value: '3,250步', status: '偏低，建议增加散步', color: 'text-blue-600' },
            { icon: Moon, label: '平均睡眠', value: '7.2小时', status: '睡眠质量良好', color: 'text-indigo-600' },
            { icon: Phone, label: '家属通话', value: '3次', status: '女儿打了2次，儿子1次', color: 'text-green-600' },
            { icon: Calendar, label: '服务预约', value: '2次', status: '周三体检、周五理发', color: 'text-orange-600' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg bg-stone-50 p-4">
              <item.icon className={cn('mt-0.5 h-5 w-5', item.color)} />
              <div>
                <p className="text-sm font-medium text-stone-700">{item.label}</p>
                <p className="text-lg font-bold text-stone-900">{item.value}</p>
                <p className="text-xs text-stone-400">{item.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
