"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth/context";
import {
    useProfile,
    useUploadPhoto,
    useHobbies,
    useSkills,
    useIntent,
    useOffers,
    usePrompts,
} from "@/lib/api/hooks";
import { formatIntentLabel } from "@/lib/utils";

export default function EditProfilePage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [photoError, setPhotoError] = useState(false);

    const { data: profileData, isLoading } = useProfile(isAuthenticated);
    const { data: hobbies } = useHobbies(isAuthenticated);
    const { data: skills } = useSkills(isAuthenticated);
    const { data: intent } = useIntent(isAuthenticated);
    const { data: offers } = useOffers(isAuthenticated);
    const { data: prompts } = usePrompts(isAuthenticated);
    const uploadPhoto = useUploadPhoto();

    const profile = profileData?.profile;
    const fullName = profile
        ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
        : "";
    const initials = fullName
        ? fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "?";
    const photoUrl = profile?.photo_url;

    const traitCount = (hobbies?.tags?.length || 0) + (skills?.tags?.length || 0);
    const intentList = intent?.intents || [];
    const offerList = offers || [];
    const promptList = prompts || [];
    const answeredPrompts = promptList.filter((p) => p.answer?.trim());

    const truncate = (s: string, n = 42) =>
        s.length > n ? s.slice(0, n) + "…" : s;

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            await uploadPhoto.mutateAsync(file);
            setPhotoError(false);
        } catch {
            // non-fatal
        }
        // Reset so same file can be re-selected
        e.target.value = "";
    };

    if (isLoading) {
        return (
            <div className="min-h-dvh bg-[#f8f7f6] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#d8602e] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const headline =
        profile?.headline ||
        (profile?.occupation && profile?.company
            ? `${profile.occupation} at ${profile.company}`
            : profile?.occupation || "");

    const rows = [
        {
            label: "Name",
            value: fullName || "Add your name",
            href: "/me/edit/name",
        },
        {
            label: "Headline",
            value: headline || "Add a headline",
            href: "/me/edit/headline",
        },
        {
            label: "Prompts",
            value:
                answeredPrompts.length > 0
                    ? `${answeredPrompts.length} prompt${answeredPrompts.length > 1 ? "s" : ""}`
                    : "Add prompts",
            href: "/me/edit/prompts",
        },
        {
            label: "Traits",
            value:
                traitCount > 0
                    ? `${traitCount} trait${traitCount > 1 ? "s" : ""}`
                    : "Add traits",
            href: "/me/edit/traits",
        },
        {
            label: "Looking For",
            value:
                intentList.length > 0
                    ? intentList.map(formatIntentLabel).join(", ")
                    : "Add what you're looking for",
            href: "/me/edit/looking-for",
        },
        {
            label: "Connect With Me For",
            value:
                offerList.length > 0
                    ? offerList.map((o) => o.title).join(", ")
                    : "Add your offerings",
            href: "/me/edit/connect",
        },
    ];

    return (
        <div className="min-h-dvh bg-[#f8f7f6]">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-[#f8f7f6]/95 backdrop-blur border-b border-[#e8e0da] px-6 h-14 flex items-center gap-3">
                <button
                    onClick={() => router.push("/me")}
                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f0e8e0] transition-colors"
                >
                    <ChevronLeft size={20} className="text-[#453933]" strokeWidth={1.5} />
                </button>
                <h1 className="font-serif font-semibold text-[18px] text-[#181412]">
                    Edit Profile
                </h1>
            </div>

            {/* Body */}
            <div className="max-w-lg mx-auto px-6 py-8 pb-44">
                {/* Photo */}
                <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center mb-8"
                >
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="relative group"
                        disabled={uploadPhoto.isPending}
                        type="button"
                    >
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[rgba(180,83,42,0.2)] bg-[#e8ddd7]">
                            {photoUrl && !photoError ? (
                                <img
                                    src={photoUrl}
                                    alt={fullName}
                                    className="w-full h-full object-cover"
                                    onError={() => setPhotoError(true)}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-2xl font-serif font-bold text-[#b4532a]">
                                        {initials}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Camera size={20} className="text-white" />
                        </div>
                        {uploadPhoto.isPending && (
                            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                    </button>
                    <p className="mt-2 text-[13px] font-sans text-[#715e55]">
                        Tap to change photo
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                    />
                </motion.div>

                {/* Section rows */}
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-[0_1px_4px_0_rgba(0,0,0,0.06)] border border-[#f0e8e0] overflow-hidden"
                >
                    {rows.map((row, i) => (
                        <button
                            key={row.label}
                            onClick={() => router.push(row.href)}
                            className={`w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#faf8f6] active:bg-[#f5efe6] transition-colors ${
                                i > 0 ? "border-t border-[#f0e8e0]" : ""
                            }`}
                        >
                            <div className="flex flex-col gap-0.5 min-w-0 pr-3">
                                <span className="text-[11px] font-semibold font-sans text-[#715e55] uppercase tracking-wide">
                                    {row.label}
                                </span>
                                <span className="text-[14px] font-sans text-[#453933] truncate">
                                    {truncate(row.value)}
                                </span>
                            </div>
                            <ChevronRight
                                size={16}
                                className="text-[#b4532a] shrink-0"
                                strokeWidth={2}
                            />
                        </button>
                    ))}
                </motion.div>
            </div>

            {/* Fixed confirm button — positioned above mobile bottom nav (h-16 = 64px) */}
            <div className="fixed bottom-16 md:bottom-0 left-0 right-0 px-5 pb-5 pt-4 bg-gradient-to-t from-[#f8f7f6] via-[#f8f7f6] to-transparent pointer-events-none">
                <div className="mx-auto max-w-lg pointer-events-auto">
                    <button
                        onClick={() => router.push("/me")}
                        className="w-full py-4 rounded-3xl font-sans font-semibold text-base bg-[#d8602e] text-white hover:bg-[#c55528] shadow-[0_0_10px_rgba(255,144,97,0.8)] transition-all duration-200 flex items-center justify-center"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
}
