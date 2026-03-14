"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { usePublicProfile, useMutualConnections } from "@/lib/api/hooks/use-public-profile";
import { useSendRequest } from "@/lib/api/hooks/use-connections";
import { useSkipProfile } from "@/lib/api/hooks/use-discovery";
import { ArchetypeBadge } from "@/components/app/discovery/ArchetypeBadge";
import { MutualConnectionsSheet } from "@/components/app/discovery/MutualConnectionsSheet";
import { SocialKodesSheet } from "@/components/app/discovery/SocialKodesSheet";
import { RequestSentModal } from "@/components/app/discovery/RequestSentModal";
import { DeclinedToast } from "@/components/app/discovery/DeclinedToast";
import { formatDisplayText, formatIntentLabel } from "@/lib/utils";

export default function FullProfilePage() {
    const params = useParams();
    const router = useRouter();
    const userId = params.userId as string;

    const { data: profile, isLoading } = usePublicProfile(userId);
    const { data: mutualConnections } = useMutualConnections(userId);
    const sendRequestMutation = useSendRequest();
    const skipMutation = useSkipProfile();

    const [showRequestSent, setShowRequestSent] = useState(false);
    const [showDeclinedToast, setShowDeclinedToast] = useState(false);
    const [showMutualsSheet, setShowMutualsSheet] = useState(false);
    const [showKodesSheet, setShowKodesSheet] = useState(false);

    const canSendRequest = profile?.connection_status === "none";
    const isPendingSent = profile?.connection_status === "pending_sent";
    const isConnected = profile?.connection_status === "connected";

    const handleSendRequest = useCallback(() => {
        if (!userId) return;
        sendRequestMutation.mutate(userId, {
            onSuccess: () => setShowRequestSent(true),
        });
    }, [userId, sendRequestMutation]);

    const handleSkip = useCallback(() => {
        if (!userId) return;
        skipMutation.mutate(userId, {
            onSuccess: () => {
                setShowDeclinedToast(true);
                setTimeout(() => {
                    setShowDeclinedToast(false);
                    router.back();
                }, 1500);
            },
        });
    }, [userId, skipMutation, router]);

    if (isLoading) {
        return (
            <div className="min-h-dvh flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#d8602e] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-dvh flex items-center justify-center px-8">
                <p className="text-[16px] font-sans text-[#715e55]">Profile not found</p>
            </div>
        );
    }

    const mutualText = mutualConnections && mutualConnections.length > 0
        ? mutualConnections.length === 1
            ? `${mutualConnections[0].first_name} is a mutual connection`
            : `${mutualConnections[0].first_name} and ${mutualConnections.length - 1} other${mutualConnections.length - 1 !== 1 ? "s" : ""} are mutual connections`
        : null;

    return (
        <div className="min-h-dvh pb-28 relative">
            {/* Back button */}
            <button
                onClick={() => router.back()}
                className="fixed top-4 left-4 md:left-60 z-30 w-10 h-10 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-sm"
            >
                <ArrowLeft size={20} className="text-[#453933]" />
            </button>

            {/* Photo with overlays */}
            <div className="w-full aspect-[4/3] bg-gradient-to-br from-[#ffefe5] to-[#e8d5c8] relative">
                {profile.photo_url && (
                    <img
                        src={profile.photo_url}
                        alt={profile.first_name}
                        className="w-full h-full object-cover"
                    />
                )}

                {/* Archetype badge overlay — top-right */}
                {profile.kode && (
                    <div className="absolute top-4 right-4">
                        <ArchetypeBadge archetype={profile.kode.archetype} variant="purple" />
                    </div>
                )}

                {/* Floating kode description mini-card */}
                {profile.kode && (
                    <div className="absolute top-16 right-4 max-w-[160px] bg-white/90 backdrop-blur rounded-xl shadow p-3">
                        <p className="text-[11px] font-sans text-[#453933] leading-snug line-clamp-3">
                            {profile.kode.description}
                        </p>
                    </div>
                )}
            </div>

            {/* Content */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-5 -mt-4 relative"
            >
                <div className="bg-white rounded-2xl shadow-[0_0_7px_rgba(0,0,0,0.15)] p-5">
                    {/* Name */}
                    <div className="mb-1">
                        <h1 className="font-serif font-semibold text-[24px] text-[#181412]">
                            {profile.first_name} {profile.last_name}
                        </h1>
                    </div>

                    {/* Headline */}
                    {profile.headline && (
                        <p className="text-[14px] font-sans text-[#715e55] mb-1">
                            {profile.headline}
                        </p>
                    )}

                    {/* Occupation */}
                    {profile.occupation && (
                        <p className="text-[13px] font-sans text-[#9b8479] mb-4">
                            {profile.occupation}
                        </p>
                    )}

                    {/* Social Kode */}
                    {profile.kode && (
                        <div className="mb-5">
                            <p className="text-[11px] font-sans font-semibold text-[#d8602e] uppercase tracking-wider mb-1">
                                Social Kode
                            </p>
                            <p className="font-serif font-bold text-[24px] text-[#181412] leading-snug mb-1">
                                {profile.kode.archetype}
                            </p>
                            <p className="text-[14px] font-sans text-[#715e55] leading-relaxed mb-2">
                                {profile.kode.description}
                            </p>
                            <button
                                onClick={() => setShowKodesSheet(true)}
                                className="text-[13px] font-sans font-medium text-[#d8602e] flex items-center gap-0.5"
                            >
                                More Information <ChevronRight size={14} />
                            </button>
                        </div>
                    )}

                    {/* What You Have in Common */}
                    {profile.common_traits && profile.common_traits.length > 0 && (
                        <div className="mb-5">
                            <h3 className="font-serif font-semibold text-[16px] text-[#181412] mb-2">
                                What You Have in Common
                            </h3>
                            <div className="bg-[#fff8f0] border-l-4 border-[#d8602e] rounded-r-xl px-4 py-3 mb-3">
                                <p className="text-[13px] font-sans text-[#453933] leading-relaxed">
                                    Your shared interests in{" "}
                                    <span className="font-semibold">{profile.common_traits.map((trait) => formatDisplayText(trait)).join(", ")}</span>{" "}
                                    suggests a foundation for an exciting connection.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {profile.common_traits.map((trait) => (
                                    <span
                                        key={trait}
                                        className="px-3 py-1.5 rounded-full text-[13px] font-sans font-medium bg-[#f5ede6] text-[#453933]"
                                    >
                                        ✦ {formatDisplayText(trait)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Prompts */}
                    {profile.prompts && profile.prompts.length > 0 && (
                        <div className="mb-5">
                            <h3 className="font-serif font-semibold text-[16px] text-[#181412] mb-2">
                                Prompts
                            </h3>
                            <div className="flex flex-col gap-3">
                                {profile.prompts.map((prompt) => (
                                    <div
                                        key={prompt.prompt_id}
                                        className="bg-[#f8f7f6] rounded-xl p-4 border-l-3 border-[#d8602e]"
                                    >
                                        <p className="text-[12px] font-sans font-semibold text-[#9b8479] uppercase tracking-wider mb-1">
                                            {prompt.prompt_text}
                                        </p>
                                        <p className="text-[14px] font-sans text-[#453933] leading-relaxed">
                                            {prompt.answer}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Bio */}
                    {profile.bio && (
                        <div className="mb-5">
                            <h3 className="font-serif font-semibold text-[16px] text-[#181412] mb-2">
                                About
                            </h3>
                            <p className="text-[14px] font-sans text-[#453933] leading-relaxed">
                                {profile.bio}
                            </p>
                        </div>
                    )}

                    {/* Hobbies */}
                    {profile.hobbies && profile.hobbies.length > 0 && (
                        <div className="mb-5">
                            <h3 className="font-serif font-semibold text-[16px] text-[#181412] mb-2">
                                Hobbies
                            </h3>
                            <div className="flex flex-wrap gap-1.5">
                                {profile.hobbies.map((hobby) => (
                                    <span
                                        key={hobby}
                                        className="px-3 py-1.5 rounded-full text-[13px] font-sans font-medium bg-white border border-[rgba(180,83,42,0.4)] text-[#453933]"
                                    >
                                        {formatDisplayText(hobby)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Skills */}
                    {profile.skills && profile.skills.length > 0 && (
                        <div className="mb-5">
                            <h3 className="font-serif font-semibold text-[16px] text-[#181412] mb-2">
                                Skills
                            </h3>
                            <div className="flex flex-wrap gap-1.5">
                                {profile.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1.5 rounded-full text-[13px] font-sans font-medium bg-white border border-[rgba(180,83,42,0.4)] text-[#453933]"
                                    >
                                        {formatDisplayText(skill)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Looking for */}
                    {profile.intents && profile.intents.length > 0 && (
                        <div className="mb-5">
                            <h3 className="font-serif font-semibold text-[16px] text-[#181412] mb-2">
                                Looking For
                            </h3>
                            <div className="flex flex-wrap gap-1.5">
                                {profile.intents.map((intent) => (
                                    <span
                                        key={intent}
                                        className="px-3 py-1.5 rounded-full text-[13px] font-sans font-medium bg-[#ffefe5] text-[#d8602e]"
                                    >
                                        {formatIntentLabel(intent)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Offers */}
                    {profile.offers && profile.offers.length > 0 && (
                        <div className="mb-5">
                            <h3 className="font-serif font-semibold text-[16px] text-[#181412] mb-2">
                                Connect With Me
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                {profile.offers.map((offer, i) => (
                                    <div
                                        key={i}
                                        className="bg-[#f8f7f6] rounded-xl p-3"
                                    >
                                        <p className="text-[13px] font-sans font-semibold text-[#181412] mb-0.5">
                                            {offer.title}
                                        </p>
                                        <p className="text-[12px] font-sans text-[#715e55]">
                                            {offer.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Mutual connections */}
                    {mutualConnections && mutualConnections.length > 0 && (
                        <div className="mb-2">
                            <h3 className="font-serif font-semibold text-[16px] text-[#181412] mb-2">
                                Mutual Connections
                            </h3>
                            <button
                                onClick={() => setShowMutualsSheet(true)}
                                className="flex items-center gap-3 w-full text-left"
                            >
                                {/* Stacked avatars */}
                                <div className="flex -space-x-2">
                                    {mutualConnections.slice(0, 3).map((mc) => (
                                        <div
                                            key={mc.user_id}
                                            className="w-8 h-8 rounded-full border-2 border-white bg-[#e8ddd7] overflow-hidden flex-shrink-0 flex items-center justify-center"
                                        >
                                            {mc.photo_url ? (
                                                <img src={mc.photo_url} alt={mc.first_name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-[10px] font-serif font-semibold text-[#b4532a]">
                                                    {mc.first_name[0]}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {/* Text + arrow */}
                                <p className="text-[13px] font-sans text-[#453933] flex-1 leading-snug">
                                    {mutualText}
                                </p>
                                <ChevronRight size={14} className="text-[#d8602e] flex-shrink-0" />
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Sticky bottom actions */}
            <div className="fixed bottom-16 md:bottom-0 left-0 right-0 md:left-56 bg-gradient-to-t from-white via-white to-white/0 pt-6 pb-5 px-5 z-20">
                <div className="max-w-lg mx-auto flex flex-col gap-2">
                    {canSendRequest && (
                        <button
                            onClick={handleSendRequest}
                            disabled={sendRequestMutation.isPending}
                            className="w-full py-3.5 rounded-2xl bg-[#d8602e] text-white font-semibold font-sans text-[15px] active:scale-[0.98] transition-transform disabled:opacity-50 shadow-[0px_0px_10px_rgba(255,144,97,0.8)]"
                        >
                            {sendRequestMutation.isPending ? "Sending..." : "Send Request"}
                        </button>
                    )}
                    {isPendingSent && (
                        <div className="w-full py-3.5 rounded-2xl bg-[#f5ede6] text-[#715e55] font-semibold font-sans text-[15px] text-center">
                            Request Pending
                        </div>
                    )}
                    {isConnected && (
                        <div className="w-full py-3.5 rounded-2xl bg-[#e6f7e6] text-[#2e8b57] font-semibold font-sans text-[15px] text-center">
                            Connected
                        </div>
                    )}
                    {canSendRequest && (
                        <button
                            onClick={handleSkip}
                            disabled={skipMutation.isPending}
                            className="text-center text-[14px] font-sans text-[#9b8479] font-medium py-2"
                        >
                            ✕ Skip Profile
                        </button>
                    )}
                </div>
            </div>

            <SocialKodesSheet
                isOpen={showKodesSheet}
                onClose={() => setShowKodesSheet(false)}
                activeArchetype={profile.kode?.archetype}
            />

            <MutualConnectionsSheet
                isOpen={showMutualsSheet}
                onClose={() => setShowMutualsSheet(false)}
                connections={mutualConnections ?? []}
            />

            <RequestSentModal
                isOpen={showRequestSent}
                onClose={() => {
                    setShowRequestSent(false);
                    router.back();
                }}
                name={profile.first_name}
            />

            <DeclinedToast isVisible={showDeclinedToast} />
        </div>
    );
}
