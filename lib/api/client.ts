import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const api = axios.create({
    baseURL: `${API_BASE_URL}/api/v1`,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000,
});

// Token management
const TOKEN_KEY = "kobae_access_token";
const REFRESH_TOKEN_KEY = "kobae_refresh_token";

export function getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/**
 * Decode a JWT token and extract the payload (without verification)
 */
function decodeJwtPayload(token: string): { exp?: number; iat?: number } | null {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const payload = JSON.parse(atob(parts[1]));
        return payload;
    } catch {
        return null;
    }
}

/**
 * Check if a token is expired or will expire within the given buffer (in seconds)
 */
export function isTokenExpired(token: string | null, bufferSeconds = 60): boolean {
    if (!token) return true;
    const payload = decodeJwtPayload(token);
    if (!payload?.exp) return true;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp <= now + bufferSeconds;
}

/**
 * Ensure we have a valid (non-expired) access token.
 * If the current token is expired or about to expire, refresh it.
 * Returns the valid access token or null if refresh fails.
 */
export async function ensureValidAccessToken(): Promise<string | null> {
    const currentToken = getAccessToken();
    
    // If token is valid (not expired within 60 seconds), return it
    if (currentToken && !isTokenExpired(currentToken, 60)) {
        return currentToken;
    }
    
    // Token is expired or about to expire, try to refresh
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
        return null;
    }
    
    try {
        const newToken = await refreshAccessToken();
        return newToken;
    } catch {
        // Refresh failed, clear tokens
        clearTokens();
        return null;
    }
}

const REFRESH_BYPASS_HEADER = "x-skip-auth-refresh";
let refreshPromise: Promise<string> | null = null;

function shouldSkipAuthRefresh(config?: InternalAxiosRequestConfig): boolean {
    return config?.headers?.[REFRESH_BYPASS_HEADER] === "true";
}

function redirectToLogin() {
    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
    }
}

async function refreshAccessToken(): Promise<string> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
        throw new Error("No refresh token available");
    }

    const response = await api.post<import("./types").AuthResponse>(
        "/auth/refresh",
        { refresh_token: refreshToken },
        {
            headers: {
                [REFRESH_BYPASS_HEADER]: "true",
            },
        }
    );

    const { access_token, refresh_token } = response.data;
    setTokens(access_token, refresh_token);
    return access_token;
}

// Request interceptor: inject Bearer token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (shouldSkipAuthRefresh(config)) {
        return config;
    }

    const token = getAccessToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor: handle 401 → redirect to login
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as (InternalAxiosRequestConfig & {
            _retry?: boolean;
        }) | undefined;

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !shouldSkipAuthRefresh(originalRequest)
        ) {
            originalRequest._retry = true;

            try {
                if (!refreshPromise) {
                    refreshPromise = refreshAccessToken().finally(() => {
                        refreshPromise = null;
                    });
                }

                const newAccessToken = await refreshPromise;
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }

                return api(originalRequest);
            } catch {
                clearTokens();
                redirectToLogin();
            }
        }

        if (error.response?.status === 401) {
            clearTokens();
            redirectToLogin();
        }

        return Promise.reject(error);
    }
);

// ── Auth API ──────────────────────────────────────────────

export const authApi = {
    signup: (data: import("./types").SignupRequest) =>
        api.post<import("./types").OTPResponse>("/auth/signup", data),

    login: (data: import("./types").LoginRequest) =>
        api.post<import("./types").AuthResponse>("/auth/login", data),

    refresh: (data: import("./types").RefreshTokenRequest) =>
        api.post<import("./types").AuthResponse>("/auth/refresh", data, {
            headers: {
                [REFRESH_BYPASS_HEADER]: "true",
            },
        }),

    logout: (data: import("./types").LogoutRequest) =>
        api.post<{ message: string }>("/auth/logout", data, {
            headers: {
                [REFRESH_BYPASS_HEADER]: "true",
            },
        }),

    verifyOTP: (data: import("./types").VerifyOTPRequest) =>
        api.post<import("./types").AuthResponse>("/auth/verify-otp", data),

    resendOTP: (data: import("./types").ResendOTPRequest) =>
        api.post<import("./types").OTPResponse>("/auth/resend-otp", data),

    forgotPassword: (data: import("./types").ForgotPasswordRequest) =>
        api.post<import("./types").ForgotPasswordResponse>("/auth/forgot-password", data),

    verifyPasswordResetOTP: (data: import("./types").VerifyPasswordResetOTPRequest) =>
        api.post<import("./types").VerifyPasswordResetOTPResponse>("/auth/verify-password-reset-otp", data),

    resetPassword: (data: import("./types").ResetPasswordRequest) =>
        api.post<import("./types").ResetPasswordResponse>("/auth/reset-password", data),
};

// ── Profile API ───────────────────────────────────────────

export const profileApi = {
    create: (data: import("./types").CreateProfileRequest) =>
        api.post<import("./types").ProfileResponse>("/profile", data),

    get: () => api.get<import("./types").ProfileResponse>("/profile"),

    update: (data: import("./types").UpdateProfileRequest) =>
        api.patch<import("./types").ProfileResponse>("/profile", data),

    updateBio: (data: import("./types").UpdateBioRequest) =>
        api.put<import("./types").ProfileResponse>("/profile/bio", data),

    uploadPhoto: (file: File) => {
        const formData = new FormData();
        formData.append("photo", file);
        return api.post<import("./types").UploadPhotoResponse>(
            "/profile/photo",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
    },

    deletePhoto: () => api.delete("/profile/photo"),
};

// ── Tags API ──────────────────────────────────────────────

export const tagsApi = {
    getHobbies: () =>
        api.get<import("./types").TagsResponse>("/profile/hobbies"),

    updateHobbies: (data: import("./types").UpdateTagsRequest) =>
        api.put<import("./types").TagsResponse>("/profile/hobbies", data),

    getSkills: () =>
        api.get<import("./types").TagsResponse>("/profile/skills"),

    updateSkills: (data: import("./types").UpdateTagsRequest) =>
        api.put<import("./types").TagsResponse>("/profile/skills", data),
};

// ── Intent API ────────────────────────────────────────────

export const intentApi = {
    get: () => api.get<import("./types").IntentResponse>("/profile/intent"),

    update: (data: import("./types").UpdateIntentRequest) =>
        api.put<import("./types").IntentResponse>("/profile/intent", data),
};

// ── Prompts API ───────────────────────────────────────────

export const promptsApi = {
    get: () =>
        api.get<import("./types").UserPromptResponse[]>("/profile/prompts"),

    update: (data: import("./types").UpdateUserPromptRequest[]) =>
        api.put("/profile/prompts", data),
};

// ── Questionnaire API ─────────────────────────────────────

export const questionnaireApi = {
    getQuestions: () =>
        api.get<{ questions: import("./types").Question[] }>(
            "/questionnaire/questions"
        ),

    submitAnswer: (data: import("./types").SubmitAnswerRequest) =>
        api.post("/questionnaire/answer", data),

    bulkSubmitAnswers: (data: import("./types").BulkSubmitRequest) =>
        api.post("/questionnaire/answers", data),

    getResult: () =>
        api.get<import("./types").QuestionnaireResultResponse>(
            "/questionnaire/result"
        ),
};

// ── Kode API ──────────────────────────────────────────────

export const kodeApi = {
    calculate: () =>
        api.post<{ kode: import("./types").KodeResponse }>("/kode/calculate"),

    getResult: () =>
        api.get<{ kode: import("./types").KodeResponse }>("/kode/result"),
};

// ── Offers API ────────────────────────────────────────────

export const offersApi = {
    get: () =>
        api.get<{ offers: import("./types").OfferResponse[] }>(
            "/profile/offers"
        ),

    update: (data: import("./types").UpdateOffersRequest) =>
        api.put("/profile/offers", data),
};

// ── Discovery API ─────────────────────────────────────────

export const discoveryApi = {
    getRecommendation: () =>
        api.get<import("./types").DiscoveryResponse>(
            "/discovery/recommendation"
        ),

    skipProfile: (data: { skipped_user_id: string }) =>
        api.post("/discovery/skip", data),
};

// ── Connections API ───────────────────────────────────────

export const connectionsApi = {
    sendRequest: (data: import("./types").SendConnectionRequest) =>
        api.post("/connections/request", data),

    acceptRequest: (data: import("./types").RespondConnectionRequest) =>
        api.post("/connections/accept", data),

    declineRequest: (data: import("./types").RespondConnectionRequest) =>
        api.post("/connections/decline", data),

    getPendingRequests: () =>
        api.get<{ requests: import("./types").ConnectionRequestItem[] }>(
            "/connections/requests"
        ),

    getConnections: () =>
        api.get<{ connections: import("./types").ConnectionCard[] }>(
            "/connections"
        ),

    removeConnection: (userId: string) =>
        api.post("/connections/remove", { user_id: userId } as import("./types").RemoveConnectionRequest),
};

// ── Users / Public Profile API ────────────────────────────

export const usersApi = {
    getPublicProfile: (userId: string) =>
        api.get<import("./types").FullPublicProfile>(
            `/users/${userId}/profile`
        ),

    getMutualConnections: (userId: string) =>
        api.get<{
            mutual_connections: import("./types").MutualConnection[];
        }>(`/users/${userId}/mutual-connections`),

    blockUser: (userId: string) =>
        api.post(`/users/${userId}/block`),

    searchUsers: (q: string) =>
        api.get<{ users: import("./types").UserSearchResult[] }>(`/users/search`, { params: { q } }),
};

// ── Notifications API ─────────────────────────────────────

export const notificationsApi = {
    getAll: (params?: { limit?: number; offset?: number }) =>
        api.get<{ notifications: import("./types").NotificationItem[] }>(
            "/notifications",
            { params }
        ),

    getUnreadCount: () =>
        api.get<{ count: number }>("/notifications/unread-count"),

    markRead: (id: string) =>
        api.post(`/notifications/${id}/read`),

    markAllRead: () =>
        api.post("/notifications/read-all"),
};

// ── Chat API ──────────────────────────────────────────────

export const chatApi = {
    getConversations: () =>
        api.get<import("./types").ConversationListResponse>("/chat/conversations"),

    createConversation: (data: import("./types").CreateConversationRequest) =>
        api.post<import("./types").ConversationResponse>("/chat/conversations", data),

    getConversation: (conversationId: string) =>
        api.get<import("./types").ConversationResponse>(
            `/chat/conversations/${conversationId}`
        ),

    getMessages: (conversationId: string, params?: { limit?: number; before?: string }) =>
        api.get<import("./types").MessageListResponse>(
            `/chat/conversations/${conversationId}/messages`,
            { params }
        ),

    sendMessage: (conversationId: string, data: import("./types").SendMessageRequest) =>
        api.post<import("./types").MessageResponse>(
            `/chat/conversations/${conversationId}/messages`,
            data
        ),

    markRead: (conversationId: string) =>
        api.post<import("./types").MarkReadResponse>(
            `/chat/conversations/${conversationId}/read`
        ),

    getUnreadCount: () =>
        api.get<import("./types").ChatUnreadCountResponse>("/chat/unread-count"),
};

// ── WebSocket URL Helper ──────────────────────────────────

export function getChatWebSocketUrl(): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const wsProtocol = baseUrl.startsWith("https") ? "wss" : "ws";
    const wsUrl = baseUrl.replace(/^https?/, wsProtocol);
    return `${wsUrl}/ws/chat`;
}
