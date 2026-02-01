"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

export function Testimonial() {
    return (
        <section className="py-24 px-6 bg-muted/30">
            <div className="container mx-auto max-w-6xl">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Quote */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <Quote className="w-12 h-12 text-primary/20 absolute -top-14 -left-4" />
                        <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed">
                            &ldquo;Kobae has changed my weekends. I have made
                            life-long friends through this app.&rdquo;
                        </blockquote>
                        <div className="mt-6">
                            <p className="font-semibold">Si Min + Ryan</p>
                            <p className="text-sm text-muted-foreground">
                                Kobae Members
                            </p>
                        </div>
                    </motion.div>

                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="aspect-[4/3] bg-muted rounded-3xl flex items-center justify-center border border-border rotate-3 hover:rotate-0 transition-transform duration-300">
                            <span className="text-muted-foreground">
                                Image of Friends
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
