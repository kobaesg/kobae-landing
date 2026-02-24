"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import {
    OnboardingLayout,
    BottomButton,
    MCQOption,
    DiscreteSlider,
    ReinforcementScreen,
} from "@/components/onboarding";
import { useOnboardingGuard } from "@/lib/onboarding/guard";
import {
    useQuestions,
    useBulkSubmitAnswers,
    useCalculateKode,
} from "@/lib/api/hooks";
import type { Question } from "@/lib/api/types";
import { useOnboardingDraft } from "@/lib/onboarding/store";
import { PageTransition, FadeIn } from "@/components/onboarding/animations";

// Group questions into sections for pagination
interface QuestionSection {
    title: string;
    label: string;
    questions: Question[];
}

function groupQuestions(questions: Question[]): QuestionSection[] {
    const sectionMap = new Map<string, Question[]>();

    for (const q of questions) {
        const section = q.section || "General";
        if (!sectionMap.has(section)) {
            sectionMap.set(section, []);
        }
        sectionMap.get(section)!.push(q);
    }

    const sections: QuestionSection[] = [];
    for (const [name, qs] of sectionMap) {
        // Sort by order_num within each section
        qs.sort((a, b) => a.order_num - b.order_num);

        const firstQ = qs[0].order_num;
        const lastQ = qs[qs.length - 1].order_num;
        const label =
            qs.length === 1
                ? `Question ${firstQ} of 18`
                : `Questions ${firstQ}-${lastQ} of 18`;

        sections.push({ title: name, label, questions: qs });
    }

    return sections;
}

export default function QuestionnairePage() {
    const router = useRouter();
    const { isReady } = useOnboardingGuard("bio_set");
    const { data: questions, isLoading: questionsLoading } = useQuestions();
    const submitAnswers = useBulkSubmitAnswers();
    const calculateKode = useCalculateKode();
    const draft = useOnboardingDraft((s) => s.questionnaire);
    const setDraft = useOnboardingDraft((s) => s.setQuestionnaire);
    const clearDraft = useOnboardingDraft((s) => s.clearQuestionnaire);

    const [showIntro, setShowIntro] = useState(!draft.introSeen);
    const [currentSectionIndex, setCurrentSectionIndex] = useState(draft.currentSectionIndex);
    const [answers, setAnswers] = useState<Record<number, string>>(draft.answers);

    const sections = useMemo(
        () => (questions ? groupQuestions(questions) : []),
        [questions]
    );

    const currentSection = sections[currentSectionIndex];
    const isLastSection = currentSectionIndex === sections.length - 1;

    const allCurrentAnswered = currentSection?.questions.every(
        (q) => answers[q.id] !== undefined && answers[q.id] !== ""
    );

    const handleMCQAnswer = (questionId: number, answer: string) => {
        const next = { ...answers, [questionId]: answer };
        setAnswers(next);
        setDraft({ answers: next });
    };

    const handleSliderAnswer = (questionId: number, value: number) => {
        const next = { ...answers, [questionId]: String(value) };
        setAnswers(next);
        setDraft({ answers: next });
    };

    const handleNext = async () => {
        if (!isLastSection) {
            const nextIndex = currentSectionIndex + 1;
            setCurrentSectionIndex(nextIndex);
            setDraft({ currentSectionIndex: nextIndex });
            window.scrollTo(0, 0);
            return;
        }

        // Final section — submit all answers
        try {
            const answerPayload = Object.entries(answers).map(
                ([qId, answer]) => ({
                    question_id: parseInt(qId),
                    answer,
                })
            );

            await submitAnswers.mutateAsync({ answers: answerPayload });
            await calculateKode.mutateAsync();
            clearDraft();
            router.push("/result");
        } catch {
            // Error handling
        }
    };

    if (!isReady || questionsLoading) {
        return (
            <div className="min-h-dvh bg-[var(--background)] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (showIntro) {
        return (
            <OnboardingLayout showBack={true} currentStep={5}>
                <ReinforcementScreen
                    title="Let's find your Social Kōde."
                    subtitle="Fill up this short questionnaire to find out where you stand."
                    buttonText="Next"
                    onProceed={() => {
                        setShowIntro(false);
                        setDraft({ introSeen: true });
                    }}
                />
            </OnboardingLayout>
        );
    }

    if (!currentSection) {
        return null;
    }

    const isSliderSection = currentSection.questions.every(
        (q) => q.type === "slider"
    );

    return (
        <OnboardingLayout currentStep={5} showBack={true} showLogo={true}>
            <PageTransition pageKey={`section-${currentSectionIndex}`}>
                <div className="pt-6 space-y-6">
                    {/* Section header */}
                    <FadeIn>
                        <div className="text-center space-y-1">
                            <h2 className="text-lg font-serif font-bold text-[var(--foreground)]">
                                {isSliderSection
                                    ? "Social Sliders"
                                    : currentSection.title}
                            </h2>
                            <p className="text-xs text-[var(--text-200)] font-sans">
                                {currentSection.label}
                            </p>
                        </div>
                    </FadeIn>

                    {/* Questions */}
                    <div className="space-y-8">
                        {currentSection.questions.map((question) => (
                            <FadeIn key={question.id} delay={0.1}>
                                <div className="space-y-4">
                                    {question.type === "single_choice" ? (
                                        <>
                                            <div className="space-y-1">
                                                <p className="text-xs text-[var(--text-200)] font-sans">
                                                    Question {question.order_num} of 18
                                                </p>
                                                <p
                                                    className="text-base font-serif font-medium text-[var(--foreground)] leading-snug"
                                                    dangerouslySetInnerHTML={{
                                                        __html: highlightKeywords(
                                                            question.text
                                                        ),
                                                    }}
                                                />
                                            </div>
                                            <div className="space-y-2.5">
                                                {question.options?.map((option) => (
                                                    <MCQOption
                                                        key={option.key}
                                                        optionKey={option.key}
                                                        text={option.text}
                                                        selected={
                                                            answers[question.id] ===
                                                            option.key
                                                        }
                                                        onClick={() =>
                                                            handleMCQAnswer(
                                                                question.id,
                                                                option.key
                                                            )
                                                        }
                                                    />
                                                ))}
                                    </div>
                                </>
                            ) : (
                                <DiscreteSlider
                                    label={question.text}
                                    leftLabel={
                                        question.slider_labels?.[0] || ""
                                    }
                                    rightLabel={
                                        question.slider_labels?.[1] || ""
                                    }
                                    value={
                                        answers[question.id]
                                            ? parseInt(answers[question.id])
                                            : question.slider_min || 1
                                    }
                                    onChange={(value) =>
                                        handleSliderAnswer(
                                            question.id,
                                            value
                                        )
                                    }
                                    min={question.slider_min || 1}
                                    max={question.slider_max || 7}
                                />
                            )}
                                </div>
                            </FadeIn>
                        ))}
                    </div>

                    {/* Progress indicator */}
                    <div className="flex justify-center gap-1.5 pt-2">
                        {sections.map((_, i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full transition-all ${
                                    i === currentSectionIndex
                                        ? "bg-[var(--primary)] w-5"
                                        : i < currentSectionIndex
                                          ? "bg-[var(--primary)]"
                                          : "bg-[var(--secondary-100)]"
                                }`}
                            />
                        ))}
                    </div>

                    <BottomButton
                        onClick={handleNext}
                        disabled={!allCurrentAnswered}
                        loading={
                            submitAnswers.isPending || calculateKode.isPending
                        }
                    >
                        {isLastSection ? "Submit" : "Next"}
                    </BottomButton>
                </div>
            </PageTransition>
        </OnboardingLayout>
    );
}

/**
 * Simple keyword highlighter that wraps text between ** ** in orange spans.
 * Falls back to the raw text if no markers are found.
 */
function highlightKeywords(text: string): string {
    return text.replace(
        /\*\*(.*?)\*\*/g,
        '<span class="text-[var(--primary)] font-semibold">$1</span>'
    );
}
