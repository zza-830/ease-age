import { useState, useEffect } from 'react';
import {
  Heart, Users, Apple, Calendar, Clock, Star, BookOpen,
  ChevronRight, MapPin, Activity, Utensils, Music, Flower2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';

const NODE_TYPE_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  person:     { label: '人物关系', icon: Users,  color: 'blue' },
  preference: { label: '个人喜好', icon: Star,   color: 'amber' },
  health:     { label: '健康状况', icon: Heart,  color: 'red' },
  place:      { label: '常去地点', icon: MapPin, color: 'green' },
  event:      { label: '人生事件', icon: Calendar, color: 'purple' },
  habit:      { label: '生活习惯', icon: Clock,  color: 'teal' },
  food:       { label: '饮食偏好', icon: Utensils, color: 'orange' },
  hobby:      { label: '兴趣爱好', icon: Flower2, color: 'pink' },
};

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; light: string }> = {
  blue:   { bg: 'bg-blue-500',   text: 'text-blue-600',   border: 'border-blue-200',   light: 'bg-blue-50' },
  amber:  { bg: 'bg-amber-500',  text: 'text-amber-600',  border: 'border-amber-200',  light: 'bg-amber-50' },
  red:    { bg: 'bg-red-500',    text: 'text-red-600',    border: 'border-red-200',    light: 'bg-red-50' },
  green:  { bg: 'bg-emerald-500',text: 'text-emerald-600',border: 'border-emerald-200',light: 'bg-emerald-50' },
  purple: { bg: 'bg-violet-500', text: 'text-violet-600', border: 'border-violet-200', light: 'bg-violet-50' },
  teal:   { bg: 'bg-teal-500',   text: 'text-teal-600',   border: 'border-teal-200',   light: 'bg-teal-50' },
  orange: { bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-200', light: 'bg-orange-50' },
  pink:   { bg: 'bg-pink-500',   text: 'text-pink-600',   border: 'border-pink-200',   light: 'bg-pink-50' },
};

interface KgNode {
  id: string;
  nodeType: string;
  label: string;
  description: string | null;
  attributesJson: string;
  importance: number;
}

interface KgEdge {
  id: string;
  sourceId: string;
  targetId: string;
  relation: string;
  sourceNode: KgNode;
  targetNode: KgNode;
}

interface Routine {
  id: string;
  timeOfDay: string;
  activity: string;
  daysOfWeek: string;
}

interface ImportantDate {
  id: string;
  dateType: string;
  label: string;
  monthDay: string;
  isLunar: boolean;
  notes: string | null;
}

interface LifeEvent {
  id: string;
  eventType: string;
  title: string;
  description: string | null;
  eventDate: string;
  location: string | null;
  emotionalTag: string | null;
}

export default function KnowledgePage() {
  const { user } = useAuthStore();
  const [nodes, setNodes] = useState<KgNode[]>([]);
  const [edges, setEdges] = useState<KgEdge[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [dates, setDates] = useState<ImportantDate[]>([]);
  const [events, setEvents] = useState<LifeEvent[]>([]);
  const [expandedType, setExpandedType] = useState<string | null>('person');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchGraph();
    else setIsLoading(false);
  }, [user]);

  const fetchGraph = async () => {
    try {
      setIsLoading(true);
      const profileRes = await api.get<{ data: any }>(`/users/${user!.id}/elderly-profile`);
      const pid = profileRes.data?.id;
      if (!pid) { setIsLoading(false); return; }

      const [graphRes, routinesRes, datesRes, eventsRes] = await Promise.all([
        api.get<{ data: { nodes: KgNode[]; edges: KgEdge[] } }>(`/kg/${pid}/graph`).catch(() => ({ data: { nodes: [], edges: [] } })),
        api.get<{ data: Routine[] }>(`/kg/${pid}/routines`).catch(() => ({ data: [] })),
        api.get<{ data: ImportantDate[] }>(`/kg/${pid}/important-dates`).catch(() => ({ data: [] })),
        api.get<{ data: LifeEvent[] }>(`/kg/${pid}/life-events`).catch(() => ({ data: [] })),
      ]);

      setNodes(graphRes.data?.nodes || []);
      setEdges(graphRes.data?.edges || []);
      setRoutines(routinesRes.data || []);
      setDates(datesRes.data || []);
      setEvents(eventsRes.data || []);
    } catch (err) {
      console.error('获取知识图谱失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 按类型分组
  const grouped: Record<string, KgNode[]> = {};
  for (const node of nodes) {
    const t = node.nodeType;
    if (!grouped[t]) grouped[t] = [];
    grouped[t].push(node);
  }

  // 搜索过滤
  const filteredNodes = searchQuery
    ? nodes.filter((n) => n.label.includes(searchQuery) || (n.description && n.description.includes(searchQuery)))
    : null;

  // 获取某节点的关系
  const getNodeRelations = (nodeId: string) => {
    return edges.filter((e) => e.sourceId === nodeId || e.targetId === nodeId);
  };

  const RELATION_LABELS: Record<string, string> = {
    is_parent_of: '是…的父母',
    married_to: '配偶',
    is_grandparent_of: '是…的祖父母',
    is_aunt_of: '是…的姑姑/叔叔',
    friend_of: '朋友',
    caretaker_of: '护理',
    has_condition: '患有',
    allergic_to: '过敏',
    treats: '治疗',
    likes: '喜欢',
    dislikes: '不喜欢',
    has_habit: '习惯',
    lives_at: '居住在',
    works_at: '工作在',
    visits_hospital: '就诊于',
    frequents: '常去',
    worked_at: '曾在…工作',
    participates_in: '参与',
    affected_by: '经历',
    experienced: '经历',
    proud_of: '自豪',
    wishes: '愿望',
  };

  const EVENT_ICONS: Record<string, any> = {
    travel: MapPin, celebration: Star, illness: Heart,
    move: MapPin, job: Activity, education: BookOpen, other: Calendar,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-stone-900">我的档案</h2>
        <p className="text-stone-500">
          {nodes.length} 个节点 · {edges.length} 条关系 · {routines.length} 条作息 · {events.length} 个人生事件
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <input
          type="text"
          placeholder="搜索档案内容..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-stone-200 px-4 py-2.5 text-sm focus:border-orange-300 focus:outline-none"
        />
      </div>

      {/* 搜索结果 */}
      {filteredNodes && (
        <div className="rounded-xl border bg-white p-4">
          <p className="mb-3 text-sm font-medium text-stone-700">搜索结果 ({filteredNodes.length})</p>
          <div className="flex flex-wrap gap-2">
            {filteredNodes.map((node) => {
              const config = NODE_TYPE_CONFIG[node.nodeType] || NODE_TYPE_CONFIG.preference;
              const colors = COLOR_MAP[config.color] || COLOR_MAP.amber;
              return (
                <div key={node.id} className={cn('rounded-lg border px-3 py-1.5 text-sm', colors.light, colors.border)}>
                  <span className={cn('font-medium', colors.text)}>{config.label}</span>
                  <span className="mx-1.5 text-stone-300">·</span>
                  <span className="text-stone-700">{node.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 类型卡片 */}
      <div className="grid grid-cols-5 gap-3">
        {Object.entries(NODE_TYPE_CONFIG).map(([type, config]) => {
          const count = grouped[type]?.length || 0;
          if (count === 0) return null;
          const colors = COLOR_MAP[config.color];
          return (
            <button
              key={type}
              onClick={() => setExpandedType(expandedType === type ? null : type)}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border p-4 transition-all',
                expandedType === type ? `${colors.light} ${colors.border} border-2` : 'border-stone-200 bg-white hover:bg-stone-50'
              )}
            >
              <div className={cn('rounded-lg p-2', colors.light)}>
                <config.icon className={cn('h-5 w-5', colors.text)} />
              </div>
              <span className="text-xs font-medium text-stone-700">{config.label}</span>
              <span className="text-xs text-stone-400">{count}项</span>
            </button>
          );
        })}
      </div>

      {/* 知识图谱节点详情 */}
      {expandedType && grouped[expandedType] && (
        <div className="rounded-xl border bg-white overflow-hidden">
          <div className="border-b px-5 py-4">
            <h3 className="font-semibold text-stone-900">
              {NODE_TYPE_CONFIG[expandedType]?.label || expandedType}
            </h3>
          </div>
          <div className="divide-y">
            {grouped[expandedType].map((node) => {
              const relations = getNodeRelations(node.id);
              return (
                <div key={node.id} className="px-5 py-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-stone-900">{node.label}</p>
                      {node.description && (
                        <p className="mt-0.5 text-sm text-stone-500">{node.description}</p>
                      )}
                    </div>
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs text-stone-500">
                      重要度 {node.importance}/10
                    </span>
                  </div>
                  {relations.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {relations.slice(0, 5).map((rel) => {
                        const isSource = rel.sourceId === node.id;
                        const other = isSource ? rel.targetNode : rel.sourceNode;
                        const relLabel = RELATION_LABELS[rel.relation] || rel.relation;
                        return (
                          <span key={rel.id} className="rounded bg-stone-50 px-2 py-0.5 text-xs text-stone-600">
                            {isSource ? `→ ${relLabel} →` : `← ${relLabel} ←`} {other?.label?.split('（')[0]}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 日常作息 */}
      {routines.length > 0 && (
        <div className="rounded-xl border bg-white overflow-hidden">
          <div className="border-b px-5 py-4">
            <h3 className="font-semibold text-stone-900">日常作息</h3>
          </div>
          <div className="divide-y">
            {routines.map((r) => (
              <div key={r.id} className="flex items-center gap-4 px-5 py-3">
                <span className="w-16 text-sm font-mono font-medium text-orange-600">{r.timeOfDay}</span>
                <span className="text-sm text-stone-700">{r.activity}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 重要日期 */}
      {dates.length > 0 && (
        <div className="rounded-xl border bg-white overflow-hidden">
          <div className="border-b px-5 py-4">
            <h3 className="font-semibold text-stone-900">重要日期</h3>
          </div>
          <div className="divide-y">
            {dates.map((d) => (
              <div key={d.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-stone-700">{d.label}</p>
                  {d.notes && <p className="text-xs text-stone-400">{d.notes}</p>}
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono text-stone-600">{d.monthDay}</span>
                  {d.isLunar && <span className="ml-2 rounded bg-amber-50 px-1.5 py-0.5 text-xs text-amber-600">农历</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 人生事件 */}
      {events.length > 0 && (
        <div className="rounded-xl border bg-white overflow-hidden">
          <div className="border-b px-5 py-4">
            <h3 className="font-semibold text-stone-900">人生大事记</h3>
          </div>
          <div className="relative">
            {/* 时间线 */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-stone-200" />
            <div className="divide-y">
              {events.map((e) => {
                const Icon = EVENT_ICONS[e.eventType] || Calendar;
                const emotionColor = e.emotionalTag === 'happy' ? 'text-green-500' : e.emotionalTag === 'sad' ? 'text-red-500' : e.emotionalTag === 'proud' ? 'text-amber-500' : 'text-stone-400';
                return (
                  <div key={e.id} className="relative flex items-start gap-4 px-5 py-4 pl-16">
                    <div className="absolute left-6 top-4 rounded-full bg-white p-1">
                      <Icon className={cn('h-4 w-4', emotionColor)} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-stone-900">{e.title}</p>
                        {e.emotionalTag && (
                          <span className={cn('text-xs', emotionColor)}>
                            {e.emotionalTag === 'happy' ? '😊' : e.emotionalTag === 'sad' ? '😢' : e.emotionalTag === 'proud' ? '🏆' : '📌'}
                          </span>
                        )}
                      </div>
                      {e.description && <p className="mt-0.5 text-sm text-stone-500">{e.description}</p>}
                      <div className="mt-1 flex items-center gap-3 text-xs text-stone-400">
                        <span>{new Date(e.eventDate).toLocaleDateString('zh-CN')}</span>
                        {e.location && <span>📍 {e.location}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
