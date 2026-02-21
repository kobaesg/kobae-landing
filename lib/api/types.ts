// ── Onboard Steps ─────────────────────────────────────────

export type OnboardStep =
    | "account_created"
    | "profile_filled"
    | "hobbies_set"
    | "skills_set"
    | "intent_set"
    | "bio_set"
    | "questionnaire_done"
    | "kode_calculated"
    | "complete";

// Ordered progression for step guards
export const ONBOARD_STEP_ORDER: OnboardStep[] = [
    "account_created",
    "profile_filled",
    "hobbies_set",
    "skills_set",
    "intent_set",
    "bio_set",
    "questionnaire_done",
    "kode_calculated",
    "complete",
];

// Map each onboard step to its corresponding route
export const STEP_ROUTE_MAP: Record<OnboardStep, string> = {
    account_created: "/profile",
    profile_filled: "/hobbies",
    hobbies_set: "/skills",
    skills_set: "/intent",
    intent_set: "/offers",
    bio_set: "/questionnaire",
    questionnaire_done: "/result",
    kode_calculated: "/complete",
    complete: "/complete",
};

// ── Auth ──────────────────────────────────────────────────

export interface SignupRequest {
    email: string;
    phone: string;
    password: string;
    terms_accepted: boolean;
}

export interface LoginRequest {
    identifier: string;
}

export interface VerifyOTPRequest {
    phone: string;
    code: string;
}

export interface ResendOTPRequest {
    phone: string;
}

export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user: User;
}

export interface OTPResponse {
    message: string;
    expires_in: number;
}

// ── User & Profile ────────────────────────────────────────

export interface User {
    id: string;
    email: string;
    phone: string;
    is_verified: boolean;
    terms_accepted_at?: string;
    created_at: string;
    updated_at: string;
}

export interface Profile {
    id: string;
    user_id: string;
    first_name?: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    bio?: string;
    occupation?: string;
    company?: string;
    headline?: string;
    onboard_step: OnboardStep;
    created_at: string;
    updated_at: string;
}

export interface ProfileResponse {
    profile: Profile;
    user: User;
}

export interface CreateProfileRequest {
    first_name: string;
    last_name: string;
    username: string;
    headline?: string;
}

export interface UpdateProfileRequest {
    first_name?: string;
    last_name?: string;
    username?: string;
    bio?: string;
    occupation?: string;
    company?: string;
    headline?: string;
}

export interface UpdateBioRequest {
    bio: string;
}

export interface UploadPhotoResponse {
    photo_url: string;
    message: string;
}

// ── Tags ──────────────────────────────────────────────────

export interface TagsResponse {
    tags: string[];
}

export interface UpdateTagsRequest {
    tags: string[];
}

// ── Questionnaire ─────────────────────────────────────────

export interface Question {
    id: number;
    order_num: number;
    section: string;
    text: string;
    type: "single_choice" | "slider";
    options?: QuestionOption[];
    slider_min?: number;
    slider_max?: number;
    slider_labels?: [string, string];
}

export interface QuestionOption {
    key: string;
    text: string;
}

export interface SubmitAnswerRequest {
    question_id: number;
    answer: string;
}

export interface BulkSubmitRequest {
    answers: SubmitAnswerRequest[];
}

export interface QuestionnaireResultResponse {
    attribute_scores: AttributeProfile;
    progress: number;
}

// ── Kode ──────────────────────────────────────────────────

export interface AttributeProfile {
    STB: number;
    ATT: number;
    RCH: number;
    DRV: number;
    DEP: number;
    SPK: number;
}

export interface KodeResponse {
    raw_scores: AttributeProfile;
    normalised_scores: AttributeProfile;
    top_attributes: [string, string];
    archetype: string;
    description: string;
    calculated_at: string;
}

// ── Intent ────────────────────────────────────────────────

export interface IntentResponse {
    intents: string[];
}

export interface UpdateIntentRequest {
    intents: string[];
}

// ── Prompts ───────────────────────────────────────────────

export interface UserPromptResponse {
    prompt_id: number;
    prompt_text: string;
    answer: string;
}

export interface UpdateUserPromptRequest {
    prompt_id: number;
    answer: string;
}

// ── Offers ────────────────────────────────────────────────

export interface OfferResponse {
    title: string;
    description: string;
}

export interface UpdateOffersRequest {
    offers: { title: string; description: string }[];
}

// ── API Error ─────────────────────────────────────────────

export interface ApiError {
    error: {
        code: string;
        message: string;
    };
    details?: string;
}
