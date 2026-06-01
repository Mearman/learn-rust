import { useCallback, useSyncExternalStore } from "react";

export type ThemeMode = "auto" | "dark" | "light";

type ResolvedTheme = "dark" | "light";

const STORAGE_KEY = "rbc-theme-v1";

function readStoredMode(): ThemeMode {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (
            stored === "auto" ||
            stored === "dark" ||
            stored === "light"
        ) {
            return stored;
        }
    } catch {
        // localStorage unavailable
    }
    return "auto";
}

function writeStoredMode(mode: ThemeMode): void {
    try {
        localStorage.setItem(STORAGE_KEY, mode);
    } catch {
        // localStorage unavailable
    }
}

function getSystemPreference(): ResolvedTheme {
    if (typeof window === "undefined") return "dark";
    return window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
    if (mode !== "auto") return mode;
    return getSystemPreference();
}

// Module-level listeners for cross-hook sync
const listeners = new Set<() => void>();

function emitChange(): void {
    for (const listener of listeners) {
        listener();
    }
}

let currentMode: ThemeMode = readStoredMode();

export function useThemeMode(): {
    readonly mode: ThemeMode;
    readonly resolved: ResolvedTheme;
    readonly setMode: (mode: ThemeMode) => void;
} {
    const mode = useSyncExternalStore(
        (onStoreChange) => {
            listeners.add(onStoreChange);
            return () => {
                listeners.delete(onStoreChange);
            };
        },
        () => currentMode,
        () => "auto" as ThemeMode
    );

    const resolved = resolveTheme(mode);

    const setMode = useCallback((next: ThemeMode): void => {
        if (next === currentMode) return;
        currentMode = next;
        writeStoredMode(next);
        emitChange();
    }, []);

    return { mode, resolved, setMode };
}
