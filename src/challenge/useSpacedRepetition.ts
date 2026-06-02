import { useCallback, useState } from "react";
import {
    applyReview,
    deriveQuality,
    isReviewStore,
} from "./spacedRepetition.ts";
import type { ReviewStore } from "./spacedRepetition.ts";

const STORAGE_KEY = "rbc-reviews-v1";

/** Load persisted review store from localStorage.
 *  Falls back to an empty map when absent or malformed; corrupt data is
 *  cleared so it cannot wedge the app. */
export function loadReviewStore(): ReviewStore {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw === null) return {};
        const parsed: unknown = JSON.parse(raw);
        if (!isReviewStore(parsed)) {
            console.warn(
                `[rbc] Stored review data under "${STORAGE_KEY}" failed ` +
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

function saveReviewStore(store: ReviewStore): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export interface UseSpacedRepetitionResult {
    readonly store: ReviewStore;
    /** Record a review outcome.
     *  @param challengeId  The challenge's stable id.
     *  @param correct      Whether the answer was correct.
     *  @param shownAt      Epoch ms when the card became visible (for quality
     *                      derivation via elapsed time).
     */
    readonly recordReview: (
        challengeId: string,
        correct: boolean,
        shownAt: number
    ) => void;
}

export function useSpacedRepetition(): UseSpacedRepetitionResult {
    const [store, setStore] = useState<ReviewStore>(loadReviewStore);

    const recordReview = useCallback(
        (challengeId: string, correct: boolean, shownAt: number): void => {
            const now = Date.now();
            const elapsedMs = now - shownAt;
            const quality = deriveQuality(correct, elapsedMs);

            setStore((prev) => {
                const prevState = prev[challengeId];
                const next = {
                    ...prev,
                    [challengeId]: applyReview(
                        prevState,
                        correct,
                        now,
                        quality
                    ),
                };
                saveReviewStore(next);
                return next;
            });
        },
        []
    );

    return { store, recordReview };
}
