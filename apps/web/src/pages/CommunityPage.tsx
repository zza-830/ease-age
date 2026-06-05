import { useState } from 'react';
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  ChevronRight,
  Plus,
  Heart,
  HeartHandshake,
  Megaphone,
  PartyPopper,
  BookOpen,
  Activity
} from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'health' | 'event' | 'emergency';
  publishDate: string;
  isPinned: boolean;
}

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: 'social' | 'health' | 'education' | 'exercise';
  attendeeCount: number;
  maxAttendees: number;
  isRegistered: boolean;
}

interface NeighborRequest {
  id: string;
  requesterName: string;
  requesterAvatar: string;
  type: 'help_needed' | 'help_offered';
  category: 'shopping' | 'medical' | 'transport' | 'companionship' | 'other';
  description: string;
  location: string;
  postedAt: string;
  status: 'open' | 'matched' | 'completed';
}

const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: '社区健康讲座通知',
    content: '本周六上午9点，社区将举办老年人健康养生讲座，欢迎参加。',
    category: 'health',
    publishDate: '2026-06-05',
    isPinned: true,
  },
  {
    id: '2',
    title: '小区电梯维修公告',
    content: '6月10日-12日，3栋电梯将进行例行维修保养，请提前安排出行。',
    category: 'general',
    publishDate: '2026-06-04',
    isPinned: false,
  },
  {
    id: '3',
    title: '端午节社区活动',
    content: '端午节当天，社区活动中心将举办包粽子活动，欢迎老人和家属参加。',
    category: 'event',
    publishDate: '2026-06-03',
    isPinned: false,
  },
];

const mockEvents: CommunityEvent[] = [
  {
    id: '1',
    title: '太极拳晨练',
    description: '每天早上7点，社区广场太极拳教学',
    date: '2026-06-06',
    time: '07:00',
    location: '社区广场',
    category: 'exercise',
    attendeeCount: 15,
    maxAttendees: 30,
    isRegistered: true,
  },
  {
    id: '2',
    title: '健康体检活动',
    description: '免费血压、血糖检测',
    date: '2026-06-08',
    time: '09:00',
    location: '社区卫生站',
    category: 'health',
    attendeeCount: 28,
    maxAttendees: 50,
    isRegistered: false,
  },
  {
    id: '3',
    title: '书法兴趣班',
    description: '每周三下午书法教学，欢迎初学者',
    date: '2026-06-10',
    time: '14:00',
    location: '活动中心',
    category: 'education',
    attendeeCount: 8,
    maxAttendees: 15,
    isRegistered: false,
  },
  {
    id: '4',
    title: '邻里聚餐',
    description: '每月一次的邻里聚餐活动',
    date: '2026-06-15',
    time: '18:00',
    location: '社区食堂',
    category: 'social',
    attendeeCount: 42,
    maxAttendees: 60,
    isRegistered: true,
  },
];

const mockNeighborRequests: NeighborRequest[] = [
  {
    id: '1',
    requesterName: '李奶奶',
    requesterAvatar: '李',
    type: 'help_needed',
    category: 'shopping',
    description: '需要帮忙买菜，腿脚不方便',
    location: '2栋3单元',
    postedAt: '2小时前',
    status: 'open',
  },
  {
    id: '2',
    requesterName: '王爷爷',
    requesterAvatar: '王',
    type: 'help_offered',
    category: 'transport',
    description: '可以顺路带人去医院',
    location: '1栋1单元',
    postedAt: '5小时前',
    status: 'open',
  },
  {
    id: '3',
    requesterName: '张阿姨',
    requesterAvatar: '张',
    type: 'help_needed',
    category: 'medical',
    description: '需要帮忙取药',
    location: '3栋2单元',
    postedAt: '1天前',
    status: 'matched',
  },
];

const categoryColors = {
  general: 'bg-blue-100 text-blue-800',
  health: 'bg-green-100 text-green-800',
  event: 'bg-purple-100 text-purple-800',
  emergency: 'bg-red-100 text-red-800',
};

const categoryLabels = {
  general: '通知',
  health: '健康',
  event: '活动',
  emergency: '紧急',
};

const eventCategoryIcons = {
  social: PartyPopper,
  health: Heart,
  education: BookOpen,
  exercise: Activity,
};

const eventCategoryColors = {
  social: 'bg-pink-50 text-pink-600',
  health: 'bg-green-50 text-green-600',
  education: 'bg-blue-50 text-blue-600',
  exercise: 'bg-orange-50 text-orange-600',
};

const requestCategoryLabels = {
  shopping: '代购',
  medical: '医疗',
  transport: '出行',
  companionship: '陪伴',
  other: '其他',
};

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<'announcements' | 'events' | 'neighbors' | 'providers'>('announcements');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-stone-900">社区服务</h2>
        <p className="text-stone-500">社区公告、活动和邻里互助</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stone-500">社区公告</p>
              <p className="text-2xl font-bold text-blue-600">{mockAnnouncements.length}</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3">
              <Megaphone className="h-5 w-5 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stone-500">近期活动</p>
              <p className="text-2xl font-bold text-purple-600">{mockEvents.length}</p>
            </div>
            <div className="rounded-lg bg-purple-50 p-3">
              <Calendar className="h-5 w-5 text-purple-500" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stone-500">互助请求</p>
              <p className="text-2xl font-bold text-orange-600">{mockNeighborRequests.filter(r => r.status === 'open').length}</p>
            </div>
            <div className="rounded-lg bg-orange-50 p-3">
              <HeartHandshake className="h-5 w-5 text-orange-500" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stone-500">活跃邻居</p>
              <p className="text-2xl font-bold text-green-600">128</p>
            </div>
            <div className="rounded-lg bg-green-50 p-3">
              <Users className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'announcements', label: '社区公告', icon: Megaphone },
            { id: 'events', label: '活动日历', icon: Calendar },
            { id: 'neighbors', label: '邻里互助', icon: HeartHandshake },
            { id: 'providers', label: '服务人员', icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-700'
              }`}
            >
              <tab.icon className="mr-2 h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'announcements' && (
        <div className="space-y-4">
          {mockAnnouncements.map((announcement) => (
            <div key={announcement.id} className={`rounded-xl border bg-white p-4 shadow-sm ${
              announcement.isPinned ? 'border-orange-200 bg-orange-50/30' : ''
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    {announcement.isPinned && (
                      <span className="rounded-full bg-orange-500 px-2 py-0.5 text-xs font-medium text-white">
                        置顶
                      </span>
                    )}
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${categoryColors[announcement.category]}`}>
                      {categoryLabels[announcement.category]}
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-medium text-stone-900">{announcement.title}</h3>
                  <p className="mt-1 text-sm text-stone-600">{announcement.content}</p>
                  <p className="mt-2 text-xs text-stone-500">发布于 {announcement.publishDate}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-stone-400" />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button className="flex items-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">
              <Plus className="mr-2 h-4 w-4" />
              发布活动
            </button>
          </div>
          {mockEvents.map((event) => {
            const EventIcon = eventCategoryIcons[event.category];
            return (
              <div key={event.id} className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`rounded-lg p-3 ${eventCategoryColors[event.category]}`}>
                      <EventIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium text-stone-900">{event.title}</h3>
                      <p className="mt-1 text-sm text-stone-600">{event.description}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-stone-500">
                        <span className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          {event.date}
                        </span>
                        <span className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {event.time}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="mr-1 h-3 w-3" />
                          {event.location}
                        </span>
                        <span className="flex items-center">
                          <Users className="mr-1 h-3 w-3" />
                          {event.attendeeCount}/{event.maxAttendees}人
                        </span>
                      </div>
                    </div>
                  </div>
                  <button className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    event.isRegistered
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-500 text-white hover:bg-orange-600'
                  }`}>
                    {event.isRegistered ? '已报名' : '立即报名'}
                  </button>
                </div>
                {/* Progress bar */}
                <div className="mt-4">
                  <div className="h-2 rounded-full bg-stone-100">
                    <div
                      className="h-2 rounded-full bg-orange-500"
                      style={{ width: `${(event.attendeeCount / event.maxAttendees) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'neighbors' && (
        <div className="space-y-4">
          <div className="flex justify-between">
            <div className="flex space-x-2">
              <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white">
                全部
              </button>
              <button className="rounded-lg border px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50">
                需要帮助
              </button>
              <button className="rounded-lg border px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50">
                提供帮助
              </button>
            </div>
            <button className="flex items-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">
              <Plus className="mr-2 h-4 w-4" />
              发布请求
            </button>
          </div>
          {mockNeighborRequests.map((request) => (
            <div key={request.id} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-lg font-medium text-orange-600">{request.requesterAvatar}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-stone-900">{request.requesterName}</h4>
                      <p className="text-xs text-stone-500">{request.location}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      request.type === 'help_needed' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {request.type === 'help_needed' ? '需要帮助' : '提供帮助'}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-stone-600">{request.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-stone-500">
                      <span className="flex items-center">
                        <HeartHandshake className="mr-1 h-3 w-3" />
                        {requestCategoryLabels[request.category]}
                      </span>
                      <span className="flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {request.postedAt}
                      </span>
                    </div>
                    <button className="rounded-lg bg-orange-50 px-4 py-1.5 text-sm font-medium text-orange-600 hover:bg-orange-100">
                      {request.type === 'help_needed' ? '我来帮忙' : '请求帮助'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'providers' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button className="flex items-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">
              <Plus className="mr-2 h-4 w-4" />
              添加服务人员
            </button>
          </div>
          {[
            { name: '陈护工', role: '专业护工', rating: 4.9, reviews: 156, phone: '138****8888', status: 'available' },
            { name: '刘阿姨', role: '家政服务', rating: 4.8, reviews: 89, phone: '139****9999', status: 'busy' },
            { name: '张师傅', role: '维修服务', rating: 4.7, reviews: 234, phone: '137****7777', status: 'available' },
          ].map((provider, index) => (
            <div key={index} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-lg font-medium text-blue-600">{provider.name[0]}</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-900">{provider.name}</h4>
                    <p className="text-sm text-stone-500">{provider.role}</p>
                    <div className="mt-1 flex items-center space-x-2">
                      <span className="text-xs text-yellow-600">★ {provider.rating}</span>
                      <span className="text-xs text-stone-500">({provider.reviews}条评价)</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    provider.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {provider.status === 'available' ? '空闲中' : '服务中'}
                  </span>
                  <p className="mt-1 text-sm text-stone-500">{provider.phone}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
