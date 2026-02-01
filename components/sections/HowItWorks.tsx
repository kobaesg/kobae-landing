"use client";

import { motion } from "framer-motion";
import { User, MessageCircle, Calendar } from "lucide-react";

const steps = [
    {
        number: 1,
        title: "Check out your daily profile",
        description:
            "Every day, discover a new profile that matches your interests and values. Take your time to learn about potential connections.",
        icon: User,
    },
    {
        number: 2,
        title: "Chat about your interests",
        description:
            "Start a conversation about the things you both love. Our smart matching ensures you always have something to talk about.",
        icon: MessageCircle,
    },
    {
        number: 3,
        title: "Make it real",
        description:
            "Take your connection offline. Plan activities, meetups, and adventures together. Turn digital matches into real friendships.",
        icon: Calendar,
    },
];

export function HowItWorks() {
    return (
        <section className="py-24 px-6 overflow-hidden">
            <div className="container mx-auto max-w-6xl">
                {/* Section Title */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-24"
                >
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        3 Steps to Meaningful Connections
                    </h2>
                </motion.div>

                {/* Flowing Steps Layout */}
                <div className="relative max-w-3xl mx-auto">
                    {/* Curved Connection Lines - SVG with pencil texture */}
                    <svg
                        className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
                        style={{ zIndex: 0 }}
                    >
                        {/* SVG Filter for pencil/sketch effect */}
                        <defs>
                            <filter id="pencilTexture">
                                <feTurbulence
                                    type="fractalNoise"
                                    baseFrequency="0.5"
                                    numOctaves="4"
                                    result="noise"
                                />
                                <feDisplacementMap
                                    in="SourceGraphic"
                                    in2="noise"
                                    scale="1.5"
                                    xChannelSelector="R"
                                    yChannelSelector="G"
                                />
                            </filter>
                        </defs>

                        {/* Line from top (before Step 1) */}
                        <motion.path
                            d="M 100 -50 Q 150 30, 180 100"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            fill="none"
                            className="text-border"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter="url(#pencilTexture)"
                            initial={{ pathLength: 0, opacity: 0 }}
                            whileInView={{ pathLength: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 }}
                        />

                        {/* Step 1 to Step 2 */}
                        <motion.path
                            d="M 200 180 Q 350 250, 450 350"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            fill="none"
                            className="text-border"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter="url(#pencilTexture)"
                            initial={{ pathLength: 0, opacity: 0 }}
                            whileInView={{ pathLength: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.5 }}
                        />
                        {/* Step 2 to Step 3 - adjusted to avoid cutting through #3 */}
                        <motion.path
                            d="M 450 500 Q 300 580, 200 680"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            fill="none"
                            className="text-border"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter="url(#pencilTexture)"
                            initial={{ pathLength: 0, opacity: 0 }}
                            whileInView={{ pathLength: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 1 }}
                        />

                        {/* Line after Step 3 (continuing down to testimonial) */}
                        <motion.path
                            d="M 220 830 Q 350 920, 500 1050"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            fill="none"
                            className="text-border"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            filter="url(#pencilTexture)"
                            initial={{ pathLength: 0, opacity: 0 }}
                            whileInView={{ pathLength: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 1.3 }}
                        />
                    </svg>

                    <div className="relative z-10 space-y-32">
                        {/* Step 1 - Left aligned */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6 }}
                            className="flex flex-col md:flex-row items-center gap-8 md:justify-start"
                        >
                            <div className="w-48 h-48 bg-muted rounded-3xl flex items-center justify-center border border-border flex-shrink-0">
                                <User className="w-16 h-16 text-muted-foreground" />
                            </div>
                            <div className="flex-1 text-center md:text-left max-w-xs">
                                <div className="w-10 h-6 bg-primary rounded-md flex items-center justify-center mb-4 mx-auto md:mx-0">
                                    <span className="text-primary-foreground text-sm font-medium">
                                        #1
                                    </span>
                                </div>
                                <h3 className="text-xl font-semibold mb-3">
                                    Check out your daily profile
                                </h3>
                                <div className="space-y-2">
                                    <div className="h-2 bg-muted rounded w-full"></div>
                                    <div className="h-2 bg-muted rounded w-5/6"></div>
                                    <div className="h-2 bg-muted rounded w-4/6"></div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Step 2 - Right aligned */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex flex-col md:flex-row-reverse items-center gap-8 md:justify-start"
                        >
                            <div className="w-48 h-48 bg-muted rounded-3xl flex items-center justify-center border border-border flex-shrink-0">
                                <MessageCircle className="w-16 h-16 text-muted-foreground" />
                            </div>
                            <div className="flex-1 text-center md:text-right max-w-xs md:ml-auto">
                                <div className="w-10 h-6 bg-primary rounded-md flex items-center justify-center mb-4 mx-auto md:ml-auto md:mr-0">
                                    <span className="text-primary-foreground text-sm font-medium">
                                        #2
                                    </span>
                                </div>
                                <h3 className="text-xl font-semibold mb-3">
                                    Chat about your interests
                                </h3>
                                <div className="space-y-2">
                                    <div className="h-2 bg-muted rounded w-full"></div>
                                    <div className="h-2 bg-muted rounded w-5/6 md:ml-auto"></div>
                                    <div className="h-2 bg-muted rounded w-4/6 md:ml-auto"></div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Step 3 - Left aligned */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex flex-col md:flex-row items-center gap-8 md:justify-start"
                        >
                            <div className="w-48 h-48 bg-muted rounded-3xl flex items-center justify-center border border-border flex-shrink-0">
                                <Calendar className="w-16 h-16 text-muted-foreground" />
                            </div>
                            <div className="flex-1 text-center md:text-left max-w-xs">
                                <div className="w-10 h-6 bg-primary rounded-md flex items-center justify-center mb-4 mx-auto md:mx-0">
                                    <span className="text-primary-foreground text-sm font-medium">
                                        #3
                                    </span>
                                </div>
                                <h3 className="text-xl font-semibold mb-3">
                                    Make it real
                                </h3>
                                <div className="space-y-2">
                                    <div className="h-2 bg-muted rounded w-full"></div>
                                    <div className="h-2 bg-muted rounded w-5/6"></div>
                                    <div className="h-2 bg-muted rounded w-4/6"></div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
