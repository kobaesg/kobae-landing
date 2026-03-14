"use client";

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";
import type { User } from "@/lib/api/types";
import {
    authApi,
    getAccessToken,
    getRefreshToken,
    setTokens,
    clearTokens,
} from "@/lib/api/client";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (accessToken: string, refreshToken: string, user: User) => void;
    logout: () => void;
    setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = "kobae_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUserState] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Restore session on mount
    useEffect(() => {
        const restoreSession = async () => {
            const token = getAccessToken();
            const refreshToken = getRefreshToken();
            const storedUser = localStorage.getItem(USER_STORAGE_KEY);

            if (!storedUser || (!token && !refreshToken)) {
                setIsLoading(false);
                return;
            }

            try {
                const parsedUser = JSON.parse(storedUser) as User;

                if (token) {
                    setUserState(parsedUser);
                    setIsLoading(false);
                    return;
                }

                if (refreshToken) {
                    const response = await authApi.refresh({
                        refresh_token: refreshToken,
                    });
                    const { access_token, refresh_token, user } = response.data;
                    setTokens(access_token, refresh_token);
                    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
                    setUserState(user);
                }
            } catch {
                clearTokens();
                localStorage.removeItem(USER_STORAGE_KEY);
                setUserState(null);
            } finally {
                setIsLoading(false);
            }
        };

        void restoreSession();
    }, []);

    const login = useCallback(
        (accessToken: string, refreshToken: string, user: User) => {
            setTokens(accessToken, refreshToken);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
            setUserState(user);
        },
        []
    );

    const logout = useCallback(() => {
        const refreshToken = getRefreshToken();

        const finishClientLogout = () => {
            clearTokens();
            localStorage.removeItem(USER_STORAGE_KEY);
            setUserState(null);
            window.location.href = "/login";
        };

        if (!refreshToken) {
            finishClientLogout();
            return;
        }

        authApi
            .logout({ refresh_token: refreshToken })
            .catch(() => {
                // Always clear client session regardless of revoke outcome
            })
            .finally(() => {
                finishClientLogout();
            });
    }, []);

    const setUser = useCallback((user: User) => {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
        setUserState(user);
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user && !!getAccessToken(),
                isLoading,
                login,
                logout,
                setUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
