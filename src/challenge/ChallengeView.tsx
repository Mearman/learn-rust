import { Check, Lightbulb, RotateCcw, Trophy, X } from "lucide-react";
import { vars } from "../theme/theme.css.ts";
import {
    answerGrid,
    answerButton,
    feedbackBox,
    feedbackCorrect,
    feedbackIncorrect,
    nextButton,
    monoSm,
    dimSm,
    noteBlock,
    challengeStack,
    challengeCard,
    challengeSummary,
} from "../theme/styles.css.ts";
import { CodeBlock } from "../highlight/CodeBlock.tsx";
import { CompileOutput } from "../compiler/CompileOutput.tsx";
import { useCompiler } from "../compiler/useCompiler.ts";
import type { Challenge } from "./challenges.ts";
import type { ChallengeAnswers } from "./useChallengeAnswers.ts";
import type { LanguageFamiliarity } from "../data/languages.ts";
import type { UserProfile } from "../settings/types.ts";
import { languageNameForId } from "../data/languages.ts";
import { backgroundContextNotes } from "../settings/background-context.ts";

function levelColour(level: string): string {
    if (level === "warm-up") return vars.colour.good;
    if (level === "core") return vars.colour.accentSoft;
    return vars.colour.bad;
}

function PerLanguageNotes({
    challenge,
    familiarities,
}: {
    readonly challenge: Challenge;
    readonly familiarities: readonly LanguageFamiliarity[];
}) {
    const notes = familiarities
        .map((familiarity) => ({
            familiarity,
            explanation: challenge.whyPerLanguage?.[familiarity],
        }))
        .filter(
            (
                note
            ): note is {
                readonly familiarity: LanguageFamiliarity;
                readonly explanation: string;
            } => note.explanation !== undefined
        );
    if (notes.length === 0) return null;
    return (
        <div
            style={{
                borderTop: `1px solid ${vars.colour.borderSoft}`,
                paddingTop: "0.5rem",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                }}
            >
                {notes.map((note) => (
                    <p
                        key={note.familiarity}
                        style={{
                            fontSize: "0.875rem",
                            lineHeight: 1.625,
                            margin: 0,
                            color: vars.colour.text,
                        }}
                    >
                        <span
                            style={{
                                color: vars.colour.accentSoft,
                                fontWeight: 600,
                            }}
                        >
                            If you&apos;re familiar with{" "}
                            {languageNameForId(note.familiarity)}:{" "}
                        </span>
                        {note.explanation}
                    </p>
                ))}
            </div>
        </div>
    );
}

interface ChallengeCardProps {
    readonly challenge: Challenge;
    readonly number: number;
    readonly total: number;
    /** The learner's guess, or undefined if not yet answered. */
    readonly guess: boolean | undefined;
    readonly onAnswer: (id: string, guess: boolean) => void;
    readonly familiarities: readonly LanguageFamiliarity[];
}

/** One challenge, independently answerable. Each card owns its compiler so
 *  running a snippet only shows output on that card. The card root carries the
 *  challenge id so it is a scroll-tracked sidebar sub-section. */
function ChallengeCard({
    challenge,
    number,
    total,
    guess,
    onAnswer,
    familiarities,
}: ChallengeCardProps) {
    const { compiling, result, compile, clear } = useCompiler();
    const answered = guess !== undefined;
    const isCorrect = answered && guess === challenge.compiles;
    const fix = challenge.fix;

    return (
        <div id={challenge.id} className={challengeCard}>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
                className={monoSm}
            >
                <span>
                    challenge {number} / {total}
                </span>
                <span
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                    }}
                >
                    <span style={{ color: levelColour(challenge.level) }}>
                        {challenge.level}
                    </span>
                    <span className={dimSm}>{challenge.topic}</span>
                </span>
            </div>

            <CodeBlock
                code={challenge.code}
                label="snippet.rs"
                onRun={() => {
                    void compile(challenge.code);
                }}
                compiling={compiling}
            />

            <CompileOutput
                result={result}
                compiling={compiling}
                onClear={clear}
            />

            {!answered ? (
                <div className={answerGrid}>
                    <button
                        onClick={() => {
                            onAnswer(challenge.id, true);
                        }}
                        className={answerButton}
                        style={{ color: vars.colour.good }}
                    >
                        <Check size={17} /> Compiles
                    </button>
                    <button
                        onClick={() => {
                            onAnswer(challenge.id, false);
                        }}
                        className={answerButton}
                        style={{ color: vars.colour.bad }}
                    >
                        <X size={17} /> Won&apos;t compile
                    </button>
                </div>
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                    }}
                >
                    <div
                        className={`${feedbackBox} ${isCorrect ? feedbackCorrect : feedbackIncorrect}`}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                fontSize: "0.875rem",
                                fontWeight: 600,
                                color: isCorrect
                                    ? vars.colour.good
                                    : vars.colour.bad,
                            }}
                        >
                            {isCorrect ? <Check size={16} /> : <X size={16} />}
                            {isCorrect ? "Correct" : "Not quite"}
                            <span
                                style={{
                                    color: vars.colour.dim,
                                    fontWeight: 400,
                                }}
                            >
                                — this code{" "}
                                {challenge.compiles
                                    ? "compiles"
                                    : "does not compile"}
                                .
                            </span>
                        </div>
                        <p
                            style={{
                                fontSize: "0.875rem",
                                lineHeight: 1.625,
                                margin: 0,
                                color: vars.colour.text,
                            }}
                        >
                            {challenge.why}
                        </p>
                        {familiarities.length > 0 ? (
                            <PerLanguageNotes
                                challenge={challenge}
                                familiarities={familiarities}
                            />
                        ) : null}
                    </div>

                    {fix !== undefined ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.5rem",
                            }}
                        >
                            <span className={monoSm}>one way to fix it</span>
                            <CodeBlock
                                code={fix}
                                label="fixed.rs"
                                onRun={() => {
                                    void compile(fix);
                                }}
                                compiling={compiling}
                            />
                            <CompileOutput
                                result={result}
                                compiling={compiling}
                                onClear={clear}
                            />
                        </div>
                    ) : null}
                </div>
            )}
        </div>
    );
}

interface ChallengeViewProps {
    readonly challenges: readonly Challenge[];
    readonly answers: ChallengeAnswers;
    readonly onAnswer: (id: string, guess: boolean) => void;
    readonly onReset: () => void;
    readonly profile: UserProfile;
}

function ChallengeView({
    challenges,
    answers,
    onAnswer,
    onReset,
    profile,
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

    return (
        <div className={challengeStack}>
            {backgroundContextNotes(profile.backgrounds).map((note) => (
                <div key={note} className={noteBlock}>
                    <Lightbulb
                        size={16}
                        style={{
                            color: vars.colour.accent,
                            flexShrink: 0,
                            marginTop: 2,
                        }}
                    />
                    <span>{note}</span>
                </div>
            ))}

            <div className={challengeSummary}>
                <span
                    className={monoSm}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                    }}
                >
                    <Trophy size={14} style={{ color: vars.colour.accent }} />
                    {correctCount} / {answeredCount} correct
                    <span className={dimSm}>· {challenges.length} total</span>
                </span>
                {answeredCount > 0 ? (
                    <button onClick={onReset} className={nextButton}>
                        <RotateCcw size={16} /> Reset answers
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
                />
            ))}
        </div>
    );
}

export { ChallengeView };
