"use client";

import { motion } from "framer-motion";

export function About() {
    return (
        <section id="about" className="py-32 px-6 lg:px-64 bg-background">
            <div className="container mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-[56px] font-normal leading-tight lg:leading-[64px] tracking-tight">
                        Connection shouldn't feel transactional.
                    </h2>
                    <p className="mt-5 text-2xl font-normal leading-9 text-[#453933] max-w-xl mx-auto">
                        We believe meaningful connections happen naturally, when
                        there's shared context and a reason to show up.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
