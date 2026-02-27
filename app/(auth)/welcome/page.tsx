"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const EASE = [0.25, 0.1, 0.25, 1] as const;

export default function WelcomePage() {
    return (
        <div className="min-h-dvh bg-[var(--background-alt)] flex flex-col">
            {/* Hero Illustration */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: EASE }}
                className="flex-1 flex items-end justify-center overflow-hidden"
            >
                <img
                    src="/resources/welcome-screen.png"
                    alt="Two people enjoying a date"
                    className="w-[80%] max-w-[320px] object-contain"
                />
            </motion.div>

            {/* Body */}
            <div className="flex flex-col gap-6 items-center px-6 pt-6 pb-10">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.15, ease: EASE }}
                    className="flex flex-col items-center gap-5 w-full"
                >
                    <img
                        src="/resources/main-logo.png"
                        alt="Kobae"
                        className="h-8 object-contain"
                    />

                    <p className="text-base text-[var(--text-400)] font-sans text-center leading-6">
                        Meet people you&apos;ll genuinely enjoy spending time
                        with, based on shared values, interests, and how you
                        connect.
                    </p>
                </motion.div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.28, ease: EASE }}
                    className="flex flex-col gap-4 items-start w-full"
                >
                    <motion.div whileTap={{ scale: 0.97 }} className="w-full">
                        <Link
                            href="/signup"
                            className="block w-full py-3 rounded-3xl bg-[var(--primary)] text-white font-sans font-semibold text-base text-center shadow-[0_0_10px_rgba(255,144,97,0.8)] hover:bg-[var(--primary-400)] transition-all"
                        >
                            Continue
                        </Link>
                    </motion.div>

                    <p className="text-sm text-[var(--text-300)] text-center font-sans w-full leading-[21px]">
                        By clicking on &ldquo;Continue&rdquo;, you agree to
                        our{" "}
                        <Link href="/terms" className="underline">
                            Terms &amp; Conditions
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="underline">
                            Privacy Policy.
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
