"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { connectionsApi } from "../client";
import type { ConnectionRequestItem } from "../types";

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
