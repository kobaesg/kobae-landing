"use client";
import { useState, useEffect } from "react";

interface Props { nextRefreshAt: string }

function formatTimeLeft(ms: number): string {
    if (ms <= 0) return "00:00:00";

    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
        .map((value) => value.toString().padStart(2, "0"))
        .join(":");
}

export function CountdownView({ nextRefreshAt }: Props) {
    const [timeLeft, setTimeLeft] = useState(() => new Date(nextRefreshAt).getTime() - Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            const remaining = new Date(nextRefreshAt).getTime() - Date.now();
            setTimeLeft(remaining);
            if (remaining <= 0) clearInterval(interval);
        }, 1000);
        return () => clearInterval(interval);
    }, [nextRefreshAt]);

    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-5 pb-20">
            {/* Blurred gradient image placeholder */}
            <div className="w-full rounded-3xl overflow-hidden" style={{ aspectRatio: "4/3" }}>
                <div className="w-full h-full bg-gradient-to-br from-[#f5d9c0] via-[#e8c9a8] to-[#d4b08a] flex items-center justify-center"
                    style={{ filter: "blur(0px)" }}>
                    <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm" />
                </div>
            </div>

            {/* White card below */}
            <div className="w-full bg-white rounded-2xl shadow-[0_0_7px_rgba(0,0,0,0.1)] p-5 flex flex-col items-center gap-2">
                <p className="text-[13px] font-sans text-[#715e55]">Next recommendation in</p>
                <span className="font-sans text-[40px] font-bold text-[#d8602e] leading-none">
                    {formatTimeLeft(timeLeft)}
                </span>
            </div>
        </div>
    );
}
