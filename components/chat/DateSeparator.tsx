"use client";

interface DateSeparatorProps {
    date: Date;
}

function formatDate(date: Date): string {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (inputDate.getTime() === today.getTime()) {
        return "Today";
    } else if (inputDate.getTime() === yesterday.getTime()) {
        return "Yesterday";
    } else {
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
        });
    }
}

export function DateSeparator({ date }: DateSeparatorProps) {
    return (
        <div className="flex items-center justify-center py-4">
            <span className="text-[12px] font-sans text-[#8e8e8e] bg-[#f5f0eb] px-3 py-1 rounded-full">
                {formatDate(date)}
            </span>
        </div>
    );
}