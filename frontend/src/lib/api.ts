import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    // We use localStorage for Access Token (in-memory would be better but simple reload persistence is needed)
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Prevent infinite loop
        if (originalRequest.url?.includes('/auth/refresh')) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Call refresh endpoint - it uses HttpOnly cookie
                const { data } = await api.get('/auth/refresh');
                const newToken = data.accessToken;

                if (typeof window !== 'undefined') {
                    localStorage.setItem('accessToken', newToken);
                }

                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (err) {
                // Refresh failed, logout
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('accessToken');
                    window.location.href = '/login';
                }
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);
