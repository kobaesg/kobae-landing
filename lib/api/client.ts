import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

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

// Request interceptor: inject Bearer token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor: handle 401 → redirect to login
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            clearTokens();
            if (typeof window !== "undefined") {
                window.location.href = "/login";
            }
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

    verifyOTP: (data: import("./types").VerifyOTPRequest) =>
        api.post<import("./types").AuthResponse>("/auth/verify-otp", data),

    resendOTP: (data: import("./types").ResendOTPRequest) =>
        api.post<import("./types").OTPResponse>("/auth/resend-otp", data),
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
