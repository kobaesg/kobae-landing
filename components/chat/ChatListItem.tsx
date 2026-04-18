"use client";

import { useState } from "react";
import type { ConversationWithDetails } from "@/lib/api/types";

interface ChatListItemProps {
    conversation: ConversationWithDetails;
    currentUserId: string;
    onClick: () => void;
}

function formatTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }).toLowerCase();
    } else if (diffDays === 1) {
        return "Yesterday";
    } else if (diffDays < 7) {
        return date.toLocaleDateString("en-US", { weekday: "long" });
    } else {
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    }
}

function Avatar({ name, photoUrl }: { name: string; photoUrl?: string }) {
    const [imgError, setImgError] = useState(false);

    if (photoUrl && !imgError) {
        return (
            <div className="relative">
                <img
                    src={photoUrl}
                    alt={name}
                    className="w-[52px] h-[52px] rounded-full object-cover flex-shrink-0"
                    onError={() => setImgError(true)}
                />
            </div>
        );
    }

    const initial = name?.[0]?.toUpperCase() ?? "?";
    return (
        <div className="w-[52px] h-[52px] rounded-full bg-[#e8d5c8] flex-shrink-0 flex items-center justify-center">
            <span className="text-[20px] font-serif font-semibold text-[#b4532a]">{initial}</span>
        </div>
    );
}

export function ChatListItem({ conversation, currentUserId, onClick }: ChatListItemProps) {
    const { participant, last_message, unread_count } = conversation;
    const fullName = `${participant.first_name} ${participant.last_name}`.trim();
    const hasUnread = unread_count > 0;

    // Determine message preview text
    let previewText = "";
    if (last_message) {
        const isFromMe = last_message.sender_id === currentUserId;
        previewText = isFromMe ? `You: ${last_message.content}` : last_message.content;
    }

    return (
        <button
            onClick={onClick}
            className="flex items-center gap-3 w-full px-6 py-4 text-left bg-white hover:bg-[#faf8f6] active:bg-[#f5f0eb] transition-colors"
        >
            <Avatar name={participant.first_name} photoUrl={participant.photo_url} />

            <div className="flex-1 min-w-0">
                {/* Name and timestamp row */}
                <div className="flex items-center justify-between gap-2">
                    <p className={`font-sans text-[16px] leading-[24px] truncate ${hasUnread ? "font-semibold text-[#181412]" : "font-semibold text-[#181412]"}`}>
                        {fullName}
                    </p>
                    {last_message && (
                        <span className="text-[12px] font-sans text-[#715e55] flex-shrink-0">
                            {formatTime(last_message.sent_at)}
                        </span>
                    )}
                </div>

                {/* Message preview and unread indicator row */}
                <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p className={`text-[14px] font-sans leading-[20px] truncate ${hasUnread ? "font-semibold text-[#181412]" : "font-normal text-[#715e55]"}`}>
                        {previewText || "No messages yet"}
                    </p>
                    {hasUnread && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#d8602e] flex-shrink-0" />
                    )}
                </div>
            </div>
        </button>
    );
}