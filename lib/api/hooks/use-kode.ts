"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { kodeApi } from "../client";
import type { KodeResponse } from "../types";
import { AxiosResponse } from "axios";

export function useCalculateKode() {
    const queryClient = useQueryClient();
    return useMutation<AxiosResponse<{ kode: KodeResponse }>, Error, void>({
        mutationFn: () => kodeApi.calculate(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["kode"] });
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
}

export function useKodeResult(enabled = true) {
    return useQuery<KodeResponse>({
        queryKey: ["kode"],
        queryFn: async () => {
            const res = await kodeApi.getResult();
            return res.data.kode;
        },
        enabled,
    });
}
