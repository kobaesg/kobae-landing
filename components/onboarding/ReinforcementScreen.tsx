"use client";

import { motion } from "framer-motion";

interface ReinforcementScreenProps {
    illustrationSrc?: string;
    title: string;
    subtitle: string;
    buttonText?: string;
    onProceed: () => void;
}

const EASE = [0.25, 0.1, 0.25, 1] as const;

export function ReinforcementScreen({
    illustrationSrc,
    title,
    subtitle,
    buttonText = "Proceed",
    onProceed,
}: ReinforcementScreenProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70dvh] text-center px-6">
            {illustrationSrc && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="mb-8"
                >
                    <img
                        src={illustrationSrc}
                        alt=""
                        className="w-56 h-56 object-contain mx-auto"
                    />
                </motion.div>
            )}

            <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15, ease: EASE }}
                className="text-2xl font-serif font-bold text-[var(--foreground)] mb-3 leading-snug"
            >
                {title}
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25, ease: EASE }}
                className="text-sm text-[var(--text-300)] font-sans mb-10 max-w-sm"
            >
                {subtitle}
            </motion.p>

            <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35, ease: EASE }}
                whileTap={{ scale: 0.97 }}
                onClick={onProceed}
                className="w-full max-w-xs py-4 rounded-3xl bg-[var(--primary)] text-white font-sans font-semibold text-base shadow-[0_0_10px_rgba(255,144,97,0.8)] hover:bg-[var(--primary-400)] transition-colors"
            >
                {buttonText}
            </motion.button>
        </div>
    );
}
