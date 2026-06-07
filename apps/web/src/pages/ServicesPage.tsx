import { useState, useEffect } from 'react';
import {
  Search,
  Star,
  Filter
} from 'lucide-react';
import { api } from '@/lib/api';

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  rating: number;
  reviewCount: number;
  image: string;
}

const serviceImages: Record<string, string> = {
  '日常保洁': '/images/services/cleaning.png',
  '营养送餐': '/images/services/meal.webp',
  '医院陪诊': '/images/services/companion.jpg',
  '家电维修': '/images/services/repair.jpg',
  '健康咨询': '/images/services/consultation.jpg',
};

const mockServices: Service[] = [
  { id: '1', name: '日常保洁', category: '家政服务', description: '专业保洁人员上门服务', price: 80, unit: '次', rating: 4.8, reviewCount: 256, image: '/images/services/cleaning.png' },
  { id: '2', name: '营养送餐', category: '生活服务', description: '营养均衡的每日三餐', price: 25, unit: '餐', rating: 4.9, reviewCount: 1024, image: '/images/services/meal.webp' },
  { id: '3', name: '医院陪诊', category: '医疗服务', description: '专业陪诊人员陪同就医', price: 200, unit: '次', rating: 4.7, reviewCount: 89, image: '/images/services/companion.jpg' },
  { id: '4', name: '家电维修', category: '维修服务', description: '各类家电维修保养', price: 50, unit: '次', rating: 4.6, reviewCount: 178, image: '/images/services/repair.jpg' },
  { id: '5', name: '健康咨询', category: '健康服务', description: '专业按摩师上门服务', price: 150, unit: '次', rating: 4.9, reviewCount: 342, image: '/images/services/consultation.jpg' },
  { id: '6', name: '代购服务', category: '生活服务', description: '日常用品代购', price: 15, unit: '次', rating: 4.5, reviewCount: 567, image: '/images/services/cleaning.png' },
];

const getCategoryEmoji = (category?: string) => {
  const emojiMap: Record<string, string> = {
    '家政服务': '🏠',
    '送餐服务': '🍱',
    '陪诊服务': '🏥',
    '维修服务': '🔧',
    '健康咨询': '💊',
    '生活服务': '🛒',
    '医疗服务': '🏥',
    '健康服务': '💆',
  };
  return emojiMap[category || ''] || '📦';
};

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<string[]>(['全部']);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get<{ data: any[] }>('/services/categories');
      const categoryNames = response.data.map(cat => cat.categoryName);
      setCategories(['全部', ...categoryNames]);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Use default categories as fallback
      setCategories(['全部', '家政服务', '生活服务', '医疗服务', '维修服务', '健康服务']);
    }
  };

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<{ data: { items: any[] } }>('/services');
      const formattedServices = response.data.items.map(item => ({
        id: item.id,
        name: item.serviceName,
        category: item.category?.categoryName || '其他',
        description: item.descriptionText,
        price: item.basePrice,
        unit: item.priceUnit,
        rating: 4.8,
        reviewCount: 100,
        image: serviceImages[item.serviceName] || '/images/services/cleaning.png',
      }));
      setServices(formattedServices);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      setServices(mockServices);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === '全部' || service.category === selectedCategory;
    const matchesSearch = !searchQuery || service.name.includes(searchQuery) || service.description.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-stone-900">增值服务</h2>
        <p className="text-stone-500">为您提供便捷的生活服务</p>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="搜索服务..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-stone-200 pl-10 pr-4 py-3 text-sm focus:border-orange-300 focus:outline-none"
          />
        </div>
        <button className="flex items-center rounded-lg border px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50">
          <Filter className="mr-2 h-4 w-4" />
          筛选
        </button>
      </div>

      {/* Categories */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap ${
              selectedCategory === category
                ? 'bg-orange-500 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
        </div>
      )}

      {/* Service Grid */}
      {!isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredServices.map((service) => (
            <div key={service.id} className="rounded-xl border bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center overflow-hidden">
                <img
                  src={serviceImages[service.name] || '/images/services/cleaning.png'}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-stone-900">{service.name}</h3>
                    <p className="mt-1 text-sm text-stone-500">{service.description}</p>
                  </div>
                  <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-600">
                    {service.category}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1 text-sm font-medium text-stone-700">{service.rating}</span>
                      <span className="ml-1 text-xs text-stone-500">({service.reviewCount})</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-orange-600">¥{service.price}</span>
                    <span className="text-sm text-stone-500">/{service.unit}</span>
                  </div>
                </div>
                <button className="mt-4 w-full rounded-lg bg-orange-500 py-2.5 text-sm font-medium text-white hover:bg-orange-600">
                  立即预约
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredServices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-stone-500">未找到匹配的服务</p>
        </div>
      )}
    </div>
  );
}
