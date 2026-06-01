import { useMemo } from "react";
import { vars } from "../theme/theme.css.ts";
import {
    noteBlock,
    searchResultItem,
    searchResultItemActive,
} from "../theme/styles.css.ts";
import { buildSearchResults } from "./searchResults.ts";

interface SearchViewProps {
    readonly query: string;
    readonly activeIndex: number;
    readonly onOpenLesson: (lessonId: string) => void;
    readonly onOpenConcept: (conceptId: string) => void;
    readonly onOpenSyntax: (topic: string) => void;
    readonly onOpenGlossary: (termId: string) => void;
    readonly onOpenError: (errorId: string) => void;
}

export function SearchView({
    query,
    activeIndex,
    onOpenLesson,
    onOpenConcept,
    onOpenSyntax,
    onOpenGlossary,
    onOpenError,
}: SearchViewProps) {
    const results = useMemo(
        () =>
            buildSearchResults(query, {
                onOpenLesson,
                onOpenConcept,
                onOpenSyntax,
                onOpenGlossary,
                onOpenError,
            }),
        [
            query,
            onOpenLesson,
            onOpenConcept,
            onOpenSyntax,
            onOpenGlossary,
            onOpenError,
        ]
    );

    return (
        <>
            {query.trim().length >= 2 && results.length === 0 ? (
                <div className={noteBlock}>
                    <span>No results for &quot;{query}&quot;.</span>
                </div>
            ) : null}

            {results.map((result, i) => (
                <button
                    key={i}
                    type="button"
                    id={`search-result-${String(i)}`}
                    role="option"
                    aria-selected={i === activeIndex}
                    onClick={result.action}
                    className={`${searchResultItem} ${i === activeIndex ? searchResultItemActive : ""}`}
                >
                    <span
                        style={{
                            fontSize: "0.7rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            color: vars.colour.accent,
                        }}
                    >
                        {result.type}
                    </span>
                    <span
                        style={{
                            color: vars.colour.text,
                            fontWeight: 600,
                            fontSize: "0.95rem",
                        }}
                    >
                        {result.label}
                    </span>
                    <span
                        style={{
                            color: vars.colour.dim,
                            fontSize: "0.85rem",
                            lineHeight: 1.4,
                        }}
                    >
                        {result.description}
                    </span>
                </button>
            ))}
        </>
    );
}
