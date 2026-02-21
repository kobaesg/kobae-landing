"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { intentApi } from "../client";
import type { IntentResponse, UpdateIntentRequest } from "../types";
import { AxiosResponse } from "axios";

export function useIntent(enabled = true) {
    return useQuery<IntentResponse>({
        queryKey: ["intent"],
        queryFn: async () => {
            const res = await intentApi.get();
            return res.data;
        },
        enabled,
    });
}

export function useUpdateIntent() {
    const queryClient = useQueryClient();
    return useMutation<AxiosResponse<IntentResponse>, Error, UpdateIntentRequest>(
        {
            mutationFn: (data) => intentApi.update(data),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["intent"] });
                queryClient.invalidateQueries({ queryKey: ["profile"] });
            },
        }
    );
}
