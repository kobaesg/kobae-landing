"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    OnboardingLayout,
    BottomButton,
    TagSelector,
} from "@/components/onboarding";
import { useOnboardingGuard } from "@/lib/onboarding/guard";
import { useUpdateSkills } from "@/lib/api/hooks";
import { useOnboardingDraft } from "@/lib/onboarding/store";
import { FadeIn } from "@/components/onboarding/animations";

const SKILL_CATEGORIES = [
    {
        name: "Business & Professional",
        tags: [
            "Copywriting & Content",
            "Marketing & Growth",
            "Product Management",
            "Finance/Accounting",
            "Strategy",
            "Operations",
            "Legal",
            "Talent Acquisition",
            "Sales & BD",
            "Leadership",
        ],
    },
    {
        name: "People & Knowledge",
        tags: [
            "Teaching",
            "Research",
            "Negotiation",
            "Parenting",
            "Mental Health",
            "Fitness",
            "Sustainability",
            "Community Building",
            "Mentoring",
            "Speaking & Hosting",
        ],
    },
    {
        name: "Creative & Technical",
        tags: [
            "Coding",
            "UI/UX",
            "QA",
            "Data Analysis",
            "Design",
            "Media",
            "Policy",
            "Non-Profit",
            "Engineering",
            "AI & ML",
            "Healthcare",
        ],
    },
];

export default function SkillsPage() {
    const router = useRouter();
    const { isReady } = useOnboardingGuard("hobbies_set");
    const updateSkills = useUpdateSkills();
    const draft = useOnboardingDraft((s) => s.skills);
    const setDraft = useOnboardingDraft((s) => s.setSkills);
    const clearDraft = useOnboardingDraft((s) => s.clearSkills);

    const [selected, setSelected] = useState<string[]>(draft.selectedTags);

    const handleSetSelected = (tags: string[]) => {
        setSelected(tags);
        setDraft({ selectedTags: tags });
    };

    const handleSubmit = async () => {
        try {
            await updateSkills.mutateAsync({ tags: selected });
            clearDraft();
            router.push("/intent");
        } catch {
            // Error handling
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
        <OnboardingLayout currentStep={2} showBack={true} showLogo={true}>
            <div className="pt-6 space-y-6">
                <FadeIn>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-serif font-bold text-[var(--foreground)]">
                            I&apos;m{" "}
                            <span className="text-[var(--primary)]">confident</span>{" "}
                            in my...
                        </h1>
                        <p className="text-sm text-[var(--text-300)] font-sans">
                            Pick a few strengths you&apos;d like others to know
                            about.
                        </p>
                    </div>
                </FadeIn>

                <FadeIn delay={0.1}>
                    <TagSelector
                        categories={SKILL_CATEGORIES}
                        selected={selected}
                        onChange={handleSetSelected}
                        min={3}
                        max={5}
                    />
                </FadeIn>

                <button
                    onClick={() => router.push("/intent")}
                    className="block w-full text-center text-sm text-[var(--text-200)] font-sans hover:text-[var(--text-300)] transition-colors"
                >
                    Skip for now
                </button>

                <BottomButton
                    onClick={handleSubmit}
                    disabled={selected.length < 3}
                    loading={updateSkills.isPending}
                >
                    Next
                </BottomButton>
            </div>
        </OnboardingLayout>
    );
}
