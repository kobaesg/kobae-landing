"use client";

import { OnboardingLayout } from "@/components/onboarding";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TermsPage() {
    const router = useRouter();

    return (
        <OnboardingLayout showBack={true} showLogo={true}>
            <div className="pt-6 space-y-6 pb-10">
                <h1 className="text-2xl font-serif font-bold text-[var(--foreground)]">
                    Terms & Conditions
                </h1>

                <div className="prose prose-sm text-[var(--text-400)] font-sans space-y-4">
                    <p>
                        Welcome to Kobae. By using our platform, you agree to
                        the following terms and conditions. Please read them
                        carefully.
                    </p>

                    <h3 className="text-lg font-serif font-bold text-[var(--foreground)]">
                        1. Acceptance of Terms
                    </h3>
                    <p>
                        By accessing or using Kobae, you agree to be bound by
                        these Terms & Conditions and our Privacy Policy. If you
                        do not agree, please do not use the platform.
                    </p>

                    <h3 className="text-lg font-serif font-bold text-[var(--foreground)]">
                        2. User Accounts
                    </h3>
                    <p>
                        You must provide accurate information when creating an
                        account. You are responsible for maintaining the
                        confidentiality of your account credentials.
                    </p>

                    <h3 className="text-lg font-serif font-bold text-[var(--foreground)]">
                        3. Acceptable Use
                    </h3>
                    <p>
                        You agree to use Kobae for lawful purposes only. You may
                        not misuse the platform, harass other users, or engage
                        in fraudulent activity.
                    </p>

                    <h3 className="text-lg font-serif font-bold text-[var(--foreground)]">
                        4. Privacy
                    </h3>
                    <p>
                        Your privacy is important to us. Please review our
                        Privacy Policy to understand how we collect, use, and
                        protect your personal information.
                    </p>

                    <h3 className="text-lg font-serif font-bold text-[var(--foreground)]">
                        5. Changes to Terms
                    </h3>
                    <p>
                        We may update these terms from time to time. Continued
                        use of the platform after changes constitutes acceptance
                        of the new terms.
                    </p>
                </div>
            </div>
        </OnboardingLayout>
    );
}
