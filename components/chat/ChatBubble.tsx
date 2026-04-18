"use client";

import { useState } from "react";
import type { Message, ConversationParticipant } from "@/lib/api/types";

interface ChatBubbleProps {
    message: Message;
    isFromMe: boolean;
    sender?: ConversationParticipant;
    showAvatar?: boolean;
}

function formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).toLowerCase();
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
            <span className="text-[14px] font-serif font-semibold text-[#b4532a]">{initial}</span>
        </div>
    );
}

export function ChatBubble({ message, isFromMe, sender, showAvatar = true }: ChatBubbleProps) {
    if (isFromMe) {
        // Sent message (right side, orange bubble)
        return (
            <div className="flex flex-col items-end gap-1">
                <div className="max-w-[75%] px-4 py-3 bg-[#d8602e] rounded-[24px] rounded-br-none shadow-sm">
                    <p className="font-sans text-[16px] leading-[24px] text-white whitespace-pre-wrap break-words">
                        {message.content}
                    </p>
                </div>
                <span className="text-[12px] font-sans text-[#8e8e8e] px-1">
                    {formatTime(message.sent_at)}
                </span>
            </div>
        );
    }

    // Received message (left side, white bubble)
    return (
        <div className="flex items-end gap-3">
            {showAvatar && sender ? (
                <Avatar name={sender.first_name} photoUrl={sender.photo_url} />
            ) : (
                <div className="w-10 flex-shrink-0" /> // Spacer for alignment
            )}
            <div className="flex flex-col items-start gap-1">
                <div className="max-w-[75%] px-4 py-3 bg-white rounded-[24px] rounded-bl-none shadow-sm">
                    <p className="font-sans text-[16px] leading-[24px] text-[#181412] whitespace-pre-wrap break-words">
                        {message.content}
                    </p>
                </div>
                <span className="text-[12px] font-sans text-[#8e8e8e] px-1">
                    {formatTime(message.sent_at)}
                </span>
            </div>
        </div>
    );
}