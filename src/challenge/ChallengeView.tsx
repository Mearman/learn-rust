import { useEffect, useMemo, useState } from "react";
import {
    Check,
    ClipboardList,
    Lightbulb,
    RotateCcw,
    Trophy,
    Wrench,
    X,
} from "lucide-react";
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
import type { Challenge, ChallengeChoice } from "./challenges.ts";
import type { ChallengeAnswers } from "./useChallengeAnswers.ts";
import type { ReviewStore } from "./spacedRepetition.ts";
import { dueChallengeIds } from "./spacedRepetition.ts";
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
    /** Record a spaced-repetition review outcome for this challenge. */
    readonly onRecordReview: (
        challengeId: string,
        correct: boolean,
        shownAt: number
    ) => void;
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
    onRecordReview,
}: ChallengeCardProps) {
    const { compiling, result, compile, clear } = useCompiler();
    const answered = guess !== undefined;
    const isCorrect = answered && guess === challenge.compiles;
    const fix = challenge.fix;
    const eligible = isFixEligible(challenge);

    // Epoch ms when this card mounted — used to derive SR answer speed.
    // useState lazy initialiser runs once at mount, outside render, which
    // satisfies react-hooks/purity (Date.now() is impure so banned in render).
    const [shownAt] = useState<number>(() => Date.now());

    const [fixMode, setFixMode] = useState<FixMode>({ kind: "idle" });

    // Multiple-choice selection — card-local state.
    // undefined = not yet answered; string = chosen option id.
    const [mcChoice, setMcChoice] = useState<string | undefined>(undefined);
    const choices = challenge.choices;

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
        void compile(editedCode, `${challenge.id}-fix`);
        // The actual state transition (solved vs submitted-incorrect) happens
        // in the render path below when the result arrives.
        setFixMode((prev) =>
            prev.kind === "editing" || prev.kind === "submitted-incorrect"
                ? { kind: "submitted-incorrect", editedCode: prev.editedCode }
                : prev
        );
    }

    function handleGiveUp() {
        clear();
        setFixMode({ kind: "gave-up" });
        // Give-up counts as incorrect for SR (spec: "wrong answer equivalent").
        onRecordReview(challenge.id, false, shownAt);
    }

    // Derive the resolved fix mode synchronously from state: when a successful
    // compile result arrives while in submitted-incorrect, the UI transitions
    // to solved without a double-render cycle.
    let resolvedFixMode: FixMode = fixMode;
    if (fixMode.kind === "submitted-incorrect" && result !== null) {
        if (result.success) {
            resolvedFixMode = {
                kind: "solved",
                editedCode: fixMode.editedCode,
            };
        }
    }

    // Record the correct SR review once when the fix is first solved.
    // useEffect runs after render so it is outside the render path; it calls
    // only onRecordReview (no setState), which the linter permits.
    // The `fixSolved` flag (a boolean derived from resolvedFixMode) is stable
    // once it flips to true and does not create an effect loop.
    const fixSolved = resolvedFixMode.kind === "solved";
    useEffect(() => {
        if (!fixSolved) return;
        onRecordReview(challenge.id, true, shownAt);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fixSolved]);

    // Multiple-choice: resolve the chosen option object (if any).
    const chosenOption: ChallengeChoice | undefined =
        mcChoice !== undefined && choices !== undefined
            ? choices.options.find((o) => o.id === mcChoice)
            : undefined;
    const mcAnswered = chosenOption !== undefined;
    const mcCorrect = chosenOption?.correct === true;

    // Record SR review when MC answer is first submitted.
    useEffect(() => {
        if (!mcAnswered) return;
        onRecordReview(challenge.id, mcCorrect, shownAt);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mcAnswered]);

    // Fix mode is active when we are in editing, submitted-incorrect, solved,
    // or gave-up states.
    const fixActive = resolvedFixMode.kind !== "idle";
    const fixGaveUp = resolvedFixMode.kind === "gave-up";

    // Reveal explanation when:
    // - MC mode: an option has been chosen, OR fix mode has resolved
    // - non-MC: answered compile-guess AND fix mode is not active,
    //   OR fix mode has reached solved/gave-up.
    const revealExplanation =
        choices !== undefined
            ? mcAnswered || fixSolved || fixGaveUp
            : (answered && !fixActive) || fixSolved || fixGaveUp;

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
                    void compile(challenge.code, challenge.id);
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

            {/* Multiple-choice options — shown when the challenge has choices
                and no option has been selected yet. */}
            {choices !== undefined ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.625rem",
                    }}
                >
                    <span
                        className={monoSm}
                        style={{ color: vars.colour.dim, fontSize: "0.8rem" }}
                    >
                        {choices.prompt}
                    </span>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem",
                        }}
                    >
                        {choices.options.map((option) => {
                            const isChosen = mcChoice === option.id;
                            let borderColor = vars.colour.border;
                            let bgColor = vars.colour.panel2;
                            let textColor = vars.colour.text;
                            if (mcAnswered && isChosen) {
                                if (option.correct) {
                                    borderColor = vars.colour.good;
                                    bgColor = vars.colour.goodDim;
                                    textColor = vars.colour.good;
                                } else {
                                    borderColor = vars.colour.bad;
                                    bgColor = vars.colour.badDim;
                                    textColor = vars.colour.bad;
                                }
                            } else if (mcAnswered && option.correct) {
                                // After a wrong pick, highlight the correct answer
                                borderColor = vars.colour.good;
                                bgColor = vars.colour.goodDim;
                                textColor = vars.colour.good;
                            }
                            return (
                                <div
                                    key={option.id}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "0.375rem",
                                    }}
                                >
                                    <button
                                        type="button"
                                        disabled={mcAnswered}
                                        onClick={() => {
                                            if (!mcAnswered) {
                                                setMcChoice(option.id);
                                            }
                                        }}
                                        style={{
                                            textAlign: "left",
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: "0.5rem",
                                            padding: "0.625rem 0.75rem",
                                            borderRadius: "0.5rem",
                                            fontSize: "0.875rem",
                                            fontWeight:
                                                mcAnswered && option.correct
                                                    ? 600
                                                    : 400,
                                            background: bgColor,
                                            color: textColor,
                                            border: `1px solid ${borderColor}`,
                                            cursor: mcAnswered
                                                ? "default"
                                                : "pointer",
                                            transition:
                                                "background 0.15s, border-color 0.15s",
                                            width: "100%",
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        <span
                                            style={{
                                                fontFamily:
                                                    "ui-monospace, monospace",
                                                fontSize: "0.75rem",
                                                flexShrink: 0,
                                                marginTop: "0.1rem",
                                                color:
                                                    mcAnswered &&
                                                    (isChosen || option.correct)
                                                        ? textColor
                                                        : vars.colour.faint,
                                            }}
                                        >
                                            {option.id}.
                                        </span>
                                        <span>{option.text}</span>
                                        {mcAnswered && option.correct ? (
                                            <Check
                                                size={15}
                                                aria-hidden="true"
                                                style={{
                                                    flexShrink: 0,
                                                    marginLeft: "auto",
                                                    marginTop: "0.15rem",
                                                    color: vars.colour.good,
                                                }}
                                            />
                                        ) : null}
                                        {mcAnswered &&
                                        isChosen &&
                                        !option.correct ? (
                                            <X
                                                size={15}
                                                aria-hidden="true"
                                                style={{
                                                    flexShrink: 0,
                                                    marginLeft: "auto",
                                                    marginTop: "0.15rem",
                                                    color: vars.colour.bad,
                                                }}
                                            />
                                        ) : null}
                                    </button>
                                    {/* Misconception note — shown below the chosen wrong option */}
                                    {mcAnswered &&
                                    isChosen &&
                                    !option.correct &&
                                    option.misconception !== undefined ? (
                                        <div
                                            style={{
                                                marginLeft: "0.75rem",
                                                padding:
                                                    "0.5rem 0.625rem 0.5rem 0.75rem",
                                                borderLeft: `2px solid ${vars.colour.bad}`,
                                                fontSize: "0.8125rem",
                                                lineHeight: 1.5,
                                                color: vars.colour.dim,
                                                background: vars.colour.badDim,
                                                borderRadius:
                                                    "0 0.375rem 0.375rem 0",
                                            }}
                                        >
                                            {option.misconception}
                                        </div>
                                    ) : null}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : null}

            {/* Will-it-compile guess buttons — only on non-MC challenges */}
            {choices === undefined && !answered ? (
                <div className={answerGrid}>
                    <button
                        onClick={() => {
                            onAnswer(challenge.id, true);
                            // Guess "compiles" — correct iff code actually compiles.
                            onRecordReview(
                                challenge.id,
                                challenge.compiles,
                                shownAt
                            );
                        }}
                        className={answerButton}
                        style={{ color: vars.colour.good }}
                    >
                        <Check size={17} aria-hidden="true" /> Compiles
                    </button>
                    <button
                        onClick={() => {
                            onAnswer(challenge.id, false);
                            // Guess "won't compile" — correct iff code actually doesn't.
                            onRecordReview(
                                challenge.id,
                                !challenge.compiles,
                                shownAt
                            );
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
                    {fixMode.kind === "solved" ? (
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

                    {fixMode.kind !== "gave-up" && fixMode.kind !== "solved" ? (
                        <>
                            <EditableCode
                                value={
                                    fixMode.kind === "editing" ||
                                    fixMode.kind === "submitted-incorrect"
                                        ? fixMode.editedCode
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
                    {fixMode.kind === "solved" ? (
                        <>
                            <CodeBlock
                                code={fixMode.editedCode}
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

            {/* Explanation revealed after a selection is made (MC) or after
                the compile-guess has been answered / fix mode resolved. */}
            {revealExplanation ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                    }}
                >
                    {/* MC mode: show correct/incorrect badge based on MC result */}
                    {choices !== undefined ? (
                        <div
                            className={`${feedbackBox} ${mcCorrect ? feedbackCorrect : feedbackIncorrect}`}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    fontSize: "0.875rem",
                                    fontWeight: 600,
                                    color: mcCorrect
                                        ? vars.colour.good
                                        : vars.colour.bad,
                                }}
                            >
                                {mcCorrect ? (
                                    <Check size={16} aria-hidden="true" />
                                ) : (
                                    <X size={16} aria-hidden="true" />
                                )}
                                {mcCorrect ? "Correct" : "Not quite"}
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
                        </div>
                    ) : answered ? (
                        /* Non-MC: compile-guess answered — show badge + explanation */
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
                                    void compile(
                                        fix,
                                        `${challenge.id}-revealed-fix`
                                    );
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
                        style={{
                            color: vars.colour.accent,
                            flexShrink: 0,
                            marginTop: 2,
                        }}
                    />
                    <span>{note}</span>
                </div>
            ))}

            {/* Due-for-review bucket — rendered above the summary when there
                are challenges whose SR interval has elapsed. */}
            {dueIds.size > 0 ? (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        padding: "0.875rem",
                        borderRadius: "0.5rem",
                        border: `1px solid ${vars.colour.accent}`,
                        background: vars.colour.accentDim,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            fontSize: "0.8125rem",
                            fontWeight: 600,
                            color: vars.colour.accent,
                        }}
                    >
                        <ClipboardList size={14} aria-hidden="true" />
                        Due for review
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.5rem",
                        }}
                    >
                        {Array.from(dueIds).map((id) => {
                            const c = challengeById.get(id);
                            if (c === undefined) return null;
                            // Find position for the label
                            const idx = challenges.findIndex(
                                (ch) => ch.id === id
                            );
                            return (
                                <a
                                    key={id}
                                    href={`#${id}`}
                                    style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "0.25rem",
                                        padding: "0.25rem 0.625rem",
                                        borderRadius: "0.375rem",
                                        fontSize: "0.8125rem",
                                        fontWeight: 500,
                                        background: vars.colour.accentDim,
                                        color: vars.colour.accent,
                                        border: `1px solid ${vars.colour.accent}`,
                                        textDecoration: "none",
                                    }}
                                >
                                    {idx >= 0 ? `${String(idx + 1)}.` : ""}{" "}
                                    {c.topic}
                                </a>
                            );
                        })}
                    </div>
                </div>
            ) : null}

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
                    onRecordReview={onRecordReview}
                />
            ))}
        </div>
    );
}

export { ChallengeView };
