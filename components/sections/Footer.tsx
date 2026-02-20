"use client";

import { Instagram, Linkedin } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Footer() {
    return (
        <footer className="pt-14 pb-32 px-6 lg:px-32 bg-background">
            <div className="container mx-auto max-w-7xl">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-8">
                    {/* Logo & Contact Info */}
                    <div className="flex flex-col gap-4 w-full md:w-72">
                        <div className="flex items-center gap-3 h-[61px]">
                            <Image
                                src="/resources/main-logo.png"
                                alt="Kobae Logo"
                                width={175}
                                height={38}
                                className="h-10 w-auto"
                            />
                        </div>
                        <div className="flex flex-col gap-1 text-base text-foreground">
                            <p className="leading-6">Reach out to us at:</p>
                             <p className="leading-6">kobaepilot@gmail.com</p>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-col gap-1 text-base text-foreground">
                        <a
                            href="#"
                            className="hover:text-primary transition-colors leading-6"
                        >
                            Home
                        </a>
                        <a
                            href="#how-it-works"
                            className="hover:text-primary transition-colors leading-6"
                        >
                            How It Works
                        </a>
                        <a
                            href="#our-why"
                            className="hover:text-primary transition-colors leading-6"
                        >
                            Our Why
                        </a>
                        <a
                            href="#privacy"
                            className="hover:text-primary transition-colors leading-6"
                        >
                            Privacy Policy
                        </a>
                    </nav>
         
                    {/* Auth Buttons */}
    
            
                {/* Social Links */}
                <div className="flex items-center justify-end gap-3 pt-4">
                    <a
                        href="https://instagram.com/kobaeapp"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-primary transition-colors"
                        aria-label="Instagram"
                    >
                        <Instagram className="w-6 h-6" />
                    </a>
                    <a
                        href="https://linkedin.com/company/kobae/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-foreground hover:text-primary transition-colors"
                        aria-label="LinkedIn"
                    >
                        <Linkedin className="w-6 h-6" />
                    </a>
                </div>
            </div>
        </div>
        </footer>
    );
}
