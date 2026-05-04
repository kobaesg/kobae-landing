import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ── Passcode Gate Configuration ────────────────────────────
export const PASSCODE_ENABLED =
    process.env.NEXT_PUBLIC_SIGNUP_PASSCODE_ENABLED === "true";
export const PASSCODE_VALUE =
    process.env.NEXT_PUBLIC_SIGNUP_PASSCODE || "123456";

// ── Rate Limiting Configuration ────────────────────────────
const MAX_ATTEMPTS_BEFORE_LOCKOUT = 5;
const BASE_LOCKOUT_SECONDS = 30; // 30 seconds initial lockout
const MAX_LOCKOUT_SECONDS = 900; // 15 minutes max lockout

// ── Store Types ────────────────────────────────────────────
interface PasscodeState {
    isVerified: boolean;
    failedAttempts: number;
    lockoutUntil: number | null; // Unix timestamp in ms
    lockoutCount: number; // Number of times user has been locked out
    setVerified: (verified: boolean) => void;
    recordFailedAttempt: () => void;
    resetAttempts: () => void;
    reset: () => void;
}

// ── Store ──────────────────────────────────────────────────
export const usePasscodeStore = create<PasscodeState>()(
    persist(
        (set, get) => ({
            isVerified: false,
            failedAttempts: 0,
            lockoutUntil: null,
            lockoutCount: 0,

            setVerified: (verified) =>
                set({
                    isVerified: verified,
                    failedAttempts: 0,
                    lockoutUntil: null,
                    lockoutCount: 0,
                }),

            recordFailedAttempt: () => {
                const { failedAttempts, lockoutCount } = get();
                const newAttempts = failedAttempts + 1;

                if (newAttempts >= MAX_ATTEMPTS_BEFORE_LOCKOUT) {
                    // Calculate lockout duration with exponential backoff
                    const lockoutSeconds = Math.min(
                        BASE_LOCKOUT_SECONDS * Math.pow(2, lockoutCount),
                        MAX_LOCKOUT_SECONDS
                    );
                    const lockoutUntil = Date.now() + lockoutSeconds * 1000;

                    set({
                        failedAttempts: 0,
                        lockoutUntil,
                        lockoutCount: lockoutCount + 1,
                    });
                } else {
                    set({ failedAttempts: newAttempts });
                }
            },

            resetAttempts: () =>
                set({
                    failedAttempts: 0,
                    lockoutUntil: null,
                }),

            reset: () =>
                set({
                    isVerified: false,
                    failedAttempts: 0,
                    lockoutUntil: null,
                    lockoutCount: 0,
                }),
        }),
        {
            name: "kobae-passcode-gate",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);

// ── Helper Functions ───────────────────────────────────────

/**
 * Check if the passcode gate is enabled and user needs to verify
 */
export function requiresPasscodeVerification(isVerified: boolean): boolean {
    return PASSCODE_ENABLED && !isVerified;
}

/**
 * Validate a passcode against the configured value
 */
export function validatePasscode(input: string): boolean {
    return input === PASSCODE_VALUE;
}

/**
 * Check if user is currently locked out
 */
export function isLockedOut(lockoutUntil: number | null): boolean {
    if (!lockoutUntil) return false;
    return Date.now() < lockoutUntil;
}

/**
 * Get remaining lockout time in seconds
 */
export function getRemainingLockoutSeconds(lockoutUntil: number | null): number {
    if (!lockoutUntil) return 0;
    const remaining = Math.ceil((lockoutUntil - Date.now()) / 1000);
    return Math.max(0, remaining);
}

/**
 * Format seconds into a human-readable string (e.g., "1:30" or "0:05")
 */
export function formatLockoutTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Get remaining attempts before lockout
 */
export function getRemainingAttempts(failedAttempts: number): number {
    return Math.max(0, MAX_ATTEMPTS_BEFORE_LOCKOUT - failedAttempts);
}