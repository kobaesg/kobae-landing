"use client";

import PhoneInputPrimitive, {
    type Country,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";

interface PhoneInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
    defaultCountry?: Country;
}

export function PhoneInput({
    label,
    value,
    onChange,
    error,
    disabled = false,
    defaultCountry = "SG",
}: PhoneInputProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-400)] font-sans">
                {label}
            </label>

            <div
                className={`
                    flex items-center w-full rounded-xl bg-white
                    shadow-[0_0_2px_rgba(0,0,0,0.25)]
                    transition-all duration-200
                    focus-within:ring-2 focus-within:ring-[var(--primary)]/30
                    ${error ? "ring-2 ring-red-500/50" : ""}
                    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                `}
            >
                <PhoneInputPrimitive
                    international
                    defaultCountry={defaultCountry}
                    value={value}
                    onChange={(val) => onChange(val ?? "")}
                    disabled={disabled}
                    className="kobae-phone-input w-full"
                />
            </div>

            {error && (
                <p className="text-xs text-red-500 font-sans mt-0.5">{error}</p>
            )}

            <style>{`
                .kobae-phone-input {
                    display: flex;
                    align-items: center;
                    width: 100%;
                }

                /* Flag + country select button */
                .kobae-phone-input .PhoneInputCountry {
                    display: flex;
                    align-items: center;
                    padding: 0 12px 0 16px;
                    border-right: 1px solid #e5e5e5;
                    height: 48px;
                    flex-shrink: 0;
                    gap: 6px;
                    cursor: pointer;
                }

                .kobae-phone-input .PhoneInputCountryIcon {
                    width: 22px;
                    height: 16px;
                    border-radius: 2px;
                    overflow: hidden;
                    box-shadow: 0 0 1px rgba(0,0,0,0.2);
                    flex-shrink: 0;
                }

                .kobae-phone-input .PhoneInputCountryIcon img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .kobae-phone-input .PhoneInputCountrySelectArrow {
                    width: 0;
                    height: 0;
                    border-left: 4px solid transparent;
                    border-right: 4px solid transparent;
                    border-top: 5px solid #9b8479;
                    opacity: 1;
                    margin-left: 2px;
                }

                /* The hidden native <select> overlay */
                .kobae-phone-input .PhoneInputCountrySelect {
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 100%;
                    z-index: 1;
                    border: 0;
                    opacity: 0;
                    cursor: pointer;
                }

                /* The actual number input */
                .kobae-phone-input .PhoneInputInput {
                    flex: 1;
                    padding: 0 16px;
                    height: 48px;
                    background: transparent;
                    outline: none;
                    border: none;
                    font-family: var(--font-inter, sans-serif);
                    font-size: 14px;
                    color: #181412;
                    min-width: 0;
                }

                .kobae-phone-input .PhoneInputInput::placeholder {
                    color: #bcada6;
                }

                .kobae-phone-input .PhoneInputInput:disabled {
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
}
