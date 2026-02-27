"use client";

import { Loader } from "lucide-react";
import { BottomNav } from "@/components/app/BottomNav";

export default function CirclesPage() {
    return (
        <div className="min-h-dvh bg-[#f8f7f6] flex flex-col items-center">
            <div className="w-full max-w-[390px] mx-auto flex flex-col min-h-dvh relative">
                <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 pb-20 text-center">
                    <div className="w-20 h-20 rounded-full bg-[#ffefe5] flex items-center justify-center">
                        <Loader size={36} className="text-[#d8602e]" strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h2 className="font-serif font-semibold text-[28px] leading-[36px] text-[#181412]">
                            Coming Soon
                        </h2>
                        <p className="text-[16px] font-sans font-normal leading-[24px] text-[#715e55]">
                            Your circles feature is being crafted. Check back soon!
                        </p>
                    </div>
                </div>
                <BottomNav />
            </div>
        </div>
    );
}
