"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { connectionsApi, usersApi } from "../client";
import type { ConnectionCard, ConnectionRequestItem } from "../types";

export function usePendingRequests() {
    return useQuery<ConnectionRequestItem[]>({
        queryKey: ["connections", "pending"],
        queryFn: async () => {
            const res = await connectionsApi.getPendingRequests();
            return res.data.requests ?? [];
        },
        staleTime: 30 * 1000,
    });
}

export function useSendRequest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (receiverUserId: string) =>
            connectionsApi.sendRequest({ receiver_user_id: receiverUserId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["discovery"] });
            queryClient.invalidateQueries({
                queryKey: ["connections", "pending"],
            });
        },
    });
}

export function useAcceptRequest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (requestId: string) =>
            connectionsApi.acceptRequest({ request_id: requestId }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["connections", "pending"],
            });
            queryClient.invalidateQueries({
                queryKey: ["notifications"],
            });
        },
    });
}

export function useDeclineRequest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (requestId: string) =>
            connectionsApi.declineRequest({ request_id: requestId }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["connections", "pending"],
            });
        },
    });
}

export function useConnections() {
    return useQuery<ConnectionCard[]>({
        queryKey: ["connections"],
        queryFn: async () => {
            const res = await connectionsApi.getConnections();
            return res.data.connections ?? [];
        },
        staleTime: 60 * 1000,
    });
}

export function useRemoveConnection() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId: string) =>
            connectionsApi.removeConnection(userId),
        onSuccess: (_data, userId) => {
            queryClient.invalidateQueries({ queryKey: ["connections"] });
            queryClient.invalidateQueries({ queryKey: ["public-profile", userId] });
        },
    });
}

export function useBlockUser() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId: string) => usersApi.blockUser(userId),
        onSuccess: (_data, userId) => {
            queryClient.invalidateQueries({ queryKey: ["connections"] });
            queryClient.invalidateQueries({ queryKey: ["public-profile", userId] });
        },
    });
}
