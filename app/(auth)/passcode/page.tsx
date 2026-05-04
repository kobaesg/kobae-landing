"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { OnboardingLayout } from "@/components/onboarding";
import { OTPInput } from "@/components/onboarding/OTPInput";
import { BottomButton } from "@/components/onboarding";
import {
    usePasscodeStore,
    validatePasscode,
    PASSCODE_ENABLED,
    isLockedOut,
    getRemainingLockoutSeconds,
    formatLockoutTime,
    getRemainingAttempts,
} from "@/lib/auth/passcode-store";
import { StaggerContainer, StaggerItem } from "@/components/onboarding/animations";

export default function PasscodePage() {
    const router = useRouter();
    const [passcode, setPasscode] = useState("");
    const [error, setError] = useState("");
    const [isShaking, setIsShaking] = useState(false);
    const [, setTick] = useState(0); // Force re-render for countdown

    const {
        isVerified,
        setVerified,
        failedAttempts,
        lockoutUntil,
        recordFailedAttempt,
        resetAttempts,
    } = usePasscodeStore();

    const locked = isLockedOut(lockoutUntil);
    const remainingAttempts = getRemainingAttempts(failedAttempts);
    // Compute remaining seconds directly from lockoutUntil
    const remainingSeconds = getRemainingLockoutSeconds(lockoutUntil);

    // If passcode is disabled or already verified, redirect to signup
    useEffect(() => {
        if (!PASSCODE_ENABLED || isVerified) {
            router.replace("/signup");
        }
    }, [isVerified, router]);

    // Countdown timer for lockout - just triggers re-renders
    useEffect(() => {
        if (!lockoutUntil || !locked) {
            return;
        }

        const interval = setInterval(() => {
            const remaining = getRemainingLockoutSeconds(lockoutUntil);
            if (remaining <= 0) {
                resetAttempts();
            } else {
                // Force re-render to update the computed remainingSeconds
                setTick((t) => t + 1);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [lockoutUntil, locked, resetAttempts]);

    const submitPasscode = (code: string) => {
        if (locked) return; // Prevent submission during lockout

        if (code.length !== 6) {
            setError("Please enter a 6-digit code");
            return;
        }

        if (validatePasscode(code)) {
            setVerified(true);
            router.push("/signup");
        } else {
            recordFailedAttempt();
            setError("Invalid access code");
            setIsShaking(true);
            setPasscode("");
            setTimeout(() => setIsShaking(false), 500);
        }
    };

    const handlePasscodeChange = (value: string) => {
        if (locked) return; // Prevent input during lockout

        setPasscode(value);
        setError("");

        // Auto-submit when 6 digits are entered
        if (value.length === 6) {
            submitPasscode(value);
        }
    };

    const handleButtonClick = () => {
        submitPasscode(passcode);
    };

    // Don't render if passcode is disabled (will redirect)
    if (!PASSCODE_ENABLED) {
        return null;
    }

    return (
        <OnboardingLayout showBack={true} showLogo={true}>
            <div className="pt-6 space-y-6">
                <StaggerContainer staggerDelay={0.07} delayChildren={0.05}>
                    <StaggerItem>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-serif font-bold text-[var(--foreground)]">
                                Enter Access Code
                            </h1>
                            <p className="text-sm text-[var(--text-300)] font-sans">
                                Kobae is currently invite-only. Enter your 6-digit access code to continue.
                            </p>
                        </div>
                    </StaggerItem>

                    <StaggerItem className="pt-8">
                        <motion.div
                            animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
                            transition={{ duration: 0.4 }}
                            className="flex justify-center"
                        >
                            <OTPInput
                                length={6}
                                value={passcode}
                                onChange={handlePasscodeChange}
                                error={error}
                                disabled={locked}
                            />
                        </motion.div>
                    </StaggerItem>

                    {/* Lockout Warning */}
                    {locked && remainingSeconds > 0 && (
                        <StaggerItem className="pt-2">
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-center"
                            >
                                <p className="text-sm font-sans text-red-600 font-medium">
                                    Too many failed attempts
                                </p>
                                <p className="text-xs font-sans text-red-500 mt-1">
                                    Try again in{" "}
                                    <span className="font-mono font-semibold">
                                        {formatLockoutTime(remainingSeconds)}
                                    </span>
                                </p>
                            </motion.div>
                        </StaggerItem>
                    )}

                    {/* Remaining Attempts Warning */}
                    {!locked && failedAttempts > 0 && remainingAttempts <= 3 && (
                        <StaggerItem className="pt-2">
                            <p className="text-xs text-amber-600 text-center font-sans">
                                {remainingAttempts} attempt{remainingAttempts !== 1 ? "s" : ""} remaining before temporary lockout
                            </p>
                        </StaggerItem>
                    )}

                    <StaggerItem className="pt-4">
                        <p className="text-xs text-[var(--text-200)] text-center font-sans">
                            Don&apos;t have an access code?{" "}
                            <a
                                href="mailto:hello@kobae.co"
                                className="text-[var(--primary)] font-medium"
                            >
                                Contact us
                            </a>
                        </p>
                    </StaggerItem>
                </StaggerContainer>

                <BottomButton
                    type="button"
                    disabled={passcode.length !== 6 || locked}
                    onClick={handleButtonClick}
                >
                    {locked ? `Locked (${formatLockoutTime(remainingSeconds)})` : "Continue"}
                </BottomButton>
            </div>
        </OnboardingLayout>
    );
}