import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Smartphone,
  X
} from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const settingSections = [
    {
      title: '个人资料',
      items: [
        {
          icon: User,
          label: '个人信息',
          description: '修改姓名、头像、联系方式',
          action: 'link' as const,
          onClick: () => setShowProfileModal(true)
        },
        {
          icon: Shield,
          label: '家庭关系',
          description: '管理家庭成员和权限',
          action: 'link' as const,
          onClick: () => navigate('/health')
        },
      ],
    },
    {
      title: '通知设置',
      items: [
        { icon: Bell, label: '消息通知', description: '接收新消息提醒', action: 'toggle' as const },
        { icon: Bell, label: '健康提醒', description: '用药和体检提醒', action: 'toggle' as const },
        { icon: Bell, label: '服务通知', description: '服务订单状态更新', action: 'toggle' as const },
        { icon: Bell, label: '安全告警', description: '紧急安全事件通知', action: 'toggle' as const },
      ],
    },
    {
      title: '隐私与安全',
      items: [
        {
          icon: Lock,
          label: '修改密码',
          description: '定期修改密码保障安全',
          action: 'link' as const,
          onClick: () => setShowPasswordModal(true)
        },
        {
          icon: Shield,
          label: '隐私设置',
          description: '控制数据共享范围',
          action: 'link' as const,
          onClick: () => setShowPrivacyModal(true)
        },
        { icon: Lock, label: '两步验证', description: '增强账号安全性', action: 'toggle' as const },
      ],
    },
    {
      title: '其他设置',
      items: [
        { icon: Moon, label: '深色模式', description: '切换界面主题', action: 'toggle' as const },
        {
          icon: Globe,
          label: '语言设置',
          description: '简体中文',
          action: 'link' as const,
          onClick: () => {}
        },
        {
          icon: Smartphone,
          label: '设备管理',
          description: '管理已登录设备',
          action: 'link' as const,
          onClick: () => {}
        },
        {
          icon: HelpCircle,
          label: '帮助与反馈',
          description: '获取帮助或提交反馈',
          action: 'link' as const,
          onClick: () => setShowHelpModal(true)
        },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-stone-900">设置</h2>
        <p className="text-stone-500">管理您的账户和偏好设置</p>
      </div>

      {/* User Card */}
      <button
        onClick={() => setShowProfileModal(true)}
        className="w-full rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow text-left"
      >
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
            <span className="text-2xl font-bold text-orange-600">
              {user?.fullName?.[0] || '用'}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-stone-900">{user?.fullName || '用户'}</h3>
            <p className="text-sm text-stone-500">
              {user?.role === 'elderly' ? '老人账号' : user?.role === 'family' ? '家属账号' : '服务人员账号'}
            </p>
            <p className="text-sm text-stone-500">{user?.phoneNumber || '未绑定手机'}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-stone-400" />
        </div>
      </button>

      {/* Setting Sections */}
      {settingSections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <div className="border-b bg-stone-50 px-6 py-3">
            <h4 className="font-medium text-stone-700">{section.title}</h4>
          </div>
          <div className="divide-y">
            {section.items.map((item, itemIndex) => (
              <div
                key={itemIndex}
                className={`flex items-center justify-between px-6 py-4 ${
                  item.action === 'link' ? 'cursor-pointer hover:bg-stone-50' : ''
                }`}
                onClick={item.action === 'link' ? item.onClick : undefined}
              >
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle(item.label);
                    }}
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
      <button
        onClick={handleLogout}
        className="flex w-full items-center justify-center space-x-2 rounded-xl border border-red-200 bg-white py-4 text-red-600 shadow-sm hover:bg-red-50"
      >
        <LogOut className="h-5 w-5" />
        <span className="font-medium">退出登录</span>
      </button>

      {/* Version Info */}
      <p className="text-center text-sm text-stone-500">
        EaseAge v0.1.0 · 颐智相伴
      </p>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">个人信息</h3>
              <button onClick={() => setShowProfileModal(false)}>
                <X className="h-5 w-5 text-stone-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <div className="h-20 w-20 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-3xl font-bold text-orange-600">
                    {user?.fullName?.[0] || '用'}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">姓名</label>
                <input
                  type="text"
                  defaultValue={user?.fullName || ''}
                  className="w-full rounded-lg border border-stone-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">手机号</label>
                <input
                  type="tel"
                  defaultValue={user?.phoneNumber || ''}
                  disabled
                  className="w-full rounded-lg border border-stone-300 px-4 py-2.5 bg-stone-50 text-stone-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">身份</label>
                <input
                  type="text"
                  defaultValue={user?.role === 'elderly' ? '老人' : user?.role === 'family' ? '家属' : '服务人员'}
                  disabled
                  className="w-full rounded-lg border border-stone-300 px-4 py-2.5 bg-stone-50 text-stone-500"
                />
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="w-full py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600"
              >
                保存修改
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">修改密码</h3>
              <button onClick={() => setShowPasswordModal(false)}>
                <X className="h-5 w-5 text-stone-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">当前密码</label>
                <input
                  type="password"
                  placeholder="请输入当前密码"
                  className="w-full rounded-lg border border-stone-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">新密码</label>
                <input
                  type="password"
                  placeholder="请输入新密码"
                  className="w-full rounded-lg border border-stone-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">确认新密码</label>
                <input
                  type="password"
                  placeholder="请再次输入新密码"
                  className="w-full rounded-lg border border-stone-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="w-full py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600"
              >
                确认修改
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">隐私设置</h3>
              <button onClick={() => setShowPrivacyModal(false)}>
                <X className="h-5 w-5 text-stone-400" />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { label: '允许家属查看健康数据', description: '授权家属可以查看您的健康记录' },
                { label: '允许位置共享', description: '在紧急情况下共享您的位置信息' },
                { label: '数据匿名化', description: '在分析报告中使用匿名数据' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                  <div>
                    <p className="font-medium text-stone-900">{item.label}</p>
                    <p className="text-sm text-stone-500">{item.description}</p>
                  </div>
                  <button className="relative h-6 w-11 rounded-full bg-orange-500">
                    <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white translate-x-5" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="w-full py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600"
              >
                保存设置
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">帮助与反馈</h3>
              <button onClick={() => setShowHelpModal(false)}>
                <X className="h-5 w-5 text-stone-400" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-900 mb-2">联系我们</h4>
                <p className="text-sm text-orange-700">
                  客服电话：400-xxx-xxxx<br/>
                  服务时间：9:00-18:00<br/>
                  邮箱：support@easeage.com
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">反馈类型</label>
                <select className="w-full rounded-lg border border-stone-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <option>功能建议</option>
                  <option>Bug反馈</option>
                  <option>体验问题</option>
                  <option>其他</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">反馈内容</label>
                <textarea
                  rows={4}
                  placeholder="请描述您遇到的问题或建议..."
                  className="w-full rounded-lg border border-stone-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="w-full py-2.5 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600"
              >
                提交反馈
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
