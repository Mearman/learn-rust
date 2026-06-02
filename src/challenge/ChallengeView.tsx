import { useState } from "react";
import { Check, Lightbulb, RotateCcw, Trophy, Wrench, X } from "lucide-react";
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
import { EditableCode } from "./EditableCode.tsx";
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

/** Fix-mode state per challenge card. */
type FixMode =
    | { readonly kind: "idle" }
    | { readonly kind: "editing"; readonly editedCode: string }
    | { readonly kind: "submitted-incorrect"; readonly editedCode: string }
    | { readonly kind: "solved"; readonly editedCode: string }
    | { readonly kind: "gave-up" };

function isFixEligible(challenge: Challenge): boolean {
    return !challenge.compiles && challenge.fix !== undefined;
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
    const eligible = isFixEligible(challenge);

    const [fixMode, setFixMode] = useState<FixMode>({ kind: "idle" });

    function handleToggleFix() {
        if (fixMode.kind !== "idle") {
            clear();
            setFixMode({ kind: "idle" });
        } else {
            clear();
            setFixMode({ kind: "editing", editedCode: challenge.code });
        }
    }

    function handleEditChange(code: string) {
        if (
            fixMode.kind === "editing" ||
            fixMode.kind === "submitted-incorrect"
        ) {
            setFixMode({ kind: "editing", editedCode: code });
            clear();
        }
    }

    function handleRunFix() {
        const editedCode =
            fixMode.kind === "editing" || fixMode.kind === "submitted-incorrect"
                ? fixMode.editedCode
                : null;
        if (editedCode === null) return;
        void compile(editedCode).then(() => {
            // result is not yet updated here; we handle it via the effect
            // pattern of reading result after compile resolves — but because
            // compile updates state asynchronously we derive from result in
            // the render. Instead set a sentinel that this run is "pending
            // evaluation" and check result in render.
        });
        // The actual state transition (solved vs submitted-incorrect) happens
        // in the render path when result arrives — see the evaluateFixResult
        // helper below.
        setFixMode((prev) =>
            prev.kind === "editing" || prev.kind === "submitted-incorrect"
                ? { kind: "submitted-incorrect", editedCode: prev.editedCode }
                : prev
        );
    }

    function handleGiveUp() {
        clear();
        setFixMode({ kind: "gave-up" });
    }

    // When a compile result arrives after a fix run, promote submitted-incorrect
    // to solved if the run succeeded. We do this synchronously in render to
    // avoid a double-render cycle from useEffect.
    let resolvedFixMode = fixMode;
    if (fixMode.kind === "submitted-incorrect" && result !== null) {
        if (result.success) {
            resolvedFixMode = {
                kind: "solved",
                editedCode: fixMode.editedCode,
            };
        }
    }

    // Fix mode is active when we are in editing, submitted-incorrect, solved,
    // or gave-up states.
    const fixActive = resolvedFixMode.kind !== "idle";
    const fixSolved = resolvedFixMode.kind === "solved";
    const fixGaveUp = resolvedFixMode.kind === "gave-up";

    // Reveal explanation when: answered compile-guess AND fix mode is not
    // active, OR fix mode has reached solved/gave-up.
    const revealExplanation =
        (answered && !fixActive) || fixSolved || fixGaveUp;

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

            {/* Compiler output for the read-only snippet run (only when fix
                mode is not active, to avoid output panel collisions). */}
            {!fixActive ? (
                <CompileOutput
                    result={result}
                    compiling={compiling}
                    onClear={clear}
                />
            ) : null}

            {/* Will-it-compile guess buttons */}
            {!answered ? (
                <div className={answerGrid}>
                    <button
                        onClick={() => {
                            onAnswer(challenge.id, true);
                        }}
                        className={answerButton}
                        style={{ color: vars.colour.good }}
                    >
                        <Check size={17} aria-hidden="true" /> Compiles
                    </button>
                    <button
                        onClick={() => {
                            onAnswer(challenge.id, false);
                        }}
                        className={answerButton}
                        style={{ color: vars.colour.bad }}
                    >
                        <X size={17} aria-hidden="true" /> Won&apos;t compile
                    </button>
                </div>
            ) : null}

            {/* Fix mode toggle button — shown on eligible cards regardless
                of whether the compile-guess has been answered. */}
            {eligible ? (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                    }}
                >
                    <button
                        onClick={handleToggleFix}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.375rem",
                            padding: "0.375rem 0.75rem",
                            borderRadius: "0.375rem",
                            fontSize: "0.8125rem",
                            fontWeight: 500,
                            background: fixActive
                                ? vars.colour.panel2
                                : vars.colour.accentDim,
                            color: fixActive
                                ? vars.colour.dim
                                : vars.colour.accent,
                            border: `1px solid ${fixActive ? vars.colour.border : vars.colour.accent}`,
                            cursor: "pointer",
                            transition: "background 0.15s",
                        }}
                    >
                        <Wrench size={13} aria-hidden="true" />
                        {fixActive ? "Close fix mode" : "Try fixing it"}
                    </button>
                </div>
            ) : null}

            {/* Fix mode body */}
            {fixActive ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem",
                    }}
                >
                    {resolvedFixMode.kind === "solved" ? (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                fontSize: "0.875rem",
                                fontWeight: 600,
                                color: vars.colour.good,
                            }}
                        >
                            <Check size={16} aria-hidden="true" /> Fixed!
                        </div>
                    ) : null}

                    {resolvedFixMode.kind !== "gave-up" &&
                    resolvedFixMode.kind !== "solved" ? (
                        <>
                            <EditableCode
                                value={
                                    resolvedFixMode.kind === "editing" ||
                                    resolvedFixMode.kind ===
                                        "submitted-incorrect"
                                        ? resolvedFixMode.editedCode
                                        : challenge.code
                                }
                                onChange={handleEditChange}
                                onRun={handleRunFix}
                                compiling={compiling}
                            />
                            <CompileOutput
                                result={result}
                                compiling={compiling}
                                onClear={clear}
                            />
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end",
                                }}
                            >
                                <button
                                    onClick={handleGiveUp}
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "0.375rem",
                                        padding: "0.375rem 0.75rem",
                                        borderRadius: "0.375rem",
                                        fontSize: "0.8125rem",
                                        fontWeight: 500,
                                        background: "transparent",
                                        color: vars.colour.dim,
                                        border: `1px solid ${vars.colour.border}`,
                                        cursor: "pointer",
                                    }}
                                >
                                    Show me the fix
                                </button>
                            </div>
                        </>
                    ) : null}

                    {/* After solving, show the edited code (read-only) and
                        the compile output confirming success. */}
                    {resolvedFixMode.kind === "solved" ? (
                        <>
                            <CodeBlock
                                code={resolvedFixMode.editedCode}
                                label="your fix"
                            />
                            <CompileOutput
                                result={result}
                                compiling={compiling}
                                onClear={clear}
                            />
                        </>
                    ) : null}
                </div>
            ) : null}

            {/* Compile-guess feedback and explanation — shown when the
                will-it-compile guess has been answered AND fix mode is not
                active; OR when fix mode has reached solved/gave-up. */}
            {revealExplanation ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                    }}
                >
                    {/* Only show the guess correctness badge when the guess
                        has been answered. */}
                    {answered ? (
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
                                {isCorrect ? (
                                    <Check size={16} aria-hidden="true" />
                                ) : (
                                    <X size={16} aria-hidden="true" />
                                )}
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
                    ) : (
                        /* Fix mode solved/gave-up without answering the guess
                           first — show just the explanation text. */
                        <div
                            className={feedbackBox}
                            style={{
                                background: vars.colour.panel2,
                                border: `1px solid ${vars.colour.borderSoft}`,
                            }}
                        >
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
                    )}

                    {/* Canonical fix snippet — shown when not in an active
                        (editing/submitted-incorrect) fix-mode session. */}
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
                            {!fixActive ? (
                                <CompileOutput
                                    result={result}
                                    compiling={compiling}
                                    onClear={clear}
                                />
                            ) : null}
                        </div>
                    ) : null}
                </div>
            ) : null}
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
                        aria-hidden="true"
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
                    <Trophy
                        size={14}
                        aria-hidden="true"
                        style={{ color: vars.colour.accent }}
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
                />
            ))}
        </div>
    );
}

export { ChallengeView };
