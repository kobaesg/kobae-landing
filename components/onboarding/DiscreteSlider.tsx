"use client";

import { motion } from "framer-motion";

interface DiscreteSliderProps {
    label: string;
    leftLabel: string;
    rightLabel: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
}

export function DiscreteSlider({
    label,
    leftLabel,
    rightLabel,
    value,
    onChange,
    min = 1,
    max = 7,
}: DiscreteSliderProps) {
    const positions = Array.from({ length: max - min + 1 }, (_, i) => i + min);

    return (
        <div className="space-y-3">
            <p className="text-sm font-medium text-[var(--text-400)] font-sans">
                {label}
            </p>

            <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--text-300)] font-sans w-20 text-right">
                    {leftLabel}
                </span>

                <div className="flex-1 flex items-center justify-between px-2">
                    {positions.map((pos) => (
                        <motion.button
                            key={pos}
                            type="button"
                            onClick={() => onChange(pos)}
                            whileTap={{ scale: 0.85 }}
                            animate={
                                value === pos
                                    ? { scale: 1.1 }
                                    : { scale: 1 }
                            }
                            transition={{ type: "spring", stiffness: 500, damping: 25 }}
                            className={`
                                w-8 h-8 rounded-full flex items-center justify-center
                                transition-colors duration-200
                                ${
                                    value === pos
                                        ? "bg-[var(--primary)] text-white shadow-md"
                                        : "bg-white border border-[var(--secondary-100)] text-[var(--text-300)] hover:border-[var(--primary)]"
                                }
                            `}
                        >
                            <span className="text-xs font-sans">{pos}</span>
                        </motion.button>
                    ))}
                </div>

                <span className="text-xs text-[var(--text-300)] font-sans w-20">
                    {rightLabel}
                </span>
            </div>
        </div>
    );
}
