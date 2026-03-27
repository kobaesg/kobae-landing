"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth/context";
import { useHobbies, useSkills } from "@/lib/api/hooks";

export default function EditTraitsPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { data: hobbies } = useHobbies(isAuthenticated);
    const { data: skills } = useSkills(isAuthenticated);

    const hobbyCount = hobbies?.tags?.length || 0;
    const skillCount = skills?.tags?.length || 0;

    const rows = [
        {
            label: "Hobbies",
            value:
                hobbyCount > 0
                    ? `${hobbyCount} selected`
                    : "Add hobbies",
            href: "/me/edit/traits/hobbies",
        },
        {
            label: "Skills",
            value:
                skillCount > 0
                    ? `${skillCount} selected`
                    : "Add skills",
            href: "/me/edit/traits/skills",
        },
    ];

    return (
        <div className="min-h-dvh bg-[#f8f7f6]">
            <div className="sticky top-0 z-30 bg-[#f8f7f6]/95 backdrop-blur border-b border-[#e8e0da] px-6 h-14 flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f0e8e0] transition-colors"
                >
                    <ChevronLeft size={20} className="text-[#453933]" strokeWidth={1.5} />
                </button>
                <h1 className="font-serif font-semibold text-[18px] text-[#181412]">
                    Traits
                </h1>
            </div>

            <div className="max-w-lg mx-auto px-6 py-6 pb-44">
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl shadow-[0_1px_4px_0_rgba(0,0,0,0.06)] border border-[#f0e8e0] overflow-hidden"
                >
                    {rows.map((row, i) => (
                        <button
                            key={row.label}
                            onClick={() => router.push(row.href)}
                            className={`w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#faf8f6] active:bg-[#f5efe6] transition-colors ${
                                i > 0 ? "border-t border-[#f0e8e0]" : ""
                            }`}
                        >
                            <div className="flex flex-col gap-0.5 min-w-0 pr-3">
                                <span className="text-[11px] font-semibold font-sans text-[#715e55] uppercase tracking-wide">
                                    {row.label}
                                </span>
                                <span className="text-[14px] font-sans text-[#453933]">
                                    {row.value}
                                </span>
                            </div>
                            <ChevronRight
                                size={16}
                                className="text-[#b4532a] shrink-0"
                                strokeWidth={2}
                            />
                        </button>
                    ))}
                </motion.div>
            </div>

            <div className="fixed bottom-16 md:bottom-0 left-0 right-0 px-5 pb-5 pt-4 bg-gradient-to-t from-[#f8f7f6] via-[#f8f7f6] to-transparent pointer-events-none">
                <div className="mx-auto max-w-lg pointer-events-auto">
                    <button
                        type="button"
                        onClick={() => router.push("/me/edit")}
                        className="w-full py-4 rounded-3xl font-sans font-semibold text-base bg-[#d8602e] text-white hover:bg-[#c55528] shadow-[0_0_10px_rgba(255,144,97,0.8)] transition-all duration-200 flex items-center justify-center"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
