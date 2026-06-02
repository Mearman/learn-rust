import { useEffect, useRef } from "react";

/**
 * Live-updates the URL hash to reflect the active section / sub-section as the
 * reader scrolls. Uses `history.replaceState`, which updates the URL without
 * adding a back-history entry and without triggering a scroll — assigning
 * `window.location.hash` would do both.
 *
 * The first value observed is taken as a baseline and not written, so a
 * freshly-loaded URL stays clean (and a deep link is not immediately
 * overwritten). Seeding the baseline by value rather than by "first render"
 * also keeps it stable under StrictMode's double-invoked effects.
 */
export function useActiveHash(activeId: string): void {
    const previous = useRef<string | undefined>(undefined);

    useEffect(() => {
        if (previous.current === undefined) {
            previous.current = activeId;
            return;
        }
        if (activeId === previous.current) return;
        previous.current = activeId;

        const hash = `#${activeId}`;
        if (window.location.hash !== hash) {
            history.replaceState(null, "", hash);
        }
    }, [activeId]);
}
