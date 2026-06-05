import {
  Heart,
  Calendar,
  ShoppingBag,
  Video,
  Activity,
  Clock
} from 'lucide-react';
import StatusCard from '@/components/shared/StatusCard';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-stone-900">首页</h2>
        <p className="text-stone-500">欢迎回来，查看老人最新状态</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatusCard title="健康状态" value="良好" description="今日血压正常" icon={Heart} />
        <StatusCard title="今日用药" value="2/3" description="还剩1次未服用" icon={Calendar} />
        <StatusCard title="待处理服务" value={2} description="家政服务预约中" icon={ShoppingBag} />
        <StatusCard title="未读消息" value={5} description="来自3位家属" icon={Video} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-stone-900">近期健康数据</h3>
          <div className="space-y-4">
            {[
              { time: '08:30', type: '血压', value: '128/82 mmHg', status: 'normal' },
              { time: '09:00', type: '血糖', value: '6.2 mmol/L', status: 'normal' },
              { time: '10:15', type: '心率', value: '72 bpm', status: 'normal' },
            ].map((record, index) => (
              <div key={index} className="flex items-center justify-between rounded-lg bg-stone-50 p-3">
                <div className="flex items-center">
                  <Activity className="mr-3 h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-stone-900">{record.type}</p>
                    <p className="text-xs text-stone-500">{record.time}</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-stone-700">{record.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-stone-900">最近活动</h3>
          <div className="space-y-4">
            {[
              { time: '14:30', text: '与女儿视频通话 15分钟', icon: Video },
              { time: '11:00', text: '完成家政服务预约', icon: ShoppingBag },
              { time: '09:00', text: '服用降压药', icon: Heart },
              { time: '08:00', text: '查看健康养生文章', icon: Activity },
            ].map((activity, index) => (
              <div key={index} className="flex items-start">
                <div className="mr-3 mt-1 rounded-full bg-orange-50 p-1.5">
                  <activity.icon className="h-3 w-3 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-stone-900">{activity.text}</p>
                  <p className="flex items-center text-xs text-stone-500">
                    <Clock className="mr-1 h-3 w-3" />
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-stone-900">快捷操作</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { name: '发起视频', icon: Video, color: 'bg-blue-50 text-blue-600' },
            { name: '预约服务', icon: ShoppingBag, color: 'bg-green-50 text-green-600' },
            { name: '记录健康', icon: Heart, color: 'bg-red-50 text-red-600' },
            { name: '查看知识', icon: Activity, color: 'bg-purple-50 text-purple-600' },
          ].map((action) => (
            <button key={action.name} className="flex flex-col items-center rounded-xl border p-4 transition-colors hover:bg-stone-50">
              <div className={`rounded-lg p-3 ${action.color}`}>
                <action.icon className="h-6 w-6" />
              </div>
              <span className="mt-2 text-sm font-medium text-stone-700">{action.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
