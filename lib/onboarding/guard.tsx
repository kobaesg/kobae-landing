"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/lib/api/hooks";
import { useAuth } from "@/lib/auth/context";
import { OnboardStep, STEP_ROUTE_MAP, ONBOARD_STEP_ORDER } from "@/lib/api/types";

/**
 * Returns the correct route for a given onboard step.
 */
export function getRouteForStep(step: OnboardStep): string {
    return STEP_ROUTE_MAP[step] || "/profile";
}

/**
 * Returns whether `currentStep` has reached or passed `requiredStep`
 */
export function hasReachedStep(
    currentStep: OnboardStep,
    requiredStep: OnboardStep
): boolean {
    const currentIdx = ONBOARD_STEP_ORDER.indexOf(currentStep);
    const requiredIdx = ONBOARD_STEP_ORDER.indexOf(requiredStep);
    return currentIdx >= requiredIdx;
}

/**
 * Hook that guards onboarding routes. Redirects to the correct step
 * if the user tries to skip ahead.
 *
 * @param requiredStep - The minimum onboard_step needed to access this page
 */
export function useOnboardingGuard(requiredStep: OnboardStep) {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const { data: profileData, isLoading: profileLoading } = useProfile(isAuthenticated);

    useEffect(() => {
        if (authLoading || profileLoading) return;

        if (!isAuthenticated) {
            router.replace("/login");
            return;
        }

        if (profileData === null || !profileData?.profile) {
            // No profile yet — redirect to profile creation unless we're already there
            if (requiredStep !== "account_created") {
                router.replace("/profile");
            }
            return;
        }

        const currentStep = profileData.profile.onboard_step;
        if (!hasReachedStep(currentStep, requiredStep)) {
            // Redirect to the correct step
            router.replace(getRouteForStep(currentStep));
        }
    }, [
        authLoading,
        profileLoading,
        isAuthenticated,
        profileData,
        requiredStep,
        router,
    ]);

    return {
        isReady:
            !authLoading &&
            !profileLoading &&
            isAuthenticated &&
            // profileData is undefined while loading, null when no profile exists, or a ProfileResponse
            profileData !== undefined,
        profile: profileData?.profile,
        user: profileData?.user,
    };
}
