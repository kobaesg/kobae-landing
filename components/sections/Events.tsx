"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback } from "react";
import Image from "next/image";

const events = [
    {
        id: 1,
        title: "Pickleball Fridays",
        image: "/resources/carousell-1.png",
    },
    {
        id: 2,
        title: "Snorkeling Class at Bali",
        image: "/resources/carousell-2.png",
    },
    {
        id: 3,
        title: "CBD Coffee Runs",
        image: "/resources/carousell-3.png",
    },
    {
        id: 4,
        title: "Golden Hour Run Club",
        image: "/resources/carousell-4.png",
    },
    {
        id: 5,
        title: "Beginner Golf Course",
        image: "/resources/carousell-5.png",
    },
];

export function Events() {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: true,
            align: "start",
            slidesToScroll: 1,
            containScroll: "trimSnaps",
        },
        [Autoplay({ delay: 4000, stopOnInteraction: false })],
    );

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    return (
        <section className="relative py-32 px-6 lg:px-32 bg-[#8c4121] overflow-hidden min-h-[1033px]">
            <div className="container mx-auto max-w-7xl">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl lg:text-[56px] font-normal leading-tight lg:leading-[64px] text-white">
                        Who said networking has to be boring?
                    </h2>
                    <p className="mt-6 text-2xl font-normal leading-9 text-white">
                        From casual coffee runs to creative workshops, Kobae
                        helps you find people to show up with.
                    </p>
                </motion.div>

                {/* Carousel */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="relative"
                >
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex gap-11">
                            {events.map((event) => (
                                <div
                                    key={event.id}
                                    className="flex-[0_0_auto] min-w-0 w-[300px]"
                                >
                                    <div className="group cursor-pointer">
                                        <div className="relative w-full h-[400px] rounded-2xl overflow-hidden">
                                            <Image
                                                src={event.image}
                                                alt={event.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <h3 className="mt-3 text-white font-semibold text-base leading-6">
                                            {event.title}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="flex items-center justify-end gap-6 mt-12 pr-8">
                        <button
                            className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                            onClick={scrollPrev}
                            aria-label="Previous"
                        >
                            <ChevronLeft className="w-6 h-6 text-white" />
                        </button>
                        <button
                            className="w-14 h-14 rounded-full bg-white hover:bg-white/90 flex items-center justify-center transition-colors"
                            onClick={scrollNext}
                            aria-label="Next"
                        >
                            <ChevronRight className="w-6 h-6 text-[#8c4121]" />
                        </button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
