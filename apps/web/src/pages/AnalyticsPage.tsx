import {
  BarChart3,
  TrendingUp,
  Users,
  Activity
} from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-stone-900">数据分析</h2>
        <p className="text-stone-500">查看平台运营数据和趋势</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: '活跃用户', value: '1,234', change: '+12%', icon: Users, color: 'blue' },
          { label: '服务订单', value: '856', change: '+8%', icon: Activity, color: 'green' },
          { label: '健康记录', value: '3,421', change: '+15%', icon: BarChart3, color: 'purple' },
          { label: '满意度', value: '98%', change: '+2%', icon: TrendingUp, color: 'orange' },
        ].map((stat, index) => (
          <div key={index} className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-stone-900">{stat.value}</p>
                <p className="mt-1 text-sm text-green-600">{stat.change}</p>
              </div>
              <div className={`rounded-lg bg-${stat.color}-50 p-3`}>
                <stat.icon className={`h-6 w-6 text-${stat.color}-500`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Placeholder */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-stone-900">数据趋势</h3>
        <div className="mt-4 h-64 rounded-lg bg-stone-50 flex items-center justify-center">
          <p className="text-stone-400">图表区域</p>
        </div>
      </div>
    </div>
  );
}
