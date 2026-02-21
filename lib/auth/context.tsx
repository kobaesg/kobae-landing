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
        const token = getAccessToken();
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (token && storedUser) {
            try {
                setUserState(JSON.parse(storedUser));
            } catch {
                clearTokens();
                localStorage.removeItem(USER_STORAGE_KEY);
            }
        }
        setIsLoading(false);
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
        clearTokens();
        localStorage.removeItem(USER_STORAGE_KEY);
        setUserState(null);
        window.location.href = "/login";
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
