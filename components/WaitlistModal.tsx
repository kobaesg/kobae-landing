"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface WaitlistModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function WaitlistModal({ open, onOpenChange }: WaitlistModalProps) {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/waitlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email }),
            });

            if (response.ok) {
                setIsSuccess(true);
                setEmail("");
                setName("");
                setTimeout(() => {
                    onOpenChange(false);
                    setIsSuccess(false);
                }, 2000);
            }
        } catch (error) {
            console.error("Error submitting:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50"
                onClick={() => onOpenChange(false)}
            />
            
            {/* Modal */}
            <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 z-10">
                {/* Close button */}
                <button
                    onClick={() => onOpenChange(false)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-serif mb-2">Join the Waitlist</h2>
                <p className="text-sm text-gray-600 mb-6">
                    Be the first to know when Kobae launches. We'll keep you updated!
                </p>

                {isSuccess ? (
                    <div className="py-8 text-center">
                        <p className="text-lg font-semibold text-primary">
                            🎉 You're on the list!
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                            We'll be in touch soon.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-1">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Joining..." : "Join Waitlist"}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}
