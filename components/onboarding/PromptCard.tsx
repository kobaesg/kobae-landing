"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface PromptCardProps {
    promptText: string;
    answer: string;
    onChange: (answer: string) => void;
    selected: boolean;
    onToggle: () => void;
    disabled?: boolean;
    maxLength?: number;
}

export function PromptCard({
    promptText,
    answer,
    onChange,
    selected,
    onToggle,
    disabled = false,
    maxLength = 500,
}: PromptCardProps) {
    const isExpanded = selected;

    return (
        <div
            className={`
                rounded-xl bg-white shadow-[0_0_2px_rgba(0,0,0,0.25)]
                transition-all duration-300 overflow-hidden
                ${isExpanded ? "border-l-4 border-l-[var(--primary)]" : ""}
            `}
        >
            <button
                type="button"
                onClick={onToggle}
                disabled={disabled && !selected}
                className="w-full flex items-center justify-between px-4 py-4 text-left disabled:opacity-50"
            >
                <span className="text-sm font-medium text-[var(--text-400)] font-sans">
                    {promptText}
                </span>
                <span className="flex-shrink-0 ml-3">
                    {isExpanded ? (
                        <Minus className="w-5 h-5 text-[var(--primary)]" />
                    ) : (
                        <Plus className="w-5 h-5 text-[var(--text-200)]" />
                    )}
                </span>
            </button>

            {isExpanded && (
                <div className="px-4 pb-4">
                    <textarea
                        value={answer}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Type your answer..."
                        maxLength={maxLength}
                        rows={3}
                        className="w-full px-3 py-2.5 rounded-lg bg-[var(--background)] text-sm font-sans text-[var(--foreground)] placeholder:text-[var(--text-100)] outline-none resize-none focus:ring-2 focus:ring-[var(--primary)]/30 transition-all"
                    />
                    <p className="text-xs text-[var(--text-200)] text-right mt-1 font-sans">
                        {answer.length}/{maxLength}
                    </p>
                </div>
            )}
        </div>
    );
}
