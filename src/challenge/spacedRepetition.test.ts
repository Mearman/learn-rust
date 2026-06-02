import { describe, it, expect } from "vitest";
import {
    applyReview,
    isDue,
    dueChallengeIds,
    FIRST_INTERVAL_DAYS,
    SECOND_INTERVAL_DAYS,
    INITIAL_EASE,
    MIN_EASE,
    MS_PER_DAY,
} from "./spacedRepetition.ts";
import type { ReviewState, ReviewStore } from "./spacedRepetition.ts";

// ---------------------------------------------------------------------------
// applyReview — correct-answer scheduling
// ---------------------------------------------------------------------------

describe("applyReview", () => {
    const NOW = 1_000_000;

    it("first correct review: interval = 1 day, reps = 1", () => {
        const result = applyReview(undefined, true, NOW, 4);
        expect(result.reps).toBe(1);
        expect(result.intervalDays).toBe(FIRST_INTERVAL_DAYS);
        expect(result.lastCorrect).toBe(NOW);
        expect(result.firstSeen).toBe(NOW);
        expect(result.ease).toBeCloseTo(INITIAL_EASE, 5);
    });

    it("second correct review: interval = 6 days", () => {
        const first = applyReview(undefined, true, NOW, 4);
        const second = applyReview(first, true, NOW + 1, 4);
        expect(second.reps).toBe(2);
        expect(second.intervalDays).toBe(SECOND_INTERVAL_DAYS);
    });

    it("third correct review: interval = round(6 * ease)", () => {
        const first = applyReview(undefined, true, NOW, 4);
        const second = applyReview(first, true, NOW + 1, 4);
        const third = applyReview(second, true, NOW + 2, 4);
        expect(third.reps).toBe(3);
        // interval = round(6 * ease_after_second); ease barely changes at q=4
        const expectedInterval = Math.round(SECOND_INTERVAL_DAYS * second.ease);
        expect(third.intervalDays).toBe(expectedInterval);
    });

    it("wrong answer: resets reps and interval to 1 day, preserves lastCorrect", () => {
        const after1 = applyReview(undefined, true, NOW, 4);
        const wrong = applyReview(after1, false, NOW + 100, 2);
        expect(wrong.reps).toBe(0);
        expect(wrong.intervalDays).toBe(FIRST_INTERVAL_DAYS);
        expect(wrong.lastCorrect).toBe(after1.lastCorrect);
        expect(wrong.firstSeen).toBe(NOW);
    });

    it("wrong on first attempt: no lastCorrect", () => {
        const result = applyReview(undefined, false, NOW, 2);
        expect(result.lastCorrect).toBeUndefined();
        expect(result.reps).toBe(0);
        expect(result.intervalDays).toBe(FIRST_INTERVAL_DAYS);
    });

    it("ease never drops below MIN_EASE", () => {
        // Drive ease down with repeated quality-2 wrong answers
        let state: ReviewState | undefined = undefined;
        for (let i = 0; i < 20; i++) {
            state = applyReview(state, false, NOW + i, 2);
        }
        expect(state).toBeDefined();
        if (state !== undefined) {
            expect(state.ease).toBeGreaterThanOrEqual(MIN_EASE);
        }
    });

    it("fast correct answer (quality 5) increases ease", () => {
        const slow = applyReview(undefined, true, NOW, 4);
        const fast = applyReview(undefined, true, NOW, 5);
        expect(fast.ease).toBeGreaterThan(slow.ease);
    });
});

// ---------------------------------------------------------------------------
// isDue — boundary conditions
// ---------------------------------------------------------------------------

describe("isDue", () => {
    const BASE = 1_000_000_000;

    it("not due when lastCorrect is undefined (never correct)", () => {
        const state: ReviewState = {
            firstSeen: BASE,
            lastCorrect: undefined,
            intervalDays: FIRST_INTERVAL_DAYS,
            ease: INITIAL_EASE,
            reps: 0,
        };
        expect(isDue(state, BASE + MS_PER_DAY * 10)).toBe(false);
    });

    it("not due at exactly 1ms before the interval elapses", () => {
        const state: ReviewState = {
            firstSeen: BASE,
            lastCorrect: BASE,
            intervalDays: FIRST_INTERVAL_DAYS,
            ease: INITIAL_EASE,
            reps: 1,
        };
        const justBefore = BASE + MS_PER_DAY - 1;
        expect(isDue(state, justBefore)).toBe(false);
    });

    it("due at exactly the interval boundary", () => {
        const state: ReviewState = {
            firstSeen: BASE,
            lastCorrect: BASE,
            intervalDays: FIRST_INTERVAL_DAYS,
            ease: INITIAL_EASE,
            reps: 1,
        };
        const exactly = BASE + MS_PER_DAY;
        expect(isDue(state, exactly)).toBe(true);
    });

    it("due after the interval has passed", () => {
        const state: ReviewState = {
            firstSeen: BASE,
            lastCorrect: BASE,
            intervalDays: FIRST_INTERVAL_DAYS,
            ease: INITIAL_EASE,
            reps: 1,
        };
        expect(isDue(state, BASE + MS_PER_DAY * 2)).toBe(true);
    });
});

// ---------------------------------------------------------------------------
// dueChallengeIds
// ---------------------------------------------------------------------------

describe("dueChallengeIds", () => {
    const BASE = 2_000_000_000;

    it("returns only ids whose interval has elapsed", () => {
        const store: ReviewStore = {
            "challenge-0": {
                firstSeen: BASE,
                lastCorrect: BASE,
                intervalDays: FIRST_INTERVAL_DAYS,
                ease: INITIAL_EASE,
                reps: 1,
            },
            "challenge-1": {
                firstSeen: BASE,
                lastCorrect: BASE,
                intervalDays: 30,
                ease: INITIAL_EASE,
                reps: 3,
            },
        };
        const result = dueChallengeIds(
            ["challenge-0", "challenge-1"],
            store,
            BASE + MS_PER_DAY
        );
        expect(result).toEqual(["challenge-0"]);
    });

    it("excludes challenges with no entry in the store", () => {
        const store: ReviewStore = {};
        const result = dueChallengeIds(["challenge-0"], store, BASE + 99999999);
        expect(result).toEqual([]);
    });

    it("excludes challenges never answered correctly", () => {
        const store: ReviewStore = {
            "challenge-0": {
                firstSeen: BASE,
                lastCorrect: undefined,
                intervalDays: FIRST_INTERVAL_DAYS,
                ease: INITIAL_EASE,
                reps: 0,
            },
        };
        const result = dueChallengeIds(
            ["challenge-0"],
            store,
            BASE + MS_PER_DAY * 10
        );
        expect(result).toEqual([]);
    });
});
