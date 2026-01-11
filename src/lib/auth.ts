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
    }
}

export const clearTokens = () => {
    if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    }
}

export const refreshAccessToken = async () => {
    try {
        const refreshToken = fetchTokens()?.refreshToken;
        if (!refreshToken) throw new Error("No refresh token available");

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/refresh-token`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refreshToken}`
            }
        });

        if (!response.ok) throw new Error("Failed to refresh access token");
        const data = await response.json();
        setTokens(data.accessToken);
        return data.accessToken;
    } catch (error) {
        clearTokens();
        throw error;

    }
}