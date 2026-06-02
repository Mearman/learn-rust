/**
 * Reduced-motion helpers.
 *
 * Centralises the `(prefers-reduced-motion: reduce)` query so every scroll
 * animation in the app honours the same user preference from one place rather
 * than each call site re-deriving it.
 */

/** The media query string for users who have asked for reduced motion. */
export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Whether the user currently prefers reduced motion. Safe to call in any
 * environment: returns `false` when `matchMedia` is unavailable (SSR/tests).
 */
export function prefersReducedMotion(): boolean {
    if (
        typeof window === "undefined" ||
        typeof window.matchMedia !== "function"
    )
        return false;
    return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/**
 * The scroll behaviour to use for `scrollIntoView` / `scrollTo`: `"auto"`
 * (instant) when the reader prefers reduced motion, otherwise `"smooth"`.
 * Resolving this through one helper keeps every programmatic scroll consistent.
 */
export function scrollBehaviour(): ScrollBehavior {
    return prefersReducedMotion() ? "auto" : "smooth";
}
