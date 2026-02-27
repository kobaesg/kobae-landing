"use client";

import { usePathname, useRouter } from "next/navigation";
import { Compass, Loader, MessageCircle, User } from "lucide-react";

const tabs = [
    { label: "Discovery", icon: Compass, href: "/discover" },
    { label: "Circles", icon: Loader, href: "/circles" },
    { label: "Chats", icon: MessageCircle, href: "/chats" },
    { label: "Profile", icon: User, href: "/me" },
];

export function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white h-16 flex items-center justify-between px-12 py-3 max-w-[390px] mx-auto shadow-[0_-1px_4px_0_rgba(0,0,0,0.08)]">
            {tabs.map(({ label, icon: Icon, href }) => {
                const isActive = pathname === href;
                return (
                    <button
                        key={href}
                        onClick={() => router.push(href)}
                        className="flex flex-col items-center w-12 gap-0.5"
                    >
                        <Icon
                            size={22}
                            className={
                                isActive
                                    ? "text-[#d8602e]"
                                    : "text-[#614e41]"
                            }
                            strokeWidth={isActive ? 2 : 1.5}
                        />
                        <span
                            className={`text-[10px] font-semibold font-sans leading-[15px] text-center w-[74px] ${
                                isActive
                                    ? "text-[#d8602e]"
                                    : "text-[#614e41]"
                            }`}
                        >
                            {label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
