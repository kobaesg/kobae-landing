"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi, setTokens } from "../client";
import type {
    SignupRequest,
    LoginRequest,
    VerifyOTPRequest,
    ResendOTPRequest,
    AuthResponse,
    OTPResponse,
} from "../types";
import { AxiosResponse } from "axios";

export function useSignup() {
    return useMutation<AxiosResponse<OTPResponse>, Error, SignupRequest>({
        mutationFn: (data) => authApi.signup(data),
    });
}

export function useLogin() {
    return useMutation<AxiosResponse<AuthResponse>, Error, LoginRequest>({
        mutationFn: (data) => authApi.login(data),
    });
}

export function useVerifyOTP(options?: {
    onSuccess?: (data: AxiosResponse<AuthResponse>) => void;
}) {
    return useMutation<AxiosResponse<AuthResponse>, Error, VerifyOTPRequest>({
        mutationFn: (data) => authApi.verifyOTP(data),
        onSuccess: (data) => {
            const { access_token, refresh_token } = data.data;
            setTokens(access_token, refresh_token);
            options?.onSuccess?.(data);
        },
    });
}

export function useResendOTP() {
    return useMutation<AxiosResponse<OTPResponse>, Error, ResendOTPRequest>({
        mutationFn: (data) => authApi.resendOTP(data),
    });
}
