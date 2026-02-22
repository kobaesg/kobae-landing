"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
    OnboardingLayout,
    BottomButton,
    PromptCard,
} from "@/components/onboarding";
import { useOnboardingGuard } from "@/lib/onboarding/guard";
import { usePrompts, useUpdatePrompts, useUpdateBio } from "@/lib/api/hooks";
import { useOnboardingDraft } from "@/lib/onboarding/store";

const AVAILABLE_PROMPTS = [
    { id: 1, text: "Me in 5 Words..." },
    { id: 2, text: "My Latest Obsession..." },
    { id: 3, text: "This Year, I Really Want To..." },
    { id: 4, text: "I Can't Leave Home Without..." },
];

const MAX_PROMPTS = 2;

export default function BioPage() {
    const router = useRouter();
    const { isReady } = useOnboardingGuard("intent_set");
    const { data: existingPrompts } = usePrompts();
    const updatePrompts = useUpdatePrompts();
    const updateBio = useUpdateBio();
    const draft = useOnboardingDraft((s) => s.bio);
    const setDraft = useOnboardingDraft((s) => s.setBio);
    const clearDraft = useOnboardingDraft((s) => s.clearBio);

    const [selectedPrompts, setSelectedPrompts] = useState<Set<number>>(
        new Set(draft.selectedPrompts)
    );
    const [answers, setAnswers] = useState<Record<number, string>>(draft.answers);
    const [bio, setBio] = useState(draft.bio);
    const serverDataApplied = useRef(false);

    // Pre-fill from existing server data (takes priority over draft)
    useEffect(() => {
        if (existingPrompts && !serverDataApplied.current) {
            serverDataApplied.current = true;
            const sel = new Set<number>();
            const ans: Record<number, string> = {};
            let hasServerData = false;
            for (const p of existingPrompts) {
                // Only mark a prompt as selected if the user has already answered it
                if (p.answer?.trim()) {
                    sel.add(p.prompt_id);
                    ans[p.prompt_id] = p.answer;
                    hasServerData = true;
                }
            }
            if (hasServerData) {
                setSelectedPrompts(sel);
                setAnswers(ans);
            }
        }
    }, [existingPrompts]);

    // Sync local state changes to draft store
    useEffect(() => {
        setDraft({
            bio,
            selectedPrompts: Array.from(selectedPrompts),
            answers,
        });
    }, [bio, selectedPrompts, answers, setDraft]);

    const handleTogglePrompt = (promptId: number) => {
        const newSelected = new Set(selectedPrompts);
        if (newSelected.has(promptId)) {
            newSelected.delete(promptId);
        } else {
            // Count only visible prompts so stale IDs from existingPrompts don't block selection
            const visibleCount = AVAILABLE_PROMPTS.filter((p) =>
                newSelected.has(p.id)
            ).length;
            if (visibleCount < MAX_PROMPTS) {
                newSelected.add(promptId);
            }
        }
        setSelectedPrompts(newSelected);
    };

    const handleUpdateAnswer = (promptId: number, answer: string) => {
        setAnswers((prev) => ({ ...prev, [promptId]: answer }));
    };

    const filledPrompts = Array.from(selectedPrompts).filter(
        (id) => answers[id]?.trim()
    );

    // Count only prompts that are both selected AND present in the visible list
    const visibleSelectedCount = AVAILABLE_PROMPTS.filter((p) =>
        selectedPrompts.has(p.id)
    ).length;

    const handleSubmit = async () => {
        try {
            // Save prompts
            if (filledPrompts.length > 0) {
                const promptData = filledPrompts.map((id) => ({
                    prompt_id: id,
                    answer: answers[id].trim(),
                }));
                await updatePrompts.mutateAsync(promptData);
            }

            // Save bio if filled
            if (bio.trim()) {
                await updateBio.mutateAsync({ bio: bio.trim() });
            }

            clearDraft();
            router.push("/questionnaire");
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
        <OnboardingLayout currentStep={4} showBack={true} showLogo={true}>
            <div className="pt-6 space-y-6">
                <div className="space-y-2">
                    <h1 className="text-2xl font-serif font-bold text-[var(--foreground)]">
                        Add a little personality
                    </h1>
                    <p className="text-sm text-[var(--text-300)] font-sans">
                        Authenticity helps build trust. Tell us what makes you,
                        you.
                    </p>
                </div>

                {/* Bio field */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--text-400)] font-sans">
                        Bio
                    </label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself..."
                        maxLength={500}
                        rows={3}
                        className="w-full px-4 py-3.5 rounded-xl bg-white text-sm font-sans text-[var(--foreground)] placeholder:text-[var(--text-100)] shadow-[0_0_2px_rgba(0,0,0,0.25)] outline-none resize-none focus:ring-2 focus:ring-[var(--primary)]/30 transition-all"
                    />
                    <p className="text-xs text-[var(--text-200)] text-right font-sans">
                        {bio.length}/500
                    </p>
                </div>

                {/* Prompts */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-[var(--text-400)] font-sans">
                            Choose Up to {MAX_PROMPTS} Prompts
                        </h2>
                        <span className="text-xs px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-sans font-medium">
                            {visibleSelectedCount}/{MAX_PROMPTS} Selected
                        </span>
                    </div>

                    <div className="space-y-3">
                        {AVAILABLE_PROMPTS.map((prompt) => (
                            <PromptCard
                                key={prompt.id}
                                promptText={prompt.text}
                                answer={answers[prompt.id] || ""}
                                onChange={(answer) =>
                                    handleUpdateAnswer(prompt.id, answer)
                                }
                                selected={selectedPrompts.has(prompt.id)}
                                onToggle={() =>
                                    handleTogglePrompt(prompt.id)
                                }
                                disabled={
                                    visibleSelectedCount >= MAX_PROMPTS &&
                                    !selectedPrompts.has(prompt.id)
                                }
                            />
                        ))}
                    </div>
                </div>

                <BottomButton
                    onClick={handleSubmit}
                    loading={
                        updatePrompts.isPending || updateBio.isPending
                    }
                >
                    Next
                </BottomButton>
            </div>
        </OnboardingLayout>
    );
}
