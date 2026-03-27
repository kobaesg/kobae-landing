"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { usePrompts, useUpdatePrompts } from "@/lib/api/hooks";
import { PromptCard } from "@/components/onboarding";
import { Loader2 } from "lucide-react";

const AVAILABLE_PROMPTS = [
    { id: 1, text: "Me in 5 Words..." },
    { id: 2, text: "My Latest Obsession..." },
    { id: 3, text: "This Year, I Really Want To..." },
    { id: 4, text: "I Can't Leave Home Without..." },
];

const MAX_PROMPTS = 3;

export default function EditPromptsPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { data: existingPrompts, isLoading } = usePrompts(isAuthenticated);
    const updatePrompts = useUpdatePrompts();

    const [selectedPrompts, setSelectedPrompts] = useState<Set<number>>(new Set());
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const serverDataApplied = useRef(false);

    useEffect(() => {
        if (existingPrompts && !serverDataApplied.current) {
            serverDataApplied.current = true;
            const sel = new Set<number>();
            const ans: Record<number, string> = {};
            for (const p of existingPrompts) {
                if (p.answer?.trim()) {
                    sel.add(p.prompt_id);
                    ans[p.prompt_id] = p.answer;
                }
            }
            setSelectedPrompts(sel);
            setAnswers(ans);
        }
    }, [existingPrompts]);

    const visibleSelectedCount = AVAILABLE_PROMPTS.filter((p) =>
        selectedPrompts.has(p.id)
    ).length;

    const handleTogglePrompt = (promptId: number) => {
        const next = new Set(selectedPrompts);
        if (next.has(promptId)) {
            next.delete(promptId);
        } else {
            const visible = AVAILABLE_PROMPTS.filter((p) => next.has(p.id)).length;
            if (visible < MAX_PROMPTS) {
                next.add(promptId);
            }
        }
        setSelectedPrompts(next);
    };

    const handleUpdateAnswer = (promptId: number, answer: string) => {
        setAnswers((prev) => ({ ...prev, [promptId]: answer }));
    };

    const handleSubmit = async () => {
        const filled = AVAILABLE_PROMPTS.filter(
            (p) => selectedPrompts.has(p.id) && answers[p.id]?.trim()
        );
        try {
            await updatePrompts.mutateAsync(
                filled.map((p) => ({
                    prompt_id: p.id,
                    answer: answers[p.id].trim(),
                }))
            );
            router.push("/me/edit");
        } catch {
            // non-fatal
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-dvh bg-[#f8f7f6] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#d8602e] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-dvh bg-[#f8f7f6]">
            <div className="sticky top-0 z-30 bg-[#f8f7f6]/95 backdrop-blur border-b border-[#e8e0da] px-6 h-14 flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f0e8e0] transition-colors"
                >
                    <ChevronLeft size={20} className="text-[#453933]" strokeWidth={1.5} />
                </button>
                <h1 className="font-serif font-semibold text-[18px] text-[#181412]">
                    Prompts
                </h1>
            </div>

            <div className="max-w-lg mx-auto px-6 py-6 pb-44 space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-[14px] font-semibold font-sans text-[#453933]">
                        Choose up to {MAX_PROMPTS} Prompts
                    </p>
                    <span className="text-xs px-3 py-1 rounded-full bg-[#d8602e]/10 text-[#d8602e] font-sans font-medium">
                        {visibleSelectedCount}/{MAX_PROMPTS} Selected
                    </span>
                </div>

                <div className="space-y-3">
                    {AVAILABLE_PROMPTS.map((prompt) => (
                        <PromptCard
                            key={prompt.id}
                            promptText={prompt.text}
                            answer={answers[prompt.id] || ""}
                            onChange={(answer) => handleUpdateAnswer(prompt.id, answer)}
                            selected={selectedPrompts.has(prompt.id)}
                            onToggle={() => handleTogglePrompt(prompt.id)}
                            disabled={
                                visibleSelectedCount >= MAX_PROMPTS &&
                                !selectedPrompts.has(prompt.id)
                            }
                        />
                    ))}
                </div>

                <div className="fixed bottom-16 md:bottom-0 left-0 right-0 px-5 pb-5 pt-4 bg-gradient-to-t from-[#f8f7f6] via-[#f8f7f6] to-transparent pointer-events-none">
                    <div className="mx-auto max-w-lg pointer-events-auto">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={updatePrompts.isPending}
                            className="w-full py-4 rounded-3xl font-sans font-semibold text-base bg-[#d8602e] text-white hover:bg-[#c55528] shadow-[0_0_10px_rgba(255,144,97,0.8)] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            {updatePrompts.isPending && <Loader2 className="w-5 h-5 animate-spin" />}
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
