"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { offersApi } from "../client";
import type { OfferResponse, UpdateOffersRequest } from "../types";
import { AxiosResponse } from "axios";

export function useOffers(enabled = true) {
    return useQuery<OfferResponse[]>({
        queryKey: ["offers"],
        queryFn: async () => {
            const res = await offersApi.get();
            return res.data.offers;
        },
        enabled,
    });
}

export function useUpdateOffers() {
    const queryClient = useQueryClient();
    return useMutation<AxiosResponse<unknown>, Error, UpdateOffersRequest>({
        mutationFn: (data) => offersApi.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["offers"] });
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
}
