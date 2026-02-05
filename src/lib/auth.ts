export const fetchTokens = () => {
    if (typeof window !== "undefined") {
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");
        return { accessToken, refreshToken };
    }
    return null;
}

export const setTokens = (accessToken?: string, refreshToken?: string) => {
    if (typeof window !== "undefined") {
        if (accessToken) localStorage.setItem("accessToken", accessToken);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
        // Dispatch event for auth state change
        window.dispatchEvent(new Event('authStateChanged'));
    }
}

export const clearTokens = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // Dispatch event for auth state change
        window.dispatchEvent(new Event('authStateChanged'));
    }
}

// Variable pour stocker la promesse de refresh en cours
let refreshTokenPromise: Promise<string> | null = null;

export const refreshAccessToken = async () => {
    // Si un refresh est déjà en cours, retourner la même promesse
    if (refreshTokenPromise) {
        console.log('[Auth] Refresh déjà en cours, réutilisation de la promesse');
        return refreshTokenPromise;
    }

    refreshTokenPromise = (async () => {
        try {
            const tokens = fetchTokens();
            const refreshToken = tokens?.refreshToken;
            
            console.log('[Auth] Tentative de refresh du token', {
                hasRefreshToken: !!refreshToken,
                refreshTokenLength: refreshToken?.length
            });

            if (!refreshToken) {
                throw new Error("No refresh token available");
            }

            const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh-token`;
            console.log('[Auth] Appel API refresh:', url);

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${refreshToken}`
                }
            });

            console.log('[Auth] Réponse refresh:', {
                status: response.status,
                ok: response.ok
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('[Auth] Erreur refresh token:', errorData);
                throw new Error(`Failed to refresh access token: ${response.status} - ${errorData.message || 'Unknown error'}`);
            }

            const data = await response.json();
            
            if (!data.accessToken) {
                console.error('[Auth] Pas d\'accessToken dans la réponse:', data);
                throw new Error("No access token in response");
            }
            
            console.log('[Auth] Nouveau token reçu, longueur:', data.accessToken.length);
            setTokens(data.accessToken);
            return data.accessToken;
        } catch (error) {
            console.error('[Auth] Erreur lors du refresh:', error);
            clearTokens();
            throw error;
        } finally {
            // Réinitialiser la promesse après un court délai
            setTimeout(() => {
                refreshTokenPromise = null;
            }, 100);
        }
    })();

    return refreshTokenPromise;
}