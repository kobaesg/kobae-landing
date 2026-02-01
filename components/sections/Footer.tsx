"use client";

export function Footer() {
    return (
        <footer className="py-8 px-6 border-t border-border">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Logo */}
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-xs">
                                K
                            </span>
                        </div>
                        <span className="font-medium">Kobae</span>
                    </div>

                    {/* Links */}
                    <nav className="flex items-center gap-6 text-sm text-muted-foreground">
                        <a
                            href="#"
                            className="hover:text-foreground transition-colors"
                        >
                            Privacy
                        </a>
                        <a
                            href="#"
                            className="hover:text-foreground transition-colors"
                        >
                            Terms
                        </a>
                        <a
                            href="#"
                            className="hover:text-foreground transition-colors"
                        >
                            Contact
                        </a>
                    </nav>

                    {/* Copyright */}
                    <p className="text-sm text-muted-foreground">
                        © 2026 Kobae. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
