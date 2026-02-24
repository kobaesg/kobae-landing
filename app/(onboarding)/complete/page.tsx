"use client";

import { useRouter } from "next/navigation";
import { OnboardingLayout, BottomButton } from "@/components/onboarding";
import { useOnboardingGuard } from "@/lib/onboarding/guard";
import { useOnboardingDraft } from "@/lib/onboarding/store";
import { motion } from "framer-motion";

const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function CompletePage() {
    const router = useRouter();
    const { isReady } = useOnboardingGuard("kode_calculated");
    const clearAll = useOnboardingDraft((s) => s.clearAll);

    if (!isReady) {
        return (
            <div className="min-h-dvh bg-[var(--background)] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <OnboardingLayout showBack={false} showLogo={true}>
            <div className="flex flex-col items-center justify-center min-h-[75dvh] text-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="mb-8"
                >
                    <img
                        src="/resources/thumbnail.png"
                        alt="Kobae"
                        className="w-32 h-32 mx-auto mb-4"
                    />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2, ease: EASE }}
                    className="text-3xl font-serif font-bold text-[var(--foreground)] mb-3 leading-tight"
                >
                    We&apos;re all set!
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3, ease: EASE }}
                    className="text-sm text-[var(--text-300)] font-sans max-w-sm mb-10"
                >
                    Your profile is fully set up. Give our system some time to
                    discover the person you should have met long ago...
                </motion.p>

                <BottomButton onClick={() => {
                    clearAll();
                    router.push("/");
                }}>
                    Discover Now
                </BottomButton>
            </div>
        </OnboardingLayout>
    );
}
