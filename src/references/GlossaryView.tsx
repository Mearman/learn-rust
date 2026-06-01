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
    readonly onOpenConcept: (conceptId: string) => void;
}

export function GlossaryView({ onOpenConcept }: GlossaryViewProps) {
    return (
        <div className={referenceListGrid}>
            {GLOSSARY.map((entry) => {
                const related = entry.relatedTerms
                    .map((id) => GLOSSARY.find((g) => g.id === id))
                    .filter((g): g is GlossaryEntry => g !== undefined);

                return (
                    <article
                        key={entry.id}
                        id={`glossary-${entry.id}`}
                        className={cheatCard}
                        style={{
                            textAlign: "left",
                            width: "100%",
                        }}
                    >
                        <h3
                            className={cheatTitle}
                            style={{ color: vars.colour.text }}
                        >
                            <BookOpen
                                size={14}
                                style={{
                                    verticalAlign: "middle",
                                    marginRight: "0.25rem",
                                }}
                            />
                            {entry.term}
                        </h3>
                        <p
                            style={{
                                lineHeight: 1.7,
                                color: vars.colour.text,
                                fontSize: "0.9rem",
                                margin: "0.5rem 0 0",
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
                                    padding: "0.4rem 0.65rem",
                                    marginTop: "0.5rem",
                                }}
                            >
                                Compare across languages
                            </button>
                        ) : null}

                        {related.length > 0 ? (
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "0.25rem",
                                    marginTop: "0.5rem",
                                }}
                            >
                                {related.map((r) => (
                                    <a
                                        key={r.id}
                                        href={`#glossary-${r.id}`}
                                        className={navButton}
                                        style={{
                                            width: "auto",
                                            padding: "0.25rem 0.5rem",
                                            fontSize: "0.75rem",
                                            textDecoration: "none",
                                            display: "inline-flex",
                                        }}
                                    >
                                        {r.term}
                                    </a>
                                ))}
                            </div>
                        ) : null}
                    </article>
                );
            })}
        </div>
    );
}
