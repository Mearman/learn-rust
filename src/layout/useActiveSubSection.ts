import { useEffect, useState } from "react";

/**
 * Tracks which sub-section is currently in the viewport.
 *
 * @param ids - All sub-section element ids to observe.
 * @param mountVersion - A monotonically-increasing counter that bumps when
 *   deferred sections mount (e.g. `Number(compareMounted) +
 *   Number(syntaxMounted) * 2`). When it changes the effect re-runs and
 *   creates observers for elements that are now in the DOM. Pass `0` (or
 *   omit) when there are no deferred sections.
 */
export function useActiveSubSection(
    ids: readonly string[],
    mountVersion: number = 0
): string | undefined {
    const [active, setActive] = useState<string | undefined>(() => ids[0]);

    useEffect(() => {
        if (ids.length === 0) {
            return;
        }

        const observers: IntersectionObserver[] = [];

        for (const id of ids) {
            const element = document.getElementById(id);
            if (element === null) continue;

            const observer = new IntersectionObserver(
                (entries) => {
                    for (const entry of entries) {
                        if (entry.isIntersecting) {
                            setActive(id);
                        }
                    }
                },
                {
                    rootMargin: "-80px 0px -60% 0px",
                    threshold: 0,
                }
            );
            observer.observe(element);
            observers.push(observer);
        }

        return () => {
            for (const observer of observers) {
                observer.disconnect();
            }
        };
    }, [ids, mountVersion]);

    return active;
}
