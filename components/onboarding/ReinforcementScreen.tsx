"use client";

interface ReinforcementScreenProps {
    illustrationSrc?: string;
    title: string;
    subtitle: string;
    buttonText?: string;
    onProceed: () => void;
}

export function ReinforcementScreen({
    illustrationSrc,
    title,
    subtitle,
    buttonText = "Proceed",
    onProceed,
}: ReinforcementScreenProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70dvh] text-center px-6">
            {illustrationSrc && (
                <div className="mb-8">
                    <img
                        src={illustrationSrc}
                        alt=""
                        className="w-56 h-56 object-contain mx-auto"
                    />
                </div>
            )}

            <h1 className="text-2xl font-serif font-bold text-[var(--foreground)] mb-3 leading-snug">
                {title}
            </h1>

            <p className="text-sm text-[var(--text-300)] font-sans mb-10 max-w-sm">
                {subtitle}
            </p>

            <button
                onClick={onProceed}
                className="w-full max-w-xs py-4 rounded-3xl bg-[var(--primary)] text-white font-sans font-semibold text-base shadow-[0_0_10px_rgba(255,144,97,0.8)] hover:bg-[var(--primary-400)] transition-all"
            >
                {buttonText}
            </button>
        </div>
    );
}
