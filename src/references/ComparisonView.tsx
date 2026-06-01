import { useMemo } from "react";
import { ArrowLeftRight, BookOpen } from "lucide-react";
import { CodeBlock } from "../highlight/CodeBlock.tsx";
import { vars } from "../theme/theme.css.ts";
import {
    lessonTitle,
    lessonTagline,
    navButton,
    cheatsGrid,
    cheatCard,
    cheatTitle,
    noteBlock,
    subSection,
} from "../theme/styles.css.ts";
import { CONCEPTS } from "../data/concepts.ts";
import {
    LANGUAGES,
    languageNameForId,
    TARGET_LANGUAGE_ID,
} from "../data/languages.ts";
import { LANGUAGE_CONCEPTS } from "../data/language-concepts.ts";
import type { LanguageConcept, Concept } from "../data/types.ts";
import type { UserProfile } from "../settings/types.ts";

interface ComparisonViewProps {
    readonly profile: UserProfile;
    readonly onOpenLesson: (lessonId: string) => void;
}

function findLanguageConcept(
    languageId: string,
    conceptId: string
): LanguageConcept | undefined {
    return LANGUAGE_CONCEPTS.find(
        (lc) => lc.languageId === languageId && lc.conceptId === conceptId
    );
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

export function ComparisonView({ profile, onOpenLesson }: ComparisonViewProps) {
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
            {CONCEPTS.map((concept) => (
                <article
                    key={concept.id}
                    id={`concept-${concept.id}`}
                    className={subSection}
                >
                    <header
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.375rem",
                        }}
                    >
                        <h3 className={lessonTitle}>{concept.title}</h3>
                        <p className={lessonTagline}>{concept.description}</p>
                    </header>

                    <div className={noteBlock}>
                        <span>
                            <ArrowLeftRight
                                size={14}
                                style={{
                                    verticalAlign: "middle",
                                    marginRight: "0.25rem",
                                }}
                            />
                            {languageNameForId(TARGET_LANGUAGE_ID)}{" "}
                            {nonTargetNames.length > 0
                                ? `vs ${nonTargetNames}`
                                : ""}
                            . Select more languages in settings.
                        </span>
                    </div>

                    <div className={cheatsGrid}>
                        {visibleLanguages.map((lang) => {
                            const entry = findLanguageConcept(
                                lang.id,
                                concept.id
                            );
                            const isTarget = lang.id === TARGET_LANGUAGE_ID;
                            return (
                                <section
                                    key={lang.id}
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
                                            {lang.name}
                                        </h3>
                                        {isTarget ? (
                                            <span
                                                style={{
                                                    fontSize: "0.7rem",
                                                    padding: "0.15rem 0.4rem",
                                                    borderRadius: "0.25rem",
                                                    background:
                                                        vars.colour.accent,
                                                    color: vars.colour.panel,
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
                                                label={`${entry.id}.${fileExtensionForLanguage(lang.id)}`}
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

                    {concept.lessonIds.length > 0 ? (
                        <div className={cheatCard}>
                            <h3 className={cheatTitle}>
                                <BookOpen
                                    size={14}
                                    style={{
                                        verticalAlign: "middle",
                                        marginRight: "0.25rem",
                                    }}
                                />
                                Related lessons
                            </h3>
                            <div
                                style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "0.5rem",
                                }}
                            >
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
                                            padding: "0.5rem 0.75rem",
                                        }}
                                    >
                                        Open lesson: {lessonId}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : null}
                </article>
            ))}
        </div>
    );
}
