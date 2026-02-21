"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import {
    OnboardingLayout,
    InputField,
    BottomButton,
    PhotoUpload,
} from "@/components/onboarding";
import { useOnboardingGuard } from "@/lib/onboarding/guard";
import { useCreateProfile, useUploadPhoto } from "@/lib/api/hooks";
import { AxiosError } from "axios";
import { ApiError } from "@/lib/api/types";

const profileSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Surname is required"),
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(50, "Username must be 50 characters or less")
        .regex(
            /^[a-zA-Z0-9_-]+$/,
            "Only letters, numbers, underscores and hyphens"
        ),
    headline: z
        .string()
        .max(100, "Headline must be 100 characters or less")
        .optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
    const router = useRouter();
    const { isReady } = useOnboardingGuard("account_created");
    const createProfile = useCreateProfile();
    const uploadPhoto = useUploadPhoto();
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        mode: "onChange",
    });

    const onSubmit = async (data: ProfileFormData) => {
        setServerError("");
        try {
            await createProfile.mutateAsync({
                first_name: data.first_name,
                last_name: data.last_name,
                username: data.username,
                headline: data.headline,
            });

            // Upload photo if selected
            if (photoFile) {
                try {
                    await uploadPhoto.mutateAsync(photoFile);
                } catch {
                    // Non-fatal — profile is created, photo upload can be retried
                }
            }

            router.push("/hobbies");
        } catch (err) {
            const axiosError = err as AxiosError<ApiError>;
            setServerError(
                axiosError.response?.data?.error?.message ||
                    "Something went wrong. Please try again."
            );
        }
    };

    if (!isReady) {
        return (
            <div className="min-h-dvh bg-[var(--background)] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <OnboardingLayout currentStep={1} showBack={true} showLogo={true}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="pt-6 space-y-6"
            >
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-serif font-bold text-[var(--foreground)]">
                        Let&apos;s start with the basics
                    </h1>
                    <p className="text-sm text-[var(--text-300)] font-sans">
                        Add a photo and tell us who you are.
                    </p>
                </div>

                <PhotoUpload
                    onUpload={(file) => setPhotoFile(file)}
                    loading={uploadPhoto.isPending}
                />

                <div className="space-y-4">
                    <InputField
                        label="First Name"
                        placeholder="John"
                        autoComplete="given-name"
                        error={errors.first_name?.message}
                        {...register("first_name")}
                    />

                    <InputField
                        label="Surname"
                        placeholder="Doe"
                        autoComplete="family-name"
                        error={errors.last_name?.message}
                        {...register("last_name")}
                    />

                    <InputField
                        label="Username"
                        placeholder="johndoe_123"
                        autoComplete="username"
                        error={errors.username?.message}
                        {...register("username")}
                    />

                    <InputField
                        label="Headline"
                        placeholder="Describe yourself in 5 words"
                        error={errors.headline?.message}
                        {...register("headline")}
                    />
                </div>

                {serverError && (
                    <p className="text-sm text-red-500 font-sans text-center">
                        {serverError}
                    </p>
                )}

                <BottomButton
                    type="submit"
                    disabled={!isValid}
                    loading={createProfile.isPending}
                >
                    Next
                </BottomButton>
            </form>
        </OnboardingLayout>
    );
}
