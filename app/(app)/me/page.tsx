"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Settings, ChevronRight, LogOut, Pencil, Users, QrCode, Plus, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
import { STEP_ROUTE_MAP } from "@/lib/api/types";

type Tab = "traits" | "about" | "connect";

const TABS: { id: Tab; label: string }[] = [
    { id: "traits", label: "Traits" },
    { id: "about", label: "About" },
    { id: "connect", label: "Connect" },
];

const INTENT_LABELS: Record<string, string> = {
    up_and_comers: "Up-and-Comers",
    role_models: "Role Models",
    door_openers: "Door-Openers",
    collaborators: "Collaborators",
    anyone_whos_vibing: "Anyone who's Vibing",
};

export default function MyProfilePage() {
    const { isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [photoError, setPhotoError] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>("traits");
    const [tabDirection, setTabDirection] = useState(0);
    const settingsRef = useRef<HTMLDivElement>(null);

    const handleTabChange = (newTab: Tab) => {
        const oldIdx = TABS.findIndex((t) => t.id === activeTab);
        const newIdx = TABS.findIndex((t) => t.id === newTab);
        setTabDirection(newIdx > oldIdx ? 1 : -1);
        setActiveTab(newTab);
    };

    const { data: profileData, isLoading: profileLoading } = useProfile(isAuthenticated);
    const { data: kode } = useKodeResult(isAuthenticated);
    const { data: hobbies } = useHobbies(isAuthenticated);
    const { data: skills } = useSkills(isAuthenticated);
    const { data: intent } = useIntent(isAuthenticated);
    const { data: offers } = useOffers(isAuthenticated);
    const { data: prompts } = usePrompts(isAuthenticated);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
                setSettingsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const DONE_STEPS = ["complete", "kode_calculated"];
    useEffect(() => {
        if (profileLoading) return;
        const step = profileData?.profile?.onboard_step;
        if (step && !DONE_STEPS.includes(step)) {
            router.replace(STEP_ROUTE_MAP[step] || "/profile");
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profileLoading, profileData, router]);

    if (profileLoading) {
        return (
            <div className="min-h-dvh bg-[#f8f7f6] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#d8602e] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const onboardStep = profileData?.profile?.onboard_step;
    if (onboardStep && !DONE_STEPS.includes(onboardStep)) {
        return (
            <div className="min-h-dvh bg-[#f8f7f6] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[#d8602e] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    const profile = profileData?.profile;
    const fullName = profile
        ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
        : "";
    const traits = [...(hobbies?.tags || []), ...(skills?.tags || [])];
    const intents = intent?.intents || [];
    const offersList = offers || [];
    const promptsList = prompts || [];

    const mainPrompt = promptsList.find((p) => p.answer?.trim());
    const obsessionTitle = mainPrompt?.prompt_text || (profile?.bio ? "About Me" : null);
    const obsessionText = mainPrompt?.answer || profile?.bio;

    const photoUrl = profile?.photo_url;
    const initials = fullName
        ? fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : "?";

    const headline =
        profile?.headline ||
        (profile?.occupation && profile?.company
            ? `${profile.occupation} at ${profile.company}`
            : profile?.occupation || "");

    return (
        <div className="min-h-dvh bg-[#f8f7f6]">
            {/* Page header */}
            <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="sticky top-0 z-30 bg-[#f8f7f6]/95 backdrop-blur border-b border-[#e8e0da] px-6 md:px-10 h-14 flex items-center justify-between"
            >
                <h1 className="font-serif font-semibold text-[20px] text-[#181412]">My Profile</h1>
                <div ref={settingsRef} className="relative flex items-center gap-2">
                    {/* Desktop extras in header */}
                    <div className="hidden md:flex items-center gap-2">
                        <button
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold font-sans text-[#453933] hover:bg-[#f0e8e0] transition-colors"
                            onClick={() => router.push("/connections")}
                        >
                            <Plus size={15} /> Add Connection
                        </button>
                    </div>
                    {/* Settings button */}
                    <button
                        onClick={() => setSettingsOpen((o) => !o)}
                        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f0e8e0] transition-colors"
                        aria-label="Settings"
                    >
                        <Settings size={20} className="text-[#453933]" strokeWidth={1.5} />
                    </button>
                    <AnimatePresence>
                        {settingsOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 top-full mt-1 bg-white rounded-2xl shadow-[0_4px_16px_0_rgba(0,0,0,0.12)] overflow-hidden z-50 min-w-[160px]"
                            >
                                <button
                                    className="flex items-center gap-3 w-full px-4 py-3 text-left text-[15px] font-sans font-medium text-[#453933] hover:bg-[#f5efe6] transition-colors"
                                    onClick={() => { setSettingsOpen(false); logout(); }}
                                >
                                    <LogOut size={16} className="text-[#d8602e]" />
                                    Log Out
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Page body */}
            <div className="max-w-5xl mx-auto px-6 md:px-10 py-8">
                <div className="flex flex-col md:flex-row gap-8 md:gap-12">

                    {/* ── Left column: profile card ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="flex flex-col items-center md:items-start gap-5 md:w-64 shrink-0"
                    >
                        {/* Photo */}
                        <div className="relative">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
                                className="w-[140px] h-[140px] rounded-full overflow-hidden border-2 border-[rgba(180,83,42,0.2)] bg-[#e8ddd7]"
                            >
                                {photoUrl && !photoError ? (
                                    <img src={photoUrl} alt={fullName} className="w-full h-full object-cover" onError={() => setPhotoError(true)} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="text-4xl font-serif font-bold text-[#b4532a]">{initials}</span>
                                    </div>
                                )}
                            </motion.div>
                            <button
                                className="absolute bottom-0 right-0 translate-x-1 translate-y-1 w-10 h-10 flex items-center justify-center"
                                aria-label="QR code"
                                title="QR code - coming soon"
                            >
                                <div className="w-8 h-8 bg-white border border-[rgba(180,83,42,0.5)] rounded-[5px] rotate-45 flex items-center justify-center shadow-sm">
                                    <QrCode size={14} className="text-[#d8602e] -rotate-45" />
                                </div>
                            </button>
                        </div>

                        {/* Name + kode */}
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: 0.18 }}
                            className="flex flex-col items-center md:items-start gap-1.5 text-center md:text-left"
                        >
                            <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
                                <h2 className="font-serif font-semibold text-[28px] md:text-[30px] leading-tight text-[#181412]">
                                    {fullName || "Your Name"}
                                </h2>
                            </div>
                            {kode?.archetype && (
                                <div className="flex items-center gap-1 bg-[#d8602e] rounded-full px-2.5 h-6 w-fit">
                                    <User size={11} className="text-white" strokeWidth={2} />
                                    <span className="text-[11px] font-semibold font-sans text-white whitespace-nowrap">
                                        {kode.archetype}
                                    </span>
                                </div>
                            )}
                            {headline && (
                                <p className="text-[15px] font-sans text-[#715e55]">{headline}</p>
                            )}
                        </motion.div>

                        {/* Action buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: 0.26 }}
                            className="flex gap-2 w-full"
                        >
                            <button
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full border border-[#b4532a] hover:bg-[#fff5ef] transition-colors"
                                onClick={() => router.push("/connections")}
                            >
                                <Pencil size={14} className="text-[#b4532a]" strokeWidth={1.5} />
                                <span className="text-[13px] font-semibold font-sans text-[#b4532a]">Edit Profile</span>
                            </button>
                            <button
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-[#d8602e] hover:bg-[#c55528] shadow-[0_0_10px_0_rgba(255,144,97,0.5)] transition-colors"
                                onClick={() => router.push("/connections")}
                            >
                                <Users size={14} className="text-white" strokeWidth={1.5} />
                                <span className="text-[13px] font-semibold font-sans text-white">Connections</span>
                            </button>
                        </motion.div>

                        {/* Mobile: add connection */}
                        <button
                            className="md:hidden flex items-center gap-2 w-full justify-center py-2 px-3 rounded-full border border-[rgba(180,83,42,0.4)] text-[13px] font-semibold font-sans text-[#453933]"
                            onClick={() => router.push("/connections")}
                        >
                            <Plus size={14} /> Add Connection
                        </button>
                    </motion.div>

                    {/* ── Right column: tabbed sections ── */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut", delay: 0.05 }}
                        className="flex-1 flex flex-col gap-0 min-w-0"
                    >
                        {/* Tab bar */}
                        <div className="flex items-center gap-0 mb-6 border-b border-[#e8e0da] relative">
                            {TABS.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => handleTabChange(tab.id)}
                                    className={`relative px-4 py-2.5 text-[14px] font-semibold font-sans transition-colors ${
                                        activeTab === tab.id
                                            ? "text-[#d8602e]"
                                            : "text-[#715e55] hover:text-[#453933]"
                                    }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <motion.div
                                            layoutId="tab-indicator"
                                            className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#d8602e] rounded-full"
                                            transition={{ type: "spring", stiffness: 500, damping: 35 }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab content */}
                        <div className="relative overflow-hidden">
                            <AnimatePresence mode="wait" initial={false} custom={tabDirection}>
                                <motion.div
                                    key={activeTab}
                                    custom={tabDirection}
                                    variants={{
                                        enter: (dir: number) => ({
                                            x: dir > 0 ? 40 : -40,
                                            opacity: 0,
                                        }),
                                        center: { x: 0, opacity: 1 },
                                        exit: (dir: number) => ({
                                            x: dir > 0 ? -40 : 40,
                                            opacity: 0,
                                        }),
                                    }}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.25, ease: "easeInOut" }}
                                    className="flex flex-col gap-8"
                                >
                                    {/* ── TRAITS TAB ── */}
                                    {activeTab === "traits" && (
                                        <>
                                            {traits.length > 0 ? (
                                                <section>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h3 className="font-serif font-medium text-[20px] text-[#181412]">Traits</h3>
                                                        <button className="flex items-center gap-0.5 text-[#d8602e]">
                                                            <span className="text-[12px] font-semibold font-sans">View All</span>
                                                            <ChevronRight size={14} strokeWidth={2} />
                                                        </button>
                                                    </div>
                                                    <motion.div
                                                        className="flex flex-wrap gap-2"
                                                        initial="hidden"
                                                        animate="visible"
                                                        variants={{
                                                            hidden: {},
                                                            visible: { transition: { staggerChildren: 0.04 } },
                                                        }}
                                                    >
                                                        {traits.map((tag) => (
                                                            <motion.div
                                                                key={tag}
                                                                variants={{
                                                                    hidden: { opacity: 0, scale: 0.85 },
                                                                    visible: { opacity: 1, scale: 1 },
                                                                }}
                                                                transition={{ duration: 0.2 }}
                                                                className="flex items-center h-8 px-3 rounded-full bg-white border border-[rgba(180,83,42,0.4)] shadow-sm"
                                                            >
                                                                <span className="text-[13px] font-semibold font-sans text-[#453933]">{tag}</span>
                                                            </motion.div>
                                                        ))}
                                                    </motion.div>
                                                </section>
                                            ) : (
                                                <div className="flex flex-col items-center gap-4 py-16 text-center">
                                                    <p className="text-[15px] font-sans text-[#715e55]">No traits added yet.</p>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {/* ── ABOUT TAB ── */}
                                    {activeTab === "about" && (
                                        <>
                                            {obsessionText ? (
                                                <section>
                                                    <h3 className="font-serif font-medium text-[20px] text-[#181412] mb-2">
                                                        {obsessionTitle}
                                                    </h3>
                                                    <p className="text-[15px] font-sans leading-[24px] text-[#453933]">{obsessionText}</p>
                                                </section>
                                            ) : (
                                                <div className="flex flex-col items-center gap-4 py-16 text-center">
                                                    <p className="text-[15px] font-sans text-[#715e55]">Nothing shared yet.</p>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {/* ── CONNECT TAB ── */}
                                    {activeTab === "connect" && (
                                        <>
                                            {intents.length > 0 && (
                                                <section>
                                                    <h3 className="font-serif font-medium text-[20px] text-[#181412] mb-3">Looking For</h3>
                                                    <motion.div
                                                        className="flex flex-wrap gap-2"
                                                        initial="hidden"
                                                        animate="visible"
                                                        variants={{
                                                            hidden: {},
                                                            visible: { transition: { staggerChildren: 0.06 } },
                                                        }}
                                                    >
                                                        {intents.map((item) => (
                                                            <motion.div
                                                                key={item}
                                                                variants={{
                                                                    hidden: { opacity: 0, y: 6 },
                                                                    visible: { opacity: 1, y: 0 },
                                                                }}
                                                                transition={{ duration: 0.2 }}
                                                                className="flex items-center h-8 px-3 rounded-full bg-[#ffefe5] border border-[rgba(180,83,42,0.4)]"
                                                            >
                                                                <span className="text-[13px] font-semibold font-sans text-[#b4532a]">{INTENT_LABELS[item] ?? item}</span>
                                                            </motion.div>
                                                        ))}
                                                    </motion.div>
                                                </section>
                                            )}
                                            {offersList.length > 0 && (
                                                <section>
                                                    <h3 className="font-serif font-medium text-[20px] text-[#181412] mb-3">Connect With Me For...</h3>
                                                    <motion.div
                                                        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                                                        initial="hidden"
                                                        animate="visible"
                                                        variants={{
                                                            hidden: {},
                                                            visible: { transition: { staggerChildren: 0.08 } },
                                                        }}
                                                    >
                                                        {offersList.map((offer, i) => (
                                                            <motion.div
                                                                key={i}
                                                                variants={{
                                                                    hidden: { opacity: 0, y: 12 },
                                                                    visible: { opacity: 1, y: 0 },
                                                                }}
                                                                transition={{ duration: 0.25 }}
                                                                className="flex flex-col gap-3 p-5 rounded-2xl bg-white shadow-[0_1px_4px_0_rgba(0,0,0,0.08)] border border-[#f0e8e0]"
                                                            >
                                                                <div className="w-8 h-8 text-[#d8602e]">
                                                                    <Pencil size={28} strokeWidth={1.5} />
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <p className="text-[15px] font-semibold font-sans text-[#181412]">{offer.title}</p>
                                                                    <p className="text-[14px] font-sans text-[#453933] leading-[22px]">{offer.description}</p>
                                                                </div>
                                                            </motion.div>
                                                        ))}
                                                    </motion.div>
                                                </section>
                                            )}
                                            {intents.length === 0 && offersList.length === 0 && (
                                                <div className="flex flex-col items-center gap-4 py-16 text-center">
                                                    <p className="text-[15px] font-sans text-[#715e55]">Nothing added yet.</p>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
