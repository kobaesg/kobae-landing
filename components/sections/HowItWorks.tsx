"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const steps = [
    {
        image: "/resources/middle-1.png",
        title: "Curated daily connections",
        description: "Receive a thoughtful match based on shared interests.",
    },
    {
        image: "/resources/middle-2.png",
        title: "Chat about your interests",
        description:
            "Skip the small talk and start conversations with real substance.",
    },
    {
        image: "/resources/middle-3.png",
        title: "Make it real",
        description: "Turn online connection into shared experiences.",
    },
];

export function HowItWorks() {
    return (
        <section
            id="how-it-works"
            className="relative overflow-hidden bg-[#f8f7f6] py-32 px-6 lg:px-64"
        >
            {/* Red String Background SVG */}
            <div className="pointer-events-none absolute left-0 top-0 h-full w-full opacity-80">
                <svg
                    viewBox="0 0 1530 2472"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute left-[-80px] top-[-199px] h-[2472px] w-[1530px]"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <path
                        d="M 100 300 Q 400 400, 700 500 T 1200 800 Q 900 1000, 600 1200 T 300 1500 Q 600 1700, 900 1900"
                        stroke="#e74c3c"
                        strokeWidth="3"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity="0.6"
                    />
                </svg>
            </div>

            <div className="container relative z-10 mx-auto max-w-6xl">
                {/* Section Title */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="mb-24 text-center"
                >
                    <h2 className="text-4xl font-normal italic leading-tight md:text-5xl lg:text-[56px] lg:leading-[64px]">
                        3 Steps to Meaningful Connections
                    </h2>
                </motion.div>

                {/* Steps */}
                <div className="mx-auto flex max-w-5xl flex-col gap-32">
                    {/* Step 1 */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col items-center gap-14 md:flex-row"
                    >
                        <div className="relative h-[316px] w-full flex-shrink-0 overflow-hidden rounded-2xl md:w-[316px]">
                            <Image
                                src={steps[0].image}
                                alt={steps[0].title}
                                fill
                                sizes="(max-width: 768px) 100vw, 316px"
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="mb-5 text-3xl font-semibold leading-tight lg:text-[35px] lg:leading-[44px]">
                                {steps[0].title}
                            </h3>
                            <p className="text-2xl font-normal leading-9 text-[#453933]">
                                {steps[0].description}
                            </p>
                        </div>
                    </motion.div>

                    {/* Step 2 */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col items-center gap-14 md:flex-row-reverse"
                    >
                        <div className="relative h-[316px] w-full flex-shrink-0 overflow-hidden rounded-2xl md:w-[316px]">
                            <Image
                                src={steps[1].image}
                                alt={steps[1].title}
                                fill
                                sizes="(max-width: 768px) 100vw, 316px"
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1 text-center md:text-right">
                            <h3 className="mb-5 text-3xl font-semibold leading-tight lg:text-[35px] lg:leading-[44px]">
                                {steps[1].title}
                            </h3>
                            <p className="text-2xl font-normal leading-9 text-[#453933]">
                                {steps[1].description}
                            </p>
                        </div>
                    </motion.div>

                    {/* Step 3 */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col items-center gap-14 md:flex-row"
                    >
                        <div className="relative h-[316px] w-full flex-shrink-0 overflow-hidden rounded-2xl md:w-[316px]">
                            <Image
                                src={steps[2].image}
                                alt={steps[2].title}
                                fill
                                sizes="(max-width: 768px) 100vw, 316px"
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="mb-5 text-3xl font-semibold leading-tight lg:text-[35px] lg:leading-[44px]">
                                {steps[2].title}
                            </h3>
                            <p className="text-2xl font-normal leading-9 text-[#453933]">
                                {steps[2].description}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
