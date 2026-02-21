"use client";

import { OnboardingLayout } from "@/components/onboarding";

export default function PrivacyPage() {
    return (
        <OnboardingLayout showBack={true} showLogo={true}>
            <div className="pt-6 space-y-6 pb-10">
                <h1 className="text-2xl font-serif font-bold text-[var(--foreground)]">
                    Privacy Policy
                </h1>

                <div className="prose prose-sm text-[var(--text-400)] font-sans space-y-4">
                    <p>
                        At Kobae, we take your privacy seriously. This policy
                        explains how we collect, use, and protect your personal
                        data.
                    </p>

                    <h3 className="text-lg font-serif font-bold text-[var(--foreground)]">
                        1. Information We Collect
                    </h3>
                    <p>
                        We collect information you provide directly, such as
                        your name, email, phone number, profile details, and
                        questionnaire responses.
                    </p>

                    <h3 className="text-lg font-serif font-bold text-[var(--foreground)]">
                        2. How We Use Your Information
                    </h3>
                    <p>
                        We use your information to provide our services,
                        including profile matching, Social Kōde calculation, and
                        personalized recommendations.
                    </p>

                    <h3 className="text-lg font-serif font-bold text-[var(--foreground)]">
                        3. Data Security
                    </h3>
                    <p>
                        We implement industry-standard security measures to
                        protect your personal information from unauthorized
                        access, alteration, or disclosure.
                    </p>

                    <h3 className="text-lg font-serif font-bold text-[var(--foreground)]">
                        4. Data Sharing
                    </h3>
                    <p>
                        We do not sell your personal information. We may share
                        limited data with trusted service providers who help us
                        operate the platform.
                    </p>

                    <h3 className="text-lg font-serif font-bold text-[var(--foreground)]">
                        5. Your Rights
                    </h3>
                    <p>
                        You have the right to access, correct, or delete your
                        personal information at any time through your account
                        settings or by contacting us.
                    </p>
                </div>
            </div>
        </OnboardingLayout>
    );
}
