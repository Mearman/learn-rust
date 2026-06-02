import { useMemo } from "react";
import { Braces } from "lucide-react";
import { CodeBlock } from "../highlight/CodeBlock.tsx";
import { vars } from "../theme/theme.css.ts";
import {
    lessonTitle,
    lessonTagline,
    cheatsGrid,
    cheatCard,
    cheatTitle,
    noteBlock,
    subSection,
} from "../theme/styles.css.ts";
import {
    LANGUAGES,
    languageNameForId,
    TARGET_LANGUAGE_ID,
} from "../data/languages.ts";
import { SYNTAX_REFERENCES } from "../data/syntax-references.ts";
import { syntaxId } from "../layout/sectionIds.ts";
import type { UserProfile } from "../settings/types.ts";

interface SyntaxViewProps {
    readonly profile: UserProfile;
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

export function SyntaxView({ profile }: SyntaxViewProps) {
    const visibleLanguages = useMemo(() => {
        const ids = new Set<string>([
            TARGET_LANGUAGE_ID,
            ...profile.familiarities,
        ]);
        return LANGUAGES.filter((l) => ids.has(l.id));
    }, [profile.familiarities]);

    const nonTargetNames = visibleLanguages
        .filter((l) => l.id !== TARGET_LANGUAGE_ID)
        .map((l) => l.name)
        .join(", ");

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "2.5rem",
            }}
        >
            {ALL_TOPICS.map((topic) => {
                const entriesForTopic = visibleLanguages.map((lang) => {
                    const entry = SYNTAX_REFERENCES.find(
                        (ref) =>
                            ref.languageId === lang.id && ref.topic === topic
                    );
                    return { language: lang, entry };
                });

                return (
                    <article
                        key={topic}
                        id={syntaxId(topic)}
                        className={subSection}
                    >
                        <header
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.375rem",
                            }}
                        >
                            <h3 className={lessonTitle}>{topic}</h3>
                            <p className={lessonTagline}>
                                Side-by-side syntax comparison across your
                                languages.
                            </p>
                        </header>

                        <div className={noteBlock}>
                            <span>
                                <Braces
                                    size={14}
                                    style={{
                                        verticalAlign: "middle",
                                        marginRight: "0.25rem",
                                    }}
                                />
                                {languageNameForId(TARGET_LANGUAGE_ID)}
                                {nonTargetNames.length > 0
                                    ? ` vs ${nonTargetNames}`
                                    : ""}
                                . Select more languages in settings.
                            </span>
                        </div>

                        <div className={cheatsGrid}>
                            {entriesForTopic.map(({ language, entry }) => {
                                const isTarget =
                                    language.id === TARGET_LANGUAGE_ID;
                                return (
                                    <section
                                        key={language.id}
                                        className={cheatCard}
                                        style={{
                                            borderLeft: isTarget
                                                ? `3px solid ${vars.colour.accent}`
                                                : undefined,
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "0.5rem",
                                                marginBottom: "0.5rem",
                                            }}
                                        >
                                            <h3
                                                className={cheatTitle}
                                                style={{ margin: 0 }}
                                            >
                                                {language.name}
                                            </h3>
                                            {isTarget ? (
                                                <span
                                                    style={{
                                                        fontSize: "0.7rem",
                                                        padding:
                                                            "0.15rem 0.4rem",
                                                        borderRadius: "0.25rem",
                                                        background:
                                                            vars.colour.accent,
                                                        color: vars.colour
                                                            .panel,
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    learning
                                                </span>
                                            ) : null}
                                        </div>
                                        {entry === undefined ? (
                                            <span
                                                style={{
                                                    color: vars.colour.faint,
                                                    fontStyle: "italic",
                                                }}
                                            >
                                                No entry yet.
                                            </span>
                                        ) : (
                                            <>
                                                <p
                                                    style={{
                                                        margin: "0 0 0.5rem",
                                                        fontSize: "0.875rem",
                                                        color: vars.colour.dim,
                                                    }}
                                                >
                                                    {entry.title}
                                                </p>
                                                <CodeBlock
                                                    code={entry.code}
                                                    label={`${entry.id}.${fileExtensionForLanguage(language.id)}`}
                                                />
                                                <p
                                                    style={{
                                                        margin: "0.5rem 0 0",
                                                        fontSize: "0.8rem",
                                                        lineHeight: 1.5,
                                                        color: vars.colour.dim,
                                                    }}
                                                >
                                                    {entry.explanation}
                                                </p>
                                            </>
                                        )}
                                    </section>
                                );
                            })}
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
