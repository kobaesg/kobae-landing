"use client";

import { motion } from "framer-motion";

interface MCQOptionProps {
    optionKey: string;
    text: string;
    selected: boolean;
    onClick: () => void;
}

export function MCQOption({
    optionKey,
    text,
    selected,
    onClick,
}: MCQOptionProps) {
    return (
        <motion.button
            type="button"
            onClick={onClick}
            whileTap={{ scale: 0.97, transition: { type: "spring", stiffness: 400, damping: 25 } }}
            animate={selected ? { scale: [1, 1.03, 1] } : { scale: 1 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={`
                w-full flex items-start gap-3 px-4 py-3.5 rounded-xl
                text-left font-sans text-sm transition-all duration-200
                ${
                    selected
                        ? "bg-[var(--primary)]/5 border-2 border-[var(--primary)] text-[var(--foreground)]"
                        : "bg-white border border-[var(--secondary-100)] text-[var(--text-400)] hover:border-[var(--primary)]/50"
                }
            `}
        >
            <motion.span
                animate={
                    selected
                        ? { backgroundColor: "var(--primary)", color: "#fff" }
                        : {}
                }
                transition={{ duration: 0.2 }}
                className={`
                    flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center
                    text-xs font-semibold mt-0.5
                    ${
                        selected
                            ? "bg-[var(--primary)] text-white"
                            : "bg-[var(--background)] text-[var(--text-300)]"
                    }
                `}
            >
                {optionKey}
            </motion.span>
            <span className="flex-1">{text}</span>
        </motion.button>
    );
}
