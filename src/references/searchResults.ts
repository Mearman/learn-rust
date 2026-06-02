import { CONCEPTS } from "../data/concepts.ts";
import { LESSONS } from "../learn/lessons.ts";
import { GLOSSARY } from "../data/glossary.ts";
import { ERROR_CATALOGUE } from "../data/errors.ts";
import { SYNTAX_REFERENCES } from "../data/syntax-references.ts";

export type ResultType = "lesson" | "concept" | "syntax" | "glossary" | "error";

export interface SearchResult {
    readonly type: ResultType;
    readonly label: string;
    readonly description: string;
    readonly action: () => void;
}

const SYNTAX_TOPICS = SYNTAX_REFERENCES.reduce<string[]>((acc, entry) => {
    if (!acc.includes(entry.topic)) acc.push(entry.topic);
    return acc;
}, []);

/** Longest description preview shown in a search result, in characters. */
export const DESCRIPTION_PREVIEW_CHARS = 120;

/**
 * Cap a description preview at {@link DESCRIPTION_PREVIEW_CHARS}, appending an
 * ellipsis only when the text was actually longer than the cap. Shorter strings
 * are returned unchanged (no trailing "..." on a complete sentence).
 */
export function truncatePreview(text: string): string {
    if (text.length <= DESCRIPTION_PREVIEW_CHARS) return text;
    return text.slice(0, DESCRIPTION_PREVIEW_CHARS) + "...";
}

export function buildSearchResults(
    query: string,
    handlers: {
        readonly onOpenLesson: (id: string) => void;
        readonly onOpenConcept: (id: string) => void;
        readonly onOpenSyntax: (topic: string) => void;
        readonly onOpenGlossary: (id: string) => void;
        readonly onOpenError: (id: string) => void;
    }
): SearchResult[] {
    if (query.trim().length < 2) return [];

    const q = query.toLowerCase();
    const found: SearchResult[] = [];

    for (const lesson of LESSONS) {
        if (
            lesson.title.toLowerCase().includes(q) ||
            lesson.tagline.toLowerCase().includes(q) ||
            lesson.id.toLowerCase().includes(q)
        ) {
            found.push({
                type: "lesson",
                label: lesson.title,
                description: lesson.tagline,
                action: () => {
                    handlers.onOpenLesson(lesson.id);
                },
            });
        }
    }

    for (const concept of CONCEPTS) {
        if (
            concept.title.toLowerCase().includes(q) ||
            concept.description.toLowerCase().includes(q) ||
            concept.id.toLowerCase().includes(q)
        ) {
            found.push({
                type: "concept",
                label: concept.title,
                description: concept.description,
                action: () => {
                    handlers.onOpenConcept(concept.id);
                },
            });
        }
    }

    for (const term of GLOSSARY) {
        if (
            term.term.toLowerCase().includes(q) ||
            term.definition.toLowerCase().includes(q)
        ) {
            found.push({
                type: "glossary",
                label: term.term,
                description: truncatePreview(term.definition),
                action: () => {
                    handlers.onOpenGlossary(term.id);
                },
            });
        }
    }

    for (const error of ERROR_CATALOGUE) {
        if (
            error.code.toLowerCase().includes(q) ||
            error.title.toLowerCase().includes(q) ||
            error.explanation.toLowerCase().includes(q)
        ) {
            found.push({
                type: "error",
                label: `${error.code}: ${error.title}`,
                description: truncatePreview(error.explanation),
                action: () => {
                    handlers.onOpenError(error.id);
                },
            });
        }
    }

    for (const topic of SYNTAX_TOPICS) {
        if (topic.toLowerCase().includes(q)) {
            found.push({
                type: "syntax",
                label: `Syntax: ${topic}`,
                description: `Side-by-side syntax comparison for ${topic}.`,
                action: () => {
                    handlers.onOpenSyntax(topic);
                },
            });
        }
    }

    return found;
}
