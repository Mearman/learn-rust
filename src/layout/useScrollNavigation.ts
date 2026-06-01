import { useCallback, useEffect } from "react";
import { flushSync } from "react-dom";

/**
 * Maps section-content prefixes to force-mount callbacks for deferred
 * sections. When a navigation target lives inside a deferred section body,
 * the callback is invoked inside `flushSync` so the DOM is synchronously
 * updated before the scroll attempt.
 *
 * Omit a key if the section is not deferred (its content is always mounted).
 */
export interface SectionMountMap {
    /** Force-mount the Compare section body (`concept-*` IDs). */
    readonly compare?: (() => void) | undefined;
    /** Force-mount the Syntax section body (`syntax-*` IDs). */
    readonly syntax?: (() => void) | undefined;
}

/**
 * Scroll smoothly to the element with `id`, if it exists, and reflect the
 * target in `window.location.hash` so the URL can be shared or bookmarked.
 *
 * If `mounts` is provided and the target ID belongs to a deferred section,
 * the corresponding force-mount callback is called inside `flushSync` first
 * so the element exists in the DOM before the scroll.
 */
function scrollToId(id: string, mounts?: SectionMountMap): void {
    // Force-mount a deferred section if needed before looking up the element.
    if (id.startsWith("concept-") && mounts?.compare !== undefined) {
        flushSync(mounts.compare);
    } else if (
        // `syntax-<slug>` sub-articles, not the top-level `#syntax` section
        id.startsWith("syntax-") &&
        id !== "syntax" &&
        mounts?.syntax !== undefined
    ) {
        flushSync(mounts.syntax);
    }

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
 * Pass `mounts` to enable force-mounting of deferred section bodies before
 * navigating to elements that live inside them.
 *
 * The `markViewed` argument is optional; pass it to record lesson visits.
 */
export function useScrollNavigation(
    markViewed?: (id: string) => void,
    mounts?: SectionMountMap
): ScrollNavigation {
    const openLesson = useCallback(
        (id: string) => {
            markViewed?.(id);
            scrollToId(`lesson-${id}`, mounts);
        },
        [markViewed, mounts]
    );

    const openConcept = useCallback(
        (id: string) => {
            scrollToId(`concept-${id}`, mounts);
        },
        [mounts]
    );

    const openSyntax = useCallback(
        (topic: string) => {
            scrollToId(
                `syntax-${topic.replace(/\s+/g, "-").toLowerCase()}`,
                mounts
            );
        },
        [mounts]
    );

    const openGlossary = useCallback((id: string) => {
        scrollToId(`glossary-${id}`);
    }, []);

    const openError = useCallback((id: string) => {
        scrollToId(`error-${id}`);
    }, []);

    const scrollToSubSection = useCallback(
        (id: string) => {
            scrollToId(id, mounts);
        },
        [mounts]
    );

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
 * element, scroll to it. If the target lives inside a deferred section, the
 * corresponding force-mount callback is called first.
 *
 * Does nothing on subsequent renders and never writes the hash, so it cannot
 * interfere with the scroll-spy in `useActiveSection`.
 *
 * `mounts` is included in the deps array; because the force-mount callbacks
 * are stable (wrapped in `useCallback`), the effect still fires exactly once.
 */
export function useHashNavigation(mounts?: SectionMountMap): void {
    useEffect(() => {
        const hash = window.location.hash.slice(1); // strip leading "#"
        if (hash.length === 0) return;

        // Force-mount the containing section so the target element exists.
        if (hash.startsWith("concept-") && mounts?.compare !== undefined) {
            flushSync(mounts.compare);
        } else if (
            hash.startsWith("syntax-") &&
            hash !== "syntax" &&
            mounts?.syntax !== undefined
        ) {
            flushSync(mounts.syntax);
        }

        const el = document.getElementById(hash);
        if (el !== null) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [mounts]); // mounts is stable; effect fires once on mount
}
