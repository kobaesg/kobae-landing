"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback } from "react";

const events = [
    {
        id: 1,
        title: "Pickleball Fridays",
        image: "Image of Event",
    },
    {
        id: 2,
        title: "Metal Jewellery Workshop",
        image: "Image",
    },
    {
        id: 3,
        title: "Coffee Runs",
        image: "Image",
    },
    {
        id: 4,
        title: "Trip to Bali",
        image: "Image",
    },
    {
        id: 5,
        title: "Book Club Meetup",
        image: "Image",
    },
    {
        id: 6,
        title: "Hiking Adventure",
        image: "Image",
    },
];

export function Events() {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, align: "start", slidesToScroll: 1 },
        [Autoplay({ delay: 4000, stopOnInteraction: false })],
    );

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    return (
        <section className="py-24 px-6">
            <div className="container mx-auto max-w-6xl">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Who said networking has to be boring?
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Kobae makes it easy for you to have genuine connections
                        with like-minded individuals.
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
                        <div className="flex -ml-6">
                            {events.map((event) => (
                                <div
                                    key={event.id}
                                    className="flex-[0_0_auto] min-w-0 pl-6"
                                    style={{ flexBasis: "280px" }}
                                >
                                    <div className="group cursor-pointer">
                                        <div className="aspect-[3/4] bg-muted rounded-2xl flex items-center justify-center border border-border group-hover:border-primary/50 transition-colors overflow-hidden">
                                            <span className="text-muted-foreground">
                                                {event.image}
                                            </span>
                                        </div>
                                        <h3 className="mt-4 font-medium text-center">
                                            {event.title}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Arrows */}
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full"
                            onClick={scrollPrev}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full"
                            onClick={scrollNext}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
