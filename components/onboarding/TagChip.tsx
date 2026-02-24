"use client";

import { motion } from "framer-motion";

interface TagChipProps {
    label: string;
    selected: boolean;
    onClick: () => void;
    disabled?: boolean;
}

export function TagChip({
    label,
    selected,
    onClick,
    disabled = false,
}: TagChipProps) {
    return (
        <motion.button
            type="button"
            onClick={onClick}
            disabled={disabled}
            whileTap={disabled && !selected ? {} : { scale: 0.93, transition: { type: "spring", stiffness: 400, damping: 25 } }}
            animate={selected ? { scale: [1, 1.06, 1] } : { scale: 1 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className={`
                px-4 py-2 rounded-lg text-sm font-sans font-medium
                transition-all duration-200 whitespace-nowrap
                ${
                    selected
                        ? "bg-[var(--primary)] text-white shadow-sm"
                        : "bg-white text-[var(--text-400)] border border-[var(--secondary-100)] hover:border-[var(--primary)]"
                }
                ${disabled && !selected ? "opacity-50 cursor-not-allowed" : ""}
            `}
        >
            {label}
        </motion.button>
    );
}
