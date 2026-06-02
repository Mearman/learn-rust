import { useCallback, useState } from "react";
import {
    applyReview,
    deriveQuality,
    isReviewStore,
} from "./spacedRepetition.ts";
import type { ReviewStore } from "./spacedRepetition.ts";
import { createLocalStore } from "../settings/createLocalStore.ts";

const STORAGE_KEY = "rbc-reviews-v1";

const reviewStore = createLocalStore<ReviewStore, ReviewStore>({
    key: STORAGE_KEY,
    guard: isReviewStore,
    fallback: {},
    label: "review data",
    decode: (stored) => stored,
    encode: (value) => value,
});

/** Load persisted review store from localStorage.
 *  Falls back to an empty map when absent or malformed; corrupt data is
 *  cleared so it cannot wedge the app. */
export function loadReviewStore(): ReviewStore {
    return reviewStore.load();
}

function saveReviewStore(reviews: ReviewStore): void {
    reviewStore.save(reviews);
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
