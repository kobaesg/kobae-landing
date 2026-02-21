import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

const playfair = Playfair_Display({
    variable: "--font-playfair",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Kobae - Where Your Circles Meet",
    description:
        "Meet people through mutual friends and shared interests, and show up to real-world experiences together.",
    icons: {
        icon: "/resources/thumbnail.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${inter.variable} ${playfair.variable} antialiased`}
            >
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
