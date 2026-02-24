"use client";

import React from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
        <motion.div
            layout
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`
                rounded-xl bg-white shadow-[0_0_2px_rgba(0,0,0,0.25)]
                overflow-hidden
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
                <motion.span
                    className="flex-shrink-0 ml-3"
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {isExpanded ? (
                        <Minus className="w-5 h-5 text-[var(--primary)]" />
                    ) : (
                        <Plus className="w-5 h-5 text-[var(--text-200)]" />
                    )}
                </motion.span>
            </button>

            <AnimatePresence initial={false}>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden"
                    >
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
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
