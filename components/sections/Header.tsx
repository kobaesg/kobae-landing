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
                <div className="flex items-center gap-3">
                    <Image
                        src="/resources/main-logo.png"
                        alt="Kobae Logo"
                        width={72}
                        height={19}
                        className="h-5 w-auto"
                    />
                </div>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-12">
                    <a
                        href="#about"
                        className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                    >
                        About Us
                    </a>
                    <a
                        href="#how-it-works"
                        className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                    >
                        How It Works
                    </a>
                    <a
                        href="#contact"
                        className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                    >
                        Contact Us
                    </a>
                </nav>

                {/* Auth Buttons */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-primary-400 text-primary-400 hover:bg-primary-400 hover:text-white text-xs font-semibold rounded-full h-8 px-4"
                    >
                        Log In
                    </Button>
                    <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-white text-xs font-semibold rounded-full h-8 px-4"
                    >
                        Sign Up
                    </Button>
                </div>
            </div>
        </motion.header>
    );
}
