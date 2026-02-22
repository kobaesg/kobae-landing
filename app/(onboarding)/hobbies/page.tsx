"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    OnboardingLayout,
    BottomButton,
    TagSelector,
    ReinforcementScreen,
} from "@/components/onboarding";
import { useOnboardingGuard } from "@/lib/onboarding/guard";
import { useUpdateHobbies } from "@/lib/api/hooks";
import { useOnboardingDraft } from "@/lib/onboarding/store";

const HOBBY_CATEGORIES = [
    {
        name: "Trending",
        isHighlighted: true,
        tags: ["Pickleball", "Running", "Travel"],
    },
    {
        name: "Food & Social",
        tags: [
            "Nightlife",
            "F1",
            "Dining",
            "Baking/Cooking",
            "Cafes & Coffee",
            "Wellness",
        ],
    },
    {
        name: "Creative & Consumption",
        tags: [
            "Art & Design",
            "Concerts",
            "Photography",
            "Karaoke",
            "Television & Film",
            "Retail Therapy",
        ],
    },
    {
        name: "Fitness & Growth",
        tags: [
            "Climbing",
            "Gym",
            "Racket Sports",
            "Hyrox",
            "Yoga & Pilates",
            "Volunteering",
            "Investing",
        ],
    },
];

export default function HobbiesPage() {
    const router = useRouter();
    const { isReady } = useOnboardingGuard("profile_filled");
    const updateHobbies = useUpdateHobbies();
    const draft = useOnboardingDraft((s) => s.hobbies);
    const setDraft = useOnboardingDraft((s) => s.setHobbies);
    const clearDraft = useOnboardingDraft((s) => s.clearHobbies);

    const [showIntro, setShowIntro] = useState(!draft.introSeen);
    const [selected, setSelected] = useState<string[]>(draft.selectedTags);

    const handleSetSelected = (tags: string[]) => {
        setSelected(tags);
        setDraft({ selectedTags: tags });
    };

    const handleDismissIntro = () => {
        setShowIntro(false);
        setDraft({ introSeen: true });
    };

    const handleSubmit = async () => {
        try {
            await updateHobbies.mutateAsync({ tags: selected });
            clearDraft();
            router.push("/skills");
        } catch {
            // Error handling via toast or inline
        }
    };

    if (!isReady) {
        return (
            <div className="min-h-dvh bg-[var(--background)] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (showIntro) {
        return (
            <OnboardingLayout showBack={true} currentStep={2}>
                <ReinforcementScreen
                    title="Help us fine tune your matches."
                    subtitle="Share some details to make your matches even better."
                    buttonText="Proceed"
                    onProceed={() => handleDismissIntro()}
                />
            </OnboardingLayout>
        );
    }

    return (
        <OnboardingLayout currentStep={2} showBack={true} showLogo={true}>
            <div className="pt-6 space-y-6">
                <div className="space-y-2">
                    <h1 className="text-2xl font-serif font-bold text-[var(--foreground)]">
                        During my{" "}
                        <span className="text-[var(--primary)]">
                            free time
                        </span>
                        , I enjoy...
                    </h1>
                    <p className="text-sm text-[var(--text-300)] font-sans">
                        Choose at least 3 — you can always change this later.
                    </p>
                </div>

                <TagSelector
                    categories={HOBBY_CATEGORIES}
                    selected={selected}
                    onChange={handleSetSelected}
                    min={3}
                    max={5}
                />

                <button
                    onClick={() => router.push("/skills")}
                    className="block w-full text-center text-sm text-[var(--text-200)] font-sans hover:text-[var(--text-300)] transition-colors"
                >
                    Skip for now
                </button>

                <BottomButton
                    onClick={handleSubmit}
                    disabled={selected.length < 3}
                    loading={updateHobbies.isPending}
                >
                    Next
                </BottomButton>
            </div>
        </OnboardingLayout>
    );
}
