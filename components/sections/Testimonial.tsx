"use client";

import { motion } from "framer-motion";
import Image from "next/image";

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
                        className="relative text-right"
                    >
                        <blockquote className="text-3xl lg:text-[35px] font-normal leading-tight lg:leading-[44px]">
                            &ldquo;Kobae{" "}
                            <span className="font-semibold">
                                transformed my weekends.
                            </span>{" "}
                            Through this app, I finally{" "}
                            <span className="font-semibold">
                                found my people!
                            </span>
                            &rdquo;
                        </blockquote>
                        <div className="mt-5 text-2xl font-normal leading-9 text-[#453933]">
                            <p>Si Min, member since 2026.</p>
                        </div>
                    </motion.div>

                    {/* Polaroid Image */}
                    <motion.div
                        initial={{ opacity: 0, rotate: 0 }}
                        whileInView={{ opacity: 1, rotate: 16.48 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative flex justify-center items-center"
                    >
                        <div className="relative w-[416px] h-[661px]">
                            {/* Polaroid frame */}
                            <div className="absolute inset-0 bg-white rounded-lg shadow-2xl p-6 pb-24">
                                <div className="relative w-full h-full rounded overflow-hidden">
                                    <Image
                                        src="/resources/middle-4.png"
                                        alt="Si Min & Her Friends"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                            {/* Handwritten text */}
                            <div
                                className="absolute -bottom-8 right-0 transform rotate-[15deg]"
                                style={{
                                    fontFamily: "'Homemade Apple', cursive",
                                }}
                            >
                                <p className="text-2xl leading-9 text-[#453933] whitespace-nowrap">
                                    Si Min & Her Friends
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
