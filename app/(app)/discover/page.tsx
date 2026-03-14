"use client";

import { useState, useCallback } from "react";
import { useDiscovery, useSkipProfile } from "@/lib/api/hooks/use-discovery";
import { useSendRequest } from "@/lib/api/hooks/use-connections";
import { useMutualConnections } from "@/lib/api/hooks/use-public-profile";
import { DiscoveryHeader } from "@/components/app/discovery/DiscoveryHeader";
import { CountdownView } from "@/components/app/discovery/CountdownView";
import { RecommendationCard } from "@/components/app/discovery/RecommendationCard";
import { MutualConnectionsSheet } from "@/components/app/discovery/MutualConnectionsSheet";
import { RequestSentModal } from "@/components/app/discovery/RequestSentModal";
import { DeclinedToast } from "@/components/app/discovery/DeclinedToast";

export default function DiscoverPage() {
    const { data, isLoading, error } = useDiscovery();
    const skipMutation = useSkipProfile();
    const sendRequestMutation = useSendRequest();

    const [showRequestSent, setShowRequestSent] = useState(false);
    const [showDeclinedToast, setShowDeclinedToast] = useState(false);
    const [showMutualsSheet, setShowMutualsSheet] = useState(false);

    const recommendation = data?.status === "ready" ? data.recommendation : null;
    const countdown = data?.status === "countdown" ? data.countdown : null;

    const { data: mutualConnections } = useMutualConnections(
        recommendation?.profile.user_id
    );

    const handleSendRequest = useCallback(() => {
        if (!recommendation) return;
        sendRequestMutation.mutate(recommendation.profile.user_id, {
            onSuccess: () => setShowRequestSent(true),
        });
    }, [recommendation, sendRequestMutation]);

    const handleDismiss = useCallback(() => {
        if (!recommendation) return;
        skipMutation.mutate(recommendation.profile.user_id, {
            onSuccess: () => {
                setShowDeclinedToast(true);
                setTimeout(() => setShowDeclinedToast(false), 2500);
            },
        });
    }, [recommendation, skipMutation]);

    const handleRequestSentClose = useCallback(() => {
        setShowRequestSent(false);
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-dvh">
                <DiscoveryHeader />
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-[#d8602e] border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col min-h-dvh">
                <DiscoveryHeader />
                <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8 pb-20 text-center">
                    <p className="text-[16px] font-sans text-[#715e55]">
                        No recommendations available right now. Check back later!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-dvh relative">
            <DiscoveryHeader />

            {countdown && (
                <CountdownView
                    nextRefreshAt={countdown.next_refresh_at}
                />
            )}

            {recommendation && (
                <div className="flex-1 pb-20">
                    <RecommendationCard
                        recommendation={recommendation}
                        onSendRequest={handleSendRequest}
                        onDismiss={handleDismiss}
                        onViewMutuals={() => setShowMutualsSheet(true)}
                        isSending={sendRequestMutation.isPending}
                    />
                </div>
            )}

            <MutualConnectionsSheet
                isOpen={showMutualsSheet}
                onClose={() => setShowMutualsSheet(false)}
                connections={mutualConnections ?? []}
            />

            <RequestSentModal
                isOpen={showRequestSent}
                onClose={handleRequestSentClose}
                name={recommendation?.profile.first_name}
            />

            <DeclinedToast isVisible={showDeclinedToast} />
        </div>
    );
}
