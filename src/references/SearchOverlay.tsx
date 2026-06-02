import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { vars } from "../theme/theme.css.ts";
import {
    searchOverlay,
    searchPanel,
    searchInput,
    searchResults,
    searchHeaderBar,
    searchCloseButton,
} from "../theme/styles.css.ts";
import { SearchView } from "./SearchView.tsx";
import { buildSearchResults } from "./searchResults.ts";

interface SearchOverlayProps {
    readonly onClose: () => void;
    readonly onOpenLesson: (id: string) => void;
    readonly onOpenConcept: (id: string) => void;
    readonly onOpenSyntax: (topic: string) => void;
    readonly onOpenGlossary: (id: string) => void;
    readonly onOpenError: (id: string) => void;
}

/** Minimum query length before the live region announces a result count. */
const MIN_QUERY_LENGTH = 2;

export function SearchOverlay({
    onClose,
    onOpenLesson,
    onOpenConcept,
    onOpenSyntax,
    onOpenGlossary,
    onOpenError,
}: SearchOverlayProps) {
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(-1);

    // Ref to the panel so we can trap focus within it.
    const panelRef = useRef<HTMLDivElement>(null);
    // Ref to the search input so we can auto-focus it.
    const inputRef = useRef<HTMLInputElement>(null);

    // Remember which element had focus before the overlay opened so we can
    // restore it on close.
    const priorFocusRef = useRef<Element | null>(
        typeof document !== "undefined" ? document.activeElement : null
    );

    // Build results so we know the total count for keyboard navigation.
    // These are the same handlers passed into SearchView, so the result list
    // is in sync.
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

    // Auto-focus the input when the overlay mounts.
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Restore focus to the previously focused element on unmount.
    useEffect(() => {
        // Capture the ref value at setup time so the cleanup function sees
        // a stable reference (the linter warns about reading .current in
        // cleanup where the value may have changed).
        const prior = priorFocusRef.current;
        return () => {
            if (prior instanceof HTMLElement) {
                prior.focus();
            }
        };
    }, []);

    // Keyboard: Escape closes; ArrowUp/Down moves highlight; Enter activates.
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === "Escape") {
                e.preventDefault();
                onClose();
                return;
            }
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((i) =>
                    results.length === 0
                        ? -1
                        : Math.min(i + 1, results.length - 1)
                );
                return;
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, -1));
                return;
            }
            if (e.key === "Enter" && activeIndex >= 0) {
                e.preventDefault();
                const result = results[activeIndex];
                if (result !== undefined) {
                    result.action();
                }
            }
        },
        [onClose, results, activeIndex]
    );

    // Focus trap: keep focus inside the panel on Tab.
    const handleFocusTrap = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key !== "Tab") return;
            const panel = panelRef.current;
            if (panel === null) return;

            const focusable = Array.from(
                panel.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
                )
            );
            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (first === undefined || last === undefined) return;

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        },
        []
    );

    const handleCombinedKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            handleFocusTrap(e);
            handleKeyDown(e);
        },
        [handleFocusTrap, handleKeyDown]
    );

    // Scroll the active result into view when it changes.
    useEffect(() => {
        if (activeIndex < 0) return;
        const el = document.getElementById(
            `search-result-${String(activeIndex)}`
        );
        el?.scrollIntoView({ block: "nearest" });
    }, [activeIndex]);

    const inputId = "search-overlay-input";

    return (
        <div
            className={searchOverlay}
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            onKeyDown={handleCombinedKeyDown}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className={searchPanel} ref={panelRef}>
                <div className={searchHeaderBar}>
                    <Search
                        size={18}
                        style={{
                            marginLeft: "1rem",
                            color: vars.colour.faint,
                            flexShrink: 0,
                        }}
                        aria-hidden="true"
                    />
                    <input
                        ref={inputRef}
                        id={inputId}
                        type="text"
                        role="combobox"
                        aria-expanded={true}
                        aria-controls="search-results-listbox"
                        aria-autocomplete="list"
                        aria-activedescendant={
                            activeIndex >= 0
                                ? `search-result-${String(activeIndex)}`
                                : undefined
                        }
                        className={searchInput}
                        placeholder="Search lessons, concepts, syntax, glossary, errors..."
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            // Reset keyboard selection whenever the query changes.
                            setActiveIndex(-1);
                        }}
                    />
                    <button
                        type="button"
                        onClick={onClose}
                        className={searchCloseButton}
                        aria-label="Close search"
                    >
                        <X size={18} aria-hidden="true" />
                    </button>
                </div>
                {/* Visually-hidden live region: announces result count to
                    screen readers without disrupting keyboard focus. */}
                <div
                    role="status"
                    aria-live="polite"
                    style={{
                        position: "absolute",
                        width: 1,
                        height: 1,
                        padding: 0,
                        margin: -1,
                        overflow: "hidden",
                        clip: "rect(0,0,0,0)",
                        whiteSpace: "nowrap",
                        borderWidth: 0,
                    }}
                >
                    {query.trim().length >= MIN_QUERY_LENGTH
                        ? `${String(results.length)} result${results.length === 1 ? "" : "s"}`
                        : ""}
                </div>
                <div
                    id="search-results-listbox"
                    role="listbox"
                    aria-label="Search results"
                    className={searchResults}
                >
                    <SearchView
                        query={query}
                        activeIndex={activeIndex}
                        onOpenLesson={(id) => {
                            onOpenLesson(id);
                            onClose();
                        }}
                        onOpenConcept={(id) => {
                            onOpenConcept(id);
                            onClose();
                        }}
                        onOpenSyntax={(topic) => {
                            onOpenSyntax(topic);
                            onClose();
                        }}
                        onOpenGlossary={(id) => {
                            onOpenGlossary(id);
                            onClose();
                        }}
                        onOpenError={(id) => {
                            onOpenError(id);
                            onClose();
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
