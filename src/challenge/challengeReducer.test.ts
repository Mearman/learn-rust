import { describe, it, expect } from "vitest";
import { challengeReducer, type ChallengeState } from "./challengeReducer.ts";

const EMPTY: ChallengeState = { answers: {} };

describe("answer action", () => {
    it("records a guess for a challenge id", () => {
        const after = challengeReducer(EMPTY, {
            type: "answer",
            id: "challenge-0",
            guess: true,
        });
        expect(after.answers).toEqual({ "challenge-0": true });
    });

    it("records a false guess", () => {
        const after = challengeReducer(EMPTY, {
            type: "answer",
            id: "challenge-1",
            guess: false,
        });
        expect(after.answers["challenge-1"]).toBe(false);
    });

    it("preserves answers for other challenges", () => {
        const seeded: ChallengeState = { answers: { "challenge-0": true } };
        const after = challengeReducer(seeded, {
            type: "answer",
            id: "challenge-1",
            guess: false,
        });
        expect(after.answers).toEqual({
            "challenge-0": true,
            "challenge-1": false,
        });
    });

    it("locks an already-answered challenge — the first guess stands", () => {
        const seeded: ChallengeState = { answers: { "challenge-0": true } };
        const after = challengeReducer(seeded, {
            type: "answer",
            id: "challenge-0",
            guess: false,
        });
        // Returns the same state reference unchanged.
        expect(after).toBe(seeded);
        expect(after.answers["challenge-0"]).toBe(true);
    });

    it("does not mutate the previous state", () => {
        const seeded: ChallengeState = { answers: { "challenge-0": true } };
        challengeReducer(seeded, {
            type: "answer",
            id: "challenge-1",
            guess: true,
        });
        expect(seeded.answers).toEqual({ "challenge-0": true });
    });
});

describe("reset action", () => {
    it("clears all answers", () => {
        const seeded: ChallengeState = {
            answers: { "challenge-0": true, "challenge-1": false },
        };
        const after = challengeReducer(seeded, { type: "reset" });
        expect(after.answers).toEqual({});
    });

    it("is a no-op shape on already-empty state", () => {
        const after = challengeReducer(EMPTY, { type: "reset" });
        expect(after.answers).toEqual({});
    });
});
