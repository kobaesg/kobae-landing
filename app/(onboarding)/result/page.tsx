"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    OnboardingLayout,
    BottomButton,
    KodeResultCard,
} from "@/components/onboarding";
import { useOnboardingGuard } from "@/lib/onboarding/guard";
import { useKodeResult } from "@/lib/api/hooks";
import { Share2 } from "lucide-react";
import { FadeIn } from "@/components/onboarding/animations";

export default function ResultPage() {
    const router = useRouter();
    const { isReady } = useOnboardingGuard("questionnaire_done");
    const { data: kode, isLoading: kodeLoading } = useKodeResult();

    const [showLoading, setShowLoading] = useState(true);

    // Show loading screen for 2 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    if (!isReady || kodeLoading || showLoading) {
        return (
            <div className="min-h-dvh bg-[var(--background)] flex flex-col items-center justify-center gap-6 px-6">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-[var(--primary)]/20 rounded-full" />
                    <div className="absolute inset-0 w-20 h-20 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-serif font-bold text-[var(--foreground)]">
                        Calculating your Social Kōde
                    </h2>
                    <p className="text-sm text-[var(--text-300)] font-sans">
                        Analyzing your responses...
                    </p>
                </div>
            </div>
        );
    }

    if (!kode) {
        return (
            <OnboardingLayout showBack={true}>
                <div className="pt-20 text-center space-y-4">
                    <h2 className="text-xl font-serif font-bold text-[var(--foreground)]">
                        Something went wrong
                    </h2>
                    <p className="text-sm text-[var(--text-300)] font-sans">
                        We couldn&apos;t calculate your Social Kōde. Please try
                        again.
                    </p>
                    <button
                        onClick={() => router.push("/questionnaire")}
                        className="text-sm text-[var(--primary)] font-sans font-medium hover:underline"
                    >
                        Go back to questionnaire
                    </button>
                </div>
            </OnboardingLayout>
        );
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `My Social Kōde: ${kode.archetype}`,
                    text: kode.description,
                    url: window.location.href,
                });
            } catch {
                // User cancelled or share failed
            }
        }
    };

    return (
        <OnboardingLayout showBack={false} showLogo={true}>
            <div className="pt-6 space-y-6">
                <FadeIn>
                    <div className="text-center">
                        <h1 className="text-2xl font-serif font-bold text-[var(--foreground)]">
                            Your Social Kōde
                        </h1>
                    </div>
                </FadeIn>

                <KodeResultCard
                    archetype={kode.archetype}
                    description={kode.description}
                />

                <div className="flex flex-col gap-[10px] w-full">
                    <BottomButton onClick={() => router.push("/complete")}>
                        Cool!
                    </BottomButton>

                    <button
                        onClick={handleShare}
                        className="flex items-center justify-center gap-2 w-full h-12 px-3 rounded-full border border-[var(--primary-400)] text-base font-sans font-semibold text-[var(--primary-400)] bg-transparent"
                    >
                        Share Result
                        <Share2 className="w-[18px] h-[18px]" />
                    </button>
                </div>
            </div>
        </OnboardingLayout>
    );
}
