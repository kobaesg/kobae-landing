"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { questionnaireApi } from "../client";
import type {
    Question,
    BulkSubmitRequest,
} from "../types";
import { AxiosResponse } from "axios";

export function useQuestions(enabled = true) {
    return useQuery<Question[]>({
        queryKey: ["questions"],
        queryFn: async () => {
            const res = await questionnaireApi.getQuestions();
            return res.data.questions;
        },
        enabled,
        staleTime: Infinity,
    });
}

export function useBulkSubmitAnswers() {
    return useMutation<AxiosResponse<unknown>, Error, BulkSubmitRequest>({
        mutationFn: (data) => questionnaireApi.bulkSubmitAnswers(data),
    });
}
