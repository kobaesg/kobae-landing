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
import { StaggerContainer, StaggerItem } from "@/components/onboarding/animations";

const loginSchema = z.object({
    identifier: z
        .string()
        .min(1, "Please enter your email or phone number"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const login = useLogin();
    const { login: setAuth } = useAuth();
    const [serverError, setServerError] = useState("");
    const [errorType, setErrorType] = useState<"credentials" | "unverified" | "generic" | null>(null);

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
        setErrorType(null);
        try {
            const response = await login.mutateAsync({
                identifier: data.identifier,
                password: data.password,
            });
            // Login returns auth tokens directly
            const { access_token, refresh_token, user } = response.data;
            setAuth(access_token, refresh_token, user);
            // /me handles onboarding redirect — verified users who never finished
            // onboarding will be bounced to the correct step from there
            router.push("/me");
        } catch (err) {
            const axiosError = err as AxiosError<ApiError>;
            const status = axiosError.response?.status;
            const msg = axiosError.response?.data?.error?.message || "";
            if (status === 401) {
                if (msg.toLowerCase().includes("verified")) {
                    setErrorType("unverified");
                } else {
                    setErrorType("credentials");
                }
                setServerError("");
            } else {
                setErrorType("generic");
                setServerError(msg || "Something went wrong. Please try again.");
            }
        }
    };

    return (
        <OnboardingLayout showBack={true} showLogo={true} onBack={() => router.push("/")}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="pt-6 space-y-6"
            >
                <StaggerContainer staggerDelay={0.07} delayChildren={0.05}>
                    <StaggerItem>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-serif font-bold text-[var(--foreground)]">
                                Welcome back
                            </h1>
                            <p className="text-sm text-[var(--text-300)] font-sans">
                                Enter your email or phone number to log in.
                            </p>
                        </div>
                    </StaggerItem>

                    <StaggerItem className="pt-6">
                        <InputField
                            label="Email or Phone Number"
                            type="text"
                            placeholder="you@example.com or +65 8123 4567"
                            autoComplete="username"
                            error={errors.identifier?.message}
                            {...register("identifier")}
                        />
                    </StaggerItem>

                    <StaggerItem className="pt-4">
                        <InputField
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            error={errors.password?.message}
                            {...register("password")}
                        />
                    </StaggerItem>

                    {errorType === "credentials" && (
                        <StaggerItem className="pt-2">
                            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-center space-y-1">
                                <p className="text-sm font-semibold font-sans text-red-700">
                                    Incorrect email, phone, or password.
                                </p>
                                <p className="text-xs font-sans text-red-500">
                                    Double-check your details and try again.
                                </p>
                            </div>
                        </StaggerItem>
                    )}

                    {errorType === "unverified" && (
                        <StaggerItem className="pt-2">
                            <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-center space-y-1">
                                <p className="text-sm font-semibold font-sans text-amber-800">
                                    Account not verified yet.
                                </p>
                                <p className="text-xs font-sans text-amber-600">
                                    Please complete signup first.
                                </p>
                            </div>
                        </StaggerItem>
                    )}

                    {errorType === "generic" && serverError && (
                        <StaggerItem className="pt-2">
                            <p className="text-sm text-red-500 font-sans text-center">
                                {serverError}
                            </p>
                        </StaggerItem>
                    )}

                    <StaggerItem className="pt-2">
                        <p className="text-xs text-[var(--text-200)] text-center font-sans">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/signup"
                                className="text-[var(--primary)] font-medium"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </StaggerItem>
                </StaggerContainer>

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
