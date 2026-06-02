import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Tracks whether the page header has scrolled out of view. Attach the
 * returned ref to a zero-height sentinel at the end of the `<header>`; once
 * that sentinel leaves the top of the viewport `collapsed` becomes true, and
 * it returns to false when the header scrolls back into view.
 */
export function useHeaderCollapsed(): {
    readonly collapsed: boolean;
    readonly sentinelRef: RefObject<HTMLDivElement | null>;
} {
    const [collapsed, setCollapsed] = useState(false);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = sentinelRef.current;
        if (el === null) return;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    setCollapsed(!entry.isIntersecting);
                }
            },
            { threshold: 0 }
        );
        observer.observe(el);
        return () => {
            observer.disconnect();
        };
    }, []);

    return { collapsed, sentinelRef };
}
