import { create } from 'zustand';
import { api } from '@/lib/api';

interface User {
    id: string;
    email: string;
    fullName: string;
    isSuperAdmin: boolean;
}

interface AuthState {
    user: User | null;
    isLoading: boolean;
    login: (creds: any) => Promise<void>;
    register: (creds: any) => Promise<void>;
    logout: () => Promise<void>;
    fetchUser: () => Promise<void>;
    setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: true,
    setUser: (user) => set({ user }),
    login: async (creds) => {
        const { data } = await api.post('/auth/login', creds);
        localStorage.setItem('accessToken', data.accessToken);
        set({ user: data.data.user });
    },
    register: async (creds) => {
        const { data } = await api.post('/auth/register', creds);
        localStorage.setItem('accessToken', data.accessToken);
        set({ user: data.data.user });
    },
    logout: async () => {
        try {
            await api.get('/auth/logout');
        } catch (e) { }
        localStorage.removeItem('accessToken');
        set({ user: null });
        window.location.href = '/login';
    },
    fetchUser: async () => {
        try {
            set({ isLoading: true });
            const { data } = await api.get('/users/me');
            set({ user: data.data, isLoading: false });
        } catch (e) {
            set({ user: null, isLoading: false });
        }
    }
}));
