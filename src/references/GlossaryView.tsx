import { BookOpen } from "lucide-react";
import { vars } from "../theme/theme.css.ts";
import {
    cheatCard,
    cheatTitle,
    navButton,
    referenceListGrid,
} from "../theme/styles.css.ts";
import { GLOSSARY } from "../data/glossary.ts";
import type { GlossaryEntry } from "../data/glossary.ts";

interface GlossaryViewProps {
    readonly active: string;
    readonly onSelect: (id: string) => void;
    readonly onOpenConcept: (conceptId: string) => void;
}

export function GlossaryView({
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
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
            }}
        >
            {/* Detail panel for the active term */}
            <div className={cheatCard}>
                <h3 className={cheatTitle} style={{ color: vars.colour.text }}>
                    {entry.term}
                </h3>
                <p
                    style={{
                        lineHeight: 1.7,
                        color: vars.colour.text,
                        fontSize: "0.95rem",
                        margin: 0,
                    }}
                >
                    {entry.definition}
                </p>

                {entry.conceptId !== undefined ? (
                    <button
                        type="button"
                        onClick={() => {
                            if (entry.conceptId !== undefined)
                                onOpenConcept(entry.conceptId);
                        }}
                        className={navButton}
                        style={{
                            width: "auto",
                            padding: "0.5rem 0.75rem",
                        }}
                    >
                        <BookOpen size={14} /> Compare across languages
                    </button>
                ) : null}

                {related.length > 0 ? (
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.375rem",
                        }}
                    >
                        {related.map((r) => (
                            <button
                                key={r.id}
                                type="button"
                                onClick={() => {
                                    onSelect(r.id);
                                }}
                                className={navButton}
                                style={{
                                    width: "auto",
                                    padding: "0.35rem 0.6rem",
                                    fontSize: "0.8rem",
                                }}
                            >
                                {r.term}
                            </button>
                        ))}
                    </div>
                ) : null}
            </div>

            {/* Grid of all terms */}
            <div className={referenceListGrid}>
                {GLOSSARY.map((g) => {
                    const on = g.id === active;
                    return (
                        <button
                            key={g.id}
                            type="button"
                            onClick={() => {
                                onSelect(g.id);
                            }}
                            className={cheatCard}
                            style={{
                                cursor: "pointer",
                                textAlign: "left",
                                border: "none",
                                width: "100%",
                                background: on
                                    ? vars.colour.accentDim
                                    : vars.colour.panel2,
                                outline: on
                                    ? `1px solid ${vars.colour.accent}`
                                    : `1px solid ${vars.colour.border}`,
                            }}
                        >
                            <span className={cheatTitle}>{g.term}</span>
                            <span
                                style={{
                                    color: vars.colour.dim,
                                    fontSize: "0.8rem",
                                    lineHeight: 1.5,
                                }}
                            >
                                {g.definition.length > 100
                                    ? g.definition.slice(0, 100) + "..."
                                    : g.definition}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
