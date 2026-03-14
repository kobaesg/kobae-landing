interface Props { archetype: string; variant?: "orange" | "purple"; className?: string }

export function ArchetypeBadge({ archetype, variant = "orange", className = "" }: Props) {
    if (!archetype) return null;

    if (variant === "purple") {
        return (
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[12px] font-semibold font-sans bg-[#faf5ff] text-[#8f2bce] shadow-[0px_0px_14px_rgba(193,106,255,0.33)] ${className}`}>
                ⚡ {archetype}
            </span>
        );
    }

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold font-sans bg-[#ffefe5] text-[#d8602e] ${className}`}>
            {archetype}
        </span>
    );
}
