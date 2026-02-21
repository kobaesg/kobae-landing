"use client";

interface KodeResultCardProps {
    archetype: string;
    description: string;
    topAttributes: [string, string];
    illustrationUrl?: string;
}

// Map top attribute codes to human-readable names
const ATTRIBUTE_NAMES: Record<string, string> = {
    STB: "Stability",
    ATT: "Attraction",
    RCH: "Reach",
    DRV: "Drive",
    DEP: "Depth",
    SPK: "Spark",
};

// Map archetypes to subtitles (can be extended)
const ARCHETYPE_SUBTITLES: Record<string, string> = {
    Sparrow: "The Connector",
    Eagle: "The Visionary",
    Owl: "The Sage",
    Peacock: "The Entertainer",
    Hawk: "The Strategist",
    Hummingbird: "The Energizer",
    Swan: "The Diplomat",
    Falcon: "The Achiever",
    Robin: "The Nurturer",
    Crane: "The Mentor",
    Phoenix: "The Transformer",
    Dove: "The Peacemaker",
    Kingfisher: "The Creator",
    Raven: "The Thinker",
    Flamingo: "The Inspirer",
};

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
        <div className="bg-white rounded-2xl shadow-[0_0_7px_rgba(0,0,0,0.15)] p-6 space-y-5">
            {/* Illustration */}
            <div className="flex justify-center">
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
            </div>

            {/* Archetype name */}
            <div className="text-center space-y-1">
                <h2 className="text-3xl font-serif font-bold italic text-[var(--primary)]">
                    {archetype}
                </h2>
                <p className="text-sm text-[var(--text-300)] font-sans">
                    {subtitle}
                </p>
            </div>

            {/* Description */}
            <p className="text-sm text-[var(--text-400)] font-sans text-center leading-relaxed">
                {description}
            </p>

            {/* Feels like */}
            <div className="text-center">
                <p className="text-xs text-[var(--text-200)] font-sans mb-1">
                    Feels like
                </p>
                <p className="text-sm text-[var(--text-400)] font-sans font-medium">
                    {attributeLabels.join(" · ")}
                </p>
            </div>
        </div>
    );
}
