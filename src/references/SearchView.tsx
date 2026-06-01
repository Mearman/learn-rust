import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { vars } from "../theme/theme.css.ts";
import {
    lessonTitle,
    navButton,
    cheatCard,
    cheatTitle,
    noteBlock,
} from "../theme/styles.css.ts";
import { CONCEPTS } from "../data/concepts.ts";
import { LESSON_CONCEPT_MAP } from "../data/concepts.ts";
import { LANGUAGES } from "../data/languages.ts";
import { LESSONS } from "../learn/lessons.ts";
import type { UserProfile } from "../settings/types.ts";

interface SearchViewProps {
    readonly profile: UserProfile;
    readonly onOpenLesson: (lessonId: string) => void;
    readonly onOpenConcept: (conceptId: string) => void;
    readonly onOpenSyntax: (topic: string) => void;
    readonly onOpenGlossary: (termId: string) => void;
    readonly onOpenError: (errorId: string) => void;
}

interface SearchResult {
    readonly type: "lesson" | "concept" | "syntax" | "glossary" | "error";
    readonly label: string;
    readonly description: string;
    readonly action: () => void;
}

export function SearchView({ profile, onOpenLesson, onOpenConcept, onOpenSyntax, onOpenGlossary, onOpenError }: SearchViewProps) {
    const [query, setQuery] = useState("");

    const results = useMemo(() => {
        if (query.trim().length < 2) return [];

        const q = query.toLowerCase();
        const found: SearchResult[] = [];

        for (const lesson of LESSONS) {
            if (
                lesson.title.toLowerCase().includes(q)
                || lesson.tagline.toLowerCase().includes(q)
                || lesson.id.toLowerCase().includes(q)
            ) {
                found.push({
                    type: "lesson",
                    label: lesson.title,
                    description: lesson.tagline,
                    action: () => onOpenLesson(lesson.id),
                });
            }
        }

        for (const concept of CONCEPTS) {
            if (
                concept.title.toLowerCase().includes(q)
                || concept.description.toLowerCase().includes(q)
                || concept.id.toLowerCase().includes(q)
            ) {
                found.push({
                    type: "concept",
                    label: concept.title,
                    description: concept.description,
                    action: () => onOpenConcept(concept.id),
                });
            }
        }

        return found;
    }, [query, onOpenLesson, onOpenConcept]);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <header style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                <h2 className={lessonTitle}>Search</h2>
            </header>

            <div style={{
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
                border: `1px solid ${vars.colour.border}`,
                background: vars.colour.panel,
            }}>
                <Search size={18} style={{ color: vars.colour.faint, flexShrink: 0 }} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search lessons, concepts, syntax, glossary, errors..."
                    style={{
                        flex: 1,
                        border: "none",
                        outline: "none",
                        background: "transparent",
                        color: vars.colour.text,
                        fontSize: "1rem",
                        fontFamily: "inherit",
                    }}
                />
            </div>

            {query.trim().length < 2 ? (
                <div className={noteBlock}>
                    <span>Type at least two characters to search across all content.</span>
                </div>
            ) : results.length === 0 ? (
                <div className={noteBlock}>
                    <span>No results for "{query}".</span>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {results.map((result, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={result.action}
                            className={cheatCard}
                            style={{
                                cursor: "pointer",
                                textAlign: "left",
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.25rem",
                                border: "none",
                                width: "100%",
                            }}
                        >
                            <span style={{
                                fontSize: "0.7rem",
                                fontWeight: 600,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                color: vars.colour.accent,
                            }}>
                                {result.type}
                            </span>
                            <span style={{ color: vars.colour.text, fontWeight: 600, fontSize: "0.95rem" }}>
                                {result.label}
                            </span>
                            <span style={{ color: vars.colour.dim, fontSize: "0.85rem", lineHeight: 1.4 }}>
                                {result.description}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
