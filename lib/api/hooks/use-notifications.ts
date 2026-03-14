"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "../client";
import type { NotificationItem } from "../types";

export function useNotifications(limit = 20, offset = 0) {
    return useQuery<NotificationItem[]>({
        queryKey: ["notifications", limit, offset],
        queryFn: async () => {
            const res = await notificationsApi.getAll({ limit, offset });
            return res.data.notifications ?? [];
        },
        staleTime: 30 * 1000,
    });
}

export function useUnreadCount() {
    return useQuery<number>({
        queryKey: ["notifications", "unreadCount"],
        queryFn: async () => {
            const res = await notificationsApi.getUnreadCount();
            return res.data.count;
        },
        staleTime: 15 * 1000,
        refetchInterval: 60 * 1000,
    });
}

export function useMarkRead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (notifId: string) => notificationsApi.markRead(notifId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });
}

export function useMarkAllRead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => notificationsApi.markAllRead(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
        },
    });
}
