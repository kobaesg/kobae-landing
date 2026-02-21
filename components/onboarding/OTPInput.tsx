"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";

interface OTPInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
}

export function OTPInput({
    length = 6,
    value,
    onChange,
    error,
    disabled = false,
}: OTPInputProps) {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [focusedIndex, setFocusedIndex] = useState(0);

    const digits = value.split("").concat(Array(length).fill("")).slice(0, length);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const focusInput = useCallback(
        (index: number) => {
            const clampedIndex = Math.max(0, Math.min(index, length - 1));
            inputRefs.current[clampedIndex]?.focus();
        },
        [length]
    );

    const handleChange = (index: number, char: string) => {
        if (disabled) return;
        const digit = char.replace(/\D/g, "").slice(-1);
        const newValue = digits.map((d, i) => (i === index ? digit : d)).join("");
        onChange(newValue.replace(/\s/g, ""));

        if (digit && index < length - 1) {
            focusInput(index + 1);
        }
    };

    const handleKeyDown = (
        index: number,
        e: React.KeyboardEvent<HTMLInputElement>
    ) => {
        if (e.key === "Backspace") {
            e.preventDefault();
            if (digits[index]) {
                const newValue = digits
                    .map((d, i) => (i === index ? "" : d))
                    .join("");
                onChange(newValue.replace(/\s/g, ""));
            } else if (index > 0) {
                focusInput(index - 1);
                const newValue = digits
                    .map((d, i) => (i === index - 1 ? "" : d))
                    .join("");
                onChange(newValue.replace(/\s/g, ""));
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            focusInput(index - 1);
        } else if (e.key === "ArrowRight" && index < length - 1) {
            focusInput(index + 1);
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, length);
        onChange(pasted);
        focusInput(Math.min(pasted.length, length - 1));
    };

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="flex gap-3">
                {digits.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => {
                            inputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit === " " ? "" : digit}
                        disabled={disabled}
                        className={`
                            w-12 h-14 text-center text-xl font-semibold font-sans
                            rounded-xl bg-white
                            shadow-[0_0_2px_rgba(0,0,0,0.25)]
                            outline-none
                            transition-all duration-200
                            disabled:opacity-50 disabled:cursor-not-allowed
                            ${
                                focusedIndex === index
                                    ? "ring-2 ring-[var(--primary)]"
                                    : ""
                            }
                            ${error ? "ring-2 ring-red-500/50" : ""}
                        `}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onFocus={() => setFocusedIndex(index)}
                        onPaste={handlePaste}
                    />
                ))}
            </div>
            {error && (
                <p className="text-xs text-red-500 font-sans">{error}</p>
            )}
        </div>
    );
}
