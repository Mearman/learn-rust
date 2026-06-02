import { describe, expect, it } from "vitest";
import { CONCEPTS } from "./concepts.ts";
import { FIX_EXERCISES, getFilteredFixExercises } from "./fix-exercises.ts";
import type { UserProfile } from "../settings/types.ts";

const VALID_LEVELS = new Set(["warm-up", "core", "tricky"]);

function makeProfile(experience: UserProfile["experience"]): UserProfile {
    return {
        experience,
        backgrounds: [],
        familiarities: [],
        hardGating: false,
    };
}

describe("FIX_EXERCISES fixture", () => {
    it("has at least one exercise", () => {
        expect(FIX_EXERCISES.length).toBeGreaterThan(0);
    });

    it("gives every exercise a unique id", () => {
        const ids = FIX_EXERCISES.map((exercise) => exercise.id);
        expect(new Set(ids).size).toBe(ids.length);
    });

    it("derives each id from its position", () => {
        FIX_EXERCISES.forEach((exercise, index) => {
            expect(exercise.id).toBe(`fix-exercise-${String(index)}`);
        });
    });

    it("gives every exercise a non-empty hints tuple", () => {
        for (const exercise of FIX_EXERCISES) {
            expect(exercise.hints.length).toBeGreaterThan(0);
            for (const hint of exercise.hints) {
                expect(hint.label.length).toBeGreaterThan(0);
                expect(hint.text.length).toBeGreaterThan(0);
            }
        }
    });

    it("keeps brokenCode and idiomaticFix distinct", () => {
        for (const exercise of FIX_EXERCISES) {
            expect(exercise.brokenCode).not.toBe(exercise.idiomaticFix);
        }
    });

    it("uses only valid levels", () => {
        for (const exercise of FIX_EXERCISES) {
            expect(VALID_LEVELS.has(exercise.level)).toBe(true);
        }
    });

    it("references a conceptId that exists in concepts.ts", () => {
        const conceptIds = new Set(CONCEPTS.map((concept) => concept.id));
        for (const exercise of FIX_EXERCISES) {
            expect(conceptIds.has(exercise.conceptId)).toBe(true);
        }
    });

    it("gives every exercise a non-empty topic and idiomaticNote", () => {
        for (const exercise of FIX_EXERCISES) {
            expect(exercise.topic.length).toBeGreaterThan(0);
            expect(exercise.idiomaticNote.length).toBeGreaterThan(0);
        }
    });
});

describe("getFilteredFixExercises", () => {
    it("returns only warm-up exercises for beginners", () => {
        const result = getFilteredFixExercises(makeProfile("beginner"));
        expect(result.length).toBeGreaterThan(0);
        expect(result.every((exercise) => exercise.level === "warm-up")).toBe(
            true
        );
    });

    it("returns the full list for intermediate readers", () => {
        const result = getFilteredFixExercises(makeProfile("intermediate"));
        expect(result).toBe(FIX_EXERCISES);
    });

    it("returns the full list for advanced readers", () => {
        const result = getFilteredFixExercises(makeProfile("advanced"));
        expect(result).toBe(FIX_EXERCISES);
    });

    it("returns more for intermediate than beginner", () => {
        const beginner = getFilteredFixExercises(makeProfile("beginner"));
        const intermediate = getFilteredFixExercises(
            makeProfile("intermediate")
        );
        expect(intermediate.length).toBeGreaterThan(beginner.length);
    });
});
