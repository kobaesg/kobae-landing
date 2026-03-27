"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronLeft } from "lucide-react";
import { AxiosError } from "axios";
import { useAuth } from "@/lib/auth/context";
import { useProfile, useUpdateProfile } from "@/lib/api/hooks";
import { InputField } from "@/components/onboarding";
import type { ApiError } from "@/lib/api/types";
import { Loader2 } from "lucide-react";

const nameSchema = z.object({
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
});

type NameFormData = z.infer<typeof nameSchema>;

export default function EditNamePage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { data: profileData, isLoading } = useProfile(isAuthenticated);
    const updateProfile = useUpdateProfile();
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid },
    } = useForm<NameFormData>({
        resolver: zodResolver(nameSchema),
        mode: "onChange",
    });

    useEffect(() => {
        if (profileData?.profile) {
            reset({
                first_name: profileData.profile.first_name || "",
                last_name: profileData.profile.last_name || "",
                username: profileData.profile.username || "",
            });
        }
    }, [profileData, reset]);

    const onSubmit = async (data: NameFormData) => {
        setServerError("");
        try {
            await updateProfile.mutateAsync(data);
            router.push("/me/edit");
        } catch (err) {
            const axiosError = err as AxiosError<ApiError>;
            setServerError(
                axiosError.response?.data?.error?.message ||
                    "Something went wrong. Please try again."
            );
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-dvh bg-[#f8f7f6] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#d8602e] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-dvh bg-[#f8f7f6]">
            <div className="sticky top-0 z-30 bg-[#f8f7f6]/95 backdrop-blur border-b border-[#e8e0da] px-6 h-14 flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f0e8e0] transition-colors"
                >
                    <ChevronLeft size={20} className="text-[#453933]" strokeWidth={1.5} />
                </button>
                <h1 className="font-serif font-semibold text-[18px] text-[#181412]">
                    Name
                </h1>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="max-w-lg mx-auto px-6 py-6 pb-44 space-y-4"
            >
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
                {serverError && (
                    <p className="text-sm text-red-500 font-sans text-center">
                        {serverError}
                    </p>
                )}
                <div className="fixed bottom-16 md:bottom-0 left-0 right-0 px-5 pb-5 pt-4 bg-gradient-to-t from-[#f8f7f6] via-[#f8f7f6] to-transparent pointer-events-none">
                    <div className="mx-auto max-w-lg pointer-events-auto">
                        <button
                            type="submit"
                            disabled={!isValid || updateProfile.isPending}
                            className="w-full py-4 rounded-3xl font-sans font-semibold text-base bg-[#d8602e] text-white hover:bg-[#c55528] shadow-[0_0_10px_rgba(255,144,97,0.8)] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            {updateProfile.isPending && <Loader2 className="w-5 h-5 animate-spin" />}
                            Confirm
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
