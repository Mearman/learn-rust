import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { vars } from "../theme/theme.css.ts";
import {
    referenceListGrid,
    cheatTitle,
    navButton,
    outputPre,
    noteBlock,
    transcriptArticle,
    levelBadge,
    annotationNote,
    annotatedLine,
    exerciseBox,
    revealButton,
} from "../theme/styles.css.ts";
import { CodeBlock } from "../highlight/CodeBlock.tsx";
import { COMPILER_ERROR_TRANSCRIPTS } from "../data/compiler-errors.ts";
import type { TranscriptAnnotation } from "../data/types.ts";

interface CompilerErrorsViewProps {
    readonly onOpenConcept: (conceptId: string) => void;
}

/** Colour used for each annotation role. */
const ROLE_COLOUR: Record<TranscriptAnnotation["role"], string> = {
    "error-code": vars.colour.bad,
    "primary-span": vars.colour.bad,
    "secondary-span": vars.colour.accentSoft,
    note: vars.colour.dim,
    help: vars.colour.good,
};

/** Short human label for each role, shown next to the marker. */
const ROLE_LABEL: Record<TranscriptAnnotation["role"], string> = {
    "error-code": "error",
    "primary-span": "primary",
    "secondary-span": "secondary",
    note: "note",
    help: "help",
};

/** Background tint for each level badge. */
const LEVEL_BG: Record<string, string> = {
    "warm-up": vars.colour.goodDim,
    core: vars.colour.accentDim,
    tricky: vars.colour.badDim,
};
const LEVEL_FG: Record<string, string> = {
    "warm-up": vars.colour.good,
    core: vars.colour.accent,
    tricky: vars.colour.bad,
};

// ---------------------------------------------------------------------------
// Per-transcript card
// ---------------------------------------------------------------------------

interface TranscriptCardProps {
    readonly id: string;
    readonly code: string;
    readonly title: string;
    readonly level: string;
    readonly source: string;
    readonly transcript: string;
    readonly annotations: readonly TranscriptAnnotation[];
    readonly question: string;
    readonly answer: string;
    readonly conceptId?: string;
    readonly onOpenConcept: (conceptId: string) => void;
}

function TranscriptCard({
    id,
    code,
    title,
    level,
    source,
    transcript,
    annotations,
    question,
    answer,
    conceptId,
    onOpenConcept,
}: TranscriptCardProps) {
    const [revealed, setRevealed] = useState(false);

    const lines = transcript.split("\n");

    // Build a map from line index to its annotation (we take the first
    // annotation that covers each line; a single annotation can span multiple
    // consecutive lines).
    const lineAnnotation = new Map<number, TranscriptAnnotation>();
    for (const ann of annotations) {
        for (let i = ann.line; i < ann.line + ann.span; i += 1) {
            if (!lineAnnotation.has(i)) {
                lineAnnotation.set(i, ann);
            }
        }
    }

    // Collect the set of first lines for each annotation so we only render
    // the note once per annotation (at its first line, not repeated per
    // covered line).
    const annotationFirstLines = new Set(annotations.map((a) => a.line));

    const bgFallback = vars.colour.accentDim;
    const fgFallback = vars.colour.accentSoft;
    const levelBg = LEVEL_BG[level] ?? bgFallback;
    const levelFg = LEVEL_FG[level] ?? fgFallback;

    return (
        <article id={`cerror-${id}`} className={transcriptArticle}>
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                    flexWrap: "wrap",
                }}
            >
                <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                        className={cheatTitle}
                        style={{
                            fontSize: "1rem",
                            color: vars.colour.text,
                            margin: 0,
                        }}
                    >
                        <span
                            style={{
                                fontSize: "0.7rem",
                                padding: "0.15rem 0.4rem",
                                borderRadius: "0.25rem",
                                background: vars.colour.bad,
                                color: vars.colour.panel,
                                fontWeight: 700,
                                marginRight: "0.5rem",
                                verticalAlign: "middle",
                                fontFamily: "ui-monospace, monospace",
                            }}
                        >
                            {code}
                        </span>
                        {title}
                    </h3>
                </div>
                <span
                    className={levelBadge}
                    style={{ background: levelBg, color: levelFg }}
                >
                    {level}
                </span>
            </div>

            {/* Source that triggers the error */}
            <div>
                <p
                    style={{
                        margin: "0 0 0.375rem",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: vars.colour.accentSoft,
                        fontFamily: "ui-monospace, monospace",
                    }}
                >
                    Source
                </p>
                <CodeBlock code={source} label="example.rs" />
            </div>

            {/* Annotated transcript */}
            <div>
                <p
                    style={{
                        margin: "0 0 0.375rem",
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: vars.colour.accentSoft,
                        fontFamily: "ui-monospace, monospace",
                    }}
                >
                    Compiler output
                </p>
                <div
                    style={{
                        borderRadius: "0.5rem",
                        overflow: "hidden",
                        border: `1px solid ${vars.colour.border}`,
                        background: vars.colour.code,
                    }}
                >
                    <pre
                        className={outputPre}
                        style={{ padding: "0.75rem 1rem", margin: 0 }}
                    >
                        {lines.map((line, idx) => {
                            const ann = lineAnnotation.get(idx);
                            const isAnnotated = ann !== undefined;
                            const isFirstLine =
                                ann !== undefined &&
                                annotationFirstLines.has(idx) &&
                                ann.line === idx;

                            return (
                                <span key={idx}>
                                    <span
                                        className={
                                            isAnnotated
                                                ? annotatedLine
                                                : undefined
                                        }
                                        style={
                                            isAnnotated
                                                ? { display: "block" }
                                                : { display: "block" }
                                        }
                                    >
                                        {isAnnotated ? (
                                            <span
                                                style={{
                                                    display: "inline-block",
                                                    width: "0.6rem",
                                                    height: "0.6rem",
                                                    borderRadius: "50%",
                                                    background:
                                                        ROLE_COLOUR[ann.role],
                                                    marginRight: "0.4rem",
                                                    verticalAlign: "middle",
                                                    flexShrink: 0,
                                                }}
                                                aria-hidden="true"
                                            />
                                        ) : null}
                                        {line}
                                    </span>
                                    {isFirstLine ? (
                                        <span
                                            className={annotationNote}
                                            style={{
                                                color: ROLE_COLOUR[ann.role],
                                                borderColor:
                                                    ROLE_COLOUR[ann.role],
                                                display: "block",
                                            }}
                                        >
                                            <strong
                                                style={{
                                                    fontFamily:
                                                        "ui-monospace, monospace",
                                                    fontSize: "0.7rem",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.06em",
                                                    marginRight: "0.4em",
                                                }}
                                            >
                                                [{ROLE_LABEL[ann.role]}]
                                            </strong>
                                            {ann.note}
                                        </span>
                                    ) : null}
                                </span>
                            );
                        })}
                    </pre>
                </div>
            </div>

            {/* Decode this error exercise */}
            <div className={exerciseBox}>
                <p
                    style={{
                        margin: 0,
                        fontSize: "0.75rem",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        color: vars.colour.accentSoft,
                        fontFamily: "ui-monospace, monospace",
                    }}
                >
                    Decode this error
                </p>
                <p
                    style={{
                        margin: 0,
                        fontSize: "0.9rem",
                        lineHeight: 1.6,
                        color: vars.colour.text,
                    }}
                >
                    {question}
                </p>
                {revealed ? (
                    <div
                        className={noteBlock}
                        style={{ flexDirection: "column", gap: "0.375rem" }}
                    >
                        <p
                            style={{
                                margin: 0,
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.06em",
                                color: vars.colour.accentSoft,
                                fontFamily: "ui-monospace, monospace",
                            }}
                        >
                            Answer
                        </p>
                        <p
                            style={{
                                margin: 0,
                                fontSize: "0.875rem",
                                lineHeight: 1.625,
                                color: vars.colour.dim,
                            }}
                        >
                            {answer}
                        </p>
                    </div>
                ) : (
                    <button
                        type="button"
                        className={revealButton}
                        onClick={() => {
                            setRevealed(true);
                        }}
                    >
                        Reveal answer
                    </button>
                )}
            </div>

            {/* Cross-link to Compare section */}
            {conceptId !== undefined ? (
                <button
                    type="button"
                    onClick={() => {
                        onOpenConcept(conceptId);
                    }}
                    className={navButton}
                    style={{
                        width: "auto",
                        padding: "0.4rem 0.65rem",
                    }}
                >
                    <ArrowUpRight size={12} /> Compare across languages
                </button>
            ) : null}
        </article>
    );
}

// ---------------------------------------------------------------------------
// View
// ---------------------------------------------------------------------------

export function CompilerErrorsView({ onOpenConcept }: CompilerErrorsViewProps) {
    return (
        <div className={referenceListGrid}>
            {COMPILER_ERROR_TRANSCRIPTS.map((t) => (
                <TranscriptCard
                    key={t.id}
                    id={t.id}
                    code={t.code}
                    title={t.title}
                    level={t.level}
                    source={t.source}
                    transcript={t.transcript}
                    annotations={t.annotations}
                    question={t.question}
                    answer={t.answer}
                    conceptId={t.conceptId}
                    onOpenConcept={onOpenConcept}
                />
            ))}
        </div>
    );
}
