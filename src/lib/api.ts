import axios from 'axios';
import { fetchTokens, clearTokens, refreshAccessToken } from '@/src/lib/auth';

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
        
        console.log('[API] Erreur interceptée:', {
            status: error.response?.status,
            url: originalRequest?.url,
            hasRetried: originalRequest._retry
        });
        
        // Vérifier si c'est une erreur 401 et si on n'a pas déjà tenté de retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            console.log('[API] Tentative de refresh du token pour:', originalRequest.url);
            
            try {
                const newAccessToken = await refreshAccessToken();
                
                if (newAccessToken) {
                    console.log('[API] Token rafraîchi avec succès, retry de la requête');
                    // Mettre à jour le header de la requête originale
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    // Retry la requête avec le nouveau token
                    return api(originalRequest);
                } else {
                    throw new Error('No access token received');
                }
            } catch (err) {
                console.error('[API] Échec du refresh, déconnexion:', err);
                // Le refresh a échoué, déconnecter l'utilisateur
                clearTokens();
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
                return Promise.reject(err);
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;