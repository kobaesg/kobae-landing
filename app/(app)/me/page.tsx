"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Settings, ChevronRight, LogOut, Pencil, Users, QrCode, Plus, User } from "lucide-react";
import { useAuth } from "@/lib/auth/context";
import {
    useProfile,
    useKodeResult,
    useHobbies,
    useSkills,
    useIntent,
    useOffers,
    usePrompts,
} from "@/lib/api/hooks";
import { BottomNav } from "@/components/app/BottomNav";
import { STEP_ROUTE_MAP } from "@/lib/api/types";

export default function MyProfilePage() {
    const { isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const [settingsOpen, setSettingsOpen] = useState(false);
    const settingsRef = useRef<HTMLDivElement>(null);

    const { data: profileData, isLoading: profileLoading } = useProfile(isAuthenticated);
    const { data: kode } = useKodeResult(isAuthenticated);
    const { data: hobbies } = useHobbies(isAuthenticated);
    const { data: skills } = useSkills(isAuthenticated);
    const { data: intent } = useIntent(isAuthenticated);
    const { data: offers } = useOffers(isAuthenticated);
    const { data: prompts } = usePrompts(isAuthenticated);

    // Close settings dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
                setSettingsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Redirect to onboarding if not fully complete
    useEffect(() => {
        if (profileLoading) return;
        const step = profileData?.profile?.onboard_step;
        if (step && step !== "complete") {
            router.replace(STEP_ROUTE_MAP[step] || "/profile");
        }
    }, [profileLoading, profileData, router]);

    if (profileLoading) {
        return (
            <div className="min-h-dvh bg-[var(--background)] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Don't render if we're about to redirect to onboarding
    const onboardStep = profileData?.profile?.onboard_step;
    if (onboardStep && onboardStep !== "complete") {
        return (
            <div className="min-h-dvh bg-[var(--background)] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const profile = profileData?.profile;
    const fullName = profile
        ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
        : "";
    const traits = [
        ...(hobbies?.tags || []),
        ...(skills?.tags || []),
    ];
    const intents = intent?.intents || [];
    const offersList = offers || [];
    const promptsList = prompts || [];

    // Use first prompt or fall back to bio for the "My Latest Obsession" section
    const mainPrompt = promptsList.find((p) => p.answer?.trim());
    const obsessionTitle = mainPrompt?.prompt_text || (profile?.bio ? "About Me" : null);
    const obsessionText = mainPrompt?.answer || profile?.bio;

    const photoUrl = profile?.photo_url;
    const initials = fullName
        ? fullName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
        : "?";

    const headline = profile?.headline ||
        (profile?.occupation && profile?.company
            ? `${profile.occupation} at ${profile.company}`
            : profile?.occupation || "");

    return (
        <div className="min-h-dvh bg-[#f8f7f6] flex flex-col items-center">
            {/* Page wrapper - mobile constrained */}
            <div className="w-full max-w-[390px] mx-auto flex flex-col min-h-dvh relative">

                {/* Yellow top status bar */}
                <div className="w-full bg-[#ffeea5] flex items-center justify-center px-3 py-3 shrink-0">
                    <p className="text-2xl font-semibold font-sans text-black text-center">
                        User Profile
                    </p>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto pb-20">

                    {/* Profile Header */}
                    <div className="flex items-center justify-between px-6 pt-4 pb-2 relative">
                        {/* + Diamond button */}
                        <button
                            className="w-[49px] h-[49px] flex items-center justify-center"
                            onClick={() => router.push("/connections")}
                            aria-label="Add connection"
                        >
                            <div className="w-[34px] h-[34px] bg-[#f8f7f6] border border-[rgba(180,83,42,0.5)] rounded-[6px] rotate-45 flex items-center justify-center shadow-sm">
                                <Plus size={14} className="text-[#d8602e] -rotate-45" />
                            </div>
                        </button>

                        {/* Title */}
                        <h1 className="font-serif font-semibold text-[22px] leading-[30px] text-[#181412] text-center">
                            My Profile
                        </h1>

                        {/* Settings */}
                        <div ref={settingsRef} className="relative">
                            <button
                                className="w-[49px] h-[49px] flex items-center justify-center"
                                onClick={() => setSettingsOpen((o) => !o)}
                                aria-label="Settings"
                            >
                                <Settings
                                    size={24}
                                    className="text-[#453933]"
                                    strokeWidth={1.5}
                                />
                            </button>
                            {settingsOpen && (
                                <div className="absolute right-0 top-full mt-1 bg-white rounded-2xl shadow-[0_4px_16px_0_rgba(0,0,0,0.12)] overflow-hidden z-50 min-w-[160px]">
                                    <button
                                        className="flex items-center gap-3 w-full px-4 py-3 text-left text-[15px] font-sans font-medium text-[#453933] hover:bg-[#f5efe6] transition-colors"
                                        onClick={() => {
                                            setSettingsOpen(false);
                                            logout();
                                        }}
                                    >
                                        <LogOut size={16} className="text-[#d8602e]" />
                                        Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Profile Photo Area */}
                    <div className="flex justify-center px-6 pb-4 relative">
                        {/* QR icon - top left of photo area */}

                        {/* Photo */}
                        <div className="relative">
                            <div className="w-[146px] h-[146px] rounded-full overflow-hidden border-2 border-[rgba(180,83,42,0.2)] bg-[#e8ddd7]">
                                {photoUrl ? (
                                    <img
                                        src={photoUrl}
                                        alt={fullName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-4xl font-serif font-bold text-[#b4532a]">
                                            {initials}
                                        </span>
                                    </div>
                                )}
                            </div>
                            {/* QR code button overlay */}
                            <button
                                className="absolute bottom-0 right-0 translate-x-1 translate-y-1 w-[52px] h-[52px] flex items-center justify-center"
                                aria-label="Show QR code"
                                title="QR code - coming soon"
                            >
                                <div className="w-[40px] h-[40px] bg-[#f8f7f6] border border-[rgba(180,83,42,0.5)] rounded-[6px] rotate-45 flex items-center justify-center shadow-sm">
                                    <QrCode size={16} className="text-[#d8602e] -rotate-45" />
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Name + Kode + Occupation */}
                    <div className="flex flex-col gap-2 items-center px-6 pb-4">
                        {/* Name + Kode badge */}
                        <div className="flex items-center gap-2 justify-center flex-wrap">
                            <h2 className="font-serif font-semibold text-[35px] leading-[44px] text-[#181412] whitespace-nowrap">
                                {fullName || "Your Name"}
                            </h2>
                            {kode?.archetype && (
                                <div className="flex items-center gap-1 bg-[#d8602e] rounded-full px-3 h-6 mt-1 shrink-0">
                                    <User size={12} className="text-white" strokeWidth={2} />
                                    <span className="text-[12px] font-semibold font-sans text-white whitespace-nowrap">
                                        {kode.archetype}
                                    </span>
                                </div>
                            )}
                        </div>
                        {/* Occupation */}
                        {headline && (
                            <p className="text-[18px] font-sans font-normal leading-[27px] text-[#715e55] text-center">
                                {headline}
                            </p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 px-6 pb-6">
                        <button
                            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full border border-[#b4532a]"
                            onClick={() => router.push("/connections")}
                        >
                            <Pencil size={18} className="text-[#b4532a]" strokeWidth={1.5} />
                            <span className="text-[16px] font-semibold font-sans text-[#b4532a]">
                                Edit Profile
                            </span>
                        </button>
                        <button
                            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#d8602e] shadow-[0_0_10px_0_rgba(255,144,97,0.8)]"
                            onClick={() => router.push("/connections")}
                        >
                            <Users size={18} className="text-white" strokeWidth={1.5} />
                            <span className="text-[16px] font-semibold font-sans text-white">
                                Connections
                            </span>
                        </button>
                    </div>

                    {/* Traits Section */}
                    {traits.length > 0 && (
                        <div className="flex flex-col gap-2 px-6 pb-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-serif font-medium text-[22px] leading-[30px] text-[#181412]">
                                    Traits
                                </h3>
                                <button className="flex items-center gap-0.5">
                                    <span className="text-[12px] font-semibold font-sans text-[#d8602e]">
                                        View All
                                    </span>
                                    <ChevronRight size={16} className="text-[#d8602e]" strokeWidth={2} />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {traits.slice(0, 6).map((tag) => (
                                    <div
                                        key={tag}
                                        className="flex items-center gap-2 h-8 px-3 py-2 rounded-full bg-[#f8f7f6] border border-[rgba(180,83,42,0.5)]"
                                    >
                                        <span className="text-[12px] font-semibold font-sans text-[#453933] whitespace-nowrap">
                                            {tag}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* My Latest Obsession / Prompt Section */}
                    {obsessionText && (
                        <div className="flex flex-col gap-2 px-6 pb-6">
                            <h3 className="font-serif font-medium text-[22px] leading-[30px] text-[#181412]">
                                {obsessionTitle}
                            </h3>
                            <p className="text-[16px] font-sans font-normal leading-[24px] text-[#453933]">
                                {obsessionText}
                            </p>
                        </div>
                    )}

                    {/* Looking For Section */}
                    {intents.length > 0 && (
                        <div className="flex flex-col gap-3 px-6 pb-6">
                            <h3 className="font-serif font-medium text-[22px] leading-[30px] text-[#181412]">
                                Looking For
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {intents.map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-center h-9 px-3 py-2 rounded-full bg-[#ffefe5] border border-[rgba(180,83,42,0.5)]"
                                    >
                                        <span className="text-[12px] font-semibold font-sans text-[#b4532a] whitespace-nowrap">
                                            {item}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Connect With Me For Section */}
                    {offersList.length > 0 && (
                        <div className="flex flex-col gap-3 px-6 pb-6">
                            <h3 className="font-serif font-medium text-[22px] leading-[30px] text-[#181412]">
                                Connect With Me For...
                            </h3>
                            <div className="flex gap-4">
                                {offersList.slice(0, 2).map((offer, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 flex flex-col gap-4 px-4 py-5 rounded-3xl bg-white shadow-[0_0_2px_0_rgba(0,0,0,0.25)]"
                                    >
                                        <div className="w-8 h-8 flex items-center justify-center text-[#d8602e]">
                                            <Pencil size={28} strokeWidth={1.5} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <p className="text-[16px] font-semibold font-sans leading-[24px] text-[#181412]">
                                                {offer.title}
                                            </p>
                                            <p className="text-[16px] font-sans font-normal leading-[24px] text-[#453933]">
                                                {offer.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Empty state if nothing to show */}
                    {traits.length === 0 && !obsessionText && intents.length === 0 && offersList.length === 0 && (
                        <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
                            <p className="text-[16px] font-sans text-[#715e55]">
                                Your profile is being set up.
                            </p>
                        </div>
                    )}
                </div>

                {/* Bottom Nav */}
                <BottomNav />
            </div>
        </div>
    );
}
