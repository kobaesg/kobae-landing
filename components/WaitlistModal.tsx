"use client";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
            // Send to your API endpoint
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-serif">Join the Waitlist</DialogTitle>
                    <DialogDescription>
                        Be the first to know when Kobae launches. We'll keep you updated!
                    </DialogDescription>
                </DialogHeader>

                {isSuccess ? (
                    <div className="py-8 text-center">
                        <p className="text-lg font-semibold text-primary">
                            🎉 You're on the list!
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            We'll be in touch soon.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
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
            </DialogContent>
        </Dialog>
    );
}
