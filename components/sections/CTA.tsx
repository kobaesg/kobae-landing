"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function CTA() {
    return (
        <section className="py-24 px-6 bg-primary text-primary-foreground">
            <div className="container mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Strong One-Liner
                    </h2>
                    <p className="mt-4 text-lg opacity-90 max-w-xl mx-auto">
                        Ready to find your community? Join thousands of others
                        who are already making meaningful connections.
                    </p>
                    <div className="mt-8">
                        <Button size="lg" variant="secondary" className="px-8">
                            Sign Up
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
