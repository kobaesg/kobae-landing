"use client";

import { useRouter } from "next/navigation";
import { Users, ArrowLeft } from "lucide-react";

export default function ConnectionsPage() {
    const router = useRouter();

    return (
        <div className="flex flex-col min-h-dvh relative">
                {/* Header */}
                <div className="flex items-center px-6 pt-safe pt-4 pb-3">
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

                {/* Coming Soon */}
                <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8 pb-20 text-center">
                    <div className="w-20 h-20 rounded-full bg-[#ffefe5] flex items-center justify-center">
                        <Users size={36} className="text-[#d8602e]" strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col gap-2">
                        <h2 className="font-serif font-semibold text-[28px] leading-[36px] text-[#181412]">
                            Coming Soon
                        </h2>
                        <p className="text-[16px] font-sans font-normal leading-[24px] text-[#715e55]">
                            Your connections feature is on its way. Stay tuned!
                        </p>
                    </div>
                </div>

            </div>
    );
}
