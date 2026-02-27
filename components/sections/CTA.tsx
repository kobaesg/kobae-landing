"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export function CTA() {
    return (
        <section className="py-32 px-6 lg:px-64 bg-[#8c4121]">
            <div className="container mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center flex flex-col items-center gap-12"
                >
                    <h2 className="text-5xl md:text-6xl lg:text-[68px] font-normal leading-tight lg:leading-[71px] tracking-tight text-white">
                        Kobae, the place for shared circles.
                    </h2>
                    <Link
                        href="/welcome"
                        className="bg-white hover:bg-white/90 text-[var(--primary)] font-semibold text-lg rounded-[32px] h-16 px-8 shadow-[0px_0px_10px_0px_rgba(255,144,97,0.8)] flex items-center justify-center transition-colors"
                    >
                        Sign Up
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
