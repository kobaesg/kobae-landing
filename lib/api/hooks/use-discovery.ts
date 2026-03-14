"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { discoveryApi } from "../client";
import type { DiscoveryResponse } from "../types";

export function useDiscovery() {
    return useQuery<DiscoveryResponse>({
        queryKey: ["discovery"],
        queryFn: async () => {
            const res = await discoveryApi.getRecommendation();
            return res.data;
        },
        retry: false,
        staleTime: 30 * 1000,
    });
}

export function useSkipProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (skippedUserId: string) =>
            discoveryApi.skipProfile({ skipped_user_id: skippedUserId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["discovery"] });
        },
    });
}
