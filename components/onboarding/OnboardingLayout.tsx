"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { OnboardingProgress } from "./OnboardingProgress";

interface OnboardingLayoutProps {
    children: React.ReactNode;
    /** Current progress group (1-5). Pass 0 to hide the progress bar. */
    currentStep?: number;
    /** Total number of steps. Default is 5. */
    totalSteps?: number;
    /** Whether to show the back button */
    showBack?: boolean;
    /** Custom back handler. If not provided, uses router.back() */
    onBack?: () => void;
    /** Whether to show the Kobae logo in the header */
    showLogo?: boolean;
}

export function OnboardingLayout({
    children,
    currentStep = 0,
    totalSteps = 5,
    showBack = true,
    onBack,
    showLogo = false,
}: OnboardingLayoutProps) {
    const router = useRouter();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    return (
        <div className="min-h-dvh bg-[var(--background)] flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-5 pt-4 pb-2">
                <div className="w-10">
                    {showBack && (
                        <button
                            onClick={handleBack}
                            className="p-2 -ml-2 rounded-full hover:bg-black/5 transition-colors"
                            aria-label="Go back"
                        >
                            <ChevronLeft className="w-5 h-5 text-[var(--foreground)]" />
                        </button>
                    )}
                </div>

                {currentStep > 0 && (
                    <OnboardingProgress
                        currentStep={currentStep}
                        totalSteps={totalSteps}
                    />
                )}

                <div className="w-10 flex justify-end">
                    {showLogo && (
                        <img
                            src="/resources/thumbnail.png"
                            alt="Kobae"
                            className="w-7 h-7"
                        />
                    )}
                </div>
            </header>

            {/* Body */}
            <main className="flex-1 overflow-y-auto px-5 pb-28">
                <div className="mx-auto max-w-lg w-full">{children}</div>
            </main>
        </div>
    );
}
