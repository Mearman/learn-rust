/**
 * Shared scroll-spy machinery for the section and sub-section trackers.
 *
 * The previous implementation gave every section its own IntersectionObserver
 * and set the active id for *any* intersecting entry. When several sections were
 * in view at once (the common case on a tall page) the "last callback wins" — a
 * non-deterministic ordering — so the highlighted section frequently did not
 * match the one the reader was actually looking at. A single observer over all
 * elements lets us pick the active id deterministically from the full set of
 * intersecting entries instead.
 */

/** Distance (px) from the viewport top below which an element counts as the
 *  active one — approximately the sticky nav's height. The matching `rootMargin`
 *  pulls the observation band down by the same amount so a section becomes
 *  active as its heading clears the nav. */
const NAV_OFFSET_PX = 80;

/** Fraction of the viewport, measured from the bottom, excluded from the band.
 *  Keeps a section from activating while it is still only peeking in from the
 *  bottom. */
const BOTTOM_BAND_FRACTION = 60;

/** The shared `rootMargin` for both scroll-spy observers, derived from the two
 *  band constants so the value cannot drift from `pickActiveId`'s thresholds. */
export const SCROLL_SPY_ROOT_MARGIN =
    "-" +
    NAV_OFFSET_PX.toString() +
    "px 0px -" +
    BOTTOM_BAND_FRACTION.toString() +
    "% 0px";

export const SCROLL_SPY_OBSERVER_OPTIONS: IntersectionObserverInit = {
    rootMargin: SCROLL_SPY_ROOT_MARGIN,
    threshold: 0,
};

/**
 * Pick the active element id from the full set of currently-intersecting
 * entries: the topmost one in the band, i.e. the entry whose top edge is closest
 * to the nav offset from above, or — if all intersecting entries have scrolled
 * their top above the nav — the last one to do so (the entry currently occupying
 * the band). Returns `undefined` when nothing is intersecting, so callers can
 * keep the previously-active id rather than clearing it.
 */
export function pickActiveId<Id extends string>(
    elements: ReadonlyMap<Element, Id>,
    intersecting: ReadonlySet<Element>
): Id | undefined {
    let bestId: Id | undefined;
    let bestTop = -Infinity;

    for (const element of intersecting) {
        const id = elements.get(element);
        if (id === undefined) continue;
        const { top } = element.getBoundingClientRect();
        // The active section is the lowest-on-screen heading whose top has
        // already passed the nav offset — that is the section the band is
        // sitting in. Among those, the one with the greatest `top` (closest to
        // the nav line from above) wins; this is deterministic regardless of
        // entry ordering.
        if (top <= NAV_OFFSET_PX && top > bestTop) {
            bestTop = top;
            bestId = id;
        }
    }

    if (bestId !== undefined) return bestId;

    // Nothing has crossed the nav line yet (e.g. at the very top of the page):
    // fall back to the topmost intersecting element, the one nearest the band.
    let fallbackId: Id | undefined;
    let fallbackTop = Infinity;
    for (const element of intersecting) {
        const id = elements.get(element);
        if (id === undefined) continue;
        const { top } = element.getBoundingClientRect();
        if (top < fallbackTop) {
            fallbackTop = top;
            fallbackId = id;
        }
    }
    return fallbackId;
}

/**
 * Observe a set of elements with a single IntersectionObserver and report the
 * deterministically-chosen active id whenever the intersecting set changes.
 *
 * @param elements  Map of element to its id, in document order.
 * @param onActive  Called with the new active id (never with `undefined` —
 *                  when nothing intersects the previous id is kept).
 * @returns a teardown function that disconnects the observer.
 */
export function observeScrollSpy<Id extends string>(
    elements: ReadonlyMap<Element, Id>,
    onActive: (id: Id) => void
): () => void {
    const intersecting = new Set<Element>();

    const observer = new IntersectionObserver((entries) => {
        for (const entry of entries) {
            if (entry.isIntersecting) {
                intersecting.add(entry.target);
            } else {
                intersecting.delete(entry.target);
            }
        }
        const next = pickActiveId(elements, intersecting);
        if (next !== undefined) onActive(next);
    }, SCROLL_SPY_OBSERVER_OPTIONS);

    for (const element of elements.keys()) {
        observer.observe(element);
    }

    return () => {
        observer.disconnect();
    };
}
