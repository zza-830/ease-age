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
  Clock
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';

interface HealthMetric {
  type: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'danger';
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  nextDose: string;
  isActive: boolean;
}

const mockMetrics: HealthMetric[] = [
  { type: '血压', value: '128/82', unit: 'mmHg', status: 'normal', trend: 'stable', lastUpdated: '08:30' },
  { type: '心率', value: '72', unit: 'bpm', status: 'normal', trend: 'down', lastUpdated: '08:30' },
  { type: '血糖', value: '6.2', unit: 'mmol/L', status: 'normal', trend: 'up', lastUpdated: '09:00' },
  { type: '体温', value: '36.5', unit: '°C', status: 'normal', trend: 'stable', lastUpdated: '07:00' },
  { type: '血氧', value: '98', unit: '%', status: 'normal', trend: 'stable', lastUpdated: '08:30' },
  { type: '体重', value: '65', unit: 'kg', status: 'normal', trend: 'down', lastUpdated: '昨天' },
];

const mockMedications: Medication[] = [
  { id: '1', name: '降压药', dosage: '1片', frequency: '每日一次', nextDose: '08:00', isActive: true },
  { id: '2', name: '降糖药', dosage: '1片', frequency: '每日两次', nextDose: '12:00', isActive: true },
  { id: '3', name: '钙片', dosage: '2片', frequency: '每日一次', nextDose: '20:00', isActive: true },
];

const statusColors = {
  normal: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  danger: 'bg-red-100 text-red-800',
};

const statusLabels = {
  normal: '正常',
  warning: '注意',
  danger: '异常',
};

export default function HealthPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'metrics' | 'medications' | 'checkups' | 'reports'>('metrics');
  const [healthRecords, setHealthRecords] = useState<HealthMetric[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchHealthData();
    } else {
      // No user, use mock data
      setHealthRecords(mockMetrics);
      setMedications(mockMedications);
      setIsLoading(false);
    }
  }, [user]);

  const fetchHealthData = async () => {
    try {
      setIsLoading(true);
      // Get elderly profile first
      const profileResponse = await api.get<{ data: any }>(`/users/${user?.id}/elderly-profile`);
      const elderlyProfileId = profileResponse.data?.id;

      if (elderlyProfileId) {
        // Fetch health records
        const recordsResponse = await api.get<{ data: { items: any[] } }>(`/health/records/${elderlyProfileId}`);
        const formattedRecords: HealthMetric[] = recordsResponse.data.items.map((item: any) => ({
          type: item.metricType || item.type,
          value: item.value,
          unit: item.unit,
          status: item.status || 'normal',
          trend: item.trend || 'stable',
          lastUpdated: new Date(item.recordedAt || item.createdAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        }));
        setHealthRecords(formattedRecords.length > 0 ? formattedRecords : mockMetrics);

        // Fetch medications
        const medsResponse = await api.get<{ data: any[] }>(`/health/medications/${elderlyProfileId}`);
        const formattedMeds: Medication[] = medsResponse.data.map((item: any) => ({
          id: item.id,
          name: item.medicationName || item.name,
          dosage: item.dosage,
          frequency: item.frequency,
          nextDose: item.nextDoseTime || '08:00',
          isActive: item.isActive !== false,
        }));
        setMedications(formattedMeds.length > 0 ? formattedMeds : mockMedications);
      } else {
        setHealthRecords(mockMetrics);
        setMedications(mockMedications);
      }
    } catch (error) {
      console.error('Failed to fetch health data:', error);
      setHealthRecords(mockMetrics);
      setMedications(mockMedications);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">健康管理</h2>
          <p className="text-stone-500">记录和管理老人健康数据</p>
        </div>
        <button className="flex items-center rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">
          <Plus className="mr-2 h-4 w-4" />
          添加记录
        </button>
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

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
        </div>
      )}

      {/* Tab Content */}
      {!isLoading && activeTab === 'metrics' && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {healthRecords.map((metric, index) => (
            <div key={index} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-stone-500">{metric.type}</p>
                  <p className="mt-1 text-2xl font-bold text-stone-900">
                    {metric.value}
                    <span className="ml-1 text-sm font-normal text-stone-500">{metric.unit}</span>
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[metric.status]}`}>
                    {statusLabels[metric.status]}
                  </span>
                  {metric.trend === 'up' && <TrendingUp className="h-4 w-4 text-orange-500" />}
                  {metric.trend === 'down' && <TrendingDown className="h-4 w-4 text-green-500" />}
                  {metric.trend === 'stable' && <Activity className="h-4 w-4 text-stone-400" />}
                </div>
              </div>
              <p className="mt-2 flex items-center text-xs text-stone-500">
                <Clock className="mr-1 h-3 w-3" />
                更新于 {metric.lastUpdated}
              </p>
            </div>
          ))}
        </div>
      )}

      {!isLoading && activeTab === 'medications' && (
        <div className="space-y-4">
          {medications.map((medication) => (
            <div key={medication.id} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="rounded-lg bg-blue-50 p-3">
                    <Pill className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-900">{medication.name}</h4>
                    <p className="text-sm text-stone-500">{medication.dosage} · {medication.frequency}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-stone-500">下次服药</p>
                  <p className="font-medium text-orange-600">{medication.nextDose}</p>
                </div>
              </div>
            </div>
          ))}
          <button className="w-full rounded-lg border-2 border-dashed border-stone-300 py-4 text-sm font-medium text-stone-500 hover:border-orange-300 hover:text-orange-500">
            + 添加药物
          </button>
        </div>
      )}

      {!isLoading && activeTab === 'checkups' && (
        <div className="space-y-4">
          {[
            { date: '2026-06-01', hospital: '社区卫生中心', type: '常规体检', status: '已完成' },
            { date: '2026-05-15', hospital: '市人民医院', type: '专项检查', status: '已完成' },
            { date: '2026-04-20', hospital: '社区卫生中心', type: '常规体检', status: '已完成' },
          ].map((checkup, index) => (
            <div key={index} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="rounded-lg bg-green-50 p-3">
                    <Calendar className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-900">{checkup.type}</h4>
                    <p className="text-sm text-stone-500">{checkup.hospital}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-stone-500">{checkup.date}</p>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                    {checkup.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && activeTab === 'reports' && (
        <div className="space-y-4">
          {[
            { date: '2026-06', title: '月度健康报告', summary: '整体健康状况良好，血压血糖控制稳定' },
            { date: '2026-05', title: '月度健康报告', summary: '血压略有波动，建议调整用药' },
            { date: '2026-04', title: '月度健康报告', summary: '各项指标正常，继续保持' },
          ].map((report, index) => (
            <div key={index} className="rounded-xl border bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="rounded-lg bg-purple-50 p-3">
                    <FileText className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-900">{report.title}</h4>
                    <p className="text-sm text-stone-500">{report.summary}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-stone-500">{report.date}</span>
                  <button className="rounded-lg border px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50">
                    查看详情
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
