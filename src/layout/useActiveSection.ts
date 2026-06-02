import { useEffect, useState } from "react";

const SECTION_IDS = [
    "learn",
    "challenge",
    "path",
    "compare",
    "syntax",
    "glossary",
    "errors",
    "cheatsheet",
] as const;

export type SectionId = (typeof SECTION_IDS)[number];

export function scrollToSection(id: SectionId): void {
    const element = document.getElementById(id);
    if (element !== null) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `#${id}`);
    }
}

export function useActiveSection(): SectionId {
    const [active, setActive] = useState<SectionId>("learn");

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        for (const id of SECTION_IDS) {
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
                    // The sticky nav height approximately — adjust if nav changes
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
    }, []);

    return active;
}
