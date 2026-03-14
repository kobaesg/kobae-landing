interface Props { archetype: string; className?: string }

export function ArchetypeBadge({ archetype, className = "" }: Props) {
    if (!archetype) return null;
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold font-sans bg-[#ffefe5] text-[#d8602e] ${className}`}>
            {archetype}
        </span>
    );
}
