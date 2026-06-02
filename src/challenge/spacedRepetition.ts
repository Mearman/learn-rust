/** Pure spaced-repetition logic (SM-2 variant). No I/O, no React. */

export interface ReviewState {
    /** Epoch ms when this challenge was first answered/attempted. */
    readonly firstSeen: number;
    /** Epoch ms of the most recent CORRECT answer. undefined if never correct. */
    readonly lastCorrect: number | undefined;
    /** Current scheduling interval in days. */
    readonly intervalDays: number;
    /** SM-2 ease factor; starts at 2.5, floored at 1.3. */
    readonly ease: number;
    /** Count of consecutive correct reviews (SM-2 repetition count). */
    readonly reps: number;
}

export type ReviewStore = Readonly<Record<string, ReviewState>>;

// ---------------------------------------------------------------------------
// Constants — no magic numbers
// ---------------------------------------------------------------------------

export const INITIAL_EASE = 2.5;
export const MIN_EASE = 1.3;
export const FIRST_INTERVAL_DAYS = 1;
export const SECOND_INTERVAL_DAYS = 6;
export const MS_PER_DAY = 86_400_000;

/** Time threshold below which a correct answer is counted as "fast". */
export const FAST_ANSWER_MS = 10_000;

// ---------------------------------------------------------------------------
// SM-2 update
// ---------------------------------------------------------------------------

/**
 * Derive an SM-2 quality grade (0–5) from the app signals.
 * Correct + fast -> 5, correct + slow -> 4, incorrect -> 2.
 */
export function deriveQuality(correct: boolean, elapsedMs: number): number {
    if (!correct) return 2;
    return elapsedMs < FAST_ANSWER_MS ? 5 : 4;
}

/**
 * Apply one review to the current state, returning the updated state.
 *
 * @param prev   Existing state, or undefined on first-ever attempt.
 * @param correct Whether this review was correct.
 * @param now    Current epoch ms (injected for testability).
 * @param quality SM-2 quality grade 0–5.
 */
export function applyReview(
    prev: ReviewState | undefined,
    correct: boolean,
    now: number,
    quality: number
): ReviewState {
    const firstSeen = prev?.firstSeen ?? now;

    if (!correct) {
        // SM-2: wrong answer resets repetitions and interval to 1 day.
        return {
            firstSeen,
            lastCorrect: prev?.lastCorrect,
            intervalDays: FIRST_INTERVAL_DAYS,
            ease: prev?.ease ?? INITIAL_EASE,
            reps: 0,
        };
    }

    // Correct answer — compute new SM-2 values.
    const prevReps = prev?.reps ?? 0;
    const prevEase = prev?.ease ?? INITIAL_EASE;
    const prevInterval = prev?.intervalDays ?? FIRST_INTERVAL_DAYS;
    const newReps = prevReps + 1;

    let newInterval: number;
    if (newReps === 1) {
        newInterval = FIRST_INTERVAL_DAYS;
    } else if (newReps === 2) {
        newInterval = SECOND_INTERVAL_DAYS;
    } else {
        newInterval = Math.round(prevInterval * prevEase);
    }

    // SM-2 EF formula: EF' = EF + (0.1 - (5-q)*(0.08 + (5-q)*0.02))
    const delta = 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
    const newEase = Math.max(prevEase + delta, MIN_EASE);

    return {
        firstSeen,
        lastCorrect: now,
        intervalDays: newInterval,
        ease: newEase,
        reps: newReps,
    };
}

// ---------------------------------------------------------------------------
// Due-for-review predicates
// ---------------------------------------------------------------------------

/**
 * Returns true when the interval has elapsed since the last correct review.
 * A challenge with no correct review is never "due" — it is "new".
 */
export function isDue(state: ReviewState, now: number): boolean {
    if (state.lastCorrect === undefined) return false;
    return now - state.lastCorrect >= state.intervalDays * MS_PER_DAY;
}

/**
 * Filters the provided challenge ids to those whose stored state is due.
 */
export function dueChallengeIds(
    challengeIds: readonly string[],
    store: ReviewStore,
    now: number
): readonly string[] {
    return challengeIds.filter((id) => {
        const state = store[id];
        return state !== undefined && isDue(state, now);
    });
}

// ---------------------------------------------------------------------------
// localStorage serialisation helpers (pure — no side effects)
// ---------------------------------------------------------------------------

function isReviewState(value: unknown): value is ReviewState {
    if (typeof value !== "object" || value === null || Array.isArray(value))
        return false;
    if (!("firstSeen" in value)) return false;
    if (!("intervalDays" in value)) return false;
    if (!("ease" in value)) return false;
    if (!("reps" in value)) return false;
    if (typeof value.firstSeen !== "number") return false;
    if (typeof value.intervalDays !== "number") return false;
    if (typeof value.ease !== "number") return false;
    if (typeof value.reps !== "number") return false;
    if (!("lastCorrect" in value)) return false;
    const lc = value.lastCorrect;
    if (lc !== undefined && typeof lc !== "number") return false;
    return true;
}

export function isReviewStore(value: unknown): value is ReviewStore {
    if (typeof value !== "object" || value === null || Array.isArray(value))
        return false;
    return Object.values(value).every(isReviewState);
}
