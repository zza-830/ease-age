import { useState } from 'react';
import {
  Shield,
  Video,
  MapPin,
  AlertTriangle,
  Bell,
  Camera,
  Activity,
  FileText,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface AlertRecord {
  id: string;
  type: 'fall_detected' | 'geofence_breach' | 'abnormal_behavior' | 'emergency_sos';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: string;
  timestamp: string;
  status: 'pending' | 'acknowledged' | 'resolved';
  resolvedBy?: string;
}

interface GeofenceZone {
  id: string;
  name: string;
  radius: number;
  isActive: boolean;
  alertOnExit: boolean;
}

const mockAlerts: AlertRecord[] = [
  {
    id: '1',
    type: 'fall_detected',
    severity: 'critical',
    description: '检测到老人在客厅跌倒',
    location: '客厅',
    timestamp: '2026-06-05 14:32:00',
    status: 'pending',
  },
  {
    id: '2',
    type: 'geofence_breach',
    severity: 'medium',
    description: '老人离开安全区域',
    location: '小区门口',
    timestamp: '2026-06-05 10:15:00',
    status: 'acknowledged',
  },
  {
    id: '3',
    type: 'abnormal_behavior',
    severity: 'low',
    description: '老人连续2小时未活动',
    location: '卧室',
    timestamp: '2026-06-05 08:00:00',
    status: 'resolved',
    resolvedBy: '张三',
  },
];

const mockGeofences: GeofenceZone[] = [
  { id: '1', name: '家', radius: 50, isActive: true, alertOnExit: true },
  { id: '2', name: '小区', radius: 200, isActive: true, alertOnExit: true },
  { id: '3', name: '公园', radius: 100, isActive: false, alertOnExit: false },
];

const severityColors = {
  low: 'bg-yellow-100 text-yellow-800',
  medium: 'bg-orange-100 text-orange-800',
  high: 'bg-red-100 text-red-800',
  critical: 'bg-red-200 text-red-900',
};

const severityLabels = {
  low: '低',
  medium: '中',
  high: '高',
  critical: '紧急',
};

const statusColors = {
  pending: 'bg-red-100 text-red-800',
  acknowledged: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
};

const statusLabels = {
  pending: '待处理',
  acknowledged: '已确认',
  resolved: '已解决',
};

const typeLabels = {
  fall_detected: '跌倒检测',
  geofence_breach: '越界告警',
  abnormal_behavior: '异常行为',
  emergency_sos: '紧急求助',
};

const typeIcons = {
  fall_detected: AlertTriangle,
  geofence_breach: MapPin,
  abnormal_behavior: Activity,
  emergency_sos: Bell,
};

export default function SafetyPage() {
  const [activeTab, setActiveTab] = useState<'alerts' | 'monitoring' | 'geofence' | 'reports'>('alerts');
  const [alerts, setAlerts] = useState<AlertRecord[]>(mockAlerts);

  const handleAcknowledge = (id: string) => {
    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, status: 'acknowledged' } : alert
    ));
  };

  const handleResolve = (id: string) => {
    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, status: 'resolved', resolvedBy: '当前用户' } : alert
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">安全监护</h2>
          <p className="text-stone-500">实时监控老人安全状态</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="flex h-3 w-3 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-green-600 font-medium">监控中</span>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stone-500">今日告警</p>
              <p className="text-2xl font-bold text-red-600">3</p>
            </div>
            <div className="rounded-lg bg-red-50 p-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stone-500">待处理</p>
              <p className="text-2xl font-bold text-orange-600">1</p>
            </div>
            <div className="rounded-lg bg-orange-50 p-3">
              <Bell className="h-5 w-5 text-orange-500" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stone-500">监控设备</p>
              <p className="text-2xl font-bold text-blue-600">4</p>
            </div>
            <div className="rounded-lg bg-blue-50 p-3">
              <Camera className="h-5 w-5 text-blue-500" />
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-stone-500">安全评分</p>
              <p className="text-2xl font-bold text-green-600">95</p>
            </div>
            <div className="rounded-lg bg-green-50 p-3">
              <Shield className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'alerts', label: '告警记录', icon: AlertTriangle },
            { id: 'monitoring', label: '实时监控', icon: Video },
            { id: 'geofence', label: '电子围栏', icon: MapPin },
            { id: 'reports', label: '巡检报告', icon: FileText },
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
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {alerts.map((alert) => {
            const TypeIcon = typeIcons[alert.type];
            return (
              <div key={alert.id} className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`rounded-lg p-2 ${
                      alert.severity === 'critical' ? 'bg-red-100' :
                      alert.severity === 'high' ? 'bg-orange-100' : 'bg-yellow-100'
                    }`}>
                      <TypeIcon className={`h-5 w-5 ${
                        alert.severity === 'critical' ? 'text-red-600' :
                        alert.severity === 'high' ? 'text-orange-600' : 'text-yellow-600'
                      }`} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-stone-900">{typeLabels[alert.type]}</h4>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${severityColors[alert.severity]}`}>
                          {severityLabels[alert.severity]}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[alert.status]}`}>
                          {statusLabels[alert.status]}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-stone-600">{alert.description}</p>
                      <div className="mt-2 flex items-center space-x-4 text-xs text-stone-500">
                        <span className="flex items-center">
                          <MapPin className="mr-1 h-3 w-3" />
                          {alert.location}
                        </span>
                        <span className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {alert.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {alert.status === 'pending' && (
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        className="rounded-lg bg-yellow-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-yellow-600"
                      >
                        确认
                      </button>
                    )}
                    {alert.status !== 'resolved' && (
                      <button
                        onClick={() => handleResolve(alert.id)}
                        className="rounded-lg bg-green-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-600"
                      >
                        解决
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'monitoring' && (
        <div className="grid gap-4 md:grid-cols-2">
          {['客厅', '卧室', '厨房', '门口'].map((location) => (
            <div key={location} className="rounded-xl border bg-white shadow-sm overflow-hidden">
              <div className="aspect-video bg-stone-900 flex items-center justify-center">
                <div className="text-center text-stone-400">
                  <Video className="mx-auto h-12 w-12" />
                  <p className="mt-2 text-sm">{location} - 实时画面</p>
                  <p className="text-xs text-stone-500">摄像头离线</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-stone-400" />
                    <span className="text-sm font-medium text-stone-700">{location}</span>
                  </div>
                  <button className="rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-600 hover:bg-orange-100">
                    查看回放
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'geofence' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">
              添加围栏
            </button>
          </div>
          {mockGeofences.map((zone) => (
            <div key={zone.id} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <MapPin className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-900">{zone.name}</h4>
                    <p className="text-sm text-stone-500">半径: {zone.radius}米</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-stone-500">离开告警</p>
                    <p className={`text-sm font-medium ${zone.alertOnExit ? 'text-green-600' : 'text-stone-400'}`}>
                      {zone.alertOnExit ? '已启用' : '未启用'}
                    </p>
                  </div>
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    zone.isActive ? 'bg-green-100' : 'bg-stone-100'
                  }`}>
                    {zone.isActive ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-stone-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-4">
          {[
            { date: '2026-06-05', status: '正常', issues: 0, score: 98 },
            { date: '2026-06-04', status: '正常', issues: 1, score: 95 },
            { date: '2026-06-03', status: '异常', issues: 2, score: 88 },
          ].map((report, index) => (
            <div key={index} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`rounded-lg p-2 ${
                    report.status === '正常' ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    <FileText className={`h-5 w-5 ${
                      report.status === '正常' ? 'text-green-600' : 'text-yellow-600'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-900">巡检报告 - {report.date}</h4>
                    <p className="text-sm text-stone-500">
                      状态: {report.status} | 问题: {report.issues}项 | 评分: {report.score}
                    </p>
                  </div>
                </div>
                <button className="rounded-lg border px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50">
                  查看详情
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
