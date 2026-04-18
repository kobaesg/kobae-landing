"use client";

import { useState } from "react";
import { Clock, AlertCircle, RefreshCw, X } from "lucide-react";
import type { Message, ConversationParticipant } from "@/lib/api/types";

export interface ChatBubbleProps {
    message: Message;
    isFromMe: boolean;
    sender?: ConversationParticipant;
    showAvatar?: boolean;
    onRetry?: () => void;
    onRemove?: () => void;
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

function StatusIndicator({ status, onRetry, onRemove }: { 
    status?: 'sending' | 'sent' | 'failed'; 
    onRetry?: () => void;
    onRemove?: () => void;
}) {
    if (!status || status === 'sent') {
        return null;
    }

    if (status === 'sending') {
        return (
            <div className="flex items-center gap-1 text-[#8e8e8e]">
                <Clock size={12} className="animate-pulse" />
                <span className="text-[11px] font-sans">Sending...</span>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-red-500">
                    <AlertCircle size={12} />
                    <span className="text-[11px] font-sans">Failed to send</span>
                </div>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="flex items-center gap-1 text-[#d8602e] hover:text-[#b4532a] transition-colors"
                    >
                        <RefreshCw size={12} />
                        <span className="text-[11px] font-sans font-medium">Retry</span>
                    </button>
                )}
                {onRemove && (
                    <button
                        onClick={onRemove}
                        className="flex items-center gap-1 text-[#8e8e8e] hover:text-red-500 transition-colors"
                    >
                        <X size={12} />
                        <span className="text-[11px] font-sans">Remove</span>
                    </button>
                )}
            </div>
        );
    }

    return null;
}

export function ChatBubble({ message, isFromMe, sender, showAvatar = true, onRetry, onRemove }: ChatBubbleProps) {
    const status = message.status;
    const isFailed = status === 'failed';
    const isSending = status === 'sending';

    if (isFromMe) {
        // Sent message (right side, orange bubble)
        return (
            <div className="flex flex-col items-end gap-1">
                <div 
                    className={`max-w-[75%] px-4 py-3 rounded-[24px] rounded-br-none shadow-sm transition-opacity ${
                        isFailed 
                            ? 'bg-red-100 border border-red-300' 
                            : isSending 
                                ? 'bg-[#d8602e] opacity-70' 
                                : 'bg-[#d8602e]'
                    }`}
                >
                    <p className={`font-sans text-[16px] leading-[24px] whitespace-pre-wrap break-words ${
                        isFailed ? 'text-red-800' : 'text-white'
                    }`}>
                        {message.content}
                    </p>
                </div>
                <div className="flex items-center gap-2 px-1">
                    {status && status !== 'sent' ? (
                        <StatusIndicator status={status} onRetry={onRetry} onRemove={onRemove} />
                    ) : (
                        <span className="text-[12px] font-sans text-[#8e8e8e]">
                            {formatTime(message.sent_at)}
                        </span>
                    )}
                </div>
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
            <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
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