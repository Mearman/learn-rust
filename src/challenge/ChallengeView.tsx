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
import { CHALLENGES } from "./challenges.ts";

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

function challengeReducer(state: ChallengeState, action: ChallengeAction): ChallengeState {
    if (action.type === "answer") {
        const ch = CHALLENGES[state.index];
        return {
            ...state,
            answered: true,
            guess: action.guess,
            total: state.total + 1,
            correct: state.correct + (ch !== undefined && action.guess === ch.compiles ? 1 : 0),
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

interface ChallengeViewProps {
    readonly state: ChallengeState;
    readonly dispatch: (action: ChallengeAction) => void;
}

function Results({ state, dispatch }: ChallengeViewProps) {
    const pct = state.total === 0 ? 0 : Math.round((state.correct / state.total) * 100);
    return (
        <div className={challengeResult}>
            <Trophy size={44} style={{ color: vars.colour.accent }} />
            <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0, color: vars.colour.text }}>
                {state.correct} / {state.total} correct
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

export function ChallengeView({ state, dispatch }: ChallengeViewProps) {
    const done = state.index >= CHALLENGES.length;

    if (done) {
        return <Results state={state} dispatch={dispatch} />;
    }

    const ch = CHALLENGES[state.index];
    if (ch === undefined) return null;

    const isCorrect = state.answered && state.guess === ch.compiles;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "42rem", margin: "0 auto", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }} className={monoSm}>
                <span>challenge {state.index + 1} / {CHALLENGES.length}</span>
                <span style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ color: levelColour(ch.level) }}>{ch.level}</span>
                    <span className={dimSm}>{ch.topic}</span>
                </span>
            </div>

            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0, color: vars.colour.text }}>
                Will this compile?
            </h2>

            <CodeBlock code={ch.code} label="snippet.rs" />

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
                        <X size={17} /> Won't compile
                    </button>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div className={`${feedbackBox} ${isCorrect ? feedbackCorrect : feedbackIncorrect}`}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", fontWeight: 600, color: isCorrect ? vars.colour.good : vars.colour.bad }}>
                            {isCorrect ? <Check size={16} /> : <X size={16} />}
                            {isCorrect ? "Correct" : "Not quite"}
                            <span style={{ color: vars.colour.dim, fontWeight: 400 }}>
                                — this code {ch.compiles ? "compiles" : "does not compile"}.
                            </span>
                        </div>
                        <p style={{ fontSize: "0.875rem", lineHeight: 1.625, margin: 0, color: vars.colour.text }}>
                            {ch.why}
                        </p>
                    </div>

                    {ch.fix ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            <span className={monoSm}>one way to fix it</span>
                            <CodeBlock code={ch.fix} label="fixed.rs" />
                        </div>
                    ) : null}

                    <button
                        onClick={() => dispatch({ type: "next" })}
                        className={nextButton}
                    >
                        {state.index + 1 >= CHALLENGES.length ? "See results" : "Next challenge"}
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}

export { challengeReducer };
export type { ChallengeState, ChallengeAction };
