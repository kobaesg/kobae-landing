"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Send, Mic } from "lucide-react";

interface ChatInputProps {
    onSend: (content: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export function ChatInput({ onSend, disabled = false, placeholder = "Type a message..." }: ChatInputProps) {
    const [message, setMessage] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
        }
    }, [message]);

    const handleSubmit = () => {
        const trimmed = message.trim();
        if (!trimmed || disabled) return;
        onSend(trimmed);
        setMessage("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const hasContent = message.trim().length > 0;

    return (
        <div className="flex items-end gap-2 px-2 py-2 bg-white shadow-[0_-1px_3px_rgba(0,0,0,0.1)]">
            {/* Plus button */}
            <button
                type="button"
                className="w-[65px] h-[65px] rounded-full bg-[#ededed] flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
                aria-label="Add attachment"
            >
                <Plus size={28} className="text-[#614e41]" strokeWidth={1.5} />
            </button>

            {/* Text input */}
            <div className="flex-1 flex items-center bg-[#ededed] rounded-[24px] px-4 py-3 min-h-[49px]">
                <textarea
                    ref={textareaRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    disabled={disabled}
                    rows={1}
                    className="flex-1 bg-transparent text-[16px] font-sans text-[#181412] placeholder:text-[#777777] outline-none resize-none leading-[24px] max-h-[120px]"
                />
            </div>

            {/* Send/Mic button */}
            <button
                type="button"
                onClick={hasContent ? handleSubmit : undefined}
                disabled={disabled}
                className={`w-[65px] h-[65px] rounded-full flex items-center justify-center flex-shrink-0 active:scale-95 transition-all ${
                    hasContent
                        ? "bg-[#d8602e] shadow-[0_0_10px_rgba(255,204,177,0.8)]"
                        : "bg-[#ededed]"
                }`}
                aria-label={hasContent ? "Send message" : "Record voice note"}
            >
                {hasContent ? (
                    <Send size={28} className="text-white" strokeWidth={1.5} />
                ) : (
                    <Mic size={28} className="text-[#614e41]" strokeWidth={1.5} />
                )}
            </button>
        </div>
    );
}