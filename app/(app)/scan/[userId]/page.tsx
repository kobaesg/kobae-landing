"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, User, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePublicProfile } from "@/lib/api/hooks/use-public-profile";
import { useSendRequest } from "@/lib/api/hooks/use-connections";
import { RequestSentModal } from "@/components/app/discovery/RequestSentModal";
import type { MutualConnection } from "@/lib/api/types";

function Avatar({
    name,
    photoUrl,
    size = 48,
}: {
    name: string;
    photoUrl?: string;
    size?: number;
}) {
    const [err, setErr] = useState(false);
    const initial = name?.[0]?.toUpperCase() ?? "?";
    const px = `${size}px`;

    if (photoUrl && !err) {
        return (
            <img
                src={photoUrl}
                alt={name}
                style={{ width: px, height: px }}
                className="rounded-full object-cover flex-shrink-0"
                onError={() => setErr(true)}
            />
        );
    }
    return (
        <div
            style={{ width: px, height: px }}
            className="rounded-full bg-[#e8d5c8] flex-shrink-0 flex items-center justify-center"
        >
            <span
                style={{ fontSize: size * 0.38 }}
                className="font-serif font-semibold text-[#b4532a]"
            >
                {initial}
            </span>
        </div>
    );
}

function MutualRow({ mutual }: { mutual: MutualConnection }) {
    const fullName = `${mutual.first_name} ${mutual.last_name}`.trim();
    return (
        <div className="flex items-center gap-3">
            <Avatar name={mutual.first_name} photoUrl={mutual.photo_url} size={40} />
            <div className="flex-1 min-w-0">
                <p className="font-sans font-semibold text-[15px] text-[#181412] truncate leading-snug">
                    {fullName}
                </p>
                {mutual.headline && (
                    <p className="font-sans text-[13px] text-[#715e55] truncate">
                        {mutual.headline}
                    </p>
                )}
            </div>
        </div>
    );
}

export default function ConnectionFoundPage() {
    const params = useParams();
    const userId = params?.userId as string;
    const router = useRouter();

    const { data: profile, isLoading, isError } = usePublicProfile(userId);
    const sendRequest = useSendRequest();
    const [requestSent, setRequestSent] = useState(false);
    const [showMutuals, setShowMutuals] = useState(false);

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-dvh bg-[#f5f0eb] items-center justify-center">
                <p className="text-[#715e55] font-sans text-[15px]">Finding profile…</p>
            </div>
        );
    }

    if (isError || !profile) {
        return (
            <div className="flex flex-col min-h-dvh bg-[#f5f0eb]">
                <div className="flex items-center px-5 pt-safe pt-4 pb-3">
                    <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center">
                        <ArrowLeft size={24} className="text-[#453933]" strokeWidth={1.5} />
                    </button>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4">
                    <p className="font-serif font-semibold text-[20px] text-[#181412] text-center">
                        Profile not found
                    </p>
                    <p className="font-sans text-[14px] text-[#715e55] text-center">
                        This QR code may be outdated or the account may no longer exist.
                    </p>
                    <button
                        onClick={() => router.push("/scan")}
                        className="mt-2 px-6 py-3 rounded-2xl bg-[#d8602e] text-white font-semibold font-sans text-[15px]"
                    >
                        Scan Again
                    </button>
                </div>
            </div>
        );
    }

    const firstName = profile.first_name;
    const fullName = `${firstName} ${profile.last_name}`.trim();
    const status = profile.connection_status;
    const mutuals = profile.mutual_connections ?? [];
    const traits = profile.common_traits ?? [];
    const hasMutuals = mutuals.length > 0;
    const hasNotables = traits.length > 0 || hasMutuals;

    const alreadyConnected = status === "connected";
    const requestPending = status === "pending" || requestSent;

    function handleSendRequest() {
        sendRequest.mutate(userId, {
            onSuccess: () => setRequestSent(true),
        });
    }

    return (
        <>
            <div className="flex flex-col min-h-dvh bg-[#f5f0eb]">
                {/* Header */}
                <div className="flex items-center px-5 pt-safe pt-4 pb-3">
                    <button
                        onClick={() => router.back()}
                        className="w-10 h-10 flex items-center justify-center"
                        aria-label="Go back"
                    >
                        <ArrowLeft size={24} className="text-[#453933]" strokeWidth={1.5} />
                    </button>
                    <h1 className="flex-1 text-center font-serif font-semibold text-[22px] leading-[30px] text-[#181412]">
                        Connection Found
                    </h1>
                    <div className="w-10" />
                </div>

                <div className="flex-1 overflow-y-auto pb-36">
                    {/* Profile header card */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mx-5 mt-2 bg-white rounded-3xl px-6 py-6 flex flex-col items-center gap-3 shadow-sm"
                    >
                        <Avatar name={firstName} photoUrl={profile.photo_url} size={72} />
                        <div className="flex flex-col items-center gap-1.5 text-center">
                            <h2 className="font-serif font-semibold text-[22px] text-[#181412] leading-tight">
                                {fullName}
                            </h2>
                            {profile.kode?.archetype && (
                                <div className="flex items-center gap-1 bg-[#d8602e] rounded-full px-2.5 h-6 w-fit">
                                    <User size={11} className="text-white" strokeWidth={2} />
                                    <span className="text-[11px] font-semibold font-sans text-white whitespace-nowrap">
                                        {profile.kode.archetype}
                                    </span>
                                </div>
                            )}
                            {profile.headline && (
                                <p className="text-[13px] font-sans text-[#715e55]">{profile.headline}</p>
                            )}
                            {profile.occupation && !profile.headline && (
                                <p className="text-[13px] font-sans text-[#715e55]">{profile.occupation}</p>
                            )}
                        </div>
                    </motion.div>

                    {/* Notable Connections */}
                    {hasNotables && (
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.08 }}
                            className="mx-5 mt-4 bg-white rounded-3xl px-6 py-5 shadow-sm"
                        >
                            <h3 className="font-serif font-semibold text-[17px] text-[#181412] mb-3">
                                Notable Connections
                            </h3>

                            {traits.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {traits.slice(0, 4).map((trait) => (
                                        <span
                                            key={trait}
                                            className="bg-[#f5f0eb] rounded-full px-3 py-1 text-[13px] font-sans text-[#453933]"
                                        >
                                            {trait}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {hasMutuals && (
                                <>
                                    <div className="flex flex-col gap-3">
                                        {mutuals.slice(0, 2).map((m) => (
                                            <MutualRow key={m.user_id} mutual={m} />
                                        ))}
                                    </div>

                                    {mutuals.length > 2 && (
                                        <button
                                            onClick={() => setShowMutuals(true)}
                                            className="mt-3 flex items-center gap-1 text-[13px] font-semibold text-[#d8602e]"
                                        >
                                            View all {mutuals.length} mutual connections
                                            <ChevronRight size={14} strokeWidth={2} />
                                        </button>
                                    )}
                                </>
                            )}
                        </motion.div>
                    )}
                </div>

                {/* Bottom CTAs */}
                <div className="fixed bottom-0 left-0 right-0 bg-[#f5f0eb]/95 backdrop-blur-sm px-5 pt-3 pb-safe pb-8 flex flex-col gap-2">
                    {alreadyConnected ? (
                        <div className="w-full py-4 rounded-2xl bg-[#e8d5c8] flex items-center justify-center">
                            <span className="font-semibold font-sans text-[16px] text-[#b4532a]">
                                Already Connected
                            </span>
                        </div>
                    ) : requestPending ? (
                        <div className="w-full py-4 rounded-2xl bg-[#e8d5c8] flex items-center justify-center">
                            <span className="font-semibold font-sans text-[16px] text-[#b4532a]">
                                Request Sent
                            </span>
                        </div>
                    ) : (
                        <button
                            onClick={handleSendRequest}
                            disabled={sendRequest.isPending}
                            className="w-full py-4 rounded-2xl bg-[#d8602e] text-white font-semibold font-sans text-[16px] active:scale-[0.98] transition-transform disabled:opacity-60"
                        >
                            {sendRequest.isPending ? "Sending…" : "Send Request"}
                        </button>
                    )}
                    <button
                        onClick={() => router.push(`/connections/${userId}`)}
                        className="text-[14px] font-sans font-medium text-[#d8602e] text-center py-1"
                    >
                        View Full Profile →
                    </button>
                </div>
            </div>

            {/* Mutual connections sheet */}
            <AnimatePresence>
                {showMutuals && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black z-50"
                            onClick={() => setShowMutuals(false)}
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[70dvh] overflow-y-auto pb-safe"
                        >
                            <div className="flex justify-center pt-3 pb-1">
                                <div className="w-10 h-1 rounded-full bg-[#e8e0da]" />
                            </div>
                            <div className="px-5 pt-2 pb-6">
                                <h3 className="font-serif font-semibold text-[19px] text-[#181412] mb-4">
                                    Mutual Connections
                                </h3>
                                <div className="flex flex-col gap-4">
                                    {mutuals.map((m) => (
                                        <MutualRow key={m.user_id} mutual={m} />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <RequestSentModal
                isOpen={requestSent}
                onClose={() => router.back()}
                name={firstName}
            />
        </>
    );
}
