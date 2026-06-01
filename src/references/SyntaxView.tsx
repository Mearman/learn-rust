import { useMemo } from "react";
import { Braces } from "lucide-react";
import { CodeBlock } from "../highlight/CodeBlock.tsx";
import { vars } from "../theme/theme.css.ts";
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
import { LANGUAGES, languageNameForId, TARGET_LANGUAGE_ID } from "../data/languages.ts";
import { SYNTAX_REFERENCES } from "../data/syntax-references.ts";
import type { SyntaxReference } from "../data/types.ts";
import type { UserProfile } from "../settings/types.ts";

interface SyntaxViewProps {
    readonly profile: UserProfile;
    readonly active: string;
    readonly onSelect: (topic: string) => void;
}

function fileExtensionForLanguage(languageId: string): string {
    if (languageId === "cpp") return "cpp";
    if (languageId === "csharp") return "cs";
    if (languageId === "typescript") return "ts";
    if (languageId === "go") return "go";
    if (languageId === "kotlin") return "kt";
    if (languageId === "java") return "java";
    if (languageId === "python") return "py";
    return "rs";
}

const ALL_TOPICS = SYNTAX_REFERENCES.reduce<string[]>((acc, entry) => {
    if (!acc.includes(entry.topic)) acc.push(entry.topic);
    return acc;
}, []);

export function SyntaxView({ profile, active, onSelect }: SyntaxViewProps) {
    const visibleLanguages = useMemo(() => {
        const ids = new Set<string>([TARGET_LANGUAGE_ID, ...profile.familiarities]);
        return LANGUAGES.filter((l) => ids.has(l.id));
    }, [profile.familiarities]);

    const entriesForTopic = useMemo(() => {
        return visibleLanguages.map((lang) => {
            const entry = SYNTAX_REFERENCES.find(
                (ref) => ref.languageId === lang.id && ref.topic === active,
            );
            return { language: lang, entry };
        });
    }, [visibleLanguages, active]);

    return (
        <div className={learnGrid}>
            <nav style={{ minWidth: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                    {ALL_TOPICS.map((topic) => {
                        const on = topic === active;
                        return (
                            <button
                                key={topic}
                                onClick={() => onSelect(topic)}
                                className={`${navButton} ${on ? navButtonActive : ""}`}
                            >
                                <Braces size={16} style={{ color: on ? vars.colour.accentSoft : vars.colour.faint, flexShrink: 0 }} />
                                <span style={{ flex: 1 }}>{topic}</span>
                            </button>
                        );
                    })}
                </div>
            </nav>

            <article style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <header style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                    <h2 className={lessonTitle}>{active}</h2>
                    <p className={lessonTagline}>
                        Side-by-side syntax comparison across your languages.
                    </p>
                </header>

                <div className={noteBlock}>
                    <span>
                        <Braces size={14} style={{ verticalAlign: "middle", marginRight: "0.25rem" }} />
                        Showing {languageNameForId(TARGET_LANGUAGE_ID)} alongside {visibleLanguages.filter((l) => l.id !== TARGET_LANGUAGE_ID).map((l) => l.name).join(", ")}.
                    </span>
                </div>

                <div className={cheatsGrid}>
                    {entriesForTopic.map(({ language, entry }) => {
                        const isTarget = language.id === TARGET_LANGUAGE_ID;
                        return (
                            <section
                                key={language.id}
                                className={cheatCard}
                                style={{
                                    borderLeft: isTarget ? `3px solid ${vars.colour.accent}` : undefined,
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                    <h3 className={cheatTitle} style={{ margin: 0 }}>
                                        {language.name}
                                    </h3>
                                    {isTarget ? (
                                        <span style={{
                                            fontSize: "0.7rem",
                                            padding: "0.15rem 0.4rem",
                                            borderRadius: "0.25rem",
                                            background: vars.colour.accent,
                                            color: vars.colour.panel,
                                            fontWeight: 600,
                                        }}>
                                            learning
                                        </span>
                                    ) : null}
                                </div>
                                {entry === undefined ? (
                                    <span style={{ color: vars.colour.faint, fontStyle: "italic" }}>No entry yet.</span>
                                ) : (
                                    <>
                                        <p style={{ margin: "0 0 0.5rem", fontSize: "0.875rem", color: vars.colour.dim }}>
                                            {entry.title}
                                        </p>
                                        <CodeBlock code={entry.code} label={`${entry.id}.${fileExtensionForLanguage(language.id)}`} />
                                        <p style={{ margin: "0.5rem 0 0", fontSize: "0.8rem", lineHeight: 1.5, color: vars.colour.dim }}>
                                            {entry.explanation}
                                        </p>
                                    </>
                                )}
                            </section>
                        );
                    })}
                </div>
            </article>
        </div>
    );
}
