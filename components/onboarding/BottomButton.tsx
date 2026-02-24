"use client";

import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface BottomButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    variant?: "primary" | "outline";
    type?: "button" | "submit";
    className?: string;
}

export function BottomButton({
    children,
    onClick,
    disabled = false,
    loading = false,
    variant = "primary",
    type = "button",
    className = "",
}: BottomButtonProps) {
    const isDisabled = disabled || loading;

    const baseStyles =
        "w-full py-4 rounded-3xl font-sans font-semibold text-base transition-all duration-200 flex items-center justify-center gap-2";

    const variantStyles = {
        primary: isDisabled
            ? "bg-[var(--primary)] text-white opacity-50 cursor-not-allowed"
            : "bg-[var(--primary)] text-white hover:bg-[var(--primary-400)] shadow-[0_0_10px_rgba(255,144,97,0.8)]",
        outline: isDisabled
            ? "border-2 border-[var(--primary)] text-[var(--primary)] opacity-50 cursor-not-allowed bg-transparent"
            : "border-2 border-[var(--primary-400)] text-[var(--primary-400)] bg-transparent hover:bg-[var(--primary)]/5",
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-[var(--background)] via-[var(--background)] to-transparent">
            <div className="mx-auto max-w-lg">
                <motion.button
                    type={type}
                    onClick={onClick}
                    disabled={isDisabled}
                    whileTap={isDisabled ? {} : { scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className={`${baseStyles} ${variantStyles[variant]} ${className}`}
                >
                    {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                    {children}
                </motion.button>
            </div>
        </div>
    );
}
