"use client";

import { ChevronDown } from "lucide-react";

interface ScrollToBottomFABProps {
    onClick: () => void;
    visible: boolean;
    unreadCount?: number;
}

export function ScrollToBottomFAB({ onClick, visible, unreadCount = 0 }: ScrollToBottomFABProps) {
    if (!visible) return null;

    return (
        <button
            onClick={onClick}
            className="absolute bottom-24 right-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center active:scale-95 transition-transform z-10"
            aria-label="Scroll to bottom"
        >
            <ChevronDown size={24} className="text-[#453933]" strokeWidth={2} />
            {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-[#d8602e] flex items-center justify-center">
                    <span className="text-[11px] font-sans font-semibold text-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                </div>
            )}
        </button>
    );
}