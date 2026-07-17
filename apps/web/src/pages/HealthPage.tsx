import { useState, useEffect } from 'react';
import {
  Heart,
  Activity,
  Pill,
  Calendar,
  FileText,
  Plus,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Thermometer,
  Droplets,
  Weight,
  Wind,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';

// 体征类型配置
const METRIC_CONFIG: Record<string, { label: string; icon: any; color: string; format: (v: any) => string; getStatus: (v: any) => 'normal' | 'warning' | 'danger' }> = {
  blood_pressure: {
    label: '血压',
    icon: Heart,
    color: 'text-red-500',
    format: (v) => `${v.systolic}/${v.diastolic}`,
    getStatus: (v) => v.systolic > 140 || v.diastolic > 90 ? 'warning' : 'normal',
  },
  heart_rate: {
    label: '心率',
    icon: Activity,
    color: 'text-blue-500',
    format: (v) => `${v.value}`,
    getStatus: (v) => v.value > 100 || v.value < 50 ? 'warning' : 'normal',
  },
  blood_sugar: {
    label: '血糖',
    icon: Droplets,
    color: 'text-amber-500',
    format: (v) => `${v.value}`,
    getStatus: (v) => v.value > 7.0 ? 'warning' : 'normal',
  },
  body_temperature: {
    label: '体温',
    icon: Thermometer,
    color: 'text-orange-500',
    format: (v) => `${v.value}`,
    getStatus: (v) => v.value > 37.5 ? 'warning' : 'normal',
  },
  blood_oxygen: {
    label: '血氧',
    icon: Wind,
    color: 'text-cyan-500',
    format: (v) => `${v.value}`,
    getStatus: (v) => v.value < 95 ? 'warning' : 'normal',
  },
  weight: {
    label: '体重',
    icon: Weight,
    color: 'text-green-500',
    format: (v) => `${v.value}`,
    getStatus: () => 'normal',
  },
};

interface HealthRecord {
  id: string;
  recordType: string;
  measurementValueJson: string;
  measurementUnit: string;
  measuredAt: string;
}

interface Medication {
  id: string;
  medicationName: string;
  dosageDescription: string;
  frequencyDescription: string;
  reminderScheduleJson: string;
  isActive: boolean;
}

interface Checkup {
  id: string;
  hospitalName: string;
  checkupDate: string;
  summaryText: string;
  resultsJson: string;
}

const statusColors = {
  normal: 'bg-green-100 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-red-100 text-red-800',
};
const statusLabels = { normal: '正常', warning: '注意', danger: '异常' };

export default function HealthPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'metrics' | 'medications' | 'checkups' | 'reports'>('metrics');
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [checkups, setCheckups] = useState<Checkup[]>([]);
  const [elderlyProfileId, setElderlyProfileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchData();
    else setIsLoading(false);
  }, [user]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      console.log('[HealthPage] user.id:', user!.id);

      // 获取老人档案
      const profileRes = await api.get<{ data: any }>(`/users/${user!.id}/elderly-profile`);
      const profileId = profileRes.data?.id;
      console.log('[HealthPage] profileId:', profileId);

      if (!profileId) { setIsLoading(false); return; }
      setElderlyProfileId(profileId);

      // 并行获取数据
      const [recordsRes, medsRes, checkupsRes] = await Promise.all([
        api.get<{ data: { items: HealthRecord[] } }>(`/health/records/${profileId}`).catch((e) => { console.error('[HealthPage] records error:', e); return { data: { items: [] } }; }),
        api.get<{ data: Medication[] }>(`/health/medications/${profileId}`).catch((e) => { console.error('[HealthPage] meds error:', e); return { data: [] }; }),
        api.get<{ data: Checkup[] }>(`/health/checkups/${profileId}`).catch((e) => { console.error('[HealthPage] checkups error:', e); return { data: [] }; }),
      ]);

      console.log('[HealthPage] records:', recordsRes.data?.items?.length, 'meds:', medsRes.data?.length, 'checkups:', checkupsRes.data?.length);

      setRecords(recordsRes.data?.items || []);
      setMedications(medsRes.data || []);
      setCheckups(checkupsRes.data || []);
    } catch (err) {
      console.error('[HealthPage] 获取健康数据失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 按类型分组，取每种最新一条
  const latestRecords = (() => {
    const map = new Map<string, HealthRecord>();
    for (const r of records) {
      if (!map.has(r.recordType)) map.set(r.recordType, r);
    }
    return Array.from(map.values());
  })();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">健康管理</h2>
          <p className="text-stone-500">记录和管理健康数据</p>
        </div>
      </div>

      {/* Health Score */}
      <div className="rounded-xl border bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">今日健康评分</p>
            <p className="mt-1 text-4xl font-bold">95</p>
            <p className="mt-1 text-sm opacity-90">整体状况良好</p>
          </div>
          <div className="rounded-full bg-white/20 p-4">
            <Heart className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'metrics', label: '体征数据', icon: Activity },
            { id: 'medications', label: '用药管理', icon: Pill },
            { id: 'checkups', label: '体检记录', icon: Calendar },
            { id: 'reports', label: '健康报告', icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex items-center border-b-2 px-1 py-4 text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-600'
                  : 'border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-700'
              )}
            >
              <tab.icon className="mr-2 h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
        </div>
      )}

      {/* 体征数据 */}
      {!isLoading && activeTab === 'metrics' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {latestRecords.map((record) => {
            const config = METRIC_CONFIG[record.recordType];
            if (!config) return null;
            const values = JSON.parse(record.measurementValueJson);
            const displayValue = config.format(values);
            const status = config.getStatus(values);
            const Icon = config.icon;
            return (
              <div key={record.id} className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-stone-50 p-2.5">
                      <Icon className={cn('h-5 w-5', config.color)} />
                    </div>
                    <div>
                      <p className="text-sm text-stone-500">{config.label}</p>
                      <p className="text-2xl font-bold text-stone-900">
                        {displayValue}
                        <span className="ml-1 text-sm font-normal text-stone-400">{record.measurementUnit}</span>
                      </p>
                    </div>
                  </div>
                  <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium', statusColors[status])}>
                    {statusLabels[status]}
                  </span>
                </div>
                <p className="mt-2 flex items-center text-xs text-stone-400">
                  <Clock className="mr-1 h-3 w-3" />
                  {new Date(record.measuredAt).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            );
          })}
          {latestRecords.length === 0 && (
            <div className="col-span-full text-center py-12 text-stone-400">
              暂无体征数据
            </div>
          )}
        </div>
      )}

      {/* 用药管理 */}
      {!isLoading && activeTab === 'medications' && (
        <div className="space-y-4">
          {medications.map((med) => {
            const schedule = (() => {
              try { return JSON.parse(med.reminderScheduleJson || '[]'); } catch { return []; }
            })();
            return (
              <div key={med.id} className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-blue-50 p-3">
                      <Pill className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-stone-900">{med.medicationName}</h4>
                      <p className="text-sm text-stone-500">{med.dosageDescription} · {med.frequencyDescription}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-stone-500">服药时间</p>
                    <p className="font-medium text-orange-600">{schedule.join(', ') || '未设置'}</p>
                  </div>
                </div>
              </div>
            );
          })}
          {medications.length === 0 && (
            <div className="text-center py-12 text-stone-400">暂无用药记录</div>
          )}
        </div>
      )}

      {/* 体检记录 */}
      {!isLoading && activeTab === 'checkups' && (
        <div className="space-y-4">
          {checkups.map((checkup) => {
            const results = (() => {
              try { return JSON.parse(checkup.resultsJson || '{}'); } catch { return {}; }
            })();
            return (
              <div key={checkup.id} className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-green-50 p-3">
                      <Calendar className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-stone-900">{checkup.hospitalName}</h4>
                      <p className="text-sm text-stone-500">{checkup.summaryText?.substring(0, 60)}...</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-stone-500">{new Date(checkup.checkupDate).toLocaleDateString('zh-CN')}</p>
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">已完成</span>
                  </div>
                </div>
                {Object.keys(results).length > 0 && (
                  <div className="mt-3 grid grid-cols-2 gap-2 border-t pt-3">
                    {Object.entries(results).map(([key, val]) => (
                      <div key={key} className="text-xs">
                        <span className="text-stone-500">{key}：</span>
                        <span className="text-stone-700">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {checkups.length === 0 && (
            <div className="text-center py-12 text-stone-400">暂无体检记录</div>
          )}
        </div>
      )}

      {/* 健康报告 */}
      {!isLoading && activeTab === 'reports' && (
        <div className="space-y-4">
          {[
            { date: '2026-06', title: '月度健康报告', summary: '整体健康状况良好，血压血糖控制稳定' },
            { date: '2026-05', title: '月度健康报告', summary: '血压略有波动，建议调整用药' },
          ].map((report, index) => (
            <div key={index} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-purple-50 p-3">
                    <FileText className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-900">{report.title}</h4>
                    <p className="text-sm text-stone-500">{report.summary}</p>
                  </div>
                </div>
                <span className="text-sm text-stone-500">{report.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
