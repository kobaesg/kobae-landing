"use client";

import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { isValidPhoneNumber } from "react-phone-number-input";
import { OnboardingLayout } from "@/components/onboarding";
import { InputField } from "@/components/onboarding";
import { BottomButton } from "@/components/onboarding";
import { PhoneInput } from "@/components/onboarding/PhoneInput";
import { useSignup } from "@/lib/api/hooks";
import { useState, useEffect } from "react";
import Link from "next/link";
import { AxiosError } from "axios";
import { ApiError } from "@/lib/api/types";
import { useOnboardingDraft } from "@/lib/onboarding/store";
import { StaggerContainer, StaggerItem } from "@/components/onboarding/animations";

const signupSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    phone: z
        .string()
        .min(1, "Phone number is required")
        .refine((val) => isValidPhoneNumber(val), "Please enter a valid phone number"),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const router = useRouter();
    const signup = useSignup();
    const [serverError, setServerError] = useState("");
    const draft = useOnboardingDraft((s) => s.signup);
    const setDraft = useOnboardingDraft((s) => s.setSignup);
    const clearDraft = useOnboardingDraft((s) => s.clearSignup);

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isValid },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        mode: "onChange",
        defaultValues: {
            email: draft.email,
            phone: draft.phone,
            password: draft.password,
        },
    });

    // Sync form changes to draft store
    useEffect(() => {
        const subscription = watch((values) => {
            setDraft({
                email: values.email || "",
                phone: values.phone || "",
                password: values.password || "",
            });
        });
        return () => subscription.unsubscribe();
    }, [watch, setDraft]);

    const onSubmit = async (data: SignupFormData) => {
        setServerError("");
        try {
            await signup.mutateAsync({
                email: data.email,
                phone: data.phone,
                password: data.password,
                terms_accepted: true,
            });
            clearDraft();
            router.push(`/verify?phone=${encodeURIComponent(data.phone)}`);
        } catch (err) {
            const axiosError = err as AxiosError<ApiError>;
            setServerError(
                axiosError.response?.data?.error?.message || "Something went wrong. Please try again."
            );
        }
    };

    return (
        <OnboardingLayout showBack={true} showLogo={true}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="pt-6 space-y-6"
            >
                <StaggerContainer staggerDelay={0.07} delayChildren={0.05}>
                    <StaggerItem>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-serif font-bold text-[var(--foreground)]">
                                Create your account
                            </h1>
                            <p className="text-sm text-[var(--text-300)] font-sans">
                                Enter your details to get started.
                            </p>
                        </div>
                    </StaggerItem>

                    <StaggerItem className="pt-6">
                        <div className="space-y-4">
                            <InputField
                                label="Email"
                                type="email"
                                placeholder="you@example.com"
                                autoComplete="email"
                                error={errors.email?.message}
                                {...register("email")}
                            />

                            <Controller
                                name="phone"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <PhoneInput
                                        label="Phone Number"
                                        value={field.value}
                                        onChange={field.onChange}
                                        error={errors.phone?.message}
                                        defaultCountry="SG"
                                    />
                                )}
                            />

                            <InputField
                                label="Password"
                                type="password"
                                placeholder="Minimum 8 characters"
                                autoComplete="new-password"
                                error={errors.password?.message}
                                {...register("password")}
                            />
                        </div>
                    </StaggerItem>

                    {serverError && (
                        <StaggerItem>
                            <p className="text-sm text-red-500 font-sans text-center">
                                {serverError}
                            </p>
                        </StaggerItem>
                    )}

                    <StaggerItem className="pt-2">
                        <p className="text-xs text-[var(--text-200)] text-center font-sans">
                            Already have an account?{" "}
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
                    loading={signup.isPending}
                >
                    Next
                </BottomButton>
            </form>
        </OnboardingLayout>
    );
}
