import { useState, useEffect } from 'react';
import {
  Bell, BellOff, Check, CheckCheck, Trash2, Filter,
  Heart, Pill, AlertTriangle, Settings, Users, Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';

const TYPE_CONFIG: Record<string, { icon: any; color: string; label: string }> = {
  health_alert: { icon: Heart, color: 'text-red-500', label: '健康预警' },
  medication: { icon: Pill, color: 'text-blue-500', label: '用药提醒' },
  system: { icon: Settings, color: 'text-stone-500', label: '系统通知' },
  family: { icon: Users, color: 'text-green-500', label: '家属消息' },
  service: { icon: Wrench, color: 'text-violet-500', label: '服务通知' },
  emergency: { icon: AlertTriangle, color: 'text-red-600', label: '紧急通知' },
};

interface Notification {
  id: string;
  notificationType: string;
  title: string;
  content: string;
  priority: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const [notiRes, countRes] = await Promise.all([
        api.get<{ data: { notifications: Notification[] } }>(`/notifications?unreadOnly=${filter === 'unread'}`)
          .catch(() => ({ data: { notifications: [] } })),
        api.get<{ data: { count: number } }>('/notifications/unread-count')
          .catch(() => ({ data: { count: 0 } })),
      ]);
      setNotifications(notiRes.data?.notifications || []);
      setUnreadCount(countRes.data?.count || 0);
    } catch (err) {
      console.error('获取通知失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`, {});
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch {}
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all', {});
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {}
  };

  const deleteNotification = async (id: string) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">通知中心</h2>
          <p className="text-stone-500">
            {unreadCount > 0 ? `${unreadCount} 条未读通知` : '暂无未读通知'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border overflow-hidden">
            <button
              onClick={() => setFilter('all')}
              className={cn('px-3 py-1.5 text-sm', filter === 'all' ? 'bg-orange-500 text-white' : 'text-stone-600')}
            >
              全部
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={cn('px-3 py-1.5 text-sm', filter === 'unread' ? 'bg-orange-500 text-white' : 'text-stone-600')}
            >
              未读
            </button>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-50"
            >
              <CheckCheck className="h-4 w-4" />
              全部已读
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12">
          <BellOff className="mx-auto h-12 w-12 text-stone-300" />
          <p className="mt-4 text-stone-500">暂无通知</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((noti) => {
            const config = TYPE_CONFIG[noti.notificationType] || TYPE_CONFIG.system;
            const Icon = config.icon;
            return (
              <div
                key={noti.id}
                className={cn(
                  'flex items-start gap-4 rounded-xl border p-4 transition-colors',
                  noti.isRead ? 'bg-white' : 'bg-orange-50/50 border-orange-200'
                )}
              >
                <div className={cn('mt-0.5 rounded-lg p-2', noti.isRead ? 'bg-stone-100' : 'bg-orange-100')}>
                  <Icon className={cn('h-5 w-5', config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-stone-900">{noti.title}</h4>
                    {!noti.isRead && <span className="h-2 w-2 rounded-full bg-orange-500" />}
                  </div>
                  <p className="mt-0.5 text-sm text-stone-500">{noti.content}</p>
                  <p className="mt-1 text-xs text-stone-400">
                    {new Date(noti.createdAt).toLocaleString('zh-CN')}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {!noti.isRead && (
                    <button
                      onClick={() => markAsRead(noti.id)}
                      className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
                      title="标记已读"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(noti.id)}
                    className="rounded-lg p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-500"
                    title="删除"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
