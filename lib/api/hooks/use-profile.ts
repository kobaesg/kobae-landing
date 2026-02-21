"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../client";
import { isAxiosError } from "axios";
import type {
    CreateProfileRequest,
    UpdateProfileRequest,
    UpdateBioRequest,
    ProfileResponse,
    UploadPhotoResponse,
} from "../types";
import { AxiosResponse } from "axios";

export function useProfile(enabled = true) {
    return useQuery<ProfileResponse | null>({
        queryKey: ["profile"],
        queryFn: async () => {
            try {
                const res = await profileApi.get();
                return res.data;
            } catch (err) {
                // 404 means the user exists but hasn't created a profile yet — not an error
                if (isAxiosError(err) && err.response?.status === 404) {
                    return null;
                }
                throw err;
            }
        },
        enabled,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });
}

export function useCreateProfile() {
    const queryClient = useQueryClient();
    return useMutation<
        AxiosResponse<ProfileResponse>,
        Error,
        CreateProfileRequest
    >({
        mutationFn: (data) => profileApi.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();
    return useMutation<
        AxiosResponse<ProfileResponse>,
        Error,
        UpdateProfileRequest
    >({
        mutationFn: (data) => profileApi.update(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
}

export function useUpdateBio() {
    const queryClient = useQueryClient();
    return useMutation<
        AxiosResponse<ProfileResponse>,
        Error,
        UpdateBioRequest
    >({
        mutationFn: (data) => profileApi.updateBio(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
}

export function useUploadPhoto() {
    const queryClient = useQueryClient();
    return useMutation<AxiosResponse<UploadPhotoResponse>, Error, File>({
        mutationFn: (file) => profileApi.uploadPhoto(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profile"] });
        },
    });
}
