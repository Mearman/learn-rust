import { useEffect } from "react";

/**
 * Locks `document.body` scroll while `active` is true, and restores the
 * previous overflow value on deactivation or unmount.
 *
 * Used by modal overlays (search, mobile TOC sheet) to prevent background
 * scroll while the overlay is open.
 */
export function useBodyScrollLock(active: boolean): void {
    useEffect(() => {
        if (!active) return;

        const previousOverflow = document.body.style.overflow;
        const previousGutter = document.body.style.scrollbarGutter;

        // Reserve the scrollbar's space while the page scrollbar is suppressed,
        // so removing it does not widen the content and shift the layout
        // sideways as the overlay opens (and shift back as it closes).
        document.body.style.overflow = "hidden";
        document.body.style.scrollbarGutter = "stable";

        return () => {
            document.body.style.overflow = previousOverflow;
            document.body.style.scrollbarGutter = previousGutter;
        };
    }, [active]);
}
