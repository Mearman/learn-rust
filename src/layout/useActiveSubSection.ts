import { useEffect, useMemo, useState } from "react";

export function useActiveSubSection(
    ids: readonly string[]
): string | undefined {
    const firstId = useMemo(() => ids[0], [ids]);

    const [active, setActive] = useState<string | undefined>(firstId);

    // Reset to first when the section changes (firstId changes).
    useEffect(() => {
        setActive(firstId);
    }, [firstId]);

    // Observe subsection elements for intersection.
    useEffect(() => {
        if (ids.length === 0) return;

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
    }, [ids]);

    return active;
}
