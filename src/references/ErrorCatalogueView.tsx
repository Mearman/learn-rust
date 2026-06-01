import { AlertTriangle } from "lucide-react";
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
import { ERROR_CATALOGUE } from "../data/errors.ts";
import type { UserProfile } from "../settings/types.ts";

interface ErrorCatalogueViewProps {
    readonly profile: UserProfile;
    readonly active: string;
    readonly onSelect: (id: string) => void;
    readonly onOpenConcept: (conceptId: string) => void;
}

export function ErrorCatalogueView({ profile, active, onSelect, onOpenConcept }: ErrorCatalogueViewProps) {
    const entry = ERROR_CATALOGUE.find((e) => e.id === active);
    if (entry === undefined) {
        throw new Error(`Unknown error entry: ${active}`);
    }

    return (
        <div className={learnGrid}>
            <nav style={{ minWidth: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                    {ERROR_CATALOGUE.map((e) => {
                        const on = e.id === active;
                        return (
                            <button
                                key={e.id}
                                onClick={() => onSelect(e.id)}
                                className={`${navButton} ${on ? navButtonActive : ""}`}
                            >
                                <AlertTriangle size={16} style={{ color: on ? vars.colour.accentSoft : vars.colour.faint, flexShrink: 0 }} />
                                <span style={{ flex: 1, textAlign: "left" }}>{e.code}: {e.title}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>

            <article style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
                <header style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                    <h2 className={lessonTitle}>
                        <span style={{
                            fontSize: "0.75rem",
                            padding: "0.15rem 0.4rem",
                            borderRadius: "0.25rem",
                            background: vars.colour.accent,
                            color: vars.colour.panel,
                            fontWeight: 700,
                            marginRight: "0.5rem",
                            verticalAlign: "middle",
                        }}>
                            {entry.code}
                        </span>
                        {entry.title}
                    </h2>
                    <p className={lessonTagline}>{entry.message}</p>
                </header>

                <section className={cheatCard}>
                    <h3 className={cheatTitle}>What happened</h3>
                    <p style={{ margin: 0, lineHeight: 1.7, color: vars.colour.text, fontSize: "0.95rem" }}>
                        {entry.explanation}
                    </p>
                </section>

                <section className={cheatCard}>
                    <h3 className={cheatTitle}>How to fix it</h3>
                    <p style={{ margin: 0, lineHeight: 1.7, color: vars.colour.text, fontSize: "0.95rem" }}>
                        {entry.fix}
                    </p>
                </section>

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
            </article>
        </div>
    );
}
