import { useCallback, useEffect } from "react";

/**
 * Scroll smoothly to the element with `id`, if it exists, and reflect the
 * target in `window.location.hash` so the URL can be shared or bookmarked.
 */
function scrollToId(id: string): void {
    const el = document.getElementById(id);
    if (el !== null) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        window.location.hash = id;
    }
}

export interface ScrollNavigation {
    /** Scroll to `lesson-<id>`. */
    readonly openLesson: (id: string) => void;
    /** Scroll to `concept-<id>`. */
    readonly openConcept: (id: string) => void;
    /**
     * Scroll to `syntax-<slug>` where slug = topic with spaces replaced by
     * hyphens, lowercased.
     */
    readonly openSyntax: (topic: string) => void;
    /** Scroll to `glossary-<id>`. */
    readonly openGlossary: (id: string) => void;
    /** Scroll to `error-<id>`. */
    readonly openError: (id: string) => void;
    /** Scroll to an arbitrary subsection by its literal element id. */
    readonly scrollToSubSection: (id: string) => void;
}

/**
 * Returns stable callbacks for scrolling to named entries and subsections.
 * All openers call the shared `scrollToId` helper so the
 * `getElementById` + `scrollIntoView` pattern lives in one place, and each
 * call also writes `window.location.hash` for shareability.
 *
 * The `markViewed` argument is optional; pass it to record lesson visits.
 */
export function useScrollNavigation(
    markViewed?: (id: string) => void
): ScrollNavigation {
    const openLesson = useCallback(
        (id: string) => {
            markViewed?.(id);
            scrollToId(`lesson-${id}`);
        },
        [markViewed]
    );

    const openConcept = useCallback((id: string) => {
        scrollToId(`concept-${id}`);
    }, []);

    const openSyntax = useCallback((topic: string) => {
        scrollToId(`syntax-${topic.replace(/\s+/g, "-").toLowerCase()}`);
    }, []);

    const openGlossary = useCallback((id: string) => {
        scrollToId(`glossary-${id}`);
    }, []);

    const openError = useCallback((id: string) => {
        scrollToId(`error-${id}`);
    }, []);

    const scrollToSubSection = useCallback((id: string) => {
        scrollToId(id);
    }, []);

    return {
        openLesson,
        openConcept,
        openSyntax,
        openGlossary,
        openError,
        scrollToSubSection,
    };
}

/**
 * One-shot effect: on initial mount, if `location.hash` points at an existing
 * element, scroll to it. Does nothing on subsequent renders and never writes
 * the hash, so it cannot interfere with the scroll-spy in `useActiveSection`.
 */
export function useHashNavigation(): void {
    useEffect(() => {
        const hash = window.location.hash.slice(1); // strip leading "#"
        if (hash.length === 0) return;
        const el = document.getElementById(hash);
        if (el !== null) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, []); // empty deps — runs once after mount
}
