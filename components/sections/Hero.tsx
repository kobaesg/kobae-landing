"use client";
import { useState } from "react";
import { WaitlistModal } from "@/components/WaitlistModal";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";

export function Hero() {
     const [modalOpen, setModalOpen] = useState(false);
    return (
         <>
        <section className="relative min-h-[calc(100vh-6rem)] lg:min-h-[1046px] flex items-center justify-center px-6 pt-24 md:pt-32 pb-16 overflow-hidden bg-background">
            <div className="container mx-auto max-w-4xl relative z-10">
                <div className="flex flex-col items-center text-center">
                    {/* Tagline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-5xl md:text-6xl lg:text-[68px] font-normal leading-tight lg:leading-[71px] tracking-tight max-w-3xl"
                    >
                        Kobae is where your circles meet.
                    </motion.h1>

                    {/* Short Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mt-6 text-2xl font-normal leading-9 text-[#453933] max-w-2xl"
                    >
                        Find your people 
                        through interests & industries 
                        existing but hidden in your circles
                    </motion.p>

                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="mt-8"
                    >
                        <Button
                            size="lg"
                            onClick={() => setModalOpen(true)} 
                            className="bg-primary hover:bg-primary/90 text-white font-semibold text-lg rounded-[32px] h-16 px-8 shadow-[0px_0px_10px_0px_rgba(255,144,97,0.8)]"
                        >
                            Waitlist
                        </Button>
                    </motion.div>
                </div>
            </div>

            {/* Floating Hero Images - Positioned as in Figma */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Bottom Left - Large Rectangle */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="absolute bottom-[50px] left-[148px] w-[356px] h-[237px] hidden lg:block"
                >
                    <div className="relative w-full h-full rounded-2xl overflow-hidden">
                        <Image
                            src="/resources/top-3.png"
                            alt=""
                            fill
                            className="object-cover"
                        />
                    </div>
                </motion.div>

                {/* Top Right - Small Rectangle */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="absolute top-[185px] right-[113px] w-[262px] h-[175px] hidden lg:block"
                >
                    <div className="relative w-full h-full rounded-2xl overflow-hidden">
                        <Image
                            src="/resources/top-2.png"
                            alt=""
                            fill
                            className="object-cover"
                        />
                    </div>
                </motion.div>

                {/* Bottom Right - Rectangle rotated */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="absolute bottom-[130px] right-[119px] w-[301px] h-[201px] hidden lg:block"
                    style={{ transform: "rotate(180deg) scaleY(-1)" }}
                >
                    <div className="relative w-full h-full rounded-2xl overflow-hidden">
                        <Image
                            src="/resources/top-4.png"
                            alt=""
                            fill
                            className="object-cover"
                        />
                    </div>
                </motion.div>

                {/* Top Left - Vertical Rectangle */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                    className="absolute top-[172px] left-[154px] w-[166px] h-[201px] hidden lg:block"
                >
                    <div className="relative w-full h-full rounded-2xl overflow-hidden">
                        <Image
                            src="/resources/top-1.png"
                            alt=""
                            fill
                            className="object-cover"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
         <WaitlistModal open={modalOpen} onOpenChange={setModalOpen} />
              </>
    );
}

