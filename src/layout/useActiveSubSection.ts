import { useEffect, useState } from "react";
import { observeScrollSpy } from "./scrollSpy.ts";

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

        const elements = new Map<Element, string>();
        for (const id of ids) {
            const element = document.getElementById(id);
            if (element !== null) elements.set(element, id);
        }
        if (elements.size === 0) return;

        return observeScrollSpy(elements, setActive);
    }, [ids, mountVersion]);

    return active;
}
