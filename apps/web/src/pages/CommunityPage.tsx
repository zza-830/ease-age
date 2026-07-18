import { useState, useEffect } from 'react';
import {
  MessageSquare, Heart, Eye, Plus, Search,
  Calendar, HelpCircle, Share2, Megaphone, Pin, Send,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/useAuthStore';

const POST_TYPES: Record<string, { icon: any; color: string; label: string }> = {
  activity: { icon: Calendar, color: 'text-blue-500', label: '社区活动' },
  help: { icon: HelpCircle, color: 'text-amber-500', label: '邻里互助' },
  share: { icon: Share2, color: 'text-green-500', label: '生活分享' },
  notice: { icon: Megaphone, color: 'text-red-500', label: '社区公告' },
};

interface Post {
  id: string;
  postType: string;
  title: string;
  content: string;
  viewCount: number;
  likeCount: number;
  isPinned: boolean;
  createdAt: string;
  author: { id: string; fullName: string; avatarUrl: string | null };
  _count?: { comments: number };
}

export default function CommunityPage() {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', postType: 'share' });

  useEffect(() => {
    fetchPosts();
  }, [selectedType]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedType) params.append('postType', selectedType);
      const res = await api.get<{ data: { posts: Post[] } }>(`/community/posts?${params}`)
        .catch(() => ({ data: { posts: [] } }));
      setPosts(res.data?.posts || []);
    } catch (err) {
      console.error('获取帖子失败:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await api.post(`/community/posts/${postId}/like`, {});
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, likeCount: p.likeCount + 1 } : p))
      );
    } catch {}
  };

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;
    try {
      await api.post('/community/posts', newPost);
      setShowNewPost(false);
      setNewPost({ title: '', content: '', postType: 'share' });
      fetchPosts();
    } catch {}
  };

  const filteredPosts = posts.filter(
    (p) => !searchQuery || p.title.includes(searchQuery) || p.content.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">社区服务</h2>
          <p className="text-stone-500">邻里互助，温暖社区</p>
        </div>
        <button
          onClick={() => setShowNewPost(true)}
          className="flex items-center gap-1 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
        >
          <Plus className="h-4 w-4" />
          发帖
        </button>
      </div>

      {/* 搜索 */}
      <div className="relative max-w-lg">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="搜索帖子..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-stone-200 pl-10 pr-4 py-2.5 text-sm focus:border-orange-300 focus:outline-none"
        />
      </div>

      {/* 类型筛选 */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelectedType(null)}
          className={cn(
            'rounded-full px-4 py-2 text-sm font-medium',
            !selectedType ? 'bg-orange-500 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
          )}
        >
          全部
        </button>
        {Object.entries(POST_TYPES).map(([type, config]) => (
          <button
            key={type}
            onClick={() => setSelectedType(selectedType === type ? null : type)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-medium',
              selectedType === type ? 'bg-orange-500 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            )}
          >
            {config.label}
          </button>
        ))}
      </div>

      {/* 帖子列表 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-stone-300" />
          <p className="mt-4 text-stone-500">暂无帖子</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post) => {
            const typeConfig = POST_TYPES[post.postType] || POST_TYPES.share;
            return (
              <div key={post.id} className="rounded-xl border bg-white p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                    <span className="text-sm font-medium text-orange-600">
                      {post.author.fullName[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {post.isPinned && <Pin className="h-3.5 w-3.5 text-orange-500" />}
                      <span className={cn('rounded-full px-2 py-0.5 text-xs font-medium bg-stone-50', typeConfig.color)}>
                        {typeConfig.label}
                      </span>
                      <span className="text-xs text-stone-400">{post.author.fullName}</span>
                      <span className="text-xs text-stone-400">
                        {new Date(post.createdAt).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    <h3 className="mt-2 font-semibold text-stone-900">{post.title}</h3>
                    <p className="mt-1 text-sm text-stone-500 line-clamp-2">{post.content}</p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-stone-400">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center gap-1 hover:text-red-500 transition-colors"
                      >
                        <Heart className="h-3.5 w-3.5" />
                        {post.likeCount}
                      </button>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" />
                        {post._count?.comments || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        {post.viewCount}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 发帖弹窗 */}
      {showNewPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowNewPost(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-stone-900 mb-4">发布帖子</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">类型</label>
                <div className="flex gap-2">
                  {Object.entries(POST_TYPES).map(([type, config]) => (
                    <button
                      key={type}
                      onClick={() => setNewPost((p) => ({ ...p, postType: type }))}
                      className={cn(
                        'rounded-lg px-3 py-1.5 text-sm',
                        newPost.postType === type ? 'bg-orange-500 text-white' : 'bg-stone-100 text-stone-700'
                      )}
                    >
                      {config.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">标题</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost((p) => ({ ...p, title: e.target.value }))}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-orange-300 focus:outline-none"
                  placeholder="输入标题..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">内容</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost((p) => ({ ...p, content: e.target.value }))}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-orange-300 focus:outline-none"
                  rows={4}
                  placeholder="输入内容..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowNewPost(false)}
                  className="rounded-lg border px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                >
                  取消
                </button>
                <button
                  onClick={handleCreatePost}
                  disabled={!newPost.title.trim() || !newPost.content.trim()}
                  className="flex items-center gap-1 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  发布
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
