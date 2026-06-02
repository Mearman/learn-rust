import { useMemo, useState } from "react";
import { ClipboardList, Lightbulb, RotateCcw, Trophy } from "lucide-react";
import {
    nextButton,
    monoSm,
    dimSm,
    noteBlock,
    challengeStack,
    challengeSummary,
} from "../theme/styles.css.ts";
import {
    dueBucket,
    dueHeader,
    dueChips,
    dueChip,
    noteIcon,
    summaryTrophy,
    summaryTally,
} from "./challenge.css.ts";
import { ChallengeCard } from "./ChallengeCard.tsx";
import type { Challenge } from "./challenges.ts";
import type { ChallengeAnswers } from "./useChallengeAnswers.ts";
import type { ReviewStore } from "./spacedRepetition.ts";
import { dueChallengeIds } from "./spacedRepetition.ts";
import type { UserProfile } from "../settings/types.ts";
import { backgroundContextNotes } from "../settings/background-context.ts";

interface ChallengeViewProps {
    readonly challenges: readonly Challenge[];
    readonly answers: ChallengeAnswers;
    readonly onAnswer: (id: string, guess: boolean) => void;
    readonly onReset: () => void;
    readonly profile: UserProfile;
    readonly reviewStore: ReviewStore;
    readonly onRecordReview: (
        challengeId: string,
        correct: boolean,
        shownAt: number
    ) => void;
}

function ChallengeView({
    challenges,
    answers,
    onAnswer,
    onReset,
    profile,
    reviewStore,
    onRecordReview,
}: ChallengeViewProps) {
    let answeredCount = 0;
    let correctCount = 0;
    for (const c of challenges) {
        const g = answers[c.id];
        if (g !== undefined) {
            answeredCount += 1;
            if (g === c.compiles) correctCount += 1;
        }
    }

    // Snapshot of the current time taken once at mount; used for the due-for-
    // review computation. Date.now() is impure so it cannot be called in
    // render — useState lazy initialiser runs once outside render.
    const [nowMs] = useState<number>(() => Date.now());

    // Compute the set of challenge ids due for review. Memoised on the store
    // so it only recomputes when review data changes.
    const challengeIds = useMemo(
        () => challenges.map((c) => c.id),
        [challenges]
    );
    const dueIds = useMemo(
        () => new Set(dueChallengeIds(challengeIds, reviewStore, nowMs)),
        [challengeIds, reviewStore, nowMs]
    );

    // Build a lookup map for rendering due items with their labels.
    const challengeById = useMemo(() => {
        const map = new Map<string, Challenge>();
        for (const c of challenges) {
            map.set(c.id, c);
        }
        return map;
    }, [challenges]);

    return (
        <div className={challengeStack}>
            {backgroundContextNotes(profile.backgrounds).map((note) => (
                <div key={note} className={noteBlock}>
                    <Lightbulb
                        size={16}
                        aria-hidden="true"
                        className={noteIcon}
                    />
                    <span>{note}</span>
                </div>
            ))}

            {/* Due-for-review bucket — rendered above the summary when there
                are challenges whose SR interval has elapsed. */}
            {dueIds.size > 0 ? (
                <div className={dueBucket}>
                    <div className={dueHeader}>
                        <ClipboardList size={14} aria-hidden="true" />
                        Due for review
                    </div>
                    <div className={dueChips}>
                        {Array.from(dueIds).map((id) => {
                            const c = challengeById.get(id);
                            if (c === undefined) return null;
                            // Find position for the label
                            const idx = challenges.findIndex(
                                (ch) => ch.id === id
                            );
                            return (
                                <a key={id} href={`#${id}`} className={dueChip}>
                                    {idx >= 0 ? `${String(idx + 1)}.` : ""}{" "}
                                    {c.topic}
                                </a>
                            );
                        })}
                    </div>
                </div>
            ) : null}

            <div className={challengeSummary}>
                <span className={`${monoSm} ${summaryTally}`}>
                    <Trophy
                        size={14}
                        aria-hidden="true"
                        className={summaryTrophy}
                    />
                    {correctCount} / {answeredCount} correct
                    <span className={dimSm}>· {challenges.length} total</span>
                </span>
                {answeredCount > 0 ? (
                    <button onClick={onReset} className={nextButton}>
                        <RotateCcw size={16} aria-hidden="true" /> Reset answers
                    </button>
                ) : null}
            </div>

            {challenges.map((c, i) => (
                <ChallengeCard
                    key={c.id}
                    challenge={c}
                    number={i + 1}
                    total={challenges.length}
                    guess={answers[c.id]}
                    onAnswer={onAnswer}
                    familiarities={profile.familiarities}
                    onRecordReview={onRecordReview}
                />
            ))}
        </div>
    );
}

export { ChallengeView };
