"use client";

import Link from "next/link";

export default function WelcomePage() {
    return (
        <div className="min-h-dvh bg-[var(--background)] flex flex-col items-center justify-between px-6 py-10">
            {/* Hero Illustration */}
            <div className="flex-1 flex flex-col items-center justify-center max-w-sm">
                <div className="mb-8">
                    <img
                        src="/resources/thumbnail.png"
                        alt="Kobae"
                        className="w-28 h-28 mx-auto mb-6"
                    />
                </div>

                <h1 className="text-3xl font-serif font-bold text-[var(--foreground)] text-center mb-3 leading-tight">
                    Meet people you&apos;ll genuinely enjoy spending time with
                </h1>

                <p className="text-sm text-[var(--text-300)] font-sans text-center max-w-xs">
                    Build real connections through shared interests and mutual
                    friends.
                </p>
            </div>

            {/* CTAs */}
            <div className="w-full max-w-sm space-y-3">
                <Link
                    href="/signup"
                    className="block w-full py-4 rounded-3xl bg-[var(--primary)] text-white font-sans font-semibold text-base text-center shadow-[0_0_10px_rgba(255,144,97,0.8)] hover:bg-[var(--primary-400)] transition-all"
                >
                    Sign Up
                </Link>

                <Link
                    href="/login"
                    className="block w-full py-4 rounded-3xl border-2 border-[var(--primary-400)] text-[var(--primary-400)] font-sans font-semibold text-base text-center bg-transparent hover:bg-[var(--primary)]/5 transition-all"
                >
                    Log In
                </Link>

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
            </div>
        </div>
    );
}
