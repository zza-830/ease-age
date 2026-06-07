import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { api } from '@/lib/api';
import { useNavigate } from 'react-router-dom';

// Gradient card component
function GradientCard({
  title,
  value,
  subtitle,
  gradient,
  onClick
}: {
  title: string;
  value: string | number;
  subtitle: string;
  gradient: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-6 text-white cursor-pointer hover:scale-[1.02] transition-transform ${gradient}`}
    >
      <div className="relative z-10">
        <p className="text-white/80 text-sm">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
        <p className="text-white/70 text-sm mt-2">{subtitle}</p>
      </div>
      {/* Decorative circles */}
      <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
      <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/5" />
    </div>
  );
}

// Activity item component
function ActivityItem({
  time,
  title,
  description,
  type
}: {
  time: string;
  title: string;
  description: string;
  type: 'health' | 'service' | 'call' | 'alert';
}) {
  const typeColors = {
    health: 'bg-green-500',
    service: 'bg-blue-500',
    call: 'bg-purple-500',
    alert: 'bg-orange-500',
  };

  return (
    <div className="flex items-start space-x-4 py-3">
      <div className={`w-2 h-2 rounded-full mt-2 ${typeColors[type]}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-stone-900">{title}</p>
        <p className="text-sm text-stone-500 truncate">{description}</p>
      </div>
      <span className="text-xs text-stone-400 whitespace-nowrap">{time}</span>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [healthData, setHealthData] = useState<any[]>([]);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('早上好');
    else if (hour < 18) setGreeting('下午好');
    else setGreeting('晚上好');

    if (user?.id) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const profileResponse = await api.get<{ data: any }>(`/users/${user?.id}/elderly-profile`);
      const elderlyProfileId = profileResponse.data?.id;

      if (elderlyProfileId) {
        const recordsResponse = await api.get<{ data: { items: any[] } }>(`/health/records/${elderlyProfileId}?pageSize=5`);
        setHealthData(recordsResponse.data.items);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-stone-900">
            {greeting}，{user?.fullName || '用户'}
          </h1>
          <p className="text-stone-500 mt-1">欢迎回到 EaseAge 智慧养老平台</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-stone-500">今天是</p>
          <p className="text-lg font-semibold text-stone-900">
            {new Date().toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long'
            })}
          </p>
        </div>
      </div>

      {/* Gradient Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <GradientCard
          title="健康状态"
          value="良好"
          subtitle="今日血压 128/82 mmHg"
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
          onClick={() => navigate('/health')}
        />
        <GradientCard
          title="今日用药"
          value="2/3"
          subtitle="还剩1次未服用"
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          onClick={() => navigate('/health')}
        />
        <GradientCard
          title="待处理服务"
          value={2}
          subtitle="家政服务预约中"
          gradient="bg-gradient-to-br from-violet-500 to-violet-600"
          onClick={() => navigate('/services')}
        />
        <GradientCard
          title="未读消息"
          value={5}
          subtitle="来自3位家属"
          gradient="bg-gradient-to-br from-orange-500 to-orange-600"
          onClick={() => navigate('/video-chat')}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions - Left Column */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-stone-900 mb-4">快捷操作</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: '视频通话', path: '/video-chat', color: 'bg-blue-50 text-blue-700 hover:bg-blue-100' },
                { label: '预约服务', path: '/services', color: 'bg-green-50 text-green-700 hover:bg-green-100' },
                { label: '健康记录', path: '/health', color: 'bg-purple-50 text-purple-700 hover:bg-purple-100' },
                { label: '知识学习', path: '/knowledge', color: 'bg-amber-50 text-amber-700 hover:bg-amber-100' },
                { label: '安全监护', path: '/safety', color: 'bg-red-50 text-red-700 hover:bg-red-100' },
                { label: '社区活动', path: '/community', color: 'bg-teal-50 text-teal-700 hover:bg-teal-100' },
              ].map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${action.color}`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          {/* Family Members */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-stone-900 mb-4">家庭成员</h3>
            <div className="space-y-3">
              {[
                { name: '张奶奶', relation: '母亲', status: '在线', avatar: '张' },
                { name: '李阿姨', relation: '护工', status: '服务中', avatar: '李' },
              ].map((member, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-stone-50">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-orange-600 font-medium">{member.avatar}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-stone-900">{member.name}</p>
                    <p className="text-xs text-stone-500">{member.relation}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    member.status === '在线' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {member.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Health Overview - Middle Column */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border bg-white p-5 shadow-sm h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-stone-900">今日健康</h3>
              <button
                onClick={() => navigate('/health')}
                className="text-sm text-orange-600 hover:text-orange-700"
              >
                查看详情
              </button>
            </div>

            {/* Health Metrics */}
            <div className="space-y-4">
              {[
                { label: '血压', value: '128/82', unit: 'mmHg', status: 'normal', color: 'text-green-600' },
                { label: '心率', value: '72', unit: 'bpm', status: 'normal', color: 'text-green-600' },
                { label: '血糖', value: '6.2', unit: 'mmol/L', status: 'normal', color: 'text-green-600' },
                { label: '体温', value: '36.5', unit: '°C', status: 'normal', color: 'text-green-600' },
                { label: '血氧', value: '98', unit: '%', status: 'normal', color: 'text-green-600' },
              ].map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-stone-50">
                  <span className="text-sm text-stone-600">{metric.label}</span>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-stone-900">{metric.value}</span>
                    <span className="text-xs text-stone-500 ml-1">{metric.unit}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Health Score */}
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">健康评分</p>
                  <p className="text-3xl font-bold">95</p>
                </div>
                <div className="text-right">
                  <p className="text-white/80 text-sm">整体状况</p>
                  <p className="text-lg font-medium">优秀</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity - Right Column */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border bg-white p-5 shadow-sm h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-stone-900">最近动态</h3>
              <button className="text-sm text-orange-600 hover:text-orange-700">
                查看全部
              </button>
            </div>

            <div className="divide-y divide-stone-100">
              <ActivityItem
                time="14:30"
                title="与女儿视频通话"
                description="通话时长 15分钟"
                type="call"
              />
              <ActivityItem
                time="11:00"
                title="完成家政服务"
                description="日常保洁服务已完成"
                type="service"
              />
              <ActivityItem
                time="09:00"
                title="服用降压药"
                description="今日第2次用药"
                type="health"
              />
              <ActivityItem
                time="08:30"
                title="血压测量完成"
                description="血压 128/82 mmHg"
                type="health"
              />
              <ActivityItem
                time="08:00"
                title="查看健康文章"
                description="《夏季老年人养生要点》"
                type="health"
              />
              <ActivityItem
                time="昨天"
                title="预约家政服务"
                description="明日 14:00 日常保洁"
                type="service"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Reminders */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h3 className="font-semibold text-stone-900 mb-4">今日提醒</h3>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { time: '20:00', title: '服用钙片', type: 'medication' },
            { time: '明天 14:00', title: '家政服务预约', type: 'service' },
            { time: '后天 09:00', title: '社区健康讲座', type: 'event' },
          ].map((reminder, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <div className="flex-1">
                <p className="text-sm font-medium text-stone-900">{reminder.title}</p>
                <p className="text-xs text-stone-500">{reminder.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
