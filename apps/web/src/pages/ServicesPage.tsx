import { useState, useEffect } from 'react';
import {
  Search, Home, UtensilsCrossed, Stethoscope, Wrench,
  Heart, ShoppingBag, Scissors, Truck, ShieldCheck,
  Phone, Clock, Star, ChevronRight, Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

const CATEGORY_ICONS: Record<string, any> = {
  '家政服务': Home,
  '送餐服务': UtensilsCrossed,
  '陪诊服务': Stethoscope,
  '维修服务': Wrench,
  '健康咨询': Heart,
  '理发服务': Scissors,
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; light: string }> = {
  '家政服务': { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50' },
  '送餐服务': { bg: 'bg-orange-500', text: 'text-orange-600', light: 'bg-orange-50' },
  '陪诊服务': { bg: 'bg-green-500', text: 'text-green-600', light: 'bg-green-50' },
  '维修服务': { bg: 'bg-violet-500', text: 'text-violet-600', light: 'bg-violet-50' },
  '健康咨询': { bg: 'bg-red-500', text: 'text-red-600', light: 'bg-red-50' },
  '理发服务': { bg: 'bg-pink-500', text: 'text-pink-600', light: 'bg-pink-50' },
};

interface ServiceItem {
  id: string;
  categoryId: string;
  serviceName: string;
  descriptionText: string;
  basePrice: number;
  priceUnit: string;
  categoryName: string;
}

interface CategoryInfo {
  id: string;
  categoryName: string;
  iconIdentifier: string;
  serviceCount?: number;
}

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [catRes, svcRes] = await Promise.all([
        api.get<{ data: any[] }>('/services/categories').catch(() => ({ data: [] })),
        api.get<{ data: { items: any[] } }>('/services').catch(() => ({ data: { items: [] } })),
      ]);
      setCategories(catRes.data || []);
      const items = (svcRes.data?.items || []).map((s: any) => ({
        id: s.id,
        categoryId: s.categoryId,
        serviceName: s.serviceName,
        descriptionText: s.descriptionText,
        basePrice: s.basePrice,
        priceUnit: s.priceUnit,
        categoryName: s.category?.categoryName || '其他',
      }));
      setServices(items);
    } catch (err) {
      console.error('获取服务数据失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = services.filter((s) => {
    const matchCat = !selectedCategory || s.categoryName === selectedCategory;
    const matchSearch = !searchQuery || s.serviceName.includes(searchQuery) || s.descriptionText.includes(searchQuery);
    return matchCat && matchSearch;
  });

  // 统计每个分类的服务数量
  const catCounts = new Map<string, number>();
  for (const s of services) {
    catCounts.set(s.categoryName, (catCounts.get(s.categoryName) || 0) + 1);
  }

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
        <h2 className="text-2xl font-bold text-stone-900">增值服务</h2>
        <p className="text-stone-500">专业服务，贴心到家</p>
      </div>

      {/* Search */}
      <div className="relative max-w-lg">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="搜索服务..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-stone-200 pl-10 pr-4 py-2.5 text-sm focus:border-orange-300 focus:outline-none"
        />
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
        <button
          onClick={() => setSelectedCategory(null)}
          className={cn(
            'flex flex-col items-center gap-2 rounded-xl border p-4 transition-all',
            !selectedCategory
              ? 'border-orange-300 bg-orange-50'
              : 'border-stone-200 bg-white hover:bg-stone-50'
          )}
        >
          <div className="rounded-lg bg-stone-100 p-2">
            <Sparkles className="h-5 w-5 text-stone-600" />
          </div>
          <span className="text-xs font-medium text-stone-700">全部</span>
          <span className="text-xs text-stone-400">{services.length}项</span>
        </button>

        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.categoryName] || ShoppingBag;
          const colors = CATEGORY_COLORS[cat.categoryName] || { text: 'text-stone-600', light: 'bg-stone-50' };
          const count = catCounts.get(cat.categoryName) || 0;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.categoryName ? null : cat.categoryName)}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border p-4 transition-all',
                selectedCategory === cat.categoryName
                  ? 'border-orange-300 bg-orange-50'
                  : 'border-stone-200 bg-white hover:bg-stone-50'
              )}
            >
              <div className={cn('rounded-lg p-2', colors.light)}>
                <Icon className={cn('h-5 w-5', colors.text)} />
              </div>
              <span className="text-xs font-medium text-stone-700">{cat.categoryName}</span>
              <span className="text-xs text-stone-400">{count}项</span>
            </button>
          );
        })}
      </div>

      {/* Service List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((service) => {
          const Icon = CATEGORY_ICONS[service.categoryName] || ShoppingBag;
          const colors = CATEGORY_COLORS[service.categoryName] || { text: 'text-stone-600', light: 'bg-stone-50', bg: 'bg-stone-500' };
          return (
            <div key={service.id} className="rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className={cn('rounded-xl p-3', colors.light)}>
                  <Icon className={cn('h-6 w-6', colors.text)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-stone-900 truncate">{service.serviceName}</h3>
                    <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-xs font-medium', colors.light, colors.text)}>
                      {service.categoryName}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-stone-500 line-clamp-2">{service.descriptionText}</p>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-stone-400">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                        4.8
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        预约上门
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-orange-600">¥{service.basePrice}</span>
                      <span className="text-xs text-stone-400">/{service.priceUnit}</span>
                    </div>
                  </div>

                  <button className="mt-3 w-full flex items-center justify-center gap-1 rounded-lg bg-orange-500 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors">
                    立即预约
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-stone-400">
          <ShoppingBag className="mx-auto h-10 w-10 mb-3" />
          <p>未找到匹配的服务</p>
        </div>
      )}
    </div>
  );
}
