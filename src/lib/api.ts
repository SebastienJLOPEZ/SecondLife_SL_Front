import axios from 'axios';
import { fetchTokens, clearTokens, refreshAccessToken } from '@/lib/auth';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    async (config) => {
        const tokens = fetchTokens();
        if (tokens?.accessToken) {
            config.headers['Authorization'] = `Bearer ${tokens.accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newAccessToken = await refreshAccessToken();
                if(newAccessToken) {
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                }
            } catch (err) {
                clearTokens();
                setTimeout(() => {
                    window.location.href = '/login';
                }, 5000);
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default api;