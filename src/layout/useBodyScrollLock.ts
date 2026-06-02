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

        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previous;
        };
    }, [active]);
}
