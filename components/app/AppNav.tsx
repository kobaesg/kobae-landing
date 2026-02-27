"use client";

import { usePathname, useRouter } from "next/navigation";
import { Compass, Loader, MessageCircle, User, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth/context";

const tabs = [
    { label: "Discovery", icon: Compass, href: "/discover" },
    { label: "Circles", icon: Loader, href: "/circles" },
    { label: "Chats", icon: MessageCircle, href: "/chats" },
    { label: "Profile", icon: User, href: "/me" },
];

export function AppNav() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuth();

    return (
        <>
            {/* ── Desktop sidebar ── */}
            <aside className="hidden md:flex flex-col fixed top-0 left-0 h-dvh w-56 bg-white border-r border-[#e8e0da] z-40 py-8 px-4">
                {/* Logo */}
                <div className="mb-10 px-2">
                    <span className="font-serif font-bold text-[22px] text-[#181412]">kobae</span>
                </div>

                {/* Nav items */}
                <nav className="flex flex-col gap-1 flex-1">
                    {tabs.map(({ label, icon: Icon, href }) => {
                        const isActive = pathname === href;
                        return (
                            <button
                                key={href}
                                onClick={() => router.push(href)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors w-full ${
                                    isActive
                                        ? "bg-[#ffefe5] text-[#d8602e]"
                                        : "text-[#453933] hover:bg-[#f5ede6]"
                                }`}
                            >
                                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                                <span className="text-[15px] font-semibold font-sans">{label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Logout */}
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#453933] hover:bg-[#f5ede6] transition-colors w-full"
                >
                    <LogOut size={20} strokeWidth={1.5} />
                    <span className="text-[15px] font-semibold font-sans">Log Out</span>
                </button>
            </aside>

            {/* ── Mobile bottom bar ── */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white h-16 flex items-center justify-around px-2 border-t border-[#e8e0da]">
                {tabs.map(({ label, icon: Icon, href }) => {
                    const isActive = pathname === href;
                    return (
                        <button
                            key={href}
                            onClick={() => router.push(href)}
                            className="flex flex-col items-center gap-0.5 px-3"
                        >
                            <Icon
                                size={22}
                                className={isActive ? "text-[#d8602e]" : "text-[#614e41]"}
                                strokeWidth={isActive ? 2 : 1.5}
                            />
                            <span className={`text-[10px] font-semibold font-sans ${isActive ? "text-[#d8602e]" : "text-[#614e41]"}`}>
                                {label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </>
    );
}
