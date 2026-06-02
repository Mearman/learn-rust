import { useCallback, useState } from "react";
import { createLocalStore } from "../settings/createLocalStore.ts";
import { isStringArray } from "../settings/guards.ts";

const STORAGE_KEY = "rbc-viewed-v1";

const store = createLocalStore<ReadonlySet<string>, readonly string[]>({
    key: STORAGE_KEY,
    guard: isStringArray,
    fallback: new Set(),
    label: "viewed-lessons",
    decode: (stored) => new Set(stored),
    encode: (value) => [...value],
});

export function useViewedLessons(): readonly [
    ReadonlySet<string>,
    (id: string) => void,
] {
    const [viewed, setViewed] = useState<ReadonlySet<string>>(store.load);

    const markViewed = useCallback((id: string) => {
        setViewed((prev) => {
            if (prev.has(id)) return prev;
            const next = new Set(prev);
            next.add(id);
            store.save(next);
            return next;
        });
    }, []);

    return [viewed, markViewed] as const;
}
