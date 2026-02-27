"use client";

import { motion } from "framer-motion";

interface KodeResultCardProps {
    archetype: string;
    description: string;
    topAttributes?: [string, string];
    illustrationUrl?: string;
}

// Map archetypes to subtitles
const ARCHETYPE_SUBTITLES: Record<string, string> = {
    "Whale Shark": "The Observer",
    Sparrow: "The Connector",
    Firefly: "The Spark",
    Rhino: "The Driver",
    Chameleon: "The Integrator",
    Tortoise: "The Anchor",
};

// Archetype-specific "Feels like" traits
const ARCHETYPE_FEELS_LIKE: Record<string, string> = {
    Sparrow: "Visible · Adaptive · Socially fluent",
    Rhino: "Decisive · Forceful · Outcome-oriented",
    Tortoise: "Dependable · Grounding · Loyal",
    "Whale Shark": "Thoughtful · Inward-weighted · Insightful",
    Firefly: "Catalytic · Emotional · Bright",
    Chameleon: "Perceptive · Flexible · Translating",
};

// Archetype-specific "Watch-out" warnings
const ARCHETYPE_WATCH_OUT: Record<string, string> = {
    Sparrow: "Spreading yourself too thin",
    Rhino: "Overrunning nuance or people's pace",
    Tortoise: "Carrying too much for others",
    "Whale Shark": "Being overlooked or under-seen",
    Firefly: "Sustaining presence and follow-through",
    Chameleon: "Losing your own stance by over-adapting",
};

// Local illustration images per archetype
const ARCHETYPE_IMAGES: Record<string, string> = {
    Sparrow: "/resources/sparrow.png",
    Rhino: "/resources/rhino.png",
    Tortoise: "/resources/tortoise.png",
    "Whale Shark": "/resources/whale shark.png",
    Firefly: "/resources/firefly.png",
    Chameleon: "/resources/chameleon.png",
};

const EASE = [0.25, 0.1, 0.25, 1] as const;

// Simple inline SVG icons matching Figma
function StarIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
        >
            <path
                d="M8 1.5L9.854 5.753L14.5 6.427L11.25 9.597L12.09 14.25L8 12L3.91 14.25L4.75 9.597L1.5 6.427L6.146 5.753L8 1.5Z"
                stroke="#9b8479"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function SquareWarningIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="shrink-0"
        >
            <rect
                x="2"
                y="2"
                width="12"
                height="12"
                rx="2"
                stroke="#9b8479"
                strokeWidth="1.2"
            />
            <path
                d="M8 5.5V8.5"
                stroke="#9b8479"
                strokeWidth="1.2"
                strokeLinecap="round"
            />
            <circle cx="8" cy="10.5" r="0.6" fill="#9b8479" />
        </svg>
    );
}

export function KodeResultCard({
    archetype,
    description,
    illustrationUrl,
}: KodeResultCardProps) {
    const subtitle = ARCHETYPE_SUBTITLES[archetype] || "Your Archetype";
    const feelsLike = ARCHETYPE_FEELS_LIKE[archetype];
    const watchOut = ARCHETYPE_WATCH_OUT[archetype];
    const imageSrc = illustrationUrl || ARCHETYPE_IMAGES[archetype];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="bg-white rounded-3xl shadow-[0px_0px_7px_0px_rgba(0,0,0,0.15)] px-5 py-8 flex flex-col gap-5 items-center w-full"
        >
            {/* Illustration */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
                className="flex justify-center"
            >
                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt={archetype}
                        className="w-[220px] h-[140px] object-contain"
                    />
                ) : (
                    <div className="w-[220px] h-[140px] rounded-xl bg-[var(--background)] flex items-center justify-center">
                        <img
                            src="/resources/thumbnail.png"
                            alt="Kobae"
                            className="w-20 h-20 opacity-50"
                        />
                    </div>
                )}
            </motion.div>

            {/* Name + subtitle */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3, ease: EASE }}
                className="flex flex-col gap-2 items-center w-full"
            >
                {/* Archetype name with peach highlight */}
                <div className="relative h-9 w-full flex items-center justify-center">
                    <span className="absolute w-[106px] h-[15px] top-[15px] left-1/2 -translate-x-1/2 bg-[#ffefe5]" />
                    <h2 className="relative text-[28px] font-serif font-semibold italic text-[var(--primary)] leading-[36px] text-center">
                        {archetype}
                    </h2>
                </div>

                {/* Subtitle */}
                <p className="text-sm font-sans font-semibold text-[var(--text-200)] text-center leading-[21px]">
                    {subtitle}
                </p>
            </motion.div>

            {/* Description */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.4, ease: EASE }}
                className="text-base font-sans font-normal text-[var(--text-400)] text-center leading-6 w-full"
            >
                {description}
            </motion.p>

            {/* Feels like */}
            {feelsLike && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.5, ease: EASE }}
                    className="flex flex-col gap-2 items-start w-full"
                >
                    <div className="flex items-center gap-1 h-6">
                        <StarIcon />
                        <span className="text-sm font-sans font-semibold text-[var(--text-200)] leading-[21px]">
                            Feels like
                        </span>
                    </div>
                    <p className="text-base font-sans font-semibold text-[var(--primary)] leading-6">
                        {feelsLike}
                    </p>
                </motion.div>
            )}

            {/* Watch-out */}
            {watchOut && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.6, ease: EASE }}
                    className="flex flex-col gap-2 items-start w-full"
                >
                    <div className="flex items-center gap-1 h-6">
                        <SquareWarningIcon />
                        <span className="text-sm font-sans font-semibold text-[var(--text-200)] leading-[21px]">
                            Watch‑out
                        </span>
                    </div>
                    <p className="text-base font-sans font-semibold text-[var(--primary)] leading-6">
                        {watchOut}
                    </p>
                </motion.div>
            )}
        </motion.div>
    );
}
