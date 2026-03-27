"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Plus, X } from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import { useOffers, useUpdateOffers } from "@/lib/api/hooks";
import { Loader2 } from "lucide-react";

interface OfferEntry {
    title: string;
    description: string;
}

export default function EditConnectPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { data: offersData, isLoading } = useOffers(isAuthenticated);
    const updateOffers = useUpdateOffers();
    const [offers, setOffers] = useState<OfferEntry[]>([{ title: "", description: "" }]);

    useEffect(() => {
        if (offersData && offersData.length > 0) {
            setOffers(offersData.map((o) => ({ title: o.title, description: o.description })));
        }
    }, [offersData]);

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
                    Connect With Me For
                </h1>
            </div>

            <div className="max-w-lg mx-auto px-6 py-6 pb-44 space-y-4">
                <p className="text-[14px] font-sans text-[#715e55]">
                    Kobae is built on mutual support. Share a way you can help others.
                </p>

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
                                    <X className="w-4 h-4 text-[#715e55]" />
                                </button>
                            )}
                            <input
                                type="text"
                                placeholder="Title (e.g., Resume Review)"
                                value={offer.title}
                                onChange={(e) =>
                                    handleUpdateOffer(index, "title", e.target.value)
                                }
                                maxLength={100}
                                className="w-full px-3 py-2.5 rounded-lg bg-[#f8f7f6] text-sm font-sans text-[#181412] placeholder:text-[#b4a49c] outline-none focus:ring-2 focus:ring-[#d8602e]/30 transition-all"
                            />
                            <textarea
                                placeholder="Description (optional)"
                                value={offer.description}
                                onChange={(e) =>
                                    handleUpdateOffer(index, "description", e.target.value)
                                }
                                rows={2}
                                className="w-full px-3 py-2.5 rounded-lg bg-[#f8f7f6] text-sm font-sans text-[#181412] placeholder:text-[#b4a49c] outline-none resize-none focus:ring-2 focus:ring-[#d8602e]/30 transition-all"
                            />
                        </div>
                    ))}

                    {offers.length < 5 && (
                        <button
                            type="button"
                            onClick={handleAddOffer}
                            className="w-full py-4 rounded-xl border-2 border-dashed border-[#e8ddd7] text-sm font-sans text-[#715e55] hover:border-[#d8602e] hover:text-[#d8602e] transition-all flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add another offering
                        </button>
                    )}
                </div>

                <div className="fixed bottom-16 md:bottom-0 left-0 right-0 px-5 pb-5 pt-4 bg-gradient-to-t from-[#f8f7f6] via-[#f8f7f6] to-transparent pointer-events-none">
                    <div className="mx-auto max-w-lg pointer-events-auto">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={updateOffers.isPending}
                            className="w-full py-4 rounded-3xl font-sans font-semibold text-base bg-[#d8602e] text-white hover:bg-[#c55528] shadow-[0_0_10px_rgba(255,144,97,0.8)] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            {updateOffers.isPending && <Loader2 className="w-5 h-5 animate-spin" />}
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
