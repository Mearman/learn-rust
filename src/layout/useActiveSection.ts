import { useEffect, useState } from "react";
import { observeScrollSpy } from "./scrollSpy.ts";
import { scrollBehaviour } from "./reducedMotion.ts";
import { SECTION_IDS } from "./subSections.ts";
import type { SectionId } from "./subSections.ts";

export function scrollToSection(id: SectionId): void {
    const element = document.getElementById(id);
    if (element !== null) {
        element.scrollIntoView({ behavior: scrollBehaviour(), block: "start" });
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
