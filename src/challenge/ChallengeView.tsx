import { useMemo } from "react";
import { Check, ChevronRight, RotateCcw, Trophy, X } from "lucide-react";
import { vars } from "../theme/theme.css.ts";
import {
    challengeResult,
    answerGrid,
    answerButton,
    feedbackBox,
    feedbackCorrect,
    feedbackIncorrect,
    nextButton,
    monoSm,
    dimSm,
} from "../theme/styles.css.ts";
import { CodeBlock } from "../highlight/CodeBlock.tsx";
import { CompileOutput } from "../compiler/CompileOutput.tsx";
import { CHALLENGES, getFilteredChallenges } from "./challenges.ts";
import type { Challenge } from "./challenges.ts";
import type { CompileResult } from "../compiler/types.ts";
import type { LanguageFamiliarity, UserProfile } from "../settings/types.ts";
import { languageFamiliarityLabel } from "../settings/languages.ts";

interface ChallengeState {
    readonly index: number;
    readonly answered: boolean;
    readonly guess: boolean | null;
    readonly correct: number;
    readonly total: number;
}

type ChallengeAction =
    | { readonly type: "answer"; readonly guess: boolean }
    | { readonly type: "next" }
    | { readonly type: "reset" };

function challengeReducer(
    state: ChallengeState,
    action: ChallengeAction,
    challenges: readonly Challenge[] = CHALLENGES,
): ChallengeState {
    if (action.type === "answer") {
        const ch = challenges[state.index];
        return {
            ...state,
            answered: true,
            guess: action.guess,
            total: state.total + 1,
            correct:
                state.correct +
                (ch !== undefined && action.guess === ch.compiles ? 1 : 0),
        };
    }
    if (action.type === "next") {
        return { ...state, index: state.index + 1, answered: false, guess: null };
    }
    if (action.type === "reset") {
        return { index: 0, answered: false, guess: null, correct: 0, total: 0 };
    }
    return state;
}

function levelColour(level: string): string {
    if (level === "warm-up") return vars.colour.good;
    if (level === "core") return vars.colour.accentSoft;
    return vars.colour.bad;
}

function PerLanguageNote({
    challenge,
    familiarity,
}: {
    readonly challenge: Challenge;
    readonly familiarity: Exclude<LanguageFamiliarity, "none">;
}) {
    const explanation = challenge.whyPerLanguage?.[familiarity];
    if (explanation === undefined) return null;
    return (
        <div
            style={{
                borderTop: `1px solid ${vars.colour.borderSoft}`,
                paddingTop: "0.5rem",
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
                <span
                    style={{
                        color: vars.colour.accentSoft,
                        fontWeight: 600,
                    }}
                >
                    If you're familiar with {languageFamiliarityLabel(familiarity)}:{" "}
                </span>
                {explanation}
            </p>
        </div>
    );
}

function Results({
    state,
    dispatch,
    totalChallenges,
}: {
    readonly state: ChallengeState;
    readonly dispatch: (a: ChallengeAction) => void;
    readonly totalChallenges: number;
}) {
    const pct =
        totalChallenges === 0
            ? 0
            : Math.round((state.correct / totalChallenges) * 100);
    return (
        <div className={challengeResult}>
            <Trophy size={44} style={{ color: vars.colour.accent }} />
            <h2
                style={{
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    margin: 0,
                    color: vars.colour.text,
                }}
            >
                {state.correct} / {totalChallenges} correct
            </h2>
            <p style={{ fontSize: "0.875rem", margin: 0, color: vars.colour.dim }}>
                {pct >= 80
                    ? "The borrow checker holds no fear for you."
                    : pct >= 50
                        ? "Solid instincts. The tricky borrows are where the points hide."
                        : "Replay the Borrowing and Lifetimes lessons, then run it back."}
            </p>
            <button
                onClick={() => dispatch({ type: "reset" })}
                className={nextButton}
            >
                <RotateCcw size={16} /> Start over
            </button>
        </div>
    );
}

interface ChallengeViewProps {
    readonly state: ChallengeState;
    readonly dispatch: (action: ChallengeAction) => void;
    readonly profile: UserProfile;
    readonly compiling: boolean;
    readonly compileResult: CompileResult | null;
    onCompile: (code: string) => void;
    onClearCompile: () => void;
}

function ChallengeView({
    state,
    dispatch,
    profile,
    compiling,
    compileResult,
    onCompile,
    onClearCompile,
}: ChallengeViewProps) {
    const filtered = useMemo(
        () => getFilteredChallenges(profile),
        [profile],
    );

    const done = state.index >= filtered.length;

    if (done) {
        return (
            <Results
                state={state}
                dispatch={dispatch}
                totalChallenges={filtered.length}
            />
        );
    }

    const ch = filtered[state.index];
    if (ch === undefined) return null;

    const isCorrect = state.answered && state.guess === ch.compiles;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                maxWidth: "42rem",
                margin: "0 auto",
                width: "100%",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
                className={monoSm}
            >
                <span>
                    challenge {state.index + 1} / {filtered.length}
                </span>
                <span
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                    }}
                >
                    <span style={{ color: levelColour(ch.level) }}>
                        {ch.level}
                    </span>
                    <span className={dimSm}>{ch.topic}</span>
                </span>
            </div>

            <h2
                style={{
                    fontSize: "1.25rem",
                    fontWeight: 700,
                    margin: 0,
                    color: vars.colour.text,
                }}
            >
                Will this compile?
            </h2>

            <CodeBlock
                code={ch.code}
                label="snippet.rs"
                onRun={() => onCompile(ch.code)}
                compiling={compiling}
            />

            <CompileOutput
                result={compileResult}
                compiling={compiling}
                onClear={onClearCompile}
            />

            {!state.answered ? (
                <div className={answerGrid}>
                    <button
                        onClick={() => dispatch({ type: "answer", guess: true })}
                        className={answerButton}
                        style={{ color: vars.colour.good }}
                    >
                        <Check size={17} /> Compiles
                    </button>
                    <button
                        onClick={() => dispatch({ type: "answer", guess: false })}
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
                                {ch.compiles ? "compiles" : "does not compile"}.
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
                            {ch.why}
                        </p>
                        {profile.familiarity !== "none" ? (
                            <PerLanguageNote
                                challenge={ch}
                                familiarity={profile.familiarity}
                            />
                        ) : null}
                    </div>

                    {ch.fix ? (
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.5rem",
                            }}
                        >
                            <span className={monoSm}>one way to fix it</span>
                            <CodeBlock
                                code={ch.fix}
                                label="fixed.rs"
                                onRun={() => onCompile(ch.fix ?? "")}
                                compiling={compiling}
                            />
                            <CompileOutput
                                result={compileResult}
                                compiling={compiling}
                                onClear={onClearCompile}
                            />
                        </div>
                    ) : null}

                    <button
                        onClick={() => dispatch({ type: "next" })}
                        className={nextButton}
                    >
                        {state.index + 1 >= filtered.length
                            ? "See results"
                            : "Next challenge"}
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}

export { challengeReducer, ChallengeView };
export type { ChallengeState, ChallengeAction };
