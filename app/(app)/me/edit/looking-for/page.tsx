"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { useIntent, useUpdateIntent } from "@/lib/api/hooks";
import { TagChip } from "@/components/onboarding";
import { Loader2 } from "lucide-react";

const INTENT_OPTIONS = [
    { label: "Up-and-Comers", value: "up_and_comers" },
    { label: "Role Models", value: "role_models" },
    { label: "Door-Openers", value: "door_openers" },
    { label: "Collaborators", value: "collaborators" },
    { label: "Anyone who's Vibing", value: "anyone_whos_vibing" },
];

export default function EditLookingForPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { data: intentData, isLoading } = useIntent(isAuthenticated);
    const updateIntent = useUpdateIntent();
    const [selected, setSelected] = useState<string[]>([]);

    useEffect(() => {
        if (intentData?.intents) {
            setSelected(intentData.intents);
        }
    }, [intentData]);

    const handleToggle = (value: string) => {
        setSelected((prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        );
    };

    const handleSubmit = async () => {
        try {
            await updateIntent.mutateAsync({ intents: selected });
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
                    Looking For
                </h1>
            </div>

            <div className="max-w-lg mx-auto px-6 py-6 pb-44 space-y-4">
                <p className="text-[14px] font-sans text-[#715e55]">
                    Select all that apply. We'll curate matches that fit your intent.
                </p>
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
                <div className="fixed bottom-16 md:bottom-0 left-0 right-0 px-5 pb-5 pt-4 bg-gradient-to-t from-[#f8f7f6] via-[#f8f7f6] to-transparent pointer-events-none">
                    <div className="mx-auto max-w-lg pointer-events-auto">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={selected.length === 0 || updateIntent.isPending}
                            className="w-full py-4 rounded-3xl font-sans font-semibold text-base bg-[#d8602e] text-white hover:bg-[#c55528] shadow-[0_0_10px_rgba(255,144,97,0.8)] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            {updateIntent.isPending && <Loader2 className="w-5 h-5 animate-spin" />}
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
