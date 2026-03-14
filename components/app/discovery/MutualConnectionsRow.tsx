interface Props { count: number; onViewAll?: () => void }

export function MutualConnectionsRow({ count, onViewAll }: Props) {
    if (count === 0) return null;
    return (
        <button onClick={onViewAll} className="flex items-center gap-2 py-2">
            <div className="flex -space-x-2">
                {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-[#e8d5c8] border-2 border-white" />
                ))}
            </div>
            <span className="text-[13px] font-sans text-[#d8602e] font-medium">
                {count} mutual connection{count !== 1 ? "s" : ""}
            </span>
        </button>
    );
}
