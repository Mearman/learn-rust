import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";
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
import {
    CONCEPT_DEPENDENCIES,
    conceptDependsOn,
    conceptRequiredBy,
} from "../data/dependencies.ts";
import { LESSONS } from "../learn/lessons.ts";

/** Visual state of a concept node in the dependency graph. */
type NodeState = "complete" | "started" | "locked";

/** A measured dependency edge ready to render as an SVG path. */
interface EdgePath {
    /** Stable react key, `${from}->${to}`. */
    readonly key: string;
    /** SVG cubic-bezier path data in container-relative coordinates. */
    readonly d: string;
    /** Drives stroke colour + arrowhead marker; from the prerequisite node. */
    readonly state: NodeState;
}

/** Stroke colour for an edge, keyed by the prerequisite node's state. */
function strokeForState(state: NodeState): string {
    switch (state) {
        case "complete":
            return vars.colour.good;
        case "started":
            return vars.colour.accent;
        case "locked":
            return vars.colour.border;
    }
}

/** Arrowhead marker id for an edge, keyed by the prerequisite node's state. */
function markerIdForState(state: NodeState): string {
    switch (state) {
        case "complete":
            return "rbc-arrow-good";
        case "started":
            return "rbc-arrow-accent";
        case "locked":
            return "rbc-arrow-border";
    }
}

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

    // --- Visual DAG edge overlay ---------------------------------------
    // Each concept node registers its DOM element here so edges can be
    // measured from live geometry (correct even when layers flex-wrap).
    const nodeRefs = useRef<Map<string, HTMLElement>>(new Map());
    const graphContainerRef = useRef<HTMLDivElement | null>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);

    const [edges, setEdges] = useState<readonly EdgePath[]>([]);
    const [svgSize, setSvgSize] = useState<{
        width: number;
        height: number;
    }>({ width: 0, height: 0 });

    const measureEdges = useCallback(() => {
        const container = graphContainerRef.current;
        if (container === null) return;

        const containerRect = container.getBoundingClientRect();
        const computed: EdgePath[] = [];

        for (const [from, to] of CONCEPT_DEPENDENCIES) {
            const fromEl = nodeRefs.current.get(from);
            const toEl = nodeRefs.current.get(to);
            if (fromEl === undefined || toEl === undefined) continue;

            const fr = fromEl.getBoundingClientRect();
            const tr = toEl.getBoundingClientRect();

            // Edge LEAVES the prerequisite (`to`) at its bottom-centre and
            // ENTERS the dependent (`from`) at its top-centre, so the arrow
            // reads "prerequisite → unlocks → dependent" top-to-bottom.
            const startX = (tr.left + tr.right) / 2 - containerRect.left;
            const startY = tr.bottom - containerRect.top;
            const endX = (fr.left + fr.right) / 2 - containerRect.left;
            const endY = fr.top - containerRect.top;

            // Vertical-biased cubic bezier: control points share the
            // midpoint Y, giving a smooth S-curve that absorbs the
            // horizontal offset introduced when layers wrap.
            const midY = startY + (endY - startY) / 2;
            const d = `M ${String(startX)} ${String(startY)} C ${String(
                startX
            )} ${String(midY)}, ${String(endX)} ${String(midY)}, ${String(
                endX
            )} ${String(endY)}`;

            const prereqConcept = CONCEPTS.find((c) => c.id === to);
            const state =
                prereqConcept === undefined
                    ? "locked"
                    : nodeState(prereqConcept.lessonIds, viewed);

            computed.push({ key: `${from}->${to}`, d, state });
        }

        setEdges(computed);

        // Size the SVG to the node extent, measured from the node elements —
        // NOT `container.scrollWidth`/`scrollHeight`. The SVG is absolutely
        // positioned at the container's origin, and an overflowing abspos child
        // counts towards its parent's scroll size, so measuring the container
        // would feed the SVG's own size back in: once it reached its widest
        // value on a desktop render it stayed there, overflowing narrow
        // viewports. Measuring the nodes is feedback-free and shrinks when they
        // reflow on a smaller screen.
        let maxX = 0;
        let maxY = 0;
        for (const el of nodeRefs.current.values()) {
            const r = el.getBoundingClientRect();
            maxX = Math.max(maxX, r.right - containerRect.left);
            maxY = Math.max(maxY, r.bottom - containerRect.top);
        }
        setSvgSize({ width: maxX, height: maxY });
        // `layers` is derived once (useMemo with [] deps) so it is stable and
        // does not belong in the dependency array; only `viewed` drives a
        // recompute. Live geometry changes are caught by the ResizeObserver.
    }, [viewed]);

    useLayoutEffect(() => {
        measureEdges();
    }, [measureEdges]);

    useEffect(() => {
        const container = graphContainerRef.current;
        if (container === null) return;
        const observer = new ResizeObserver(() => {
            measureEdges();
        });
        observer.observe(container);
        return () => {
            observer.disconnect();
        };
    }, [measureEdges]);

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

            <div ref={graphContainerRef} style={{ position: "relative" }}>
                <svg
                    ref={svgRef}
                    width={svgSize.width}
                    height={svgSize.height}
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        pointerEvents: "none",
                        zIndex: 0,
                        overflow: "visible",
                    }}
                >
                    <defs>
                        <marker
                            id="rbc-arrow-good"
                            markerWidth={8}
                            markerHeight={8}
                            refX={6}
                            refY={3}
                            orient="auto"
                            markerUnits="strokeWidth"
                        >
                            <path
                                d="M0,0 L6,3 L0,6 Z"
                                fill={vars.colour.good}
                            />
                        </marker>
                        <marker
                            id="rbc-arrow-accent"
                            markerWidth={8}
                            markerHeight={8}
                            refX={6}
                            refY={3}
                            orient="auto"
                            markerUnits="strokeWidth"
                        >
                            <path
                                d="M0,0 L6,3 L0,6 Z"
                                fill={vars.colour.accent}
                            />
                        </marker>
                        <marker
                            id="rbc-arrow-border"
                            markerWidth={8}
                            markerHeight={8}
                            refX={6}
                            refY={3}
                            orient="auto"
                            markerUnits="strokeWidth"
                        >
                            <path
                                d="M0,0 L6,3 L0,6 Z"
                                fill={vars.colour.border}
                            />
                        </marker>
                    </defs>
                    {edges.map((e) => (
                        <path
                            key={e.key}
                            d={e.d}
                            fill="none"
                            stroke={strokeForState(e.state)}
                            strokeWidth={1.5}
                            markerEnd={`url(#${markerIdForState(e.state)})`}
                            opacity={e.state === "locked" ? 0.5 : 0.85}
                        />
                    ))}
                </svg>
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
                                const state = nodeState(
                                    concept.lessonIds,
                                    viewed
                                );
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
                                        ref={(el) => {
                                            if (el === null) {
                                                nodeRefs.current.delete(
                                                    conceptId
                                                );
                                            } else {
                                                nodeRefs.current.set(
                                                    conceptId,
                                                    el
                                                );
                                            }
                                        }}
                                        className={cheatCard}
                                        style={{
                                            flex: "1 1 280px",
                                            minWidth: 0,
                                            position: "relative",
                                            zIndex: 1,
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
                                                                ? vars.colour
                                                                      .accent
                                                                : vars.colour
                                                                      .faint,
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
                                                        const dep =
                                                            CONCEPTS.find(
                                                                (c) =>
                                                                    c.id === d
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
                                                        const dep =
                                                            CONCEPTS.find(
                                                                (c) =>
                                                                    c.id === d
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
                                            {concept.lessonIds.map(
                                                (lessonId) => {
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
                                                                onOpenLesson(
                                                                    lessonId
                                                                );
                                                            }}
                                                            className={
                                                                navButton
                                                            }
                                                            style={{
                                                                width: "auto",
                                                                padding:
                                                                    "0.4rem 0.65rem",
                                                                fontSize:
                                                                    "0.8rem",
                                                                color: lessonViewed
                                                                    ? vars
                                                                          .colour
                                                                          .good
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
                                                }
                                            )}
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
        </div>
    );
}
