import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createLocalStore } from "./createLocalStore.ts";
import { isStringArray } from "./guards.ts";

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

const KEY = "rbc-test-store";

function makeStore() {
    return createLocalStore<readonly string[], readonly string[]>({
        key: KEY,
        guard: isStringArray,
        fallback: [],
        label: "test data",
        decode: (stored) => stored,
        encode: (value) => [...value],
    });
}

describe("createLocalStore", () => {
    beforeEach(() => {
        vi.stubGlobal("localStorage", createLocalStorageStub());
    });

    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it("returns the default when the stored value is not valid JSON and removes the key", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        localStorage.setItem(KEY, "{not json");

        const store = makeStore();
        expect(store.load()).toEqual([]);
        expect(localStorage.getItem(KEY)).toBeNull();
        expect(warn).toHaveBeenCalledOnce();
    });

    it("returns the default and clears the key when the parsed shape fails the guard", () => {
        vi.spyOn(console, "warn").mockImplementation(() => {});
        localStorage.setItem(KEY, JSON.stringify({ not: "an array" }));

        const store = makeStore();
        expect(store.load()).toEqual([]);
        expect(localStorage.getItem(KEY)).toBeNull();
    });

    it("returns the default when nothing is stored", () => {
        expect(makeStore().load()).toEqual([]);
    });

    it("round-trips a valid value", () => {
        const store = makeStore();
        store.save(["a", "b"]);
        expect(store.load()).toEqual(["a", "b"]);
    });
});
