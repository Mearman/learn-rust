import { useState } from "react";
import { BookOpen } from "lucide-react";
import { CodeBlock } from "../highlight/CodeBlock.tsx";
import { vars } from "../theme/theme.css.ts";
import {
    learnGrid,
    lessonTitle,
    lessonTagline,
    navButton,
    navButtonActive,
    cheatCard,
    cheatTitle,
} from "../theme/styles.css.ts";
import { GLOSSARY } from "../data/glossary.ts";
import type { GlossaryEntry } from "../data/glossary.ts";
import type { UserProfile } from "../settings/types.ts";

interface GlossaryViewProps {
    readonly profile: UserProfile;
    readonly active: string;
    readonly onSelect: (id: string) => void;
    readonly onOpenConcept: (conceptId: string) => void;
}

export function GlossaryView({
    profile,
    active,
    onSelect,
    onOpenConcept,
}: GlossaryViewProps) {
    const entry = GLOSSARY.find((g) => g.id === active);
    if (entry === undefined) {
        throw new Error(`Unknown glossary entry: ${active}`);
    }

    const related = entry.relatedTerms
        .map((id) => GLOSSARY.find((g) => g.id === id))
        .filter((g): g is GlossaryEntry => g !== undefined);

    return (
        <div className={learnGrid}>
            <nav style={{ minWidth: 0 }}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.375rem",
                    }}
                >
                    {GLOSSARY.map((g) => {
                        const on = g.id === active;
                        return (
                            <button
                                key={g.id}
                                onClick={() => onSelect(g.id)}
                                className={`${navButton} ${on ? navButtonActive : ""}`}
                            >
                                <BookOpen
                                    size={16}
                                    style={{
                                        color: on
                                            ? vars.colour.accentSoft
                                            : vars.colour.faint,
                                        flexShrink: 0,
                                    }}
                                />
                                <span style={{ flex: 1 }}>{g.term}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>

            <article
                style={{
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                }}
            >
                <header
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.375rem",
                    }}
                >
                    <h2 className={lessonTitle}>{entry.term}</h2>
                </header>

                <p
                    style={{
                        lineHeight: 1.7,
                        color: vars.colour.text,
                        fontSize: "0.95rem",
                    }}
                >
                    {entry.definition}
                </p>

                {entry.conceptId !== undefined ? (
                    <div className={cheatCard}>
                        <h3 className={cheatTitle}>Related concept</h3>
                        <button
                            type="button"
                            onClick={() => onOpenConcept(entry.conceptId!)}
                            className={navButton}
                            style={{ width: "auto", padding: "0.5rem 0.75rem" }}
                        >
                            Compare across languages
                        </button>
                    </div>
                ) : null}

                {related.length > 0 ? (
                    <div className={cheatCard}>
                        <h3 className={cheatTitle}>Related terms</h3>
                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "0.5rem",
                            }}
                        >
                            {related.map((r) => (
                                <button
                                    key={r.id}
                                    type="button"
                                    onClick={() => onSelect(r.id)}
                                    className={navButton}
                                    style={{
                                        width: "auto",
                                        padding: "0.4rem 0.65rem",
                                        fontSize: "0.85rem",
                                    }}
                                >
                                    {r.term}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : null}
            </article>
        </div>
    );
}
