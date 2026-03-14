"use client";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import type { RecommendationResponse } from "@/lib/api/types";
import { ArchetypeBadge } from "./ArchetypeBadge";
import { MutualConnectionsRow } from "./MutualConnectionsRow";

interface Props {
    recommendation: RecommendationResponse;
    onSendRequest: () => void;
    onDismiss: () => void;
    onViewMutuals: () => void;
    isSending: boolean;
}

export function RecommendationCard({ recommendation, onSendRequest, onDismiss, onViewMutuals, isSending }: Props) {
    const router = useRouter();
    const { profile, compat_score, why_connect, common_traits, mutual_connection_count } = recommendation;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-5 bg-white rounded-2xl shadow-[0_0_7px_rgba(0,0,0,0.15)] overflow-hidden relative"
        >
            {/* Dismiss button */}
            <button
                onClick={onDismiss}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-sm"
            >
                <X size={16} className="text-[#453933]" />
            </button>

            {/* Profile photo */}
            <div className="w-full aspect-[4/3] bg-gradient-to-br from-[#ffefe5] to-[#e8d5c8] relative">
                {profile.photo_url && (
                    <img src={profile.photo_url} alt={profile.first_name} className="w-full h-full object-cover" />
                )}
                {/* Compat score badge */}
                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur rounded-full px-3 py-1 flex items-center gap-1.5">
                    <span className="text-[12px] font-sans font-bold text-[#d8602e]">
                        {Math.round(compat_score)}% match
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Name + Archetype */}
                <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-serif font-semibold text-[22px] text-[#181412]">
                        {profile.first_name} {profile.last_name}
                    </h2>
                    <ArchetypeBadge archetype={profile.archetype || ""} />
                </div>

                {/* Headline */}
                {profile.headline && (
                    <p className="text-[14px] font-sans text-[#715e55] mb-3">{profile.headline}</p>
                )}

                {/* Why connect */}
                <p className="text-[14px] font-sans text-[#453933] mb-3 leading-relaxed">{why_connect}</p>

                {/* Common traits */}
                {common_traits && common_traits.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {common_traits.slice(0, 5).map((trait) => (
                            <span key={trait} className="px-2.5 py-1 rounded-full text-[12px] font-sans font-medium bg-[#f5ede6] text-[#453933]">
                                {trait}
                            </span>
                        ))}
                    </div>
                )}

                {/* Mutual connections */}
                <MutualConnectionsRow count={mutual_connection_count} onViewAll={onViewMutuals} />

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-4">
                    <button
                        onClick={onSendRequest}
                        disabled={isSending}
                        className="w-full py-3.5 rounded-2xl bg-[#d8602e] text-white font-semibold font-sans text-[15px] active:scale-[0.98] transition-transform disabled:opacity-50"
                    >
                        {isSending ? "Sending..." : "Send Request"}
                    </button>
                    <button
                        onClick={() => router.push(`/discover/${profile.user_id}`)}
                        className="w-full py-3 rounded-2xl text-[#d8602e] font-semibold font-sans text-[14px] hover:bg-[#ffefe5] transition-colors"
                    >
                        View Full Profile
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
