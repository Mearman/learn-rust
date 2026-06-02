import { useCallback } from "react";

const STORAGE_KEY = "rbc-challenge-answers-v1";

/** Map of challenge id to the learner's guess (true = "compiles"). */
export type ChallengeAnswers = Readonly<Record<string, boolean>>;

function isAnswers(value: unknown): value is Record<string, boolean> {
    if (typeof value !== "object" || value === null || Array.isArray(value))
        return false;
    return Object.values(value).every((v) => typeof v === "boolean");
}

/** Load persisted challenge answers. Returns an empty map when absent or
 *  malformed; corrupt data is cleared so it cannot wedge the app. */
export function loadChallengeAnswers(): ChallengeAnswers {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw === null) return {};
        const parsed: unknown = JSON.parse(raw);
        if (!isAnswers(parsed)) {
            console.warn(
                `[rbc] Stored challenge answers under "${STORAGE_KEY}" failed ` +
                    "validation — falling back to empty and clearing the key."
            );
            localStorage.removeItem(STORAGE_KEY);
            return {};
        }
        return parsed;
    } catch {
        return {};
    }
}

export function useChallengeAnswers(): (answers: ChallengeAnswers) => void {
    return useCallback((answers: ChallengeAnswers): void => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    }, []);
}
