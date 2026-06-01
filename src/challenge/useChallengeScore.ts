import { useCallback } from "react";

const STORAGE_KEY = "rbc-challenge-score-v1";

interface ChallengeScore {
    readonly correct: number;
    readonly total: number;
}

function isChallengeScore(value: unknown): value is ChallengeScore {
    if (typeof value !== "object" || value === null || Array.isArray(value))
        return false;
    if (!("correct" in value) || !("total" in value)) return false;
    return typeof value.correct === "number" && typeof value.total === "number";
}

export function loadChallengeScore(): ChallengeScore {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw === null) return { correct: 0, total: 0 };
        const parsed: unknown = JSON.parse(raw);
        if (!isChallengeScore(parsed)) {
            console.warn(
                `[rbc] Stored challenge score under "${STORAGE_KEY}" failed ` +
                    "validation — falling back to zero and clearing the key."
            );
            localStorage.removeItem(STORAGE_KEY);
            return { correct: 0, total: 0 };
        }
        return parsed;
    } catch {
        return { correct: 0, total: 0 };
    }
}

export function useChallengeScore(): (correct: number, total: number) => void {
    const saveScore = useCallback((correct: number, total: number): void => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ correct, total }));
    }, []);

    return saveScore;
}
