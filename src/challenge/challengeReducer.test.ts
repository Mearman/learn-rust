import { describe, it, expect } from "vitest";
import type { Challenge } from "./challenges.ts";
import { challengeReducer, type ChallengeState } from "./challengeReducer.ts";

// ---------------------------------------------------------------------------
// Fixture — three minimal challenges; indices and compiles values are
// deliberately varied to exercise all branches without depending on the real
// CHALLENGES ordering.
// ---------------------------------------------------------------------------
const FIXTURES: readonly Challenge[] = [
    {
        topic: "Test",
        level: "warm-up",
        compiles: true,
        code: "let x = 1;",
        why: "It compiles.",
    },
    {
        topic: "Test",
        level: "core",
        compiles: false,
        code: "let x: u8 = 256;",
        why: "Overflow.",
    },
    {
        topic: "Test",
        level: "tricky",
        compiles: true,
        code: "fn f() {}",
        why: "Empty function.",
    },
];

const INITIAL: ChallengeState = {
    index: 0,
    answered: false,
    guess: null,
    correct: 0,
    total: 0,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Run the reducer with the shared fixture so tests stay concise. */
function reduce(
    state: ChallengeState,
    action: Parameters<typeof challengeReducer>[1]
): ChallengeState {
    return challengeReducer(state, action, FIXTURES);
}

// ---------------------------------------------------------------------------
// "answer" action
// ---------------------------------------------------------------------------

describe("answer action — correct guess", () => {
    // FIXTURES[0].compiles === true, so guessing true is correct.
    const after = reduce(INITIAL, { type: "answer", guess: true });

    it("sets answered to true", () => {
        expect(after.answered).toBe(true);
    });

    it("records the guess", () => {
        expect(after.guess).toBe(true);
    });

    it("increments total", () => {
        expect(after.total).toBe(1);
    });

    it("increments correct", () => {
        expect(after.correct).toBe(1);
    });

    it("does not change index", () => {
        expect(after.index).toBe(0);
    });
});

describe("answer action — incorrect guess", () => {
    // FIXTURES[0].compiles === true, so guessing false is incorrect.
    const after = reduce(INITIAL, { type: "answer", guess: false });

    it("sets answered to true", () => {
        expect(after.answered).toBe(true);
    });

    it("records the guess", () => {
        expect(after.guess).toBe(false);
    });

    it("increments total", () => {
        expect(after.total).toBe(1);
    });

    it("does not increment correct", () => {
        expect(after.correct).toBe(0);
    });
});

describe("answer action — challenge with compiles: false, correct guess", () => {
    // FIXTURES[1].compiles === false, so guessing false is correct.
    const stateAtIndex1: ChallengeState = {
        ...INITIAL,
        index: 1,
    };
    const after = reduce(stateAtIndex1, { type: "answer", guess: false });

    it("increments correct for a non-compiling challenge guessed correctly", () => {
        expect(after.correct).toBe(1);
    });

    it("increments total", () => {
        expect(after.total).toBe(1);
    });
});

describe("answer action — challenge with compiles: false, incorrect guess", () => {
    // FIXTURES[1].compiles === false, so guessing true is incorrect.
    const stateAtIndex1: ChallengeState = {
        ...INITIAL,
        index: 1,
    };
    const after = reduce(stateAtIndex1, { type: "answer", guess: true });

    it("does not increment correct", () => {
        expect(after.correct).toBe(0);
    });

    it("increments total", () => {
        expect(after.total).toBe(1);
    });
});

describe("answer action — running score accumulates across challenges", () => {
    // Answer FIXTURES[0] (compiles: true) correctly, then FIXTURES[1]
    // (compiles: false) incorrectly.
    const afterFirst = reduce(INITIAL, { type: "answer", guess: true });
    const atIndex1 = reduce(afterFirst, { type: "next" });
    const afterSecond = reduce(atIndex1, { type: "answer", guess: true });

    it("total reflects both answers", () => {
        expect(afterSecond.total).toBe(2);
    });

    it("correct reflects only the right answer", () => {
        expect(afterSecond.correct).toBe(1);
    });
});

// ---------------------------------------------------------------------------
// "next" action
// ---------------------------------------------------------------------------

describe("next action", () => {
    const answered: ChallengeState = {
        index: 0,
        answered: true,
        guess: true,
        correct: 1,
        total: 1,
    };
    const after = reduce(answered, { type: "next" });

    it("advances index by one", () => {
        expect(after.index).toBe(1);
    });

    it("clears answered flag", () => {
        expect(after.answered).toBe(false);
    });

    it("clears guess", () => {
        expect(after.guess).toBeNull();
    });

    it("preserves correct count", () => {
        expect(after.correct).toBe(1);
    });

    it("preserves total count", () => {
        expect(after.total).toBe(1);
    });
});

describe("next action — advance through all challenges", () => {
    // Stepping from index 1 to index 2 (last fixture).
    const stateAtIndex1: ChallengeState = {
        ...INITIAL,
        index: 1,
        answered: true,
        guess: false,
    };
    const after = reduce(stateAtIndex1, { type: "next" });

    it("advances to the last index in the fixture", () => {
        expect(after.index).toBe(2);
    });
});

describe("next action — beyond last challenge (bounds behaviour)", () => {
    // The reducer does not clamp — index simply advances past the array length.
    // This matches the current implementation: the UI is responsible for
    // detecting end-of-list.  We document the actual behaviour here so a
    // future change to add clamping becomes a deliberate, visible test update.
    const stateAtLast: ChallengeState = {
        ...INITIAL,
        index: FIXTURES.length - 1,
        answered: true,
        guess: true,
    };
    const after = reduce(stateAtLast, { type: "next" });

    it("allows index to exceed fixture length (no automatic wrap)", () => {
        expect(after.index).toBe(FIXTURES.length);
    });
});

// ---------------------------------------------------------------------------
// "reset" action
// ---------------------------------------------------------------------------

describe("reset action", () => {
    const midGame: ChallengeState = {
        index: 2,
        answered: true,
        guess: false,
        correct: 2,
        total: 3,
    };
    const after = reduce(midGame, { type: "reset" });

    it("resets index to 0", () => {
        expect(after.index).toBe(0);
    });

    it("clears answered flag", () => {
        expect(after.answered).toBe(false);
    });

    it("clears guess", () => {
        expect(after.guess).toBeNull();
    });

    it("resets correct to 0", () => {
        expect(after.correct).toBe(0);
    });

    it("resets total to 0", () => {
        expect(after.total).toBe(0);
    });
});
