"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Xarrow from "react-xarrows";

const steps = [
    {
        image: "/resources/middle-1.jpg",
        title: "People you should meet",
        description: "Recommendations curated based on not just commonalities but your natural social disposition",
    },
    {
        image: "/resources/conversations-pic.jpg",
        title: "Conversations you would enjoy",
        description: "Skip the small talk and dive into conversation with ease through shared mutuals, interests or industry.",
    },
    {
        image: "/resources/genuine-connection.JPG",
        title: "Build up genuine connections",
        description: "Go offline and simply hang out with your new people",
    },
];

export function HowItWorks() {
    return (
        <section
            id="how-it-works"
            className="relative bg-[#f8f7f6] py-32 px-6 lg:px-64"
        >
            {/* Invisible anchor point at top-left of section */}
            <div id="section-top" className="absolute left-1 top-0" />

            <div className="container relative mx-auto max-w-6xl">
                {/* Section Title */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="mb-24 text-center"
                >
                    <h2 className="text-4xl font-normal italic leading-tight md:text-5xl lg:text-[56px] lg:leading-[64px]">
                        Meaningful Connections as easy as 1 2 3
                    </h2>
                </motion.div>

                {/* Steps */}
                <div className="relative mx-auto flex max-w-5xl flex-col gap-32">
                    {/* Step 1 */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.6 }}
                        className="relative z-10 flex flex-col items-center gap-14 md:flex-row"
                    >
                        <div
                            id="step1-image"
                            className="relative h-[316px] w-full flex-shrink-0 overflow-hidden rounded-2xl md:w-[316px]"
                        >
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
                        className="relative z-10 flex flex-col items-center gap-14 md:flex-row-reverse"
                    >
                        <div
                            id="step2-image"
                            className="relative h-[316px] w-full flex-shrink-0 overflow-hidden rounded-2xl md:w-[316px]"
                        >
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
                        className="relative z-10 flex flex-col items-center gap-14 md:flex-row"
                    >
                        <div
                            id="step3-image"
                            className="relative h-[316px] w-full flex-shrink-0 overflow-hidden rounded-2xl md:w-[316px]"
                        >
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

                    {/* Arrows connecting the images - only visible on desktop */}
                    <div className="hidden lg:block">
                        {/* Arrow from top-left of section to left middle of first image */}
                        <Xarrow
                            start="section-top"
                            end="step1-image"
                            color="#D71212"
                            strokeWidth={3}
                            curveness={0.8}
                            startAnchor="right"
                            endAnchor="left"
                            path="smooth"
                            showHead={false}
                        />
                        {/* Arrow from first to second image */}
                        <Xarrow
                            start="step1-image"
                            end="step2-image"
                            color="#D71212"
                            strokeWidth={3}
                            curveness={0.8}
                            startAnchor="bottom"
                            endAnchor="top"
                            path="smooth"
                            showHead={false}
                        />
                        {/* Arrow from second to third image */}
                        <Xarrow
                            start="step2-image"
                            end="step3-image"
                            color="#D71212"
                            strokeWidth={3}
                            curveness={0.8}
                            startAnchor="bottom"
                            endAnchor="top"
                            path="smooth"
                            showHead={false}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
