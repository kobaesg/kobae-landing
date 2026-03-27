"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function AddConnectionPage() {
    const router = useRouter();

    return (
        <div className="min-h-dvh bg-[#f8f7f6]">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-[#f8f7f6]/95 backdrop-blur border-b border-[#e8e0da] px-4 h-14 flex items-center">
                <button
                    onClick={() => router.back()}
                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f0e8e0] transition-colors"
                    aria-label="Go back"
                >
                    <ArrowLeft size={20} className="text-[#453933]" strokeWidth={1.5} />
                </button>
            </div>

            {/* Content */}
            <div className="px-6 pt-8 pb-10 max-w-lg mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                >
                    <h1 className="font-serif font-semibold text-[35px] leading-[44px] text-[#181412] mb-2">
                        Add someone
                    </h1>
                    <p className="text-[16px] font-sans text-[#715e55] leading-[24px] mb-8">
                        Expand your circle of meaningful connections.
                    </p>
                </motion.div>

                {/* Options */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 }}
                    className="flex flex-col gap-4"
                >
                    <button
                        onClick={() => router.push("/add-connection/search")}
                        className="flex items-center gap-5 w-full bg-white rounded-[32px] px-6 py-5 text-left shadow-[0_2px_8px_0_rgba(0,0,0,0.08)] border border-[#f0e8e0] hover:shadow-[0_4px_16px_0_rgba(0,0,0,0.1)] transition-shadow"
                    >
                        <div className="w-10 h-10 flex items-center justify-center shrink-0">
                            <Search size={32} className="text-[#d8602e]" strokeWidth={1.5} />
                        </div>
                        <div className="flex flex-col gap-1 min-w-0">
                            <span className="text-[18px] font-semibold font-sans text-[#181412] leading-[27px]">
                                Search for Users
                            </span>
                            <span className="text-[16px] font-sans text-[#453933] leading-[24px]">
                                Find and connect with people on Kobae.
                            </span>
                        </div>
                    </button>
                </motion.div>
            </div>
        </div>
    );
}
