import { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Activity,
  Heart,
  ShoppingBag,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  RefreshCw,
  Maximize2
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Health trend data - 6 months
const healthTrendData = [
  { month: '1月', bloodPressure: 125, heartRate: 72, bloodSugar: 5.8, weight: 65.2 },
  { month: '2月', bloodPressure: 128, heartRate: 75, bloodSugar: 6.0, weight: 65.0 },
  { month: '3月', bloodPressure: 122, heartRate: 70, bloodSugar: 5.6, weight: 64.8 },
  { month: '4月', bloodPressure: 130, heartRate: 73, bloodSugar: 6.2, weight: 65.1 },
  { month: '5月', bloodPressure: 126, heartRate: 71, bloodSugar: 5.9, weight: 64.9 },
  { month: '6月', bloodPressure: 124, heartRate: 69, bloodSugar: 5.7, weight: 64.7 },
];

// Service usage data
const serviceUsageData = [
  { name: '家政服务', count: 45, growth: 12, color: '#f97316' },
  { name: '送餐服务', count: 89, growth: 23, color: '#3b82f6' },
  { name: '陪诊服务', count: 23, growth: -5, color: '#22c55e' },
  { name: '维修服务', count: 18, growth: 8, color: '#a855f7' },
  { name: '健康咨询', count: 67, growth: 31, color: '#ec4899' },
];

// Daily active users - 7 days
const dailyActiveData = [
  { day: '周一', users: 156, newUsers: 12 },
  { day: '周二', users: 142, newUsers: 8 },
  { day: '周三', users: 168, newUsers: 15 },
  { day: '周四', users: 159, newUsers: 10 },
  { day: '周五', users: 175, newUsers: 18 },
  { day: '周六', users: 198, newUsers: 22 },
  { day: '周日', users: 187, newUsers: 16 },
];

// Alert distribution
const alertTypeData = [
  { name: '跌倒检测', value: 12, color: '#ef4444' },
  { name: '越界告警', value: 8, color: '#f97316' },
  { name: '异常行为', value: 23, color: '#eab308' },
  { name: '紧急求助', value: 5, color: '#8b5cf6' },
];

// Hourly activity heatmap data
const hourlyActivity = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  activity: Math.floor(Math.random() * 100) + 20,
}));

// Custom tooltip for charts
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

// Animated counter component
function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  return (
    <span className="text-3xl font-bold text-stone-900">
      {value.toLocaleString()}{suffix}
    </span>
  );
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">数据分析</h2>
          <p className="text-stone-500">平台运营数据和健康趋势分析</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex rounded-lg border overflow-hidden">
            {(['week', 'month', 'quarter', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-orange-500 text-white'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                {range === 'week' ? '本周' : range === 'month' ? '本月' : range === 'quarter' ? '本季' : '本年'}
              </button>
            ))}
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center rounded-lg border px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            刷新
          </button>
          <button className="flex items-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">
            <Download className="mr-2 h-4 w-4" />
            导出报表
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stone-500">活跃用户</p>
              <AnimatedCounter value={1234} />
              <div className="mt-2 flex items-center text-sm">
                <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-600 font-medium">+12.5%</span>
                <span className="ml-1 text-stone-500">较上月</span>
              </div>
            </div>
            <div className="rounded-xl bg-blue-50 p-3">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <div className="mt-4 h-1 rounded-full bg-stone-100">
            <div className="h-1 rounded-full bg-blue-500" style={{ width: '75%' }} />
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stone-500">服务订单</p>
              <AnimatedCounter value={856} />
              <div className="mt-2 flex items-center text-sm">
                <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-600 font-medium">+8.3%</span>
                <span className="ml-1 text-stone-500">较上月</span>
              </div>
            </div>
            <div className="rounded-xl bg-orange-50 p-3">
              <ShoppingBag className="h-6 w-6 text-orange-500" />
            </div>
          </div>
          <div className="mt-4 h-1 rounded-full bg-stone-100">
            <div className="h-1 rounded-full bg-orange-500" style={{ width: '68%' }} />
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stone-500">健康记录</p>
              <AnimatedCounter value={3456} />
              <div className="mt-2 flex items-center text-sm">
                <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-600 font-medium">+15.2%</span>
                <span className="ml-1 text-stone-500">较上月</span>
              </div>
            </div>
            <div className="rounded-xl bg-green-50 p-3">
              <Heart className="h-6 w-6 text-green-500" />
            </div>
          </div>
          <div className="mt-4 h-1 rounded-full bg-stone-100">
            <div className="h-1 rounded-full bg-green-500" style={{ width: '82%' }} />
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stone-500">安全告警</p>
              <AnimatedCounter value={48} />
              <div className="mt-2 flex items-center text-sm">
                <ArrowDownRight className="mr-1 h-4 w-4 text-green-500" />
                <span className="text-green-600 font-medium">-23.1%</span>
                <span className="ml-1 text-stone-500">较上月</span>
              </div>
            </div>
            <div className="rounded-xl bg-red-50 p-3">
              <Activity className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <div className="mt-4 h-1 rounded-full bg-stone-100">
            <div className="h-1 rounded-full bg-red-500" style={{ width: '35%' }} />
          </div>
        </div>
      </div>

      {/* Charts Row 1: Health Trends + Service Usage */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Health Trends - Line Chart */}
        <div className="lg:col-span-2 rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-stone-900">健康趋势分析</h3>
              <p className="text-sm text-stone-500">近6个月体征数据变化</p>
            </div>
            <button className="rounded-lg p-2 hover:bg-stone-100">
              <Maximize2 className="h-4 w-4 text-stone-400" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={healthTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="bloodPressure"
                name="血压(mmHg)"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="heartRate"
                name="心率(bpm)"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="bloodSugar"
                name="血糖(mmol/L)"
                stroke="#f97316"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Alert Distribution - Pie Chart */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-stone-900">告警类型分布</h3>
            <p className="text-sm text-stone-500">本月告警统计</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={alertTypeData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {alertTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {alertTypeData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                  <span className="text-stone-600">{item.name}</span>
                </div>
                <span className="font-medium text-stone-900">{item.value}次</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2: Daily Active Users + Service Usage */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Daily Active Users - Area Chart */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-stone-900">每日活跃用户</h3>
              <p className="text-sm text-stone-500">本周用户活跃趋势</p>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-orange-500 mr-1" />
                <span className="text-stone-600">总用户</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-1" />
                <span className="text-stone-600">新用户</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={dailyActiveData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorNewUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="users"
                name="总用户"
                stroke="#f97316"
                fillOpacity={1}
                fill="url(#colorUsers)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="newUsers"
                name="新用户"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorNewUsers)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Service Usage - Horizontal Bar Chart */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-stone-900">服务使用统计</h3>
              <p className="text-sm text-stone-500">本月各服务订单量</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={serviceUsageData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" stroke="#9ca3af" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="订单数" radius={[0, 4, 4, 0]}>
                {serviceUsageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {serviceUsageData.map((service, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-stone-50">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: service.color }} />
                  <span className="text-sm text-stone-600">{service.name}</span>
                </div>
                <span className={`text-sm font-medium ${service.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {service.growth >= 0 ? '+' : ''}{service.growth}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hourly Activity Heatmap */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-stone-900">24小时活跃度热力图</h3>
            <p className="text-sm text-stone-500">用户活跃时间分布</p>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-stone-500">低</span>
            <div className="flex space-x-1">
              {['#fef3c7', '#fde68a', '#fbbf24', '#f59e0b', '#d97706'].map((color, i) => (
                <div key={i} className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
              ))}
            </div>
            <span className="text-stone-500">高</span>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-1">
          {hourlyActivity.map((item, index) => {
            const intensity = item.activity / 120;
            const bgColor = intensity > 0.8 ? '#d97706' :
                           intensity > 0.6 ? '#f59e0b' :
                           intensity > 0.4 ? '#fbbf24' :
                           intensity > 0.2 ? '#fde68a' : '#fef3c7';
            return (
              <div
                key={index}
                className="aspect-square rounded cursor-pointer hover:ring-2 hover:ring-orange-500 transition-all"
                style={{ backgroundColor: bgColor }}
                title={`${item.hour}: ${item.activity} 活跃用户`}
              />
            );
          })}
        </div>
        <div className="mt-2 flex justify-between text-xs text-stone-500">
          <span>0:00</span>
          <span>6:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>23:00</span>
        </div>
      </div>

      {/* Performance Metrics Table */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-stone-900">运营指标详情</h3>
            <p className="text-sm text-stone-500">关键业务指标对比</p>
          </div>
          <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
            查看全部 →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-stone-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">指标名称</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">本月</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">上月</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">环比</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">目标</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-stone-500 uppercase tracking-wider">完成率</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {[
                { metric: '新注册用户', current: 156, previous: 132, unit: '人', target: 200 },
                { metric: '日均活跃用户', current: 892, previous: 845, unit: '人', target: 1000 },
                { metric: '服务完成率', current: 96.5, previous: 94.2, unit: '%', target: 98 },
                { metric: '用户满意度', current: 4.8, previous: 4.7, unit: '分', target: 4.9 },
                { metric: '平均响应时间', current: 12, previous: 15, unit: '分钟', target: 10 },
                { metric: '告警处理率', current: 98.2, previous: 95.8, unit: '%', target: 99 },
              ].map((row, index) => {
                const change = ((row.current - row.previous) / row.previous * 100).toFixed(1);
                const isPositive = row.current >= row.previous;
                const completion = ((row.current / row.target) * 100).toFixed(0);
                return (
                  <tr key={index} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-stone-900">{row.metric}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-semibold text-stone-900">{row.current}{row.unit}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm text-stone-500">{row.previous}{row.unit}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center text-sm font-medium ${
                        isPositive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {isPositive ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                        {isPositive ? '+' : ''}{change}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm text-stone-500">{row.target}{row.unit}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <div className="w-16 h-2 rounded-full bg-stone-200 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              Number(completion) >= 100 ? 'bg-green-500' :
                              Number(completion) >= 80 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.min(Number(completion), 100)}%` }}
                          />
                        </div>
                        <span className={`text-sm font-medium ${
                          Number(completion) >= 100 ? 'text-green-600' :
                          Number(completion) >= 80 ? 'text-orange-600' : 'text-red-600'
                        }`}>
                          {completion}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
