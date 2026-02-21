"use client";

import { TagChip } from "./TagChip";

interface TagCategory {
    name: string;
    tags: string[];
    isHighlighted?: boolean;
}

interface TagSelectorProps {
    categories: TagCategory[];
    selected: string[];
    onChange: (selected: string[]) => void;
    min?: number;
    max?: number;
}

export function TagSelector({
    categories,
    selected,
    onChange,
    min = 0,
    max = Infinity,
}: TagSelectorProps) {
    const handleToggle = (tag: string) => {
        if (selected.includes(tag)) {
            onChange(selected.filter((t) => t !== tag));
        } else if (selected.length < max) {
            onChange([...selected, tag]);
        }
    };

    const atMax = selected.length >= max;

    return (
        <div className="space-y-6">
            {/* Counter badge */}
            {max < Infinity && (
                <div className="flex justify-center">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-sans font-medium">
                        {selected.length} out of {max} Selected
                    </span>
                </div>
            )}

            {/* Category sections */}
            {categories.map((category) => (
                <div key={category.name} className="space-y-3">
                    <h3 className="text-sm font-semibold text-[var(--text-300)] font-sans flex items-center gap-2">
                        {category.name}
                        {category.isHighlighted && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
                                Trending
                            </span>
                        )}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {category.tags.map((tag) => (
                            <TagChip
                                key={tag}
                                label={tag}
                                selected={selected.includes(tag)}
                                onClick={() => handleToggle(tag)}
                                disabled={atMax && !selected.includes(tag)}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
