import { ChevronRight } from "lucide-react";

interface Props { count: number; onViewAll?: () => void }

export function MutualConnectionsRow({ count, onViewAll }: Props) {
    if (count === 0) return null;
    return (
        <button
            onClick={onViewAll}
            className="w-full flex items-center gap-3 bg-[#f8f7f6] rounded-xl px-4 py-3"
        >
            <div className="flex -space-x-2">
                {Array.from({ length: Math.min(count, 3) }).map((_, i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-[#d4c4bb] border-2 border-[#f8f7f6]" />
                ))}
            </div>
            <span className="flex-1 text-[13px] font-sans text-[#453933] font-medium text-left">
                View all {count} mutual connection{count !== 1 ? "s" : ""}
            </span>
            <ChevronRight size={16} className="text-[#9b8479]" />
        </button>
    );
}
