"use client";

import React, { useRef, useState } from "react";
import { Camera, Plus } from "lucide-react";

interface PhotoUploadProps {
    photoUrl?: string | null;
    onUpload: (file: File) => void;
    loading?: boolean;
}

export function PhotoUpload({
    photoUrl,
    onUpload,
    loading = false,
}: PhotoUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const displayUrl = preview || photoUrl || null;

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file
        const validTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!validTypes.includes(file.type)) {
            alert("Please upload a JPEG, PNG, or WebP image.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert("Image must be less than 5MB.");
            return;
        }

        // Preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        onUpload(file);
    };

    return (
        <div className="flex justify-center">
            <button
                type="button"
                onClick={handleClick}
                disabled={loading}
                className="relative w-28 h-28 rounded-full overflow-hidden bg-white shadow-[0_0_7px_rgba(0,0,0,0.15)] transition-all hover:shadow-[0_0_12px_rgba(0,0,0,0.2)] disabled:opacity-60"
            >
                {displayUrl ? (
                    <img
                        src={displayUrl}
                        alt="Profile photo"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[var(--background)]">
                        <Camera className="w-8 h-8 text-[var(--text-200)]" />
                    </div>
                )}

                {/* Plus badge */}
                <div className="absolute bottom-1 right-1 w-7 h-7 rounded-full bg-[var(--primary)] flex items-center justify-center shadow-sm">
                    <Plus className="w-4 h-4 text-white" />
                </div>

                {loading && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </button>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleChange}
            />
        </div>
    );
}
