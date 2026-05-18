"use client";

import { useQuery } from "@tanstack/react-query";
import { circlesApi } from "../client";
import type { CirclesGraphResponse } from "../types";

export function useCirclesGraph() {
    return useQuery<CirclesGraphResponse>({
        queryKey: ["circles", "graph"],
        queryFn: async () => {
            const response = await circlesApi.getGraph();
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
    });
}