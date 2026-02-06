"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function CTA() {
    return (
        <section className="py-32 px-6 lg:px-64 bg-background">
            <div className="container mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center flex flex-col items-center gap-12"
                >
                    <h2 className="text-5xl md:text-6xl lg:text-[68px] font-normal leading-tight lg:leading-[71px] tracking-tight">
                        Kobae, the social app for shared circles.
                    </h2>
                    <Button
                        size="lg"
                        className="bg-primary hover:bg-primary/90 text-white font-semibold text-lg rounded-[32px] h-16 px-8 shadow-[0px_0px_10px_0px_rgba(255,144,97,0.8)]"
                    >
                        Sign Up Now
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
