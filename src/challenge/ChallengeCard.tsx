import { useEffect, useState } from "react";
import { Check, Wrench, X } from "lucide-react";
import { vars } from "../theme/theme.css.ts";
import {
    feedbackBox,
    feedbackCorrect,
    feedbackIncorrect,
    answerGrid,
    answerButton,
    monoSm,
    dimSm,
    challengeCard,
} from "../theme/styles.css.ts";
import {
    cardHeader,
    cardHeaderMeta,
    mcBlock,
    mcPrompt,
    mcOptionList,
    mcOption,
    mcOptionButton,
    mcOptionId,
    mcOptionIcon,
    mcMisconception,
    actionRow,
    fixToggleButton,
    explanation,
    verdictLine,
    verdictSuffix,
    explanationText,
    neutralFeedback,
    fixSnippet,
} from "./challenge.css.ts";
import { CodeBlock } from "../highlight/CodeBlock.tsx";
import { CompileOutput } from "../compiler/CompileOutput.tsx";
import { useCompiler } from "../compiler/useCompiler.ts";
import { FixModeEditor } from "./FixModeEditor.tsx";
import type { FixMode } from "./FixModeEditor.tsx";
import { PerLanguageNotes } from "./PerLanguageNotes.tsx";
import type { Challenge, ChallengeChoice } from "./challenges.ts";
import type { LanguageFamiliarity } from "../data/languages.ts";

function levelColour(level: string): string {
    if (level === "warm-up") return vars.colour.good;
    if (level === "core") return vars.colour.accentSoft;
    return vars.colour.bad;
}

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
export function ChallengeCard({
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
            <div className={`${cardHeader} ${monoSm}`}>
                <span>
                    challenge {number} / {total}
                </span>
                <span className={cardHeaderMeta}>
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
                <div className={mcBlock}>
                    <span className={`${monoSm} ${mcPrompt}`}>
                        {choices.prompt}
                    </span>
                    <div className={mcOptionList}>
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
                                <div key={option.id} className={mcOption}>
                                    <button
                                        type="button"
                                        disabled={mcAnswered}
                                        onClick={() => {
                                            if (!mcAnswered) {
                                                setMcChoice(option.id);
                                            }
                                        }}
                                        className={mcOptionButton}
                                        style={{
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
                                        }}
                                    >
                                        <span
                                            className={mcOptionId}
                                            style={{
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
                                                className={mcOptionIcon}
                                                style={{
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
                                                className={mcOptionIcon}
                                                style={{
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
                                        <div className={mcMisconception}>
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
                <div className={actionRow}>
                    <button
                        onClick={handleToggleFix}
                        className={fixToggleButton}
                        style={{
                            background: fixActive
                                ? vars.colour.panel2
                                : vars.colour.accentDim,
                            color: fixActive
                                ? vars.colour.dim
                                : vars.colour.accent,
                            border: `1px solid ${fixActive ? vars.colour.border : vars.colour.accent}`,
                        }}
                    >
                        <Wrench size={13} aria-hidden="true" />
                        {fixActive ? "Close fix mode" : "Try fixing it"}
                    </button>
                </div>
            ) : null}

            {/* Fix mode body */}
            {fixActive ? (
                <FixModeEditor
                    fixMode={resolvedFixMode}
                    originalCode={challenge.code}
                    compiling={compiling}
                    result={result}
                    onEditChange={handleEditChange}
                    onRun={handleRunFix}
                    onGiveUp={handleGiveUp}
                    onClear={clear}
                />
            ) : null}

            {/* Explanation revealed after a selection is made (MC) or after
                the compile-guess has been answered / fix mode resolved. */}
            {revealExplanation ? (
                <div className={explanation}>
                    {/* MC mode: show correct/incorrect badge based on MC result */}
                    {choices !== undefined ? (
                        <div
                            className={`${feedbackBox} ${mcCorrect ? feedbackCorrect : feedbackIncorrect}`}
                        >
                            <div
                                className={verdictLine}
                                style={{
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
                            <p className={explanationText}>{challenge.why}</p>
                        </div>
                    ) : answered ? (
                        /* Non-MC: compile-guess answered — show badge + explanation */
                        <div
                            className={`${feedbackBox} ${isCorrect ? feedbackCorrect : feedbackIncorrect}`}
                        >
                            <div
                                className={verdictLine}
                                style={{
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
                                <span className={verdictSuffix}>
                                    — this code{" "}
                                    {challenge.compiles
                                        ? "compiles"
                                        : "does not compile"}
                                    .
                                </span>
                            </div>
                            <p className={explanationText}>{challenge.why}</p>
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
                        <div className={`${feedbackBox} ${neutralFeedback}`}>
                            <p className={explanationText}>{challenge.why}</p>
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
                        <div className={fixSnippet}>
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
