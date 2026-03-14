"use client";
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface Props { nextRefreshAt: string; message: string }

function formatTimeLeft(ms: number): string {
    if (ms <= 0) return "0:00:00";
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function CountdownView({ nextRefreshAt, message }: Props) {
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
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 pb-20">
            <div className="w-64 h-64 rounded-3xl bg-gradient-to-br from-[#ffefe5] via-[#f5ede6] to-[#e8d5c8] flex items-center justify-center">
                <Clock size={48} className="text-[#d8602e]" strokeWidth={1} />
            </div>
            <div className="flex flex-col items-center gap-3">
                <span className="font-mono text-[36px] font-bold text-[#181412] tracking-wide">
                    {formatTimeLeft(timeLeft)}
                </span>
                <p className="text-[15px] font-sans text-[#715e55] text-center max-w-[280px]">
                    {message}
                </p>
            </div>
        </div>
    );
}
