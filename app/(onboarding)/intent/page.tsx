"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    OnboardingLayout,
    BottomButton,
    TagChip,
} from "@/components/onboarding";
import { useOnboardingGuard } from "@/lib/onboarding/guard";
import { useUpdateIntent } from "@/lib/api/hooks";

const INTENT_OPTIONS = [
    { label: "Up-and-Comers", value: "up_and_comers" },
    { label: "Role Models", value: "role_models" },
    { label: "Door-Openers", value: "door_openers" },
    { label: "Collaborators", value: "collaborators" },
    { label: "Anyone who's Vibing", value: "anyone_whos_vibing" },
];

export default function IntentPage() {
    const router = useRouter();
    const { isReady } = useOnboardingGuard("skills_set");
    const updateIntent = useUpdateIntent();

    const [selected, setSelected] = useState<string[]>([]);

    const handleToggle = (value: string) => {
        setSelected((prev) =>
            prev.includes(value)
                ? prev.filter((v) => v !== value)
                : [...prev, value]
        );
    };

    const handleSubmit = async () => {
        try {
            await updateIntent.mutateAsync({ intents: selected });
            router.push("/offers");
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
        <OnboardingLayout currentStep={3} showBack={true} showLogo={true}>
            <div className="pt-6 space-y-6">
                <div className="space-y-2">
                    <h1 className="text-2xl font-serif font-bold text-[var(--foreground)]">
                        Who are you hoping to connect with?
                    </h1>
                    <p className="text-sm text-[var(--text-300)] font-sans">
                        Select all that apply. We&apos;ll curate matches that
                        match your intent.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    {INTENT_OPTIONS.map((option) => (
                        <TagChip
                            key={option.value}
                            label={option.label}
                            selected={selected.includes(option.value)}
                            onClick={() => handleToggle(option.value)}
                        />
                    ))}
                </div>

                <BottomButton
                    onClick={handleSubmit}
                    disabled={selected.length === 0}
                    loading={updateIntent.isPending}
                >
                    Next
                </BottomButton>
            </div>
        </OnboardingLayout>
    );
}
