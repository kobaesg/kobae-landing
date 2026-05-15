"use client";

import { motion } from "framer-motion";

export function OurSolution() {
    return (
        <section id="our-solution" className="py-32 px-6 lg:px-64 bg-background">
            <div className="container mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-[56px] font-normal leading-tight lg:leading-[64px] tracking-tight">
                        Our solution:
                        New friends through existing ones
                    </h2>
                    <p className="mt-5 text-2xl font-normal leading-9 text-[#453933] max-w-xl mx-auto">
                        Mutuals and Introductions invoke trust to get conversations going. 
                        Ultimately, we don’t want just another connection
                        but rather a friend that you feel you should have made long ago. 
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
