import { useCallback, useEffect, useRef, useState } from "react";

export interface VisibilityControl {
    /** True once the sentinel has entered (or nearly entered) the viewport. */
    readonly mounted: boolean;
    /**
     * Ref to attach to a sentinel `<div>` placed at the top of the deferred
     * section body. The IntersectionObserver watches this element.
     */
    readonly sentinelRef: React.RefObject<HTMLDivElement | null>;
    /**
     * Imperatively force the section to mount without waiting for scroll.
     * Call this before navigating to a child element that lives inside the
     * deferred body.
     */
    readonly forceMount: () => void;
}

/**
 * Returns controls for lazy-mounting a section body.
 *
 * `mounted` flips to `true` the first time the sentinel element enters the
 * viewport (using a generous 200 px look-ahead margin). It never flips back.
 * `forceMount` sets `mounted` immediately — use it before programmatic
 * navigation to elements that live inside the deferred body.
 */
export function useHasBeenVisible(): VisibilityControl {
    const [mounted, setMounted] = useState(false);
    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const forceMount = useCallback(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) return; // already visible — no observer needed

        const el = sentinelRef.current;
        if (el === null) return;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        setMounted(true);
                        observer.disconnect();
                    }
                }
            },
            {
                // Load content 300 px before it reaches the viewport so
                // users never see a blank flash while scrolling.
                rootMargin: "0px 0px 300px 0px",
                threshold: 0,
            }
        );

        observer.observe(el);
        return () => {
            observer.disconnect();
        };
    }, [mounted]);

    return { mounted, sentinelRef, forceMount };
}
