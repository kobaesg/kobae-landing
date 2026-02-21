"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { OnboardingLayout, InputField, BottomButton } from "@/components/onboarding";
import { useLogin } from "@/lib/api/hooks";
import { useState } from "react";
import Link from "next/link";
import { AxiosError } from "axios";
import { ApiError } from "@/lib/api/types";
import { useAuth } from "@/lib/auth/context";

const loginSchema = z.object({
    identifier: z
        .string()
        .min(1, "Please enter your email or phone number"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const login = useLogin();
    const { login: setAuth } = useAuth();
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
    });

    const onSubmit = async (data: LoginFormData) => {
        setServerError("");
        try {
            const response = await login.mutateAsync({
                identifier: data.identifier,
            });
            // Login returns auth tokens directly
            const { access_token, refresh_token, user } = response.data;
            setAuth(access_token, refresh_token, user);
            router.push("/profile");
        } catch (err) {
            const axiosError = err as AxiosError<ApiError>;
            const errorMsg = axiosError.response?.data?.error?.message || "";
            // If the backend sends an OTP (phone-based login), redirect to verify
            if (errorMsg.includes("OTP") || axiosError.response?.status === 200) {
                router.push(
                    `/verify?phone=${encodeURIComponent(data.identifier)}&mode=login`
                );
                return;
            }
            setServerError(errorMsg || "Something went wrong. Please try again.");
        }
    };

    return (
        <OnboardingLayout showBack={true} showLogo={true}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="pt-6 space-y-6"
            >
                <div className="space-y-2">
                    <h1 className="text-2xl font-serif font-bold text-[var(--foreground)]">
                        Welcome back
                    </h1>
                    <p className="text-sm text-[var(--text-300)] font-sans">
                        Enter your email or phone number to log in.
                    </p>
                </div>

                <InputField
                    label="Email or Phone Number"
                    type="text"
                    placeholder="you@example.com or +65 8123 4567"
                    autoComplete="username"
                    error={errors.identifier?.message}
                    {...register("identifier")}
                />

                {serverError && (
                    <p className="text-sm text-red-500 font-sans text-center">
                        {serverError}
                    </p>
                )}

                <p className="text-xs text-[var(--text-200)] text-center font-sans">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/signup"
                        className="text-[var(--primary)] font-medium"
                    >
                        Sign Up
                    </Link>
                </p>

                <BottomButton
                    type="submit"
                    disabled={!isValid}
                    loading={login.isPending}
                >
                    Next
                </BottomButton>
            </form>
        </OnboardingLayout>
    );
}
