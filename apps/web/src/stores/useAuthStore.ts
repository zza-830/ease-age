import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';

interface User {
  id: string;
  phoneNumber: string;
  fullName: string;
  role: string;
  avatarUrl: string | null;
  isActive: boolean;
  elderlyProfile?: any;
  familyRelations?: any[];
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (phoneNumber: string, password: string) => Promise<void>;
  register: (data: { phoneNumber: string; password: string; fullName: string; role: string }) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (phoneNumber: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<{ data: { user: User; accessToken: string; refreshToken: string } }>(
            '/auth/login',
            { phoneNumber, password }
          );
          const { user, accessToken, refreshToken } = response.data;
          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({ isLoading: false, error: error.message || '登录失败' });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<{ data: { user: User; accessToken: string; refreshToken: string } }>(
            '/auth/register',
            data
          );
          const { user, accessToken, refreshToken } = response.data;
          set({
            user,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: any) {
          set({ isLoading: false, error: error.message || '注册失败' });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      fetchProfile: async () => {
        const { accessToken } = get();
        if (!accessToken) return;

        try {
          const response = await api.get<{ data: User }>('/auth/profile', accessToken);
          set({ user: response.data });
        } catch (error) {
          // Token expired, logout
          get().logout();
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'easeage-auth',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
