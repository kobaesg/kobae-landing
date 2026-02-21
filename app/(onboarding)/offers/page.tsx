"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { OnboardingLayout, BottomButton } from "@/components/onboarding";
import { useOnboardingGuard } from "@/lib/onboarding/guard";
import { useUpdateOffers } from "@/lib/api/hooks";
import { X, Plus } from "lucide-react";

interface OfferEntry {
    title: string;
    description: string;
}

export default function OffersPage() {
    const router = useRouter();
    const { isReady } = useOnboardingGuard("intent_set");
    const updateOffers = useUpdateOffers();

    const [offers, setOffers] = useState<OfferEntry[]>([
        { title: "", description: "" },
    ]);

    const handleAddOffer = () => {
        if (offers.length >= 5) return;
        setOffers([...offers, { title: "", description: "" }]);
    };

    const handleRemoveOffer = (index: number) => {
        setOffers(offers.filter((_, i) => i !== index));
    };

    const handleUpdateOffer = (
        index: number,
        field: keyof OfferEntry,
        value: string
    ) => {
        const updated = [...offers];
        updated[index] = { ...updated[index], [field]: value };
        setOffers(updated);
    };

    const validOffers = offers.filter((o) => o.title.trim() !== "");

    const handleSubmit = async () => {
        try {
            await updateOffers.mutateAsync({
                offers: validOffers.map((o) => ({
                    title: o.title.trim(),
                    description: o.description.trim(),
                })),
            });
            router.push("/bio");
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
                        What can you help with?
                    </h1>
                    <p className="text-sm text-[var(--text-300)] font-sans">
                        Kobae is built on mutual support. Share a way you can
                        help others.
                    </p>
                </div>

                <div className="space-y-4">
                    {offers.map((offer, index) => (
                        <div
                            key={index}
                            className="relative bg-white rounded-xl shadow-[0_0_2px_rgba(0,0,0,0.25)] p-4 space-y-3"
                        >
                            {offers.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveOffer(index)}
                                    className="absolute top-3 right-3 p-1 rounded-full hover:bg-black/5 transition-colors"
                                >
                                    <X className="w-4 h-4 text-[var(--text-200)]" />
                                </button>
                            )}

                            <input
                                type="text"
                                placeholder="Title (e.g., Resume Review)"
                                value={offer.title}
                                onChange={(e) =>
                                    handleUpdateOffer(
                                        index,
                                        "title",
                                        e.target.value
                                    )
                                }
                                maxLength={100}
                                className="w-full px-3 py-2.5 rounded-lg bg-[var(--background)] text-sm font-sans text-[var(--foreground)] placeholder:text-[var(--text-100)] outline-none focus:ring-2 focus:ring-[var(--primary)]/30 transition-all"
                            />

                            <textarea
                                placeholder="Description (optional)"
                                value={offer.description}
                                onChange={(e) =>
                                    handleUpdateOffer(
                                        index,
                                        "description",
                                        e.target.value
                                    )
                                }
                                rows={2}
                                className="w-full px-3 py-2.5 rounded-lg bg-[var(--background)] text-sm font-sans text-[var(--foreground)] placeholder:text-[var(--text-100)] outline-none resize-none focus:ring-2 focus:ring-[var(--primary)]/30 transition-all"
                            />
                        </div>
                    ))}

                    {offers.length < 5 && (
                        <button
                            type="button"
                            onClick={handleAddOffer}
                            className="w-full py-4 rounded-xl border-2 border-dashed border-[var(--secondary-100)] text-sm font-sans text-[var(--text-200)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add another offer
                        </button>
                    )}
                </div>

                <button
                    onClick={() => router.push("/bio")}
                    className="block w-full text-center text-sm text-[var(--text-200)] font-sans hover:text-[var(--text-300)] transition-colors"
                >
                    Skip for now
                </button>

                <BottomButton
                    onClick={handleSubmit}
                    disabled={validOffers.length === 0}
                    loading={updateOffers.isPending}
                >
                    Next
                </BottomButton>
            </div>
        </OnboardingLayout>
    );
}
