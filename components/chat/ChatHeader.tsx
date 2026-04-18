"use client";

import { useState } from "react";
import { ArrowLeft, MoreVertical } from "lucide-react";
import type { ConversationParticipant } from "@/lib/api/types";

interface ChatHeaderProps {
    participant: ConversationParticipant;
    onBack: () => void;
    onMoreClick?: () => void;
}

function Avatar({ name, photoUrl }: { name: string; photoUrl?: string }) {
    const [imgError, setImgError] = useState(false);

    if (photoUrl && !imgError) {
        return (
            <img
                src={photoUrl}
                alt={name}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                onError={() => setImgError(true)}
            />
        );
    }

    const initial = name?.[0]?.toUpperCase() ?? "?";
    return (
        <div className="w-10 h-10 rounded-full bg-[#e8d5c8] flex-shrink-0 flex items-center justify-center">
            <span className="text-[16px] font-serif font-semibold text-[#b4532a]">{initial}</span>
        </div>
    );
}

export function ChatHeader({ participant, onBack, onMoreClick }: ChatHeaderProps) {
    const fullName = `${participant.first_name} ${participant.last_name}`.trim();

    return (
        <div className="flex items-center gap-4 px-6 py-4 bg-white shadow-sm">
            {/* Back button */}
            <button
                onClick={onBack}
                className="w-7 h-7 flex items-center justify-center -ml-1"
                aria-label="Go back"
            >
                <ArrowLeft size={24} className="text-[#453933]" strokeWidth={1.5} />
            </button>

            {/* User info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="relative">
                    <Avatar name={participant.first_name} photoUrl={participant.photo_url} />
                    {/* Online indicator */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#34C759] border-2 border-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-sans font-semibold text-[16px] leading-[24px] text-[#181412] truncate">
                        {fullName}
                    </p>
                    <p className="font-sans text-[12px] leading-[18px] text-[#715e55]">
                        Active Now
                    </p>
                </div>
            </div>

            {/* More button */}
            {onMoreClick && (
                <button
                    onClick={onMoreClick}
                    className="w-7 h-7 flex items-center justify-center"
                    aria-label="More options"
                >
                    <MoreVertical size={24} className="text-[#453933]" strokeWidth={1.5} />
                </button>
            )}
        </div>
    );
}