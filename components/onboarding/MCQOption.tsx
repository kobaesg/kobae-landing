"use client";

interface MCQOptionProps {
    optionKey: string;
    text: string;
    selected: boolean;
    onClick: () => void;
}

export function MCQOption({
    optionKey,
    text,
    selected,
    onClick,
}: MCQOptionProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                w-full flex items-start gap-3 px-4 py-3.5 rounded-xl
                text-left font-sans text-sm transition-all duration-200
                ${
                    selected
                        ? "bg-[var(--primary)]/5 border-2 border-[var(--primary)] text-[var(--foreground)]"
                        : "bg-white border border-[var(--secondary-100)] text-[var(--text-400)] hover:border-[var(--primary)]/50"
                }
            `}
        >
            <span
                className={`
                    flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center
                    text-xs font-semibold mt-0.5
                    ${
                        selected
                            ? "bg-[var(--primary)] text-white"
                            : "bg-[var(--background)] text-[var(--text-300)]"
                    }
                `}
            >
                {optionKey}
            </span>
            <span className="flex-1">{text}</span>
        </button>
    );
}
