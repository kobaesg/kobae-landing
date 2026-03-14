"use client";
import { motion } from "framer-motion";
import { X, ChevronRight, Sun, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import type { RecommendationResponse } from "@/lib/api/types";
import { formatDisplayText } from "@/lib/utils";
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
    const { profile, shared_interests, common_traits, mutual_connection_count } = recommendation;

    const hasNotableConnections = (shared_interests && shared_interests.length > 0) || (common_traits && common_traits.length > 0);

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

            {/* Top: horizontal layout — small photo left, info right */}
            <div className="flex gap-3 p-4 pb-3">
                {/* Small thumbnail */}
                <div className="w-[100px] h-[100px] rounded-2xl bg-gradient-to-br from-[#ffefe5] to-[#e8d5c8] flex-shrink-0 overflow-hidden">
                    {profile.photo_url && (
                        <img src={profile.photo_url} alt={profile.first_name} className="w-full h-full object-cover" />
                    )}
                </div>

                {/* Name + badge + headline */}
                <div className="flex-1 min-w-0 pt-1 pr-8">
                    <h2 className="font-serif font-semibold text-[20px] text-[#181412] leading-snug">
                        {profile.first_name} {profile.last_name}
                    </h2>
                    <div className="mt-1 mb-2">
                        <ArchetypeBadge archetype={profile.archetype || ""} variant="purple" />
                    </div>
                    {profile.headline && (
                        <p className="text-[13px] font-sans text-[#715e55] leading-snug line-clamp-2">{profile.headline}</p>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="px-4 pb-4">
                {/* Notable Connections */}
                {hasNotableConnections && (
                    <div className="bg-white rounded-xl shadow-[0px_0px_2px_rgba(0,0,0,0.25)] p-3.5 mb-3">
                        <p className="text-[11px] font-sans font-semibold text-[#9b8479] uppercase tracking-wider mb-2.5">
                            Notable Connections
                        </p>
                        <div className="flex flex-col gap-2">
                            {shared_interests?.slice(0, 2).map((interest) => (
                                <div key={interest} className="flex items-start gap-2">
                                    <Sun size={14} className="text-[#d8602e] mt-0.5 flex-shrink-0" />
                                    <p className="text-[13px] font-sans text-[#453933]">
                                        You and {profile.first_name} both enjoy <span className="font-semibold">{formatDisplayText(interest)}</span>
                                    </p>
                                </div>
                            ))}
                            {common_traits?.slice(0, 2).map((trait) => (
                                <div key={trait} className="flex items-start gap-2">
                                    <Pencil size={14} className="text-[#d8602e] mt-0.5 flex-shrink-0" />
                                    <p className="text-[13px] font-sans text-[#453933]">
                                        You're both skilled in <span className="font-semibold">{formatDisplayText(trait)}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Mutual connections */}
                <div className="mb-3">
                    <MutualConnectionsRow count={mutual_connection_count} onViewAll={onViewMutuals} />
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                    <button
                        onClick={onSendRequest}
                        disabled={isSending}
                        className="w-full py-3.5 rounded-2xl bg-[#d8602e] text-white font-semibold font-sans text-[15px] active:scale-[0.98] transition-transform disabled:opacity-50 shadow-[0px_0px_10px_rgba(255,144,97,0.8)]"
                    >
                        {isSending ? "Sending..." : "Send Request"}
                    </button>
                    <button
                        onClick={() => router.push(`/discover/${profile.user_id}`)}
                        className="w-full py-3 rounded-2xl text-[#d8602e] font-semibold font-sans text-[14px] hover:bg-[#ffefe5] transition-colors flex items-center justify-center gap-1"
                    >
                        View Full Profile
                        <ChevronRight size={16} className="text-[#d8602e]" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
