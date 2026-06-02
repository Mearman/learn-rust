import { useCallback, useState } from "react";
import { createLocalStore } from "../settings/createLocalStore.ts";
import { isStringArray } from "../settings/guards.ts";

export const STORAGE_KEY = "rbc-starred-v1";

const store = createLocalStore<ReadonlySet<string>, readonly string[]>({
    key: STORAGE_KEY,
    guard: isStringArray,
    fallback: new Set(),
    label: "starred entries",
    decode: (stored) => new Set(stored),
    encode: (value) => [...value],
});

/**
 * Load the set of starred entry IDs from localStorage. Returns an empty set
 * when the key is absent, the stored value is not a string array, or storage
 * is unavailable. Corrupt data is cleared so it cannot wedge the app.
 */
export function loadStarred(): ReadonlySet<string> {
    return store.load();
}

export function saveStarred(starred: ReadonlySet<string>): void {
    store.save(starred);
}

/**
 * Persisted set of starred sidebar entry IDs (e.g. `lesson-…`, `concept-…`,
 * `glossary-…`). Starring an entry keeps it visible under its section header
 * even when the section is collapsed.
 */
export function useStarredEntries(): readonly [
    ReadonlySet<string>,
    (id: string) => void,
] {
    const [starred, setStarred] = useState<ReadonlySet<string>>(loadStarred);

    const toggleStar = useCallback((id: string) => {
        setStarred((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            saveStarred(next);
            return next;
        });
    }, []);

    return [starred, toggleStar] as const;
}
