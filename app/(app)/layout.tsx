"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { AppNav } from "@/components/app/AppNav";

export default function AppGroupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="min-h-dvh bg-[var(--background)] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-dvh bg-[#f8f7f6]">
            <AppNav />
            {/* Offset content for sidebar on desktop, bottom nav on mobile */}
            <div className="md:pl-56 pb-16 md:pb-0">
                {children}
            </div>
        </div>
    );
}
