"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchUsers, useSendRequest } from "@/lib/api/hooks";
import type { UserSearchResult } from "@/lib/api/types";

export default function SearchUsersPage() {
    const router = useRouter();
    const [inputValue, setInputValue] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [selected, setSelected] = useState<Map<string, UserSearchResult>>(new Map());
    const [sentSuccess, setSentSuccess] = useState(false);
    const [successCount, setSuccessCount] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    // Debounce input
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(inputValue.trim()), 400);
        return () => clearTimeout(timer);
    }, [inputValue]);

    const { data: results = [], isFetching } = useSearchUsers(debouncedQuery);
    const sendRequest = useSendRequest();

    const toggleSelect = useCallback((user: UserSearchResult) => {
        setSelected((prev) => {
            const next = new Map(prev);
            if (next.has(user.user_id)) {
                next.delete(user.user_id);
            } else {
                next.set(user.user_id, user);
            }
            return next;
        });
    }, []);

    const handleSend = useCallback(async () => {
        const ids = Array.from(selected.keys());
        let successfulRequests = 0;

        try {
            // Send requests sequentially to avoid overwhelming the server
            // and prevent race conditions with token refresh
            for (const id of ids) {
                try {
                    await sendRequest.mutateAsync(id);
                    successfulRequests++;
                } catch (error) {
                    // Log individual failures but continue with remaining requests
                    console.error(`Failed to send request to user ${id}:`, error);
                }
            }

            // Show success message even if some requests failed
            // This prevents users from getting logged out
            setSuccessCount(successfulRequests);
            setSentSuccess(true);
            setTimeout(() => router.back(), 1500);
        } catch (error) {
            // If there's a catastrophic error, just go back
            console.error("Error sending requests:", error);
            router.back();
        }
    }, [selected, sendRequest, router]);

    const initials = (user: UserSearchResult) => {
        const f = user.first_name?.[0] ?? "";
        const l = user.last_name?.[0] ?? "";
        return (f + l).toUpperCase() || "?";
    };

    const subtext = (user: UserSearchResult) =>
        user.headline || user.occupation || "";

    if (sentSuccess) {
        return (
            <div className="min-h-dvh bg-[#f8f7f6] flex flex-col items-center justify-center gap-4">
                <motion.div
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-16 h-16 rounded-full bg-[#d8602e] flex items-center justify-center"
                >
                    <Check size={28} className="text-white" strokeWidth={2.5} />
                </motion.div>
                <p className="font-serif font-semibold text-[22px] text-[#181412]">
                    {successCount === 1 ? "Request sent!" : `${successCount} request${successCount !== 1 ? "s" : ""} sent!`}
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-dvh bg-[#f8f7f6] flex flex-col">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-[#f8f7f6]/95 backdrop-blur border-b border-[#e8e0da] px-4 h-14 flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f0e8e0] transition-colors shrink-0"
                    aria-label="Go back"
                >
                    <ArrowLeft size={20} className="text-[#453933]" strokeWidth={1.5} />
                </button>
                <h1 className="font-serif font-semibold text-[20px] text-[#181412]">Find People</h1>
            </div>

            {/* Search input */}
            <div className="px-4 pt-4 pb-2">
                <div className="relative flex items-center bg-white rounded-2xl border border-[#e8e0da] shadow-[0_1px_4px_0_rgba(0,0,0,0.06)]">
                    <Search size={18} className="absolute left-4 text-[#b09a8e] shrink-0" strokeWidth={1.5} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Search by name..."
                        autoFocus
                        className="w-full bg-transparent py-3 pl-11 pr-10 text-[15px] font-sans text-[#181412] placeholder:text-[#b09a8e] outline-none"
                    />
                    {inputValue && (
                        <button
                            onClick={() => setInputValue("")}
                            className="absolute right-3 w-6 h-6 flex items-center justify-center rounded-full bg-[#e8e0da] hover:bg-[#ddd4cc] transition-colors"
                        >
                            <X size={12} className="text-[#715e55]" strokeWidth={2} />
                        </button>
                    )}
                </div>
            </div>

            {/* Selected chips */}
            <AnimatePresence>
                {selected.size > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="flex gap-2 px-4 py-2 flex-wrap">
                            {Array.from(selected.values()).map((u) => (
                                <motion.div
                                    key={u.user_id}
                                    initial={{ opacity: 0, scale: 0.85 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.85 }}
                                    className="flex items-center gap-1.5 h-7 px-2.5 rounded-full bg-[#d8602e] shadow-sm"
                                >
                                    <span className="text-[12px] font-semibold font-sans text-white">
                                        {u.first_name}
                                    </span>
                                    <button onClick={() => toggleSelect(u)}>
                                        <X size={10} className="text-white/80" strokeWidth={2.5} />
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results */}
            <div className="flex-1 overflow-y-auto px-4 pb-32">
                {debouncedQuery.length < 2 && (
                    <div className="flex flex-col items-center gap-2 py-20 text-center">
                        <Search size={36} className="text-[#cbbfb8]" strokeWidth={1} />
                        <p className="text-[15px] font-sans text-[#715e55]">Type a name to search</p>
                    </div>
                )}

                {debouncedQuery.length >= 2 && isFetching && results.length === 0 && (
                    <div className="flex justify-center py-16">
                        <div className="w-6 h-6 border-2 border-[#d8602e] border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {debouncedQuery.length >= 2 && !isFetching && results.length === 0 && (
                    <div className="flex flex-col items-center gap-2 py-20 text-center">
                        <p className="text-[15px] font-sans text-[#715e55]">No users found for "{debouncedQuery}"</p>
                    </div>
                )}

                {results.length > 0 && (
                    <div className="flex flex-col gap-1 pt-2">
                        {results.map((user) => {
                            const isSelected = selected.has(user.user_id);
                            return (
                                <motion.button
                                    key={user.user_id}
                                    onClick={() => toggleSelect(user)}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex items-center gap-3 w-full px-3 py-3 rounded-2xl transition-colors ${
                                        isSelected ? "bg-[#fff5ef]" : "hover:bg-white"
                                    }`}
                                >
                                    {/* Avatar */}
                                    <div className="relative shrink-0">
                                        <div className="w-11 h-11 rounded-full overflow-hidden bg-[#e8ddd7] border border-[rgba(180,83,42,0.2)] flex items-center justify-center">
                                            {user.photo_url ? (
                                                <img
                                                    src={user.photo_url}
                                                    alt={`${user.first_name} ${user.last_name}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-[14px] font-serif font-bold text-[#b4532a]">
                                                    {initials(user)}
                                                </span>
                                            )}
                                        </div>
                                        {isSelected && (
                                            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#d8602e] flex items-center justify-center border-2 border-[#f8f7f6]">
                                                <Check size={10} className="text-white" strokeWidth={3} />
                                            </div>
                                        )}
                                    </div>

                                    {/* Name + subtext */}
                                    <div className="flex flex-col items-start min-w-0 flex-1">
                                        <span className="text-[15px] font-semibold font-sans text-[#181412] truncate w-full text-left">
                                            {user.first_name} {user.last_name}
                                        </span>
                                        {subtext(user) && (
                                            <span className="text-[13px] font-sans text-[#715e55] truncate w-full text-left">
                                                {subtext(user)}
                                            </span>
                                        )}
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Sticky send button */}
            <AnimatePresence>
                {selected.size > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 24 }}
                        className="fixed bottom-16 md:bottom-0 left-0 right-0 px-4 pb-5 pt-3 bg-gradient-to-t from-[#f8f7f6] via-[#f8f7f6]/90 to-transparent"
                    >
                        <button
                            onClick={handleSend}
                            disabled={sendRequest.isPending}
                            className="w-full max-w-lg mx-auto flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#d8602e] hover:bg-[#c55528] disabled:opacity-70 shadow-[0_4px_16px_0_rgba(216,96,46,0.4)] transition-colors font-semibold font-sans text-white text-[16px]"
                        >
                            {sendRequest.isPending ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                `Send Request${selected.size > 1 ? `s (${selected.size})` : ""}`
                            )}
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
