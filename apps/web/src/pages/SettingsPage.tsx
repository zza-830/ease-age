import { useState } from 'react';
import {
  User,
  Bell,
  Shield,
  Lock,
  HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Globe,
  Smartphone
} from 'lucide-react';

interface SettingSection {
  title: string;
  items: SettingItem[];
}

interface SettingItem {
  icon: any;
  label: string;
  description: string;
  action?: 'toggle' | 'link';
  value?: boolean;
}

const settingSections: SettingSection[] = [
  {
    title: '个人资料',
    items: [
      { icon: User, label: '个人信息', description: '修改姓名、头像、联系方式', action: 'link' },
      { icon: Shield, label: '家庭关系', description: '管理家庭成员和权限', action: 'link' },
    ],
  },
  {
    title: '通知设置',
    items: [
      { icon: Bell, label: '消息通知', description: '接收新消息提醒', action: 'toggle', value: true },
      { icon: Bell, label: '健康提醒', description: '用药和体检提醒', action: 'toggle', value: true },
      { icon: Bell, label: '服务通知', description: '服务订单状态更新', action: 'toggle', value: true },
      { icon: Bell, label: '安全告警', description: '紧急安全事件通知', action: 'toggle', value: true },
    ],
  },
  {
    title: '隐私与安全',
    items: [
      { icon: Lock, label: '修改密码', description: '定期修改密码保障安全', action: 'link' },
      { icon: Shield, label: '隐私设置', description: '控制数据共享范围', action: 'link' },
      { icon: Lock, label: '两步验证', description: '增强账号安全性', action: 'toggle', value: false },
    ],
  },
  {
    title: '其他设置',
    items: [
      { icon: Moon, label: '深色模式', description: '切换界面主题', action: 'toggle', value: false },
      { icon: Globe, label: '语言设置', description: '简体中文', action: 'link' },
      { icon: Smartphone, label: '设备管理', description: '管理已登录设备', action: 'link' },
      { icon: HelpCircle, label: '帮助与反馈', description: '获取帮助或提交反馈', action: 'link' },
    ],
  },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, boolean>>({
    '消息通知': true,
    '健康提醒': true,
    '服务通知': true,
    '安全告警': true,
    '两步验证': false,
    '深色模式': false,
  });

  const handleToggle = (label: string) => {
    setSettings(prev => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-stone-900">设置</h2>
        <p className="text-stone-500">管理您的账户和偏好设置</p>
      </div>

      {/* User Card */}
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
            <span className="text-2xl font-bold text-orange-600">张</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-stone-900">张三</h3>
            <p className="text-sm text-stone-500">家属账号</p>
            <p className="text-sm text-stone-500">138****8888</p>
          </div>
          <ChevronRight className="ml-auto h-5 w-5 text-stone-400" />
        </div>
      </div>

      {/* Setting Sections */}
      {settingSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <div className="border-b bg-stone-50 px-6 py-3">
            <h4 className="font-medium text-stone-700">{section.title}</h4>
          </div>
          <div className="divide-y">
            {section.items.map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center space-x-4">
                  <div className="rounded-lg bg-stone-100 p-2">
                    <item.icon className="h-5 w-5 text-stone-600" />
                  </div>
                  <div>
                    <p className="font-medium text-stone-900">{item.label}</p>
                    <p className="text-sm text-stone-500">{item.description}</p>
                  </div>
                </div>
                {item.action === 'toggle' ? (
                  <button
                    onClick={() => handleToggle(item.label)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${
                      settings[item.label] ? 'bg-orange-500' : 'bg-stone-300'
                    }`}
                  >
                    <span
                      className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                        settings[item.label] ? 'translate-x-5' : ''
                      }`}
                    />
                  </button>
                ) : (
                  <ChevronRight className="h-5 w-5 text-stone-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Logout Button */}
      <button className="flex w-full items-center justify-center space-x-2 rounded-xl border border-red-200 bg-white py-4 text-red-600 shadow-sm hover:bg-red-50">
        <LogOut className="h-5 w-5" />
        <span className="font-medium">退出登录</span>
      </button>

      {/* Version Info */}
      <p className="text-center text-sm text-stone-500">
        EaseAge v0.1.0 · 颐智相伴
      </p>
    </div>
  );
}
