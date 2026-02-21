"use client";

interface OnboardingProgressProps {
    currentStep: number;
    totalSteps?: number;
}

export function OnboardingProgress({
    currentStep,
    totalSteps = 5,
}: OnboardingProgressProps) {
    return (
        <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }, (_, i) => {
                const step = i + 1;
                const isActive = step === currentStep;
                const isCompleted = step < currentStep;

                return (
                    <div
                        key={step}
                        className={`
                            rounded-full transition-all duration-300
                            ${
                                isActive
                                    ? "w-8 h-2.5 bg-[var(--primary)]"
                                    : isCompleted
                                      ? "w-2.5 h-2.5 bg-[var(--primary)]"
                                      : "w-2.5 h-2.5 bg-[var(--secondary-100)]"
                            }
                        `}
                    />
                );
            })}
        </div>
    );
}
