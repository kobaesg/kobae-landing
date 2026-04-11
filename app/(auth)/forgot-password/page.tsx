"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { OnboardingLayout, BottomButton } from "@/components/onboarding";
import { PhoneInput } from "@/components/onboarding/PhoneInput";
import { useForgotPassword } from "@/lib/api/hooks";
import { useState } from "react";
import Link from "next/link";
import { AxiosError } from "axios";
import { ApiError } from "@/lib/api/types";
import { StaggerContainer, StaggerItem } from "@/components/onboarding/animations";

const forgotPasswordSchema = z.object({
    phone: z
        .string()
        .min(10, "Please enter a valid phone number")
        .regex(/^\+?[0-9\s-]+$/, "Please enter a valid phone number"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const router = useRouter();
    const forgotPassword = useForgotPassword();
    const [serverError, setServerError] = useState("");

    const {
        setValue,
        watch,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        mode: "onChange",
        defaultValues: {
            phone: "",
        },
    });

    const phone = watch("phone");

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setServerError("");
        try {
            await forgotPassword.mutateAsync({ phone: data.phone });
            // Navigate to verify page with phone number
            router.push(`/forgot-password/verify?phone=${encodeURIComponent(data.phone)}`);
        } catch (err) {
            const axiosError = err as AxiosError<ApiError>;
            const msg = axiosError.response?.data?.error?.message || "";
            if (axiosError.response?.status === 429) {
                setServerError("Too many requests. Please wait before trying again.");
            } else {
                setServerError(msg || "Something went wrong. Please try again.");
            }
        }
    };

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
                                Forgot Password
                            </h1>
                            <p className="text-sm text-[var(--text-300)] font-sans">
                                Enter your phone number and we&apos;ll send you a verification code to reset your password.
                            </p>
                        </div>
                    </StaggerItem>

                    <StaggerItem className="pt-6">
                        <PhoneInput
                            label="Phone Number"
                            value={phone}
                            onChange={(value) => setValue("phone", value, { shouldValidate: true })}
                            error={errors.phone?.message}
                        />
                    </StaggerItem>

                    {serverError && (
                        <StaggerItem className="pt-2">
                            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-center">
                                <p className="text-sm font-sans text-red-700">
                                    {serverError}
                                </p>
                            </div>
                        </StaggerItem>
                    )}

                    <StaggerItem className="pt-4">
                        <p className="text-xs text-[var(--text-200)] text-center font-sans">
                            Remember your password?{" "}
                            <Link
                                href="/login"
                                className="text-[var(--primary)] font-medium"
                            >
                                Log In
                            </Link>
                        </p>
                    </StaggerItem>
                </StaggerContainer>

                <BottomButton
                    type="submit"
                    disabled={!isValid}
                    loading={forgotPassword.isPending}
                >
                    Send Code
                </BottomButton>
            </form>
        </OnboardingLayout>
    );
}