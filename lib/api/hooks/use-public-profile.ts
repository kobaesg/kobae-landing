"use client";

import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../client";
import type { FullPublicProfile, MutualConnection, UserSearchResult } from "../types";

export function usePublicProfile(userId: string | undefined) {
    return useQuery<FullPublicProfile>({
        queryKey: ["publicProfile", userId],
        queryFn: async () => {
            const res = await usersApi.getPublicProfile(userId!);
            return res.data;
        },
        enabled: !!userId,
        staleTime: 60 * 1000,
    });
}

export function useMutualConnections(userId: string | undefined) {
    return useQuery<MutualConnection[]>({
        queryKey: ["mutualConnections", userId],
        queryFn: async () => {
            const res = await usersApi.getMutualConnections(userId!);
            return res.data.mutual_connections ?? [];
        },
        enabled: !!userId,
        staleTime: 60 * 1000,
    });
}

export function useSearchUsers(query: string) {
    return useQuery<UserSearchResult[]>({
        queryKey: ["users", "search", query],
        queryFn: async () => {
            const res = await usersApi.searchUsers(query);
            return res.data.users ?? [];
        },
        enabled: query.trim().length >= 2,
        staleTime: 30_000,
    });
}
