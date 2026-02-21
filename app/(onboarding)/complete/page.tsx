"use client";

import { useRouter } from "next/navigation";
import { OnboardingLayout, BottomButton } from "@/components/onboarding";
import { useOnboardingGuard } from "@/lib/onboarding/guard";

export default function CompletePage() {
    const router = useRouter();
    const { isReady } = useOnboardingGuard("kode_calculated");

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
                <div className="mb-8">
                    <img
                        src="/resources/thumbnail.png"
                        alt="Kobae"
                        className="w-32 h-32 mx-auto mb-4"
                    />
                </div>

                <h1 className="text-3xl font-serif font-bold text-[var(--foreground)] mb-3 leading-tight">
                    We&apos;re all set!
                </h1>

                <p className="text-sm text-[var(--text-300)] font-sans max-w-sm mb-10">
                    Your profile is fully set up. Give our system some time to
                    discover the person you should have met long ago...
                </p>

                <BottomButton onClick={() => router.push("/")}>
                    Discover Now
                </BottomButton>
            </div>
        </OnboardingLayout>
    );
}
