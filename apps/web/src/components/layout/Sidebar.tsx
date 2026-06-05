import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Video,
  ShoppingBag,
  BookOpen,
  Heart,
  Settings,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: '首页', href: '/', icon: LayoutDashboard },
  { name: '视频通讯', href: '/video-chat', icon: Video },
  { name: '增值服务', href: '/services', icon: ShoppingBag },
  { name: '知识库', href: '/knowledge', icon: BookOpen },
  { name: '健康管理', href: '/health', icon: Heart },
  { name: '设置', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="flex w-64 flex-col border-r bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold text-orange-500">
          EaseAge
        </h1>
        <span className="ml-2 text-sm text-stone-500">颐智相伴</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
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
            <span className="text-orange-600 font-medium">张</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-stone-900">张三</p>
            <p className="text-xs text-stone-500">家属</p>
          </div>
          <button className="ml-auto rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-600">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
