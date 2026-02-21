import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Kobae - Get Started",
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
