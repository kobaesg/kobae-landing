"use client";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUnreadCount } from "@/lib/api/hooks/use-notifications";

interface Props { title?: string }

export function DiscoveryHeader({ title = "Today's Connection" }: Props) {
    const router = useRouter();
    const { data: unreadCount } = useUnreadCount();

    return (
        <div className="flex items-center px-5 pt-6 pb-4 relative">
            <div className="w-10" />
            <h1 className="flex-1 text-center font-serif font-semibold text-[24px] text-[#181412]">{title}</h1>
            <button
                onClick={() => router.push("/notifications")}
                className="relative p-2 rounded-full hover:bg-[#f5ede6] transition-colors"
            >
                <Bell size={22} className="text-[#453933]" strokeWidth={1.5} />
                {unreadCount && unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-[#d8602e] rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>
        </div>
    );
}
