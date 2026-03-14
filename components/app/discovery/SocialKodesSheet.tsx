"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ArrowLeft } from "lucide-react";

interface KodeInfo {
    name: string;
    subtitle: string;
    image: string;
    description: string;
    feelsLike: string[];
    watchOut: string;
}

const KODES: KodeInfo[] = [
    {
        name: "Sparrow",
        subtitle: "The Connector",
        image: "/resources/sparrow.png",
        description:
            "You keep things socially alive. You move easily between people, read dynamics fast, and help groups feel cohesive and energised.",
        feelsLike: ["Visible", "Adaptive", "Socially fluent"],
        watchOut: "Spreading yourself too thin",
    },
    {
        name: "Rhino",
        subtitle: "The Driver",
        image: "/resources/rhino.png",
        description:
            "You're the one who actions while everyone else is still talking about it. Your competence gets things done, and people rely on you to make things happen.",
        feelsLike: ["Decisive", "Action-oriented", "Reliable"],
        watchOut: "Coming across as intense or impatient",
    },
    {
        name: "Tortoise",
        subtitle: "The Anchor",
        image: "/resources/tortoise.png",
        description:
            "You're the one people come back to. Your friendships withstand the test of time and you show up even when it's inconvenient.",
        feelsLike: ["Loyal", "Steady", "Dependable"],
        watchOut: "Bearing too much emotional load",
    },
    {
        name: "Whale Shark",
        subtitle: "The Observer",
        image: "/resources/whale shark.png",
        description:
            "You move through social spaces on your own terms. You notice what others miss, engage when it matters, and provide perspective with ease.",
        feelsLike: ["Insightful", "Grounded", "Selective"],
        watchOut: "Being seen as distant or hard to read",
    },
    {
        name: "Firefly",
        subtitle: "The Spark",
        image: "/resources/firefly.png",
        description:
            "You show up with energy that shifts the vibe of a room. You come alive in spontaneous moments and people remember you vividly.",
        feelsLike: ["Electric", "Spontaneous", "Memorable"],
        watchOut: "Being seen as inconsistent",
    },
    {
        name: "Chameleon",
        subtitle: "The Integrator",
        image: "/resources/chameleon.png",
        description:
            "You read social dynamics effortlessly. You bridge gaps between people who wouldn't naturally connect and make spaces feel inclusive.",
        feelsLike: ["Adaptive", "Inclusive", "Versatile"],
        watchOut: "Losing yourself in others' needs",
    },
];

interface Props {
    isOpen: boolean;
    onClose: () => void;
    /** Highlight this archetype in the list */
    activeArchetype?: string;
}

export function SocialKodesSheet({ isOpen, onClose, activeArchetype }: Props) {
    const [selected, setSelected] = useState<KodeInfo | null>(null);

    function handleClose() {
        setSelected(null);
        onClose();
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.4 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black z-50"
                        onClick={handleClose}
                    />

                    {/* Sheet */}
                    <motion.div
                        key="sheet"
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[85vh] flex flex-col"
                    >
                        <AnimatePresence mode="wait">
                            {selected ? (
                                /* ── Detail view ── */
                                <motion.div
                                    key="detail"
                                    initial={{ x: "100%", opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: "100%", opacity: 0 }}
                                    transition={{ type: "spring", damping: 28, stiffness: 320 }}
                                    className="flex flex-col flex-1 overflow-y-auto"
                                >
                                    {/* Header */}
                                    <div className="flex items-center px-5 py-4 border-b border-[#e8e0da]">
                                        <button
                                            onClick={() => setSelected(null)}
                                            className="p-1 rounded-full hover:bg-[#f5ede6] mr-3"
                                        >
                                            <ArrowLeft size={20} className="text-[#453933]" />
                                        </button>
                                        <h3 className="font-serif font-semibold text-[18px] text-[#181412]">
                                            {selected.name}
                                        </h3>
                                    </div>

                                    {/* Body */}
                                    <div className="px-5 py-6 flex flex-col items-center text-center gap-4">
                                        {/* Animal illustration */}
                                        <div className="w-28 h-28 rounded-full bg-[#fff4ec] flex items-center justify-center overflow-hidden shadow-inner">
                                            <img
                                                src={selected.image}
                                                alt={selected.name}
                                                className="w-full h-full object-contain p-2"
                                            />
                                        </div>

                                        {/* Name + subtitle */}
                                        <div>
                                            <p className="font-serif italic font-bold text-[28px] text-[#d8602e] leading-tight">
                                                {selected.name}
                                            </p>
                                            <p className="text-[14px] font-sans text-[#715e55] mt-0.5">
                                                {selected.subtitle}
                                            </p>
                                        </div>

                                        {/* Description */}
                                        <p className="text-[14px] font-sans text-[#453933] leading-relaxed max-w-sm text-center">
                                            {selected.description}
                                        </p>

                                        {/* Feels like */}
                                        <div className="w-full bg-[#faf8f6] rounded-xl p-4 text-left">
                                            <p className="text-[12px] font-sans text-[#9b8479] mb-1 flex items-center gap-1">
                                                <span>☆</span> Feels like
                                            </p>
                                            <p className="text-[14px] font-sans font-semibold text-[#d8602e]">
                                                {selected.feelsLike.join(" · ")}
                                            </p>
                                        </div>

                                        {/* Watch-out */}
                                        <div className="w-full bg-[#faf8f6] rounded-xl p-4 text-left">
                                            <p className="text-[12px] font-sans text-[#9b8479] mb-1 flex items-center gap-1">
                                                <span>⊡</span> Watch-out
                                            </p>
                                            <p className="text-[14px] font-sans font-semibold text-[#d8602e]">
                                                {selected.watchOut}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                /* ── List view ── */
                                <motion.div
                                    key="list"
                                    initial={{ x: "-100%", opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: "-100%", opacity: 0 }}
                                    transition={{ type: "spring", damping: 28, stiffness: 320 }}
                                    className="flex flex-col flex-1 overflow-hidden"
                                >
                                    {/* Header */}
                                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e0da]">
                                        <h3 className="font-serif font-semibold text-[18px] text-[#181412]">
                                            Social Kodes
                                        </h3>
                                        <button
                                            onClick={handleClose}
                                            className="p-1 rounded-full hover:bg-[#f5ede6]"
                                        >
                                            <X size={20} className="text-[#453933]" />
                                        </button>
                                    </div>

                                    {/* List */}
                                    <div className="overflow-y-auto px-4 py-2">
                                        {KODES.map((kode) => {
                                            const isActive =
                                                activeArchetype?.toLowerCase() === kode.name.toLowerCase();
                                            return (
                                                <button
                                                    key={kode.name}
                                                    onClick={() => setSelected(kode)}
                                                    className={`w-full flex items-center gap-4 px-3 py-3.5 rounded-2xl mb-1 text-left transition-colors ${
                                                        isActive
                                                            ? "bg-[#fff4ec]"
                                                            : "hover:bg-[#faf8f6] active:bg-[#f5ede6]"
                                                    }`}
                                                >
                                                    {/* Icon */}
                                                    <div className="w-11 h-11 rounded-full bg-[#fff4ec] flex items-center justify-center flex-shrink-0 border border-[#f0ddd0] overflow-hidden">
                                                        <img
                                                            src={kode.image}
                                                            alt={kode.name}
                                                            className="w-full h-full object-contain p-1"
                                                        />
                                                    </div>

                                                    {/* Text */}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-serif font-semibold text-[16px] text-[#181412]">
                                                            {kode.name}
                                                        </p>
                                                        <p className="text-[13px] font-sans text-[#715e55]">
                                                            {kode.subtitle}
                                                        </p>
                                                    </div>

                                                    <ChevronRight size={18} className="text-[#9b8479] flex-shrink-0" />
                                                </button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
