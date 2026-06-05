import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Video,
  ShoppingBag,
  BookOpen,
  Heart,
  Settings,
  LogOut,
  Shield,
  Building2,
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/useAuthStore';

const navigation = [
  { name: '首页', href: '/', icon: LayoutDashboard },
  { name: '视频通讯', href: '/video-chat', icon: Video },
  { name: '增值服务', href: '/services', icon: ShoppingBag },
  { name: '知识库', href: '/knowledge', icon: BookOpen },
  { name: '健康管理', href: '/health', icon: Heart },
  { name: '安全监护', href: '/safety', icon: Shield },
  { name: '社区服务', href: '/community', icon: Building2 },
  { name: '数据分析', href: '/analytics', icon: BarChart3 },
  { name: '设置', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="flex w-64 flex-col border-r bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold text-orange-500">EaseAge</h1>
        <span className="ml-2 text-sm text-stone-500">颐智相伴</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              )
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="border-t p-4">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
            <span className="text-orange-600 font-medium">
              {user?.fullName?.[0] || '用'}
            </span>
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-stone-900">{user?.fullName || '用户'}</p>
            <p className="text-xs text-stone-500">
              {user?.role === 'elderly' ? '老人' : user?.role === 'family' ? '家属' : '服务人员'}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
            title="退出登录"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
