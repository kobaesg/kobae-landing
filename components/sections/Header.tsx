"use client";
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
                <div className="flex items-center gap-3">
                    <Image
                        src="/resources/main-logo.png"
                        alt="Kobae Logo"
                        width={144}
                        height={38}
                        priority
                    />
                </div>
                <nav className="hidden md:flex items-center gap-12 absolute left-1/2 -translate-x-1/2">
                    <a href="#" className="text-base font-semibold text-foreground hover:text-primary transition-colors">
                        Home
                    </a>
                    <a href="#our-why" className="text-base font-semibold text-foreground hover:text-primary transition-colors">
                        Our Why
                    </a>
                     <a href="#how-it-works" className="text-base font-semibold text-foreground hover:text-primary transition-colors">
                        How It Works
                    </a>
                </nav>
            </div>
        </motion.header>
    );
}
