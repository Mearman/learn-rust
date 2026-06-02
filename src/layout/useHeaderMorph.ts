import { useEffect, useRef } from "react";

/**
 * Normalise a scroll position into a 0..1 morph progress.
 *
 * `0` means the page is at the top — the tailoring panel is in its full
 * expanded form. `1` means the reader has scrolled `distance` pixels — the
 * panel has fully condensed into its compact strip form. The same DOM elements
 * are transformed between the two; nothing is shown twice.
 *
 * `distance` is the panel's measured expanded height, so the condense completes
 * as the panel's original footprint scrolls past rather than at an arbitrary
 * hard-coded offset. A non-positive height (not yet measured) yields `0`.
 */
export function computeMorphProgress(
    scrollY: number,
    distance: number
): number {
    if (distance <= 0) return 0;
    const raw = scrollY / distance;
    if (raw <= 0) return 0;
    if (raw >= 1) return 1;
    return raw;
}

export interface HeaderMorph {
    /**
     * Attach to the ancestor of the tailoring panel. The hook writes the
     * `--morph` custom property here (0..1) for the panel's styles to consume.
     */
    readonly containerRef: React.RefObject<HTMLDivElement | null>;
    /**
     * Attach to the morphing tailoring panel itself. Its expanded height (the
     * height it has while the page is at the top) sets the scroll distance over
     * which the condense happens.
     */
    readonly panelRef: React.RefObject<HTMLDivElement | null>;
}

/** Scroll position (px) below which the panel is treated as fully expanded, so
 *  its current height can be trusted as the expanded-height reference. */
const EXPANDED_SAMPLE_THRESHOLD = 1;

/**
 * Drives the scroll-linked condense of the tailoring panel from its expanded
 * form to its compact strip form.
 *
 * On every scroll frame (throttled to one `requestAnimationFrame`) it writes a
 * single `--morph` custom property onto the container, so the panel's elements
 * transform in lockstep with the scroll position without re-rendering React on
 * every frame. The scroll distance is the panel's expanded height, sampled via
 * a `ResizeObserver` while the page is at the top (where the panel is known to
 * be fully expanded) so a mid-condense height is never mistaken for it.
 */
export function useHeaderMorph(): HeaderMorph {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const panelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        const panel = panelRef.current;
        if (container === null || panel === null) return;

        let frame = 0;
        // Expanded height of the panel; the scroll distance for a full condense.
        let expandedHeight = panel.offsetHeight;

        const apply = () => {
            frame = 0;
            const progress = computeMorphProgress(
                window.scrollY,
                expandedHeight
            );
            container.style.setProperty("--morph", progress.toString());
        };

        const schedule = () => {
            if (frame !== 0) return;
            frame = window.requestAnimationFrame(apply);
        };

        const sampleExpanded = () => {
            // Only trust the panel's height as "expanded" while at the top,
            // where the morph is 0 and the panel is at full size.
            if (window.scrollY <= EXPANDED_SAMPLE_THRESHOLD) {
                expandedHeight = panel.offsetHeight;
            }
            schedule();
        };

        const resizeObserver = new ResizeObserver(sampleExpanded);
        resizeObserver.observe(panel);

        sampleExpanded();
        apply(); // paint the initial state before the first scroll

        window.addEventListener("scroll", schedule, { passive: true });
        return () => {
            window.removeEventListener("scroll", schedule);
            resizeObserver.disconnect();
            if (frame !== 0) window.cancelAnimationFrame(frame);
        };
    }, []);

    return { containerRef, panelRef };
}
