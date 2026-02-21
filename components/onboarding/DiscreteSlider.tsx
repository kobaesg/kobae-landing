"use client";

interface DiscreteSliderProps {
    label: string;
    leftLabel: string;
    rightLabel: string;
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
}

export function DiscreteSlider({
    label,
    leftLabel,
    rightLabel,
    value,
    onChange,
    min = 1,
    max = 7,
}: DiscreteSliderProps) {
    const positions = Array.from({ length: max - min + 1 }, (_, i) => i + min);

    return (
        <div className="space-y-3">
            <p className="text-sm font-medium text-[var(--text-400)] font-sans">
                {label}
            </p>

            <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--text-300)] font-sans w-20 text-right">
                    {leftLabel}
                </span>

                <div className="flex-1 flex items-center justify-between px-2">
                    {positions.map((pos) => (
                        <button
                            key={pos}
                            type="button"
                            onClick={() => onChange(pos)}
                            className={`
                                w-8 h-8 rounded-full flex items-center justify-center
                                transition-all duration-200
                                ${
                                    value === pos
                                        ? "bg-[var(--primary)] text-white scale-110 shadow-md"
                                        : "bg-white border border-[var(--secondary-100)] text-[var(--text-300)] hover:border-[var(--primary)]"
                                }
                            `}
                        >
                            <span className="text-xs font-sans">{pos}</span>
                        </button>
                    ))}
                </div>

                <span className="text-xs text-[var(--text-300)] font-sans w-20">
                    {rightLabel}
                </span>
            </div>
        </div>
    );
}
