"use client";

import { useCirclesGraph } from "@/lib/api/hooks/use-circles";
import { NodeGraph } from "@/components/circles/NodeGraph";
import { Loader, RefreshCw, Users } from "lucide-react";

export default function CirclesPage() {
    const { data, isLoading, error, refetch, isRefetching } = useCirclesGraph();

    // Loading state
    if (isLoading) {
        return (
            <div className="flex flex-col min-h-dvh relative">
                <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 pb-20 text-center">
                    <div className="w-20 h-20 rounded-full bg-[#f3e8ff] flex items-center justify-center">
                        <Loader
                            size={36}
                            className="text-[#7C3AED] animate-spin"
                            strokeWidth={1.5}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h2 className="font-serif font-semibold text-[28px] leading-[36px] text-[#181412]">
                            Loading Your Network
                        </h2>
                        <p className="text-[16px] font-sans font-normal leading-[24px] text-[#715e55]">
                            Mapping your connections...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-col min-h-dvh relative">
                <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 pb-20 text-center">
                    <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                        <Users size={36} className="text-red-500" strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h2 className="font-serif font-semibold text-[28px] leading-[36px] text-[#181412]">
                            Unable to Load
                        </h2>
                        <p className="text-[16px] font-sans font-normal leading-[24px] text-[#715e55]">
                            We couldn&apos;t load your network graph. Please try again.
                        </p>
                    </div>
                    <button
                        onClick={() => refetch()}
                        className="mt-4 px-6 py-3 bg-[#7C3AED] text-white rounded-full font-medium hover:bg-[#6D28D9] transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Empty state - no connections yet
    if (!data || (data.nodes.length === 0 && data.links.length === 0)) {
        return (
            <div className="flex flex-col min-h-dvh relative">
                <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 pb-20 text-center">
                    <div className="w-20 h-20 rounded-full bg-[#f3e8ff] flex items-center justify-center">
                        <Users size={36} className="text-[#7C3AED]" strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h2 className="font-serif font-semibold text-[28px] leading-[36px] text-[#181412]">
                            Start Building Your Circle
                        </h2>
                        <p className="text-[16px] font-sans font-normal leading-[24px] text-[#715e55]">
                            Connect with others to see your network grow here. Your connections
                            and their connections will appear as an interactive graph.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Graph view
    return (
        <div className="flex flex-col min-h-dvh relative bg-gradient-to-b from-white to-gray-50">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100">
                <div className="flex items-center justify-between px-4 py-3">
                    <div>
                        <h1 className="font-serif font-semibold text-xl text-[#181412]">
                            Your Circles
                        </h1>
                        <p className="text-sm text-[#715e55]">
                            {data.nodes.filter((n) => n.degree === 1).length} connections
                            {data.nodes.filter((n) => n.degree === 2).length > 0 && (
                                <span>
                                    {" "}
                                    · {data.nodes.filter((n) => n.degree === 2).length} potential
                                </span>
                            )}
                        </p>
                    </div>
                    <button
                        onClick={() => refetch()}
                        disabled={isRefetching}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
                        aria-label="Refresh graph"
                    >
                        <RefreshCw
                            size={20}
                            className={`text-[#715e55] ${isRefetching ? "animate-spin" : ""}`}
                        />
                    </button>
                </div>
            </div>

            {/* Graph Container */}
            <div className="flex-1 relative h-[calc(100dvh-140px)]">
                <NodeGraph data={data} />
            </div>

            {/* Instructions overlay */}
            <div className="absolute bottom-20 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm text-xs text-gray-500">
                <p>Pinch to zoom · Drag to pan</p>
                <p>Tap a node to view profile</p>
            </div>
        </div>
    );
}