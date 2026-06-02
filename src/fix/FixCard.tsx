import { useState } from "react";
import { Check, Lightbulb } from "lucide-react";
import { vars } from "../theme/theme.css.ts";
import {
    challengeCard,
    monoSm,
    dimSm,
    feedbackBox,
    feedbackCorrect,
} from "../theme/styles.css.ts";
import {
    cardHeader,
    cardHeaderMeta,
    fixBody,
    fixSolvedLine,
    giveUpButton,
    explanation,
    explanationText,
    fixSnippet,
    neutralFeedback,
} from "../challenge/challenge.css.ts";
import {
    fixActionRow,
    hintList,
    hintItem,
    hintLabel,
    hintText,
    hintButton,
} from "./fix.css.ts";
import { CodeBlock } from "../highlight/CodeBlock.tsx";
import { EditableCode } from "../challenge/EditableCode.tsx";
import { CompileOutput } from "../compiler/CompileOutput.tsx";
import { useCompiler } from "../compiler/useCompiler.ts";
import type { FixExercise } from "../data/types.ts";

function levelColour(level: FixExercise["level"]): string {
    if (level === "warm-up") return vars.colour.good;
    if (level === "core") return vars.colour.accentSoft;
    return vars.colour.bad;
}

/** The reader's progress through a single fix exercise. The card starts in
 *  `editing` seeded with the broken snippet; running an edit moves to
 *  `submitted` (the oracle verdict resolves "solved" synchronously from the
 *  compile result); "Show me the fix" jumps to `gave-up`. */
type FixState =
    | { readonly kind: "editing"; readonly code: string }
    | { readonly kind: "submitted"; readonly code: string }
    | { readonly kind: "gave-up" };

interface FixCardProps {
    readonly exercise: FixExercise;
    readonly number: number;
    readonly total: number;
}

/** One fix exercise, independently solvable. Each card owns its compiler so a
 *  run only shows output on that card. The card root carries the exercise id so
 *  it is a scroll-tracked sidebar sub-section. */
export function FixCard({ exercise, number, total }: FixCardProps) {
    const { compiling, result, blockId, compile, clear } = useCompiler();
    const [state, setState] = useState<FixState>({
        kind: "editing",
        code: exercise.brokenCode,
    });
    const [hintsShown, setHintsShown] = useState(0);

    const idiomaticBlockId = `${exercise.id}-idiomatic`;

    // A submitted edit the oracle accepted is "solved" — derived synchronously
    // from the compile result so the success view lands in the same render the
    // result arrives, with no double-render flash.
    const solved =
        state.kind === "submitted" &&
        result !== null &&
        result.success &&
        blockId === `${exercise.id}-fix`;
    const gaveUp = state.kind === "gave-up";
    const revealed = solved || gaveUp;

    // While unsolved the editor stays open — including after a rejected attempt,
    // so the reader can read the compiler error and keep editing.
    const editorActive = !revealed;
    const editedCode =
        state.kind === "editing" || state.kind === "submitted"
            ? state.code
            : exercise.brokenCode;

    const allHintsShown = hintsShown >= exercise.hints.length;

    function handleChange(code: string) {
        setState({ kind: "editing", code });
        clear();
    }

    function handleRun() {
        if (state.kind !== "editing" && state.kind !== "submitted") return;
        const code = state.code;
        void compile(code, `${exercise.id}-fix`);
        setState({ kind: "submitted", code });
    }

    function handleGiveUp() {
        clear();
        setState({ kind: "gave-up" });
    }

    // The idiomatic-fix snippet has its own run; only show its output when that
    // snippet is the block that ran, never the reader's earlier edit result.
    const showIdiomaticOutput =
        blockId === idiomaticBlockId && (compiling || result !== null);

    return (
        <div id={exercise.id} className={challengeCard}>
            <div className={`${cardHeader} ${monoSm}`}>
                <span>
                    fix {number} / {total}
                </span>
                <span className={cardHeaderMeta}>
                    <span style={{ color: levelColour(exercise.level) }}>
                        {exercise.level}
                    </span>
                    <span className={dimSm}>{exercise.topic}</span>
                </span>
            </div>

            {editorActive ? (
                <div className={fixBody}>
                    <EditableCode
                        value={editedCode}
                        onChange={handleChange}
                        onRun={handleRun}
                        compiling={compiling}
                    />
                    <CompileOutput
                        result={result}
                        compiling={compiling}
                        onClear={clear}
                    />

                    {hintsShown > 0 ? (
                        <ol className={hintList}>
                            {exercise.hints
                                .slice(0, hintsShown)
                                .map((hint, i) => (
                                    <li key={i} className={hintItem}>
                                        <span className={hintLabel}>
                                            {hint.label}
                                        </span>
                                        <span className={hintText}>
                                            {hint.text}
                                        </span>
                                    </li>
                                ))}
                        </ol>
                    ) : null}

                    <div className={fixActionRow}>
                        {allHintsShown ? (
                            <span />
                        ) : (
                            <button
                                type="button"
                                className={hintButton}
                                onClick={() => {
                                    setHintsShown((n) => n + 1);
                                }}
                            >
                                <Lightbulb size={13} aria-hidden="true" />
                                {hintsShown === 0
                                    ? "Need a hint?"
                                    : "Next hint"}
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={handleGiveUp}
                            className={giveUpButton}
                        >
                            Show me the fix
                        </button>
                    </div>
                </div>
            ) : null}

            {solved ? (
                <div className={fixSolvedLine}>
                    <Check size={16} aria-hidden="true" /> Fixed! The compiler
                    accepted your repair.
                </div>
            ) : null}

            {revealed ? (
                <div className={explanation}>
                    <div
                        className={`${feedbackBox} ${solved ? feedbackCorrect : neutralFeedback}`}
                    >
                        <p className={explanationText}>
                            {exercise.idiomaticNote}
                        </p>
                    </div>

                    <div className={fixSnippet}>
                        <span className={monoSm}>idiomatic fix</span>
                        <CodeBlock
                            code={exercise.idiomaticFix}
                            label="fixed.rs"
                            onRun={() => {
                                void compile(
                                    exercise.idiomaticFix,
                                    idiomaticBlockId
                                );
                            }}
                            compiling={compiling}
                        />
                        {showIdiomaticOutput ? (
                            <CompileOutput
                                result={result}
                                compiling={compiling}
                                onClear={clear}
                            />
                        ) : null}
                    </div>
                </div>
            ) : null}
        </div>
    );
}
