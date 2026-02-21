"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tagsApi } from "../client";
import type { TagsResponse, UpdateTagsRequest } from "../types";
import { AxiosResponse } from "axios";

export function useHobbies(enabled = true) {
    return useQuery<TagsResponse>({
        queryKey: ["hobbies"],
        queryFn: async () => {
            const res = await tagsApi.getHobbies();
            return res.data;
        },
        enabled,
    });
}

export function useUpdateHobbies() {
    const queryClient = useQueryClient();
    return useMutation<AxiosResponse<TagsResponse>, Error, UpdateTagsRequest>({
        mutationFn: (data) => tagsApi.updateHobbies(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["hobbies"] });
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
}

export function useSkills(enabled = true) {
    return useQuery<TagsResponse>({
        queryKey: ["skills"],
        queryFn: async () => {
            const res = await tagsApi.getSkills();
            return res.data;
        },
        enabled,
    });
}

export function useUpdateSkills() {
    const queryClient = useQueryClient();
    return useMutation<AxiosResponse<TagsResponse>, Error, UpdateTagsRequest>({
        mutationFn: (data) => tagsApi.updateSkills(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["skills"] });
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
}
