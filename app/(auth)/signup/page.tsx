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
import { useState } from "react";
import Link from "next/link";
import { AxiosError } from "axios";
import { ApiError } from "@/lib/api/types";

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

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isValid },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        mode: "onChange",
    });

    const onSubmit = async (data: SignupFormData) => {
        setServerError("");
        try {
            await signup.mutateAsync({
                email: data.email,
                phone: data.phone,
                password: data.password,
                terms_accepted: true,
            });
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
                <div className="space-y-2">
                    <h1 className="text-2xl font-serif font-bold text-[var(--foreground)]">
                        Create your account
                    </h1>
                    <p className="text-sm text-[var(--text-300)] font-sans">
                        Enter your details to get started.
                    </p>
                </div>

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

                {serverError && (
                    <p className="text-sm text-red-500 font-sans text-center">
                        {serverError}
                    </p>
                )}

                <p className="text-xs text-[var(--text-200)] text-center font-sans">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="text-[var(--primary)] font-medium"
                    >
                        Log In
                    </Link>
                </p>

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
