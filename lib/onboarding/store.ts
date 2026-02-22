import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ── Draft types for each onboarding page ──────────────────

interface SignupDraft {
    email: string;
    phone: string;
    password: string;
}

interface ProfileDraft {
    first_name: string;
    last_name: string;
    username: string;
    headline: string;
    photoPreviewUrl: string | null; // data URI for preview only
}

interface HobbiesDraft {
    selectedTags: string[];
    introSeen: boolean;
}

interface SkillsDraft {
    selectedTags: string[];
}

interface IntentDraft {
    selectedIntents: string[];
}

interface OfferEntry {
    title: string;
    description: string;
}

interface OffersDraft {
    offers: OfferEntry[];
}

interface BioDraft {
    bio: string;
    selectedPrompts: number[];
    answers: Record<number, string>;
}

interface QuestionnaireDraft {
    answers: Record<number, string>;
    currentSectionIndex: number;
    introSeen: boolean;
}

// ── Store shape ───────────────────────────────────────────

interface OnboardingDraftState {
    signup: SignupDraft;
    profile: ProfileDraft;
    hobbies: HobbiesDraft;
    skills: SkillsDraft;
    intent: IntentDraft;
    offers: OffersDraft;
    bio: BioDraft;
    questionnaire: QuestionnaireDraft;

    // Setters (partial updates per slice)
    setSignup: (data: Partial<SignupDraft>) => void;
    setProfile: (data: Partial<ProfileDraft>) => void;
    setHobbies: (data: Partial<HobbiesDraft>) => void;
    setSkills: (data: Partial<SkillsDraft>) => void;
    setIntent: (data: Partial<IntentDraft>) => void;
    setOffers: (data: Partial<OffersDraft>) => void;
    setBio: (data: Partial<BioDraft>) => void;
    setQuestionnaire: (data: Partial<QuestionnaireDraft>) => void;

    // Per-slice clear
    clearSignup: () => void;
    clearProfile: () => void;
    clearHobbies: () => void;
    clearSkills: () => void;
    clearIntent: () => void;
    clearOffers: () => void;
    clearBio: () => void;
    clearQuestionnaire: () => void;

    // Global clear (on completion)
    clearAll: () => void;
}

// ── Defaults ──────────────────────────────────────────────

const defaultSignup: SignupDraft = { email: "", phone: "", password: "" };
const defaultProfile: ProfileDraft = {
    first_name: "",
    last_name: "",
    username: "",
    headline: "",
    photoPreviewUrl: null,
};
const defaultHobbies: HobbiesDraft = { selectedTags: [], introSeen: false };
const defaultSkills: SkillsDraft = { selectedTags: [] };
const defaultIntent: IntentDraft = { selectedIntents: [] };
const defaultOffers: OffersDraft = {
    offers: [{ title: "", description: "" }],
};
const defaultBio: BioDraft = { bio: "", selectedPrompts: [], answers: {} };
const defaultQuestionnaire: QuestionnaireDraft = {
    answers: {},
    currentSectionIndex: 0,
    introSeen: false,
};

// ── Store ─────────────────────────────────────────────────

export const useOnboardingDraft = create<OnboardingDraftState>()(
    persist(
        (set) => ({
            signup: defaultSignup,
            profile: defaultProfile,
            hobbies: defaultHobbies,
            skills: defaultSkills,
            intent: defaultIntent,
            offers: defaultOffers,
            bio: defaultBio,
            questionnaire: defaultQuestionnaire,

            setSignup: (data) =>
                set((s) => ({ signup: { ...s.signup, ...data } })),
            setProfile: (data) =>
                set((s) => ({ profile: { ...s.profile, ...data } })),
            setHobbies: (data) =>
                set((s) => ({ hobbies: { ...s.hobbies, ...data } })),
            setSkills: (data) =>
                set((s) => ({ skills: { ...s.skills, ...data } })),
            setIntent: (data) =>
                set((s) => ({ intent: { ...s.intent, ...data } })),
            setOffers: (data) =>
                set((s) => ({ offers: { ...s.offers, ...data } })),
            setBio: (data) =>
                set((s) => ({ bio: { ...s.bio, ...data } })),
            setQuestionnaire: (data) =>
                set((s) => ({
                    questionnaire: { ...s.questionnaire, ...data },
                })),

            clearSignup: () => set({ signup: defaultSignup }),
            clearProfile: () => set({ profile: defaultProfile }),
            clearHobbies: () => set({ hobbies: defaultHobbies }),
            clearSkills: () => set({ skills: defaultSkills }),
            clearIntent: () => set({ intent: defaultIntent }),
            clearOffers: () => set({ offers: defaultOffers }),
            clearBio: () => set({ bio: defaultBio }),
            clearQuestionnaire: () =>
                set({ questionnaire: defaultQuestionnaire }),

            clearAll: () =>
                set({
                    signup: defaultSignup,
                    profile: defaultProfile,
                    hobbies: defaultHobbies,
                    skills: defaultSkills,
                    intent: defaultIntent,
                    offers: defaultOffers,
                    bio: defaultBio,
                    questionnaire: defaultQuestionnaire,
                }),
        }),
        {
            name: "kobae-onboarding-draft",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
