import { useEffect, useState } from "react";

export function useActiveSubSection(
    ids: readonly string[]
): string | undefined {
    const [active, setActive] = useState<string | undefined>(ids[0]);

    useEffect(() => {
        if (ids.length === 0) {
            setActive(undefined);
            return;
        }

        // Reset to first when the list of IDs changes
        setActive(ids[0]);

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
