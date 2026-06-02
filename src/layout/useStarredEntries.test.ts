import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { STORAGE_KEY, loadStarred, saveStarred } from "./useStarredEntries.ts";

/** Minimal in-memory localStorage for the node test environment. */
function createLocalStorageStub(): Storage {
    const store = new Map<string, string>();
    return {
        get length() {
            return store.size;
        },
        clear() {
            store.clear();
        },
        getItem(key) {
            return store.get(key) ?? null;
        },
        key(index) {
            return [...store.keys()][index] ?? null;
        },
        removeItem(key) {
            store.delete(key);
        },
        setItem(key, value) {
            store.set(key, value);
        },
    };
}

describe("useStarredEntries persistence", () => {
    beforeEach(() => {
        vi.stubGlobal("localStorage", createLocalStorageStub());
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it("returns an empty set when nothing is stored", () => {
        expect(loadStarred().size).toBe(0);
    });

    it("round-trips starred IDs through save and load", () => {
        saveStarred(new Set(["lesson-a", "concept-b"]));
        expect([...loadStarred()].sort()).toEqual(["concept-b", "lesson-a"]);
    });

    it("persists as a JSON string array under the versioned key", () => {
        saveStarred(new Set(["error-x"]));
        expect(localStorage.getItem(STORAGE_KEY)).toBe('["error-x"]');
    });

    it("falls back to empty on corrupt JSON without throwing", () => {
        localStorage.setItem(STORAGE_KEY, "{not valid json");
        expect(loadStarred().size).toBe(0);
    });

    it("clears the key and warns when the stored shape is wrong", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ not: "an array" }));

        expect(loadStarred().size).toBe(0);
        expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
        expect(warn).toHaveBeenCalledOnce();
    });

    it("rejects arrays containing non-string members", () => {
        vi.spyOn(console, "warn").mockImplementation(() => {});
        localStorage.setItem(STORAGE_KEY, JSON.stringify(["ok", 42]));

        expect(loadStarred().size).toBe(0);
        expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
});
