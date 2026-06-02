import { useCallback } from "react";
import { createLocalStore } from "../settings/createLocalStore.ts";

const STORAGE_KEY = "rbc-challenge-answers-v1";

/** Map of challenge id to the learner's guess (true = "compiles"). */
export type ChallengeAnswers = Readonly<Record<string, boolean>>;

function isAnswers(value: unknown): value is Record<string, boolean> {
    if (typeof value !== "object" || value === null || Array.isArray(value))
        return false;
    return Object.values(value).every((v) => typeof v === "boolean");
}

const store = createLocalStore<ChallengeAnswers, Record<string, boolean>>({
    key: STORAGE_KEY,
    guard: isAnswers,
    fallback: {},
    label: "challenge answers",
    decode: (stored) => stored,
    encode: (value) => ({ ...value }),
});

/** Load persisted challenge answers. Returns an empty map when absent or
 *  malformed; corrupt data is cleared so it cannot wedge the app. */
export function loadChallengeAnswers(): ChallengeAnswers {
    return store.load();
}

export function useChallengeAnswers(): (answers: ChallengeAnswers) => void {
    return useCallback((answers: ChallengeAnswers): void => {
        store.save(answers);
    }, []);
}
