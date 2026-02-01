"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-6 py-32 overflow-hidden">
            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="flex flex-col items-center text-center">
                    {/* Tagline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl"
                    >
                        Kobae is where your circles meet.
                    </motion.h1>

                    {/* Short Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-6 text-lg text-muted-foreground max-w-xl"
                    >
                        Short introduction to kobae. Short introduction to
                        kobae. Short introduction to kobae. Short introduction
                        to kobae.
                    </motion.p>

                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="mt-8"
                    >
                        <Button size="lg" className="px-8">
                            Get Started
                        </Button>
                    </motion.div>
                </div>
            </div>

            {/* Floating Hero Images - Scattered around the page */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Top Left - Small Square */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="absolute top-20 left-8 md:left-16 lg:left-32 w-28 h-28 md:w-32 md:h-32 lg:w-40 lg:h-40"
                >
                    <div className="w-full h-full bg-muted rounded-2xl flex items-center justify-center border border-border">
                        <span className="text-xs text-muted-foreground">
                            Hero Image
                        </span>
                    </div>
                </motion.div>

                {/* Top Right - Small Square */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="absolute top-20 right-8 md:right-16 lg:right-32 w-28 h-28 md:w-32 md:h-32 lg:w-40 lg:h-40"
                >
                    <div className="w-full h-full bg-muted rounded-2xl flex items-center justify-center border border-border">
                        <span className="text-xs text-muted-foreground">
                            Hero Image
                        </span>
                    </div>
                </motion.div>

                {/* Middle Left - Vertical Rectangle */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="absolute top-1/2 -translate-y-1/2 left-4 md:left-8 lg:left-16 w-24 h-40 md:w-32 md:h-52 lg:w-36 lg:h-56"
                >
                    <div className="w-full h-full bg-muted rounded-2xl flex items-center justify-center border border-border">
                        <span className="text-xs text-muted-foreground">
                            Hero Image
                        </span>
                    </div>
                </motion.div>

                {/* Bottom Right - Vertical Rectangle */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                    className="absolute bottom-32 md:bottom-24 right-4 md:right-8 lg:right-16 w-24 h-40 md:w-32 md:h-48 lg:w-36 lg:h-52"
                >
                    <div className="w-full h-full bg-muted rounded-2xl flex items-center justify-center border border-border">
                        <span className="text-xs text-muted-foreground">
                            Hero Image
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
