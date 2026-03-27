"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, SlidersHorizontal, Send, X } from "lucide-react";
import { useConnections } from "@/lib/api/hooks/use-connections";
import type { ConnectionCard } from "@/lib/api/types";

function InitialsAvatar({ name, photoUrl }: { name: string; photoUrl?: string }) {
    const [imgError, setImgError] = useState(false);

    if (photoUrl && !imgError) {
        return (
            <img
                src={photoUrl}
                alt={name}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                onError={() => setImgError(true)}
            />
        );
    }

    const initial = name?.[0]?.toUpperCase() ?? "?";
    return (
        <div className="w-12 h-12 rounded-full bg-[#e8d5c8] flex-shrink-0 flex items-center justify-center">
            <span className="text-[18px] font-serif font-semibold text-[#b4532a]">{initial}</span>
        </div>
    );
}

function ConnectionRow({ connection, onRowClick, onMessageClick }: {
    connection: ConnectionCard;
    onRowClick: () => void;
    onMessageClick: (e: React.MouseEvent) => void;
}) {
    const fullName = `${connection.first_name} ${connection.last_name}`.trim();
    return (
        <button
            onClick={onRowClick}
            className="flex items-center gap-3 w-full px-5 py-3 text-left active:bg-[#f5f0eb] transition-colors"
        >
            <InitialsAvatar name={connection.first_name} photoUrl={connection.photo_url} />
            <div className="flex-1 min-w-0">
                <p className="font-sans font-semibold text-[18px] text-[#181412] truncate leading-snug">
                    {fullName}
                </p>
                {connection.headline && (
                    <p className="font-sans text-[14px] text-[#715e55] truncate leading-snug">
                        {connection.headline}
                    </p>
                )}
            </div>
            <button
                onClick={onMessageClick}
                className="w-9 h-9 rounded-full bg-[#d8602e] flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform"
                aria-label={`Message ${connection.first_name}`}
            >
                <Send size={16} className="text-white" strokeWidth={1.5} />
            </button>
        </button>
    );
}

export default function ConnectionsPage() {
    const router = useRouter();
    const { data: connections, isLoading } = useConnections();
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const filtered = useMemo(() => {
        if (!connections) return [];
        if (!searchQuery.trim()) return connections;
        const q = searchQuery.toLowerCase();
        return connections.filter((c) =>
            `${c.first_name} ${c.last_name}`.toLowerCase().includes(q)
        );
    }, [connections, searchQuery]);

    function handleMessageClick(e: React.MouseEvent, userId: string) {
        e.stopPropagation();
        router.push("/chats");
    }

    return (
        <div className="flex flex-col min-h-dvh bg-[#f5f0eb]">
            {/* Header */}
            <div className="flex items-center px-5 pt-safe pt-4 pb-3 bg-[#f5f0eb]">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 flex items-center justify-center"
                    aria-label="Go back"
                >
                    <ArrowLeft size={24} className="text-[#453933]" strokeWidth={1.5} />
                </button>
                <h1 className="flex-1 text-center font-serif font-semibold text-[22px] leading-[30px] text-[#181412]">
                    Connections
                </h1>
                <div className="w-10" />
            </div>

            {/* Subheader row */}
            <div className="flex items-center justify-between px-5 pb-3">
                <p className="font-sans font-semibold text-[16px] text-[#715e55]">
                    {isLoading ? "" : `${connections?.length ?? 0} Connection${(connections?.length ?? 0) !== 1 ? "s" : ""}`}
                </p>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => {
                            setSearchOpen((prev) => !prev);
                            if (searchOpen) setSearchQuery("");
                        }}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#e8ddd7] active:bg-[#e8ddd7] transition-colors"
                        aria-label="Search"
                    >
                        {searchOpen
                            ? <X size={20} className="text-[#453933]" strokeWidth={1.5} />
                            : <Search size={20} className="text-[#453933]" strokeWidth={1.5} />
                        }
                    </button>
                    <button
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#e8ddd7] transition-colors"
                        aria-label="Filter"
                    >
                        <SlidersHorizontal size={20} className="text-[#453933]" strokeWidth={1.5} />
                    </button>
                </div>
            </div>

            {/* Search input */}
            {searchOpen && (
                <div className="px-5 pb-3">
                    <input
                        autoFocus
                        type="text"
                        placeholder="Search connections..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-[#e8e0da] text-[15px] font-sans text-[#181412] placeholder:text-[#9b8479] outline-none focus:border-[#d8602e]"
                    />
                </div>
            )}

            {/* Content */}
            <div className="flex-1 bg-white rounded-t-2xl overflow-hidden">
                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-[#d8602e] border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {!isLoading && filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 px-8 text-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-[#ffefe5] flex items-center justify-center">
                            <Search size={28} className="text-[#d8602e]" strokeWidth={1.5} />
                        </div>
                        <p className="text-[16px] font-sans text-[#715e55]">
                            {searchQuery ? "No connections match your search" : "No connections yet"}
                        </p>
                    </div>
                )}

                {!isLoading && filtered.length > 0 && (
                    <div className="divide-y divide-[#f5f0eb]">
                        {filtered.map((connection) => (
                            <ConnectionRow
                                key={connection.user_id}
                                connection={connection}
                                onRowClick={() => router.push(`/connections/${connection.user_id}`)}
                                onMessageClick={(e) => handleMessageClick(e, connection.user_id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
