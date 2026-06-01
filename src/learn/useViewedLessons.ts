import { useCallback, useState } from "react";

const STORAGE_KEY = "rbc-viewed-v1";

function isStringArray(value: unknown): value is readonly string[] {
    return (
        Array.isArray(value) && value.every((item) => typeof item === "string")
    );
}

function loadViewed(): ReadonlySet<string> {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw === null) return new Set();
        const parsed: unknown = JSON.parse(raw);
        if (!isStringArray(parsed)) {
            console.warn(
                `[rbc] Stored viewed-lessons under "${STORAGE_KEY}" failed ` +
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

function saveViewed(viewed: ReadonlySet<string>): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...viewed]));
}

export function useViewedLessons(): readonly [
    ReadonlySet<string>,
    (id: string) => void,
] {
    const [viewed, setViewed] = useState<ReadonlySet<string>>(loadViewed);

    const markViewed = useCallback((id: string) => {
        setViewed((prev) => {
            if (prev.has(id)) return prev;
            const next = new Set(prev);
            next.add(id);
            saveViewed(next);
            return next;
        });
    }, []);

    return [viewed, markViewed] as const;
}
