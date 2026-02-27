"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function Header() {
    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md"
        >
            <div className="container mx-auto px-6 lg:px-20 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3 w-72">
                    <Image
                        src="/resources/main-logo.png"
                        alt="Kobae Logo"
                        width={144}
                        height={38}
                        priority
                    />
                </div>

                {/* Nav Links */}
                <nav className="hidden md:flex items-center gap-12">
                    <a
                        href="#about"
                        className="text-base font-semibold text-foreground hover:text-primary transition-colors"
                    >
                        About Us
                    </a>
                    <a
                        href="#how-it-works"
                        className="text-base font-semibold text-foreground hover:text-primary transition-colors"
                    >
                        How It Works
                    </a>
                    <a
                        href="#contact"
                        className="text-base font-semibold text-foreground hover:text-primary transition-colors"
                    >
                        Contact Us
                    </a>
                </nav>

                {/* Auth Buttons */}
                <div className="flex items-center gap-4 w-72 justify-end">
                    <Link
                        href="/login"
                        className="hidden sm:flex items-center justify-center h-8 px-5 rounded-3xl border border-[var(--primary-400)] text-xs font-semibold text-[var(--primary-400)] hover:bg-[var(--primary)]/5 transition-colors"
                    >
                        Log In
                    </Link>
                    <Link
                        href="/welcome"
                        className="flex items-center justify-center h-8 px-5 rounded-3xl bg-[var(--primary)] text-xs font-semibold text-white hover:bg-[var(--primary-400)] transition-colors"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </motion.header>
    );
}
