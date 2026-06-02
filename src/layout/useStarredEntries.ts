import { useCallback, useState } from "react";

export const STORAGE_KEY = "rbc-starred-v1";

function isStringArray(value: unknown): value is readonly string[] {
    return (
        Array.isArray(value) && value.every((item) => typeof item === "string")
    );
}

/**
 * Load the set of starred entry IDs from localStorage. Returns an empty set
 * when the key is absent, the stored value is not a string array, or storage
 * is unavailable. Corrupt data is cleared so it cannot wedge the app.
 */
export function loadStarred(): ReadonlySet<string> {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw === null) return new Set();
        const parsed: unknown = JSON.parse(raw);
        if (!isStringArray(parsed)) {
            console.warn(
                `[rbc] Stored starred entries under "${STORAGE_KEY}" failed ` +
                    "validation — falling back to empty and clearing the key."
            );
            localStorage.removeItem(STORAGE_KEY);
            return new Set();
        }
        return new Set(parsed);
    } catch {
        return new Set();
    }
}

export function saveStarred(starred: ReadonlySet<string>): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...starred]));
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
