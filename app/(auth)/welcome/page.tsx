"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function WelcomePage() {
    return (
        <div className="min-h-dvh bg-[var(--background)] flex flex-col items-center justify-between px-6 py-10">
            {/* Hero Illustration */}
            <div className="flex-1 flex flex-col items-center justify-center max-w-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="mb-8"
                >
                    <img
                        src="/resources/thumbnail.png"
                        alt="Kobae"
                        className="w-28 h-28 mx-auto mb-6"
                    />
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15, ease: EASE }}
                    className="text-3xl font-serif font-bold text-[var(--foreground)] text-center mb-3 leading-tight"
                >
                    Meet people you&apos;ll genuinely enjoy spending time with
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25, ease: EASE }}
                    className="text-sm text-[var(--text-300)] font-sans text-center max-w-xs"
                >
                    Build real connections through shared interests and mutual
                    friends.
                </motion.p>
            </div>

            {/* CTAs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35, ease: EASE }}
                className="w-full max-w-sm space-y-3"
            >
                <motion.div whileTap={{ scale: 0.97 }}>
                    <Link
                        href="/signup"
                        className="block w-full py-4 rounded-3xl bg-[var(--primary)] text-white font-sans font-semibold text-base text-center shadow-[0_0_10px_rgba(255,144,97,0.8)] hover:bg-[var(--primary-400)] transition-all"
                    >
                        Sign Up
                    </Link>
                </motion.div>

                <motion.div whileTap={{ scale: 0.97 }}>
                    <Link
                        href="/login"
                        className="block w-full py-4 rounded-3xl border-2 border-[var(--primary-400)] text-[var(--primary-400)] font-sans font-semibold text-base text-center bg-transparent hover:bg-[var(--primary)]/5 transition-all"
                    >
                        Log In
                    </Link>
                </motion.div>

                <p className="text-xs text-[var(--text-200)] text-center font-sans mt-4">
                    By continuing, you agree to our{" "}
                    <Link
                        href="/terms"
                        className="text-[var(--primary)] underline"
                    >
                        Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                        href="/privacy"
                        className="text-[var(--primary)] underline"
                    >
                        Privacy Policy
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}
