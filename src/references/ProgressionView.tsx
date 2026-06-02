import { useMemo } from "react";
import { CheckCircle, Circle, GitBranch } from "lucide-react";
import { vars } from "../theme/theme.css.ts";
import {
    lessonTitle,
    lessonTagline,
    navButton,
    cheatCard,
    cheatTitle,
    noteBlock,
} from "../theme/styles.css.ts";
import { CONCEPTS } from "../data/concepts.ts";
import { conceptDependsOn, conceptRequiredBy } from "../data/dependencies.ts";
import { LESSONS } from "../learn/lessons.ts";

/** Visual state of a concept node in the dependency graph. */
type NodeState = "complete" | "started" | "locked";

/**
 * Derive the visual state of a concept from the set of viewed lesson ids.
 * complete  = all lessons for this concept have been viewed
 * started   = at least one lesson viewed but not all
 * locked    = no lessons viewed
 */
function nodeState(
    lessonIds: readonly string[],
    viewed: ReadonlySet<string>
): NodeState {
    const viewedCount = lessonIds.filter((id) => viewed.has(id)).length;
    if (viewedCount === lessonIds.length) return "complete";
    if (viewedCount > 0) return "started";
    return "locked";
}

interface ProgressionViewProps {
    readonly onOpenLesson: (lessonId: string) => void;
    readonly onOpenConcept: (conceptId: string) => void;
    /** Set of lesson ids the reader has viewed (from useViewedLessons). */
    readonly viewed: ReadonlySet<string>;
}

export function ProgressionView({
    onOpenLesson,
    onOpenConcept,
    viewed,
}: ProgressionViewProps) {
    const layers = useMemo(() => {
        const visited = new Set<string>();
        const result: string[][] = [];
        const remaining = new Set(CONCEPTS.map((c) => c.id));

        while (remaining.size > 0) {
            const layer: string[] = [];
            for (const id of remaining) {
                const deps = conceptDependsOn(id);
                if (deps.every((dep) => visited.has(dep))) {
                    layer.push(id);
                }
            }
            if (layer.length === 0) {
                // Cycle safety — add remaining
                layer.push(...remaining);
            }
            for (const id of layer) {
                visited.add(id);
                remaining.delete(id);
            }
            result.push(layer);
        }
        return result;
    }, []);

    return (
        <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
            <header
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.375rem",
                }}
            >
                <h2 className={lessonTitle}>Learning path</h2>
                <span
                    className={lessonTagline}
                    style={{
                        fontSize: "0.95rem",
                        color: vars.colour.faint,
                        lineHeight: 1.5,
                    }}
                >
                    Concepts build on each other. Earlier layers are
                    prerequisites for later ones.
                </span>
            </header>

            <div className={noteBlock}>
                <span>
                    <GitBranch
                        size={14}
                        style={{
                            verticalAlign: "middle",
                            marginRight: "0.25rem",
                        }}
                    />
                    Top-to-bottom order. Items on the same row can be learnt in
                    any order.
                </span>
            </div>

            {/* Graph legend */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "1rem",
                    fontSize: "0.8rem",
                    color: vars.colour.faint,
                }}
            >
                <span
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.375rem",
                    }}
                >
                    <CheckCircle
                        size={13}
                        aria-hidden="true"
                        style={{ color: vars.colour.good }}
                    />
                    Completed
                </span>
                <span
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.375rem",
                    }}
                >
                    <Circle
                        size={13}
                        aria-hidden="true"
                        style={{ color: vars.colour.accent }}
                    />
                    In progress
                </span>
                <span
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.375rem",
                    }}
                >
                    <Circle
                        size={13}
                        aria-hidden="true"
                        style={{ color: vars.colour.faint }}
                    />
                    Not started
                </span>
            </div>

            {layers.map((layer, layerIndex) => (
                <div key={layerIndex}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginBottom: "0.75rem",
                        }}
                    >
                        <span
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "1.5rem",
                                height: "1.5rem",
                                borderRadius: "50%",
                                background: vars.colour.accent,
                                color: vars.colour.panel,
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                flexShrink: 0,
                            }}
                        >
                            {layerIndex + 1}
                        </span>
                        <span
                            style={{
                                color: vars.colour.faint,
                                fontSize: "0.8rem",
                            }}
                        >
                            {layerIndex === 0
                                ? "Start here"
                                : `Layer ${String(layerIndex + 1)}`}
                        </span>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.75rem",
                        }}
                    >
                        {layer.map((conceptId) => {
                            const concept = CONCEPTS.find(
                                (c) => c.id === conceptId
                            );
                            if (concept === undefined) return null;
                            const deps = conceptDependsOn(conceptId);
                            const requiredBy = conceptRequiredBy(conceptId);
                            const state = nodeState(concept.lessonIds, viewed);
                            // Visual treatment per node state:
                            // complete  → green border + dim green bg
                            // started   → accent border (in-progress)
                            // locked    → default card border (greyed title)
                            const borderColor =
                                state === "complete"
                                    ? vars.colour.good
                                    : state === "started"
                                      ? vars.colour.accent
                                      : vars.colour.border;
                            const bgColor =
                                state === "complete"
                                    ? vars.colour.goodDim
                                    : vars.colour.panel2;
                            const titleColor =
                                state === "locked"
                                    ? vars.colour.faint
                                    : vars.colour.accentSoft;
                            return (
                                <section
                                    key={conceptId}
                                    className={cheatCard}
                                    style={{
                                        flex: "1 1 280px",
                                        minWidth: 0,
                                        border: `1px solid ${borderColor}`,
                                        background: bgColor,
                                        transition:
                                            "border-color 0.2s, background 0.2s",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "0.375rem",
                                        }}
                                    >
                                        {state === "complete" ? (
                                            <CheckCircle
                                                size={14}
                                                aria-hidden="true"
                                                style={{
                                                    color: vars.colour.good,
                                                    flexShrink: 0,
                                                }}
                                            />
                                        ) : (
                                            <Circle
                                                size={14}
                                                aria-hidden="true"
                                                style={{
                                                    color:
                                                        state === "started"
                                                            ? vars.colour.accent
                                                            : vars.colour.faint,
                                                    flexShrink: 0,
                                                }}
                                            />
                                        )}
                                        <h3
                                            className={cheatTitle}
                                            style={{ color: titleColor }}
                                        >
                                            {concept.title}
                                        </h3>
                                    </div>
                                    <p
                                        style={{
                                            margin: "0 0 0.75rem",
                                            fontSize: "0.85rem",
                                            lineHeight: 1.5,
                                            color:
                                                state === "locked"
                                                    ? vars.colour.faint
                                                    : vars.colour.dim,
                                        }}
                                    >
                                        {concept.description}
                                    </p>
                                    {deps.length > 0 ? (
                                        <div
                                            style={{
                                                marginBottom: "0.5rem",
                                                fontSize: "0.8rem",
                                                color: vars.colour.faint,
                                            }}
                                        >
                                            Requires:{" "}
                                            {deps
                                                .map((d) => {
                                                    const dep = CONCEPTS.find(
                                                        (c) => c.id === d
                                                    );
                                                    return dep?.title ?? d;
                                                })
                                                .join(", ")}
                                        </div>
                                    ) : null}
                                    {requiredBy.length > 0 ? (
                                        <div
                                            style={{
                                                marginBottom: "0.5rem",
                                                fontSize: "0.8rem",
                                                color: vars.colour.faint,
                                            }}
                                        >
                                            Unlocks:{" "}
                                            {requiredBy
                                                .map((d) => {
                                                    const dep = CONCEPTS.find(
                                                        (c) => c.id === d
                                                    );
                                                    return dep?.title ?? d;
                                                })
                                                .join(", ")}
                                        </div>
                                    ) : null}
                                    <div
                                        style={{
                                            display: "flex",
                                            gap: "0.5rem",
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onOpenConcept(conceptId);
                                            }}
                                            className={navButton}
                                            style={{
                                                width: "auto",
                                                padding: "0.4rem 0.65rem",
                                                fontSize: "0.8rem",
                                            }}
                                        >
                                            Compare languages
                                        </button>
                                        {concept.lessonIds.map((lessonId) => {
                                            const lesson = LESSONS.find(
                                                (l) => l.id === lessonId
                                            );
                                            const label =
                                                lesson !== undefined
                                                    ? lesson.title
                                                    : lessonId;
                                            const lessonViewed =
                                                viewed.has(lessonId);
                                            return (
                                                <button
                                                    key={lessonId}
                                                    type="button"
                                                    onClick={() => {
                                                        onOpenLesson(lessonId);
                                                    }}
                                                    className={navButton}
                                                    style={{
                                                        width: "auto",
                                                        padding:
                                                            "0.4rem 0.65rem",
                                                        fontSize: "0.8rem",
                                                        color: lessonViewed
                                                            ? vars.colour.good
                                                            : undefined,
                                                    }}
                                                >
                                                    {lessonViewed ? (
                                                        <CheckCircle
                                                            size={12}
                                                            aria-hidden="true"
                                                            style={{
                                                                marginRight:
                                                                    "0.25rem",
                                                                verticalAlign:
                                                                    "middle",
                                                            }}
                                                        />
                                                    ) : null}
                                                    {label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                    {layerIndex < layers.length - 1 ? (
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                padding: "0.75rem 0",
                                color: vars.colour.faint,
                            }}
                        >
                            ↓
                        </div>
                    ) : null}
                </div>
            ))}
        </div>
    );
}
