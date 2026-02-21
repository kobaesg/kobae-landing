"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, Suspense } from "react";
import { OnboardingLayout, OTPInput, BottomButton } from "@/components/onboarding";
import { useVerifyOTP, useResendOTP } from "@/lib/api/hooks";
import { useAuth } from "@/lib/auth/context";
import { AxiosError } from "axios";
import { ApiError } from "@/lib/api/types";

function VerifyContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const phone = searchParams.get("phone") || "";
    const { login } = useAuth();

    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [resendTimer, setResendTimer] = useState(30);
    const [resendMessage, setResendMessage] = useState("");

    const verifyOTP = useVerifyOTP({
        onSuccess: (data) => {
            const { access_token, refresh_token, user } = data.data;
            login(access_token, refresh_token, user);
            router.push("/profile");
        },
    });

    const resendOTP = useResendOTP();

    // Countdown timer
    useEffect(() => {
        if (resendTimer <= 0) return;
        const interval = setInterval(() => {
            setResendTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleVerify = useCallback(async () => {
        if (otp.length !== 6) return;
        if (verifyOTP.isPending) return;
        setError("");
        try {
            await verifyOTP.mutateAsync({ phone, code: otp });
        } catch (err) {
            const axiosError = err as AxiosError<ApiError>;
            setError(
                axiosError.response?.data?.error?.message ||
                    "Incorrect verification code. Please try again."
            );
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [otp, phone, verifyOTP.mutateAsync]);

    // Auto-submit when all 6 digits entered
    useEffect(() => {
        if (otp.length === 6) {
            handleVerify();
        }
    }, [otp, handleVerify]);

    const handleResend = async () => {
        try {
            await resendOTP.mutateAsync({ phone });
            setResendTimer(30);
            setResendMessage("OTP has been resent");
            setError("");
            setOtp("");
            setTimeout(() => setResendMessage(""), 3000);
        } catch {
            setError("Failed to resend OTP. Please try again.");
        }
    };

    const formatTimer = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    return (
        <OnboardingLayout showBack={true} showLogo={true}>
            <div className="pt-10 space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-serif font-bold text-[var(--foreground)]">
                        Verification
                    </h1>
                    <p className="text-sm text-[var(--text-300)] font-sans">
                        Please enter the 6-digit verification code sent to{" "}
                        <span className="font-semibold text-[var(--text-400)]">
                            {phone}
                        </span>
                    </p>
                </div>

                <OTPInput
                    value={otp}
                    onChange={setOtp}
                    error={error}
                    disabled={verifyOTP.isPending}
                />

                {resendMessage && (
                    <p className="text-sm text-green-600 font-sans text-center">
                        {resendMessage}
                    </p>
                )}

                <div className="text-center">
                    {resendTimer > 0 ? (
                        <p className="text-sm text-[var(--text-200)] font-sans">
                            Resend code in{" "}
                            <span className="font-medium">
                                {formatTimer(resendTimer)}
                            </span>
                        </p>
                    ) : (
                        <button
                            onClick={handleResend}
                            disabled={resendOTP.isPending}
                            className="text-sm text-[var(--primary)] font-sans font-medium hover:underline disabled:opacity-50"
                        >
                            Resend code
                        </button>
                    )}
                </div>

                <BottomButton
                    onClick={handleVerify}
                    disabled={otp.length !== 6}
                    loading={verifyOTP.isPending}
                >
                    Verify
                </BottomButton>
            </div>
        </OnboardingLayout>
    );
}

export default function VerifyPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-dvh bg-[var(--background)] flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                </div>
            }
        >
            <VerifyContent />
        </Suspense>
    );
}
