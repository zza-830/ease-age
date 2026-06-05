import { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Heart,
  Brain,
  Apple,
  Moon,
  Bookmark,
  Clock,
  Eye,
  ChevronRight
} from 'lucide-react';
import { api } from '@/lib/api';

interface Article {
  id: string;
  title: string;
  summary: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  views: number;
  isBookmarked: boolean;
  coverImage: string;
}

const mockArticles: Article[] = [
  { id: '1', title: '老年人高血压饮食指南', summary: '了解如何通过饮食控制血压...', category: '健康养生', author: '张医生', date: '2026-06-05', readTime: '5分钟', views: 1234, isBookmarked: true, coverImage: '🥗' },
  { id: '2', title: '糖尿病患者的日常管理', summary: '血糖监测、饮食控制和运动建议...', category: '疾病预防', author: '李医生', date: '2026-06-04', readTime: '8分钟', views: 892, isBookmarked: false, coverImage: '💉' },
  { id: '3', title: '老年人心理健康指南', summary: '如何保持积极心态，预防抑郁...', category: '心理关怀', author: '王心理师', date: '2026-06-03', readTime: '6分钟', views: 567, isBookmarked: true, coverImage: '🧠' },
  { id: '4', title: '夏季老年人养生要点', summary: '防暑降温、饮食调理建议...', category: '健康养生', author: '赵营养师', date: '2026-06-02', readTime: '4分钟', views: 2341, isBookmarked: false, coverImage: '☀️' },
  { id: '5', title: '老年人睡眠改善方法', summary: '失眠原因分析及改善建议...', category: '生活常识', author: '刘医生', date: '2026-06-01', readTime: '7分钟', views: 1567, isBookmarked: true, coverImage: '😴' },
  { id: '6', title: '关节炎的预防与护理', summary: '关节保护、运动建议...', category: '疾病预防', author: '陈医生', date: '2026-05-31', readTime: '6分钟', views: 789, isBookmarked: false, coverImage: '🦴' },
];

const getCategoryEmoji = (category?: string) => {
  const emojiMap: Record<string, string> = {
    '健康养生': '🥗',
    '疾病预防': '💉',
    '心理关怀': '🧠',
    '生活常识': '😴',
    '运动健身': '🏃',
    '营养饮食': '🍎',
  };
  return emojiMap[category || ''] || '📚';
};

const iconMap: Record<string, any> = {
  '全部': BookOpen,
  '健康养生': Heart,
  '疾病预防': Apple,
  '心理关怀': Brain,
  '生活常识': Moon,
};

interface CategoryInfo {
  id?: string;
  name: string;
  icon: any;
  count: number;
}

export default function KnowledgePage() {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>([
    { name: '全部', icon: BookOpen, count: 156 },
    { name: '健康养生', icon: Heart, count: 45 },
    { name: '疾病预防', icon: Apple, count: 38 },
    { name: '心理关怀', icon: Brain, count: 28 },
    { name: '生活常识', icon: Moon, count: 45 },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory, searchQuery]);

  const fetchCategories = async () => {
    try {
      const response = await api.get<{ data: any[] }>('/knowledge/categories');
      const categoryList: CategoryInfo[] = [
        { name: '全部', icon: BookOpen, count: 0 },
        ...response.data.map(cat => ({
          id: cat.id,
          name: cat.categoryName,
          icon: iconMap[cat.categoryName] || BookOpen,
          count: cat.articleCount || 0,
        })),
      ];
      setCategories(categoryList);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchArticles = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory !== '全部') {
        const cat = categories.find(c => c.name === selectedCategory);
        if (cat?.id) params.append('categoryId', cat.id);
      }
      if (searchQuery) params.append('search', searchQuery);

      const response = await api.get<{ data: { items: any[] } }>(`/knowledge/articles?${params}`);
      const formattedArticles = response.data.items.map(item => ({
        id: item.id,
        title: item.title,
        summary: item.summaryText || '',
        category: item.category?.categoryName || '其他',
        author: item.authorName || '匿名',
        date: new Date(item.publishedAt || item.createdAt).toLocaleDateString('zh-CN'),
        readTime: '5分钟',
        views: item.viewCount,
        isBookmarked: false,
        coverImage: getCategoryEmoji(item.category?.categoryName),
      }));
      setArticles(formattedArticles);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      setArticles(mockArticles);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === '全部' || article.category === selectedCategory;
    const matchesSearch = !searchQuery || article.title.includes(searchQuery) || article.summary.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-stone-900">知识库</h2>
        <p className="text-stone-500">健康养生知识，与家人共享</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="搜索知识文章..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-stone-200 pl-10 pr-4 py-3 text-sm focus:border-orange-300 focus:outline-none"
        />
      </div>

      <div className="flex gap-6">
        {/* Sidebar Categories */}
        <div className="w-64 space-y-2">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left ${
                selectedCategory === category.name
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-stone-600 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center">
                <category.icon className="mr-3 h-5 w-5" />
                <span className="font-medium">{category.name}</span>
              </div>
              <span className="text-sm text-stone-400">{category.count}</span>
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="flex-1">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
            </div>
          )}

          {!isLoading && (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredArticles.map((article) => (
                <div key={article.id} className="rounded-xl border bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-[2/1] bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                    <span className="text-6xl">{article.coverImage}</span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-600">
                        {article.category}
                      </span>
                      <button className={`p-1 ${article.isBookmarked ? 'text-orange-500' : 'text-stone-400'}`}>
                        <Bookmark className={`h-4 w-4 ${article.isBookmarked ? 'fill-orange-500' : ''}`} />
                      </button>
                    </div>
                    <h3 className="mt-2 font-semibold text-stone-900 line-clamp-2">{article.title}</h3>
                    <p className="mt-1 text-sm text-stone-500 line-clamp-2">{article.summary}</p>
                    <div className="mt-4 flex items-center justify-between text-xs text-stone-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {article.readTime}
                        </span>
                        <span className="flex items-center">
                          <Eye className="mr-1 h-3 w-3" />
                          {article.views}
                        </span>
                      </div>
                      <span>{article.date}</span>
                    </div>
                    <button className="mt-4 w-full flex items-center justify-center rounded-lg border py-2 text-sm font-medium text-stone-700 hover:bg-stone-50">
                      阅读全文
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-stone-500">未找到匹配的文章</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
