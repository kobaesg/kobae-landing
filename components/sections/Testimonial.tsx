"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Xarrow from "react-xarrows";

export function Testimonial() {
    return (
        <section className="relative py-24 px-6 lg:px-48 bg-background min-h-[1021px] flex items-center">
            <div className="container mx-auto max-w-7xl">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    {/* Quote */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="relative text-right pr-12"
                    >
                        <blockquote className="text-3xl lg:text-[35px] font-normal leading-tight lg:leading-[44px]">
                            &ldquo;Kobae{" "}
                            <span className="font-semibold">
                                transformed my weekends.
                            </span>{" "}
                            Through Kobae, I finally{" "}
                            <span className="font-semibold">
                                really enjoyed the people I met!
                            </span>
                            &rdquo;
                        </blockquote>
                        <div className="mt-5 text-2xl font-normal leading-9 text-[#453933]">
                            <p>D, one of our first members.</p>
                        </div>
                    </motion.div>

                    {/* Polaroid Image */}
                    <motion.div
                        initial={{ opacity: 0, rotate: 0 }}
                        whileInView={{ opacity: 1, rotate: 16.48 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative flex justify-end items-center h-full pr-8"
                    >
                        <div
                            id="testimonial-image"
                            className="relative w-full aspect-[416/661] max-w-[600px]"
                        >
                            {/* Polaroid frame */}
                            <div className="absolute inset-0 bg-white rounded-lg shadow-2xl p-6 pb-24">
                                <div className="relative w-full h-full">
                                    <Image
                                        src="/resources/middle-5.jpg"
                                        alt="Night Out of fellow Kobae People"
                                        fill
                                        className="object-cover object-center -rotate-16"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Arrow from step 3 to testimonial - only visible on desktop */}
                <div className="hidden lg:block">
                    <Xarrow
                        start="step3-image"
                        end="testimonial-image"
                        color="#D71212"
                        strokeWidth={3}
                        curveness={0.6}
                        startAnchor="bottom"
                        endAnchor={{
                            position: "top",
                            offset: { x: -100, y: 0 },
                        }}
                        path="smooth"
                        showHead={false}
                    />
                </div>
            </div>
        </section>
    );
}
