import { useEffect, useState } from "react";
import { observeScrollSpy } from "./scrollSpy.ts";

const SECTION_IDS = [
    "learn",
    "challenge",
    "path",
    "compare",
    "syntax",
    "glossary",
    "errors",
    "reading-errors",
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
        const elements = new Map<Element, SectionId>();
        for (const id of SECTION_IDS) {
            const element = document.getElementById(id);
            if (element !== null) elements.set(element, id);
        }
        if (elements.size === 0) return;

        return observeScrollSpy(elements, setActive);
    }, []);

    return active;
}
