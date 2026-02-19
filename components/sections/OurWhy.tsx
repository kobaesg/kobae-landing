"use client";

import { motion } from "framer-motion";

export function OurWhy () {
    return (
        <section id="our-why" className="py-32 px-6 lg:px-64 bg-background">
            <div className="container mx-auto max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-[56px] font-normal leading-tight lg:leading-[64px] tracking-tight">
                        Connection shouldn't be a chore.
                    </h2>
                    <p className="mt-5 text-2xl font-normal leading-9 text-[#453933] max-w-xl mx-auto">
                        Kobae's origin lies in our belief that connection 
                        should be neither performative nor transactional. 
                        </br>
                        </br>
                        The right people are hidden within our circles,
                        and through mutuals and data, find your people
                        that you should have uncovered, long ago. 
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
