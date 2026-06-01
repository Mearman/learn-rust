import { useMemo } from "react";
import { GitBranch } from "lucide-react";
import { vars } from "../theme/theme.css.ts";
import {
    lessonTitle,
    navButton,
    cheatCard,
    cheatTitle,
    noteBlock,
} from "../theme/styles.css.ts";
import { CONCEPTS } from "../data/concepts.ts";
import { conceptDependsOn, conceptRequiredBy } from "../data/dependencies.ts";
import type { UserProfile } from "../settings/types.ts";

interface ProgressionViewProps {
    readonly profile: UserProfile;
    readonly onOpenLesson: (lessonId: string) => void;
    readonly onOpenConcept: (conceptId: string) => void;
}

export function ProgressionView({
    profile,
    onOpenLesson,
    onOpenConcept,
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
                                : `Layer ${layerIndex + 1}`}
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
                            return (
                                <section
                                    key={conceptId}
                                    className={cheatCard}
                                    style={{ flex: "1 1 280px", minWidth: 0 }}
                                >
                                    <h3 className={cheatTitle}>
                                        {concept.title}
                                    </h3>
                                    <p
                                        style={{
                                            margin: "0 0 0.75rem",
                                            fontSize: "0.85rem",
                                            lineHeight: 1.5,
                                            color: vars.colour.dim,
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
                                        {concept.lessonIds.map((lessonId) => (
                                            <button
                                                key={lessonId}
                                                type="button"
                                                onClick={() => {
                                                    onOpenLesson(lessonId);
                                                }}
                                                className={navButton}
                                                style={{
                                                    width: "auto",
                                                    padding: "0.4rem 0.65rem",
                                                    fontSize: "0.8rem",
                                                }}
                                            >
                                                Lesson: {lessonId}
                                            </button>
                                        ))}
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
