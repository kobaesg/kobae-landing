"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";

export function Header() {
    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md"
        >
            <div className="container mx-auto px-6 lg:px-20 h-24 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3 flex-1">
                    <Image
                        src="/resources/main-logo.png"
                        alt="Kobae Logo"
                        width={144}
                        height={38}
                        className="h-8 w-auto"
                    />
                </div>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-12 absolute left-1/2 -translate-x-1/2">
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
                <div className="flex items-center gap-4 flex-1 justify-end">
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-white text-base font-semibold rounded-full h-10 px-6"
                    >
                        Log In
                    </Button>
                    <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-white text-base font-semibold rounded-full h-10 px-6"
                    >
                        Sign Up
                    </Button>
                </div>
            </div>
        </motion.header>
    );
}
