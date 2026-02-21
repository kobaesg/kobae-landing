"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { promptsApi } from "../client";
import type { UserPromptResponse, UpdateUserPromptRequest } from "../types";
import { AxiosResponse } from "axios";

export function usePrompts(enabled = true) {
    return useQuery<UserPromptResponse[]>({
        queryKey: ["prompts"],
        queryFn: async () => {
            const res = await promptsApi.get();
            return res.data;
        },
        enabled,
    });
}

export function useUpdatePrompts() {
    const queryClient = useQueryClient();
    return useMutation<
        AxiosResponse<unknown>,
        Error,
        UpdateUserPromptRequest[]
    >({
        mutationFn: (data) => promptsApi.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["prompts"] });
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
}
