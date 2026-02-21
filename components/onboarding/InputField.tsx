"use client";

import React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
    ({ label, error, className = "", ...props }, ref) => {
        return (
            <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[var(--text-400)] font-sans">
                    {label}
                </label>
                <input
                    ref={ref}
                    className={`
                        w-full px-4 py-3.5 rounded-xl
                        bg-white text-[var(--foreground)]
                        font-sans text-sm
                        placeholder:text-[var(--text-100)]
                        shadow-[0_0_2px_rgba(0,0,0,0.25)]
                        outline-none
                        focus:ring-2 focus:ring-[var(--primary)]/30
                        transition-all duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${error ? "ring-2 ring-red-500/50" : ""}
                        ${className}
                    `}
                    {...props}
                />
                {error && (
                    <p className="text-xs text-red-500 font-sans mt-0.5">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

InputField.displayName = "InputField";
