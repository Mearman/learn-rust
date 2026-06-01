import { useMemo } from "react";
import { FileText } from "lucide-react";
import { CodeBlock } from "../highlight/CodeBlock.tsx";
import { vars } from "../theme/theme.css.ts";
import { LESSONS } from "../learn/lessons.ts";
import {
    learnGrid,
    lessonTitle,
    lessonTagline,
    navButton,
    navButtonActive,
    cheatsGrid,
    cheatCard,
    cheatTitle,
    noteBlock,
} from "../theme/styles.css.ts";
import type { ReferenceViewProps } from "./types.ts";
import { REFERENCE_CARDS } from "./references.ts";
import { LANGUAGE_SYNTAX } from "./language-syntax.ts";
import { languageFamiliarityLabel } from "../settings/languages.ts";
import type { LanguageSyntax } from "./types.ts";

function findReference(id: string) {
    const reference = REFERENCE_CARDS.find((card) => card.id === id);
    if (reference === undefined) {
        throw new Error(`Unknown reference: ${id}`);
    }
    return reference;
}

function findSyntaxEntry(id: string): LanguageSyntax {
    const entry = LANGUAGE_SYNTAX.find((item) => item.id === id);
    if (entry === undefined) {
        throw new Error(`Unknown language syntax entry: ${id}`);
    }
    return entry;
}

function lessonTitleForId(id: string): string {
    const lesson = LESSONS.find((item) => item.id === id);
    if (lesson === undefined) {
        throw new Error(`Unknown lesson: ${id}`);
    }
    return lesson.title;
}

export function ReferenceView({ profile, active, onSelect, onOpenLesson }: ReferenceViewProps) {
    const reference = findReference(active);

    const resolvedSyntax = useMemo(() => {
        const selected = new Set(profile.familiarities);
        const entries = reference.syntaxIds.map(findSyntaxEntry);
        const sorted = [...entries];
        sorted.sort((a, b) => {
            const aSelected = selected.has(a.language) ? 0 : 1;
            const bSelected = selected.has(b.language) ? 0 : 1;
            if (aSelected !== bSelected) return aSelected - bSelected;
            return a.language.localeCompare(b.language);
        });
        return sorted;
    }, [profile.familiarities, reference.syntaxIds]);

    return (
        <div className={learnGrid}>
            <nav style={{ minWidth: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                    {REFERENCE_CARDS.map((card) => {
                        const on = card.id === active;
                        return (
                            <button
                                key={card.id}
                                onClick={() => onSelect(card.id)}
                                className={`${navButton} ${on ? navButtonActive : ""}`}
                            >
                                <FileText size={16} style={{ color: on ? vars.colour.accentSoft : vars.colour.faint, flexShrink: 0 }} />
                                <span style={{ flex: 1 }}>{card.title}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>

            <article style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
                <header style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                    <h2 className={lessonTitle}>{reference.title}</h2>
                    <p className={lessonTagline}>{reference.summary}</p>
                </header>

                <div className={noteBlock}>
                    <span>These cards are the source of truth. Lessons and the cheatsheet link back here instead of repeating the same ideas.</span>
                </div>

                <div className={cheatsGrid}>
                    <section className={cheatCard}>
                        <h3 className={cheatTitle}>{reference.syntax.title}</h3>
                        <CodeBlock code={reference.syntax.code} label={`${reference.id}-syntax.rs`} />
                    </section>
                    <section className={cheatCard}>
                        <h3 className={cheatTitle}>{reference.pattern.title}</h3>
                        <pre style={{ margin: 0, lineHeight: 1.625, color: vars.colour.text, fontFamily: "ui-monospace, monospace", whiteSpace: "pre-wrap" }}>{reference.pattern.code}</pre>
                    </section>
                    <section className={cheatCard}>
                        <h3 className={cheatTitle}>{reference.example.title}</h3>
                        <CodeBlock code={reference.example.code} label={`${reference.id}-example.rs`} />
                    </section>
                </div>

                <section className={cheatCard}>
                    <h3 className={cheatTitle}>Cross-language syntax</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {resolvedSyntax.map((entry) => {
                            const selected = profile.familiarities.includes(entry.language);
                            return (
                                <div
                                    key={entry.id}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "0.5rem",
                                        padding: "0.75rem",
                                        borderRadius: "0.5rem",
                                        border: `1px solid ${selected ? vars.colour.accent : vars.colour.border}`,
                                        background: selected ? vars.colour.accentDim : vars.colour.panel,
                                    }}
                                >
                                    <strong style={{ color: vars.colour.text, fontSize: "0.875rem" }}>
                                        {languageFamiliarityLabel(entry.language)} — {entry.title}
                                    </strong>
                                    <CodeBlock code={entry.code} label={`${entry.id}.${entry.language === "cpp" ? "cpp" : entry.language === "csharp" ? "cs" : entry.language === "typescript" ? "ts" : entry.language === "go" ? "go" : entry.language === "kotlin" ? "kt" : entry.language === "java" ? "java" : "py"}`} />
                                    <span style={{ color: vars.colour.dim, fontSize: "0.875rem", lineHeight: 1.5 }}>
                                        {entry.explanation}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <div className={cheatCard}>
                    <h3 className={cheatTitle}>Used in lessons</h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                        {reference.lessonIds.map((lessonId) => (
                            <button
                                key={lessonId}
                                type="button"
                                onClick={() => onOpenLesson(lessonId)}
                                className={navButton}
                                style={{ width: "auto", padding: "0.5rem 0.75rem" }}
                            >
                                Open lesson: {lessonTitleForId(lessonId)}
                            </button>
                        ))}
                    </div>
                </div>
            </article>
        </div>
    );
}
