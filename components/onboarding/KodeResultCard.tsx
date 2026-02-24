"use client";

import { motion } from "framer-motion";

interface KodeResultCardProps {
    archetype: string;
    description: string;
    topAttributes: [string, string];
    illustrationUrl?: string;
}

// Map top attribute codes to human-readable names
const ATTRIBUTE_NAMES: Record<string, string> = {
    STB: "Stability",
    RLN: "Relational",
    MTM: "Momentum",
    REF: "Reflection",
};

// Map archetypes to subtitles
const ARCHETYPE_SUBTITLES: Record<string, string> = {
    "Whale Shark": "The Observer",
    Sparrow: "The Connector",
    Firefly: "The Spark",
    Rhino: "The Driver",
    Chameleon: "The Integrator",
    Tortoise: "The Anchor",
};

const EASE = [0.25, 0.1, 0.25, 1] as const;

export function KodeResultCard({
    archetype,
    description,
    topAttributes,
    illustrationUrl,
}: KodeResultCardProps) {
    const subtitle = ARCHETYPE_SUBTITLES[archetype] || "Your Archetype";
    const attributeLabels = topAttributes.map(
        (attr) => ATTRIBUTE_NAMES[attr] || attr
    );

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            className="bg-white rounded-2xl shadow-[0_0_7px_rgba(0,0,0,0.15)] p-6 space-y-5"
        >
            {/* Illustration */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
                className="flex justify-center"
            >
                {illustrationUrl ? (
                    <img
                        src={illustrationUrl}
                        alt={archetype}
                        className="w-40 h-40 object-contain"
                    />
                ) : (
                    <div className="w-40 h-40 rounded-full bg-[var(--background)] flex items-center justify-center">
                        <img
                            src="/resources/thumbnail.png"
                            alt="Kobae"
                            className="w-20 h-20 opacity-50"
                        />
                    </div>
                )}
            </motion.div>

            {/* Archetype name */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35, ease: EASE }}
                className="text-center space-y-1"
            >
                <h2 className="text-3xl font-serif font-bold italic text-[var(--primary)]">
                    {archetype}
                </h2>
                <p className="text-sm text-[var(--text-300)] font-sans">
                    {subtitle}
                </p>
            </motion.div>

            {/* Description */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.45, ease: EASE }}
                className="text-sm text-[var(--text-400)] font-sans text-center leading-relaxed"
            >
                {description}
            </motion.p>

            {/* Feels like */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.55, ease: EASE }}
                className="text-center"
            >
                <p className="text-xs text-[var(--text-200)] font-sans mb-1">
                    Feels like
                </p>
                <p className="text-sm text-[var(--text-400)] font-sans font-medium">
                    {attributeLabels.join(" · ")}
                </p>
            </motion.div>
        </motion.div>
    );
}
