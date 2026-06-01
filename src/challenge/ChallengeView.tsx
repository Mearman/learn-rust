import { Check, ChevronRight, RotateCcw, Trophy, X } from "lucide-react";
import { C } from "../theme/colours.ts";
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

function levelColor(level: string): string {
    if (level === "warm-up") return C.good;
    if (level === "core") return C.accentSoft;
    return C.bad;
}

interface ChallengeViewProps {
    readonly state: ChallengeState;
    readonly dispatch: (action: ChallengeAction) => void;
}

function Results({ state, dispatch }: ChallengeViewProps) {
    const pct = state.total === 0 ? 0 : Math.round((state.correct / state.total) * 100);
    return (
        <div className="flex flex-col items-center justify-center text-center gap-4 py-12">
            <Trophy size={44} style={{ color: C.accent }} />
            <h2 className="text-2xl font-bold m-0" style={{ color: C.text }}>
                {state.correct} / {state.total} correct
            </h2>
            <p className="text-sm m-0" style={{ color: C.dim }}>
                {pct >= 80
                    ? "The borrow checker holds no fear for you."
                    : pct >= 50
                        ? "Solid instincts. The tricky borrows are where the points hide."
                        : "Replay the Borrowing and Lifetimes lessons, then run it back."}
            </p>
            <button
                onClick={() => dispatch({ type: "reset" })}
                className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
                style={{ background: C.accent, color: "#1a0f08" }}
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
        <div className="flex flex-col gap-4 max-w-2xl mx-auto w-full">
            <div className="flex items-center justify-between text-xs font-mono" style={{ color: C.faint }}>
                <span>
                    challenge {state.index + 1} / {CHALLENGES.length}
                </span>
                <span className="flex items-center gap-3">
                    <span style={{ color: levelColor(ch.level) }}>{ch.level}</span>
                    <span style={{ color: C.dim }}>{ch.topic}</span>
                </span>
            </div>

            <h2 className="text-xl font-bold m-0" style={{ color: C.text }}>
                Will this compile?
            </h2>

            <CodeBlock code={ch.code} label="snippet.rs" />

            {!state.answered ? (
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => dispatch({ type: "answer", guess: true })}
                        className="flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-colors"
                        style={{ background: C.panel2, color: C.good, border: `1px solid ${C.border}` }}
                    >
                        <Check size={17} /> Compiles
                    </button>
                    <button
                        onClick={() => dispatch({ type: "answer", guess: false })}
                        className="flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold transition-colors"
                        style={{ background: C.panel2, color: C.bad, border: `1px solid ${C.border}` }}
                    >
                        <X size={17} /> Won't compile
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <div
                        className="rounded-lg p-3.5 flex flex-col gap-2"
                        style={{
                            background: isCorrect ? C.goodDim : C.badDim,
                            border: `1px solid ${isCorrect ? C.good : C.bad}`,
                        }}
                    >
                        <div
                            className="flex items-center gap-2 text-sm font-semibold"
                            style={{ color: isCorrect ? C.good : C.bad }}
                        >
                            {isCorrect ? <Check size={16} /> : <X size={16} />}
                            {isCorrect ? "Correct" : "Not quite"}
                            <span style={{ color: C.dim, fontWeight: 400 }}>
                                — this code {ch.compiles ? "compiles" : "does not compile"}.
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed m-0" style={{ color: C.text }}>
                            {ch.why}
                        </p>
                    </div>

                    {ch.fix ? (
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-mono" style={{ color: C.faint }}>
                                one way to fix it
                            </span>
                            <CodeBlock code={ch.fix} label="fixed.rs" />
                        </div>
                    ) : null}

                    <button
                        onClick={() => dispatch({ type: "next" })}
                        className="self-end flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors"
                        style={{ background: C.accent, color: "#1a0f08" }}
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
