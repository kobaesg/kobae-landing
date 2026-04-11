"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { OnboardingLayout, InputField, BottomButton } from "@/components/onboarding";
import { useResetPassword } from "@/lib/api/hooks";
import { useState, Suspense } from "react";
import { AxiosError } from "axios";
import { ApiError } from "@/lib/api/types";
import { StaggerContainer, StaggerItem } from "@/components/onboarding/animations";

const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),
    confirmPassword: z
        .string()
        .min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token") || "";
    const resetPassword = useResetPassword();
    const [serverError, setServerError] = useState("");
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        mode: "onChange",
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        setServerError("");
        try {
            await resetPassword.mutateAsync({
                token,
                new_password: data.password,
            });
            setSuccess(true);
            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (err) {
            const axiosError = err as AxiosError<ApiError>;
            const msg = axiosError.response?.data?.error?.message || "";
            if (msg.toLowerCase().includes("expired")) {
                setServerError("Reset link has expired. Please request a new one.");
            } else if (msg.toLowerCase().includes("used")) {
                setServerError("This reset link has already been used.");
            } else if (msg.toLowerCase().includes("invalid")) {
                setServerError("Invalid reset link. Please request a new one.");
            } else {
                setServerError(msg || "Something went wrong. Please try again.");
            }
        }
    };

    if (success) {
        return (
            <OnboardingLayout showBack={false} showLogo={true}>
                <div className="pt-10 space-y-8">
                    <StaggerContainer staggerDelay={0.08} delayChildren={0.05}>
                        <StaggerItem>
                            <div className="text-center space-y-4">
                                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-8 h-8 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                                <h1 className="text-2xl font-serif font-bold text-[var(--foreground)]">
                                    Password Reset!
                                </h1>
                                <p className="text-sm text-[var(--text-300)] font-sans">
                                    Your password has been successfully reset. Redirecting you to login...
                                </p>
                            </div>
                        </StaggerItem>
                    </StaggerContainer>
                </div>
            </OnboardingLayout>
        );
    }

    return (
        <OnboardingLayout showBack={true} showLogo={true} onBack={() => router.push("/login")}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="pt-6 space-y-6"
            >
                <StaggerContainer staggerDelay={0.07} delayChildren={0.05}>
                    <StaggerItem>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-serif font-bold text-[var(--foreground)]">
                                Reset Password
                            </h1>
                            <p className="text-sm text-[var(--text-300)] font-sans">
                                Enter your new password below.
                            </p>
                        </div>
                    </StaggerItem>

                    <StaggerItem className="pt-6">
                        <InputField
                            label="New Password"
                            type="password"
                            placeholder="Enter your new password"
                            autoComplete="new-password"
                            error={errors.password?.message}
                            {...register("password")}
                        />
                    </StaggerItem>

                    <StaggerItem className="pt-4">
                        <InputField
                            label="Confirm Password"
                            type="password"
                            placeholder="Confirm your new password"
                            autoComplete="new-password"
                            error={errors.confirmPassword?.message}
                            {...register("confirmPassword")}
                        />
                    </StaggerItem>

                    {serverError && (
                        <StaggerItem className="pt-2">
                            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-center space-y-2">
                                <p className="text-sm font-sans text-red-700">
                                    {serverError}
                                </p>
                                {(serverError.includes("expired") || serverError.includes("used") || serverError.includes("Invalid")) && (
                                    <button
                                        type="button"
                                        onClick={() => router.push("/forgot-password")}
                                        className="text-sm text-[var(--primary)] font-medium hover:underline"
                                    >
                                        Request new reset link
                                    </button>
                                )}
                            </div>
                        </StaggerItem>
                    )}
                </StaggerContainer>

                <BottomButton
                    type="submit"
                    disabled={!isValid || !token}
                    loading={resetPassword.isPending}
                >
                    Reset Password
                </BottomButton>
            </form>
        </OnboardingLayout>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-dvh bg-[var(--background)] flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                </div>
            }
        >
            <ResetPasswordContent />
        </Suspense>
    );
}