"use client";

import { motion } from "framer-motion";

export function About() {
    return (
        <section id="our-story" className="py-24 px-6 bg-muted/30">
            <div className="container mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Statement about Kobae and why it&apos;s revolutionary
                    </h2>
                    <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
                        We believe that meaningful connections shouldn&apos;t be
                        left to chance. Kobae brings together like-minded
                        individuals who share your passions, interests, and
                        goals.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
