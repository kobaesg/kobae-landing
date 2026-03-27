"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, ScanLine } from "lucide-react";
import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import { useAuth } from "@/lib/auth/context";
import { useProfile, useKodeResult } from "@/lib/api/hooks";

export default function MyQRCodePage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { data: profileData } = useProfile(isAuthenticated);
    const { data: kode } = useKodeResult(isAuthenticated);
    const [photoError, setPhotoError] = useState(false);

    const profile = profileData?.profile;
    const userId = profile?.user_id;
    const firstName = profile?.first_name ?? "";
    const lastName = profile?.last_name ?? "";
    const fullName = `${firstName} ${lastName}`.trim();
    const headline = profile?.headline ?? "";
    const photoUrl = profile?.photo_url;
    const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

    const qrValue = userId ? `https://kobaeapp.com/discover/${userId}` : "";

    return (
        <div className="flex flex-col min-h-dvh bg-[#f5f0eb]">
            {/* Header */}
            <div className="flex items-center px-5 pt-safe pt-4 pb-3">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 flex items-center justify-center"
                    aria-label="Go back"
                >
                    <ArrowLeft size={24} className="text-[#453933]" strokeWidth={1.5} />
                </button>
                <h1 className="flex-1 text-center font-serif font-semibold text-[22px] leading-[30px] text-[#181412]">
                    My QR Code
                </h1>
                <div className="w-10" />
            </div>

            {/* Card */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="mx-5 mt-2 bg-[#d8602e] rounded-3xl overflow-hidden flex flex-col items-center px-8 pt-8 pb-10 gap-5"
            >
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/30 flex-shrink-0">
                    {photoUrl && !photoError ? (
                        <img
                            src={photoUrl}
                            alt={fullName}
                            className="w-full h-full object-cover"
                            onError={() => setPhotoError(true)}
                        />
                    ) : (
                        <div className="w-full h-full bg-[#b4532a] flex items-center justify-center">
                            <span className="text-2xl font-serif font-bold text-white">{initials}</span>
                        </div>
                    )}
                </div>

                {/* Name + kode */}
                <div className="flex flex-col items-center gap-1.5 text-center">
                    <h2 className="font-serif font-semibold text-[24px] text-white leading-tight">
                        {fullName || "Your Name"}
                    </h2>
                    {kode?.archetype && (
                        <div className="flex items-center gap-1 bg-white/20 rounded-full px-2.5 h-6 w-fit">
                            <User size={11} className="text-white" strokeWidth={2} />
                            <span className="text-[11px] font-semibold font-sans text-white whitespace-nowrap">
                                {kode.archetype}
                            </span>
                        </div>
                    )}
                    {headline && (
                        <p className="text-[13px] font-sans text-white/70">{headline}</p>
                    )}
                </div>

                {/* QR Code */}
                {qrValue ? (
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <QRCode
                            value={qrValue}
                            size={180}
                            bgColor="#ffffff"
                            fgColor="#181412"
                            level="M"
                        />
                    </div>
                ) : (
                    <div className="bg-white/20 rounded-2xl w-[212px] h-[212px] flex items-center justify-center">
                        <span className="text-white/50 text-sm">Loading…</span>
                    </div>
                )}

                <p className="text-[12px] font-sans text-white/60 text-center">
                    Let others scan this to connect with you
                </p>
            </motion.div>

            {/* Scan instead */}
            <div className="flex-1" />
            <div className="px-5 pb-safe pb-8">
                <button
                    onClick={() => router.push("/scan")}
                    className="w-full py-4 rounded-2xl border-2 border-[#d8602e] text-[#d8602e] font-semibold font-sans text-[16px] flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                >
                    <ScanLine size={20} strokeWidth={1.5} />
                    Scan a QR Code Instead
                </button>
            </div>
        </div>
    );
}
