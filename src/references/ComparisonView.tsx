import { useMemo } from "react";
import { ArrowLeftRight, BookOpen } from "lucide-react";
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
import { CONCEPTS } from "../data/concepts.ts";
import {
    LANGUAGES,
    languageNameForId,
    TARGET_LANGUAGE_ID,
} from "../data/languages.ts";
import { LANGUAGE_CONCEPTS } from "../data/language-concepts.ts";
import type { LanguageConcept, Concept } from "../data/types.ts";
import type { LanguageFamiliarity, UserProfile } from "../settings/types.ts";

interface ComparisonViewProps {
    readonly profile: UserProfile;
    readonly active: string;
    readonly onSelect: (conceptId: string) => void;
    readonly onOpenLesson: (lessonId: string) => void;
}

function findConcept(id: string): Concept {
    const concept = CONCEPTS.find((c) => c.id === id);
    if (concept === undefined) {
        throw new Error(`Unknown concept: ${id}`);
    }
    return concept;
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

export function ComparisonView({
    profile,
    active,
    onSelect,
    onOpenLesson,
}: ComparisonViewProps) {
    const concept = findConcept(active);

    const visibleLanguages = useMemo(() => {
        const ids = new Set<string>([
            TARGET_LANGUAGE_ID,
            ...profile.familiarities,
        ]);
        return LANGUAGES.filter((l) => ids.has(l.id));
    }, [profile.familiarities]);

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
                    {CONCEPTS.map((c) => {
                        const on = c.id === active;
                        return (
                            <button
                                key={c.id}
                                onClick={() => {
                                    onSelect(c.id);
                                }}
                                className={`${navButton} ${on ? navButtonActive : ""}`}
                            >
                                <ArrowLeftRight
                                    size={16}
                                    style={{
                                        color: on
                                            ? vars.colour.accentSoft
                                            : vars.colour.faint,
                                        flexShrink: 0,
                                    }}
                                />
                                <span style={{ flex: 1 }}>{c.title}</span>
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
                    gap: "1.5rem",
                }}
            >
                <header
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.375rem",
                    }}
                >
                    <h2 className={lessonTitle}>{concept.title}</h2>
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
                        Comparing {languageNameForId(TARGET_LANGUAGE_ID)} with{" "}
                        {visibleLanguages
                            .filter((l) => l.id !== TARGET_LANGUAGE_ID)
                            .map((l) => l.name)
                            .join(", ")}
                        . Select more languages in settings above.
                    </span>
                </div>

                <div className={cheatsGrid}>
                    {visibleLanguages.map((lang) => {
                        const entry = findLanguageConcept(lang.id, concept.id);
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
                                                background: vars.colour.accent,
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
        </div>
    );
}
