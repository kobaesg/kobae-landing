import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Kobae - Onboarding",
};

export default function OnboardingGroupLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
