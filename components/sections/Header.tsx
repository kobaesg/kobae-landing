"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Header() {
    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border"
        >
            <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-sm">
                            K
                        </span>
                    </div>
                    <span className="font-semibold text-lg">Kobae</span>
                </div>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <a
                        href="#our-story"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Our Story
                    </a>
                </nav>

                {/* Auth Buttons */}
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm">
                        Log in
                    </Button>
                    <Button size="sm">Sign Up</Button>
                </div>
            </div>
        </motion.header>
    );
}
