import { describe, expect, it } from "vitest";
import { getFilteredChallenges, CHALLENGES } from "./challenges.ts";
import type { UserProfile } from "../settings/types.ts";
import type { Challenge } from "./challenges.ts";
import type { MultipleChoice } from "./challenges.ts";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeProfile(
    experience: UserProfile["experience"],
    backgrounds: UserProfile["backgrounds"] = [],
    familiarities: UserProfile["familiarities"] = []
): UserProfile {
    return { experience, backgrounds, familiarities };
}

function levels(challenges: readonly Challenge[]): string[] {
    return challenges.map((c) => c.level);
}

// ---------------------------------------------------------------------------
// Sanity-check the fixture data
// ---------------------------------------------------------------------------

describe("CHALLENGES fixture", () => {
    it("contains warm-up challenges", () => {
        expect(CHALLENGES.some((c) => c.level === "warm-up")).toBe(true);
    });

    it("contains core challenges", () => {
        expect(CHALLENGES.some((c) => c.level === "core")).toBe(true);
    });

    it("contains tricky challenges", () => {
        expect(CHALLENGES.some((c) => c.level === "tricky")).toBe(true);
    });
});

// ---------------------------------------------------------------------------
// beginner — warm-up + core (no tricky)
// ---------------------------------------------------------------------------

describe("getFilteredChallenges — beginner", () => {
    const profile = makeProfile("beginner");
    const result = getFilteredChallenges(profile);

    it("includes warm-up challenges", () => {
        expect(result.some((c) => c.level === "warm-up")).toBe(true);
    });

    it("includes core challenges", () => {
        expect(result.some((c) => c.level === "core")).toBe(true);
    });

    it("returns at least one challenge", () => {
        expect(result.length).toBeGreaterThan(0);
    });

    it("excludes tricky challenges", () => {
        expect(result.some((c) => c.level === "tricky")).toBe(false);
    });

    it("is a subset of the full list in original order", () => {
        const expected = CHALLENGES.filter(
            (c) => c.level === "warm-up" || c.level === "core"
        );
        expect(result).toEqual(expected);
    });
});

// ---------------------------------------------------------------------------
// intermediate — all challenges (warm-up + core + tricky)
// ---------------------------------------------------------------------------

describe("getFilteredChallenges — intermediate", () => {
    const profile = makeProfile("intermediate");
    const result = getFilteredChallenges(profile);

    it("includes warm-up challenges", () => {
        expect(result.some((c) => c.level === "warm-up")).toBe(true);
    });

    it("includes core challenges", () => {
        expect(result.some((c) => c.level === "core")).toBe(true);
    });

    it("includes tricky challenges", () => {
        expect(result.some((c) => c.level === "tricky")).toBe(true);
    });

    it("returns the complete CHALLENGES array", () => {
        expect(result).toBe(CHALLENGES);
    });

    it("returns more challenges than beginner", () => {
        const beginner = getFilteredChallenges(makeProfile("beginner"));
        expect(result.length).toBeGreaterThan(beginner.length);
    });
});

// ---------------------------------------------------------------------------
// advanced — all challenges (same as intermediate)
// ---------------------------------------------------------------------------

describe("getFilteredChallenges — advanced", () => {
    const profile = makeProfile("advanced");
    const result = getFilteredChallenges(profile);

    it("returns the complete CHALLENGES array", () => {
        expect(result).toBe(CHALLENGES);
    });

    it("includes warm-up, core, and tricky", () => {
        const presentLevels = new Set(levels(result));
        expect(presentLevels.has("warm-up")).toBe(true);
        expect(presentLevels.has("core")).toBe(true);
        expect(presentLevels.has("tricky")).toBe(true);
    });

    it("returns more challenges than beginner", () => {
        const beginner = getFilteredChallenges(makeProfile("beginner"));
        expect(result.length).toBeGreaterThan(beginner.length);
    });
});

// ---------------------------------------------------------------------------
// Relative subset ordering: advanced ≥ intermediate ≥ beginner
// ---------------------------------------------------------------------------

describe("getFilteredChallenges — set containment across levels", () => {
    const beginner = getFilteredChallenges(makeProfile("beginner"));
    const intermediate = getFilteredChallenges(makeProfile("intermediate"));
    const advanced = getFilteredChallenges(makeProfile("advanced"));

    it("every beginner challenge appears in the intermediate set", () => {
        for (const challenge of beginner) {
            expect(intermediate).toContain(challenge);
        }
    });

    it("every intermediate challenge appears in the advanced set", () => {
        for (const challenge of intermediate) {
            expect(advanced).toContain(challenge);
        }
    });

    it("every beginner challenge appears in the advanced set", () => {
        for (const challenge of beginner) {
            expect(advanced).toContain(challenge);
        }
    });
});

// ---------------------------------------------------------------------------
// Result is readonly (non-mutation sanity check — structural)
// ---------------------------------------------------------------------------

describe("getFilteredChallenges — structural guarantees", () => {
    it("each challenge has a topic string", () => {
        const result = getFilteredChallenges(makeProfile("advanced"));
        for (const c of result) {
            expect(typeof c.topic).toBe("string");
            expect(c.topic.length).toBeGreaterThan(0);
        }
    });

    it("each challenge has a code string", () => {
        const result = getFilteredChallenges(makeProfile("advanced"));
        for (const c of result) {
            expect(typeof c.code).toBe("string");
        }
    });

    it("each challenge has a boolean compiles field", () => {
        const result = getFilteredChallenges(makeProfile("advanced"));
        for (const c of result) {
            expect(typeof c.compiles).toBe("boolean");
        }
    });
});

// ---------------------------------------------------------------------------
// Multiple-choice invariants
// ---------------------------------------------------------------------------

function checkMultipleChoice(mc: MultipleChoice): void {
    // 3 or 4 options
    expect(mc.options.length).toBeGreaterThanOrEqual(3);
    expect(mc.options.length).toBeLessThanOrEqual(4);

    // Exactly one correct option — derived from the data, not a magic number
    const correctCount = mc.options.filter((o) => o.correct).length;
    expect(correctCount).toBe(1);

    // All option ids are unique within the challenge
    const ids = mc.options.map((o) => o.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);

    // Correct option has no misconception
    for (const option of mc.options) {
        if (option.correct) {
            expect(option.misconception).toBeUndefined();
        }
    }
}

describe("multiple-choice challenges — structural invariants", () => {
    const mcChallenges = CHALLENGES.filter((c) => c.choices !== undefined);

    it("at least one multiple-choice challenge exists", () => {
        expect(mcChallenges.length).toBeGreaterThan(0);
    });

    it("each MC challenge has 3–4 options", () => {
        for (const c of mcChallenges) {
            if (c.choices !== undefined) {
                expect(c.choices.options.length).toBeGreaterThanOrEqual(3);
                expect(c.choices.options.length).toBeLessThanOrEqual(4);
            }
        }
    });

    it("each MC challenge has exactly one correct option", () => {
        for (const c of mcChallenges) {
            if (c.choices !== undefined) {
                const correctCount = c.choices.options.filter(
                    (o) => o.correct
                ).length;
                expect(correctCount).toBe(1);
            }
        }
    });

    it("each MC challenge has unique option ids within the challenge", () => {
        for (const c of mcChallenges) {
            if (c.choices !== undefined) {
                const ids = c.choices.options.map((o) => o.id);
                expect(new Set(ids).size).toBe(ids.length);
            }
        }
    });

    it("correct option has no misconception", () => {
        for (const c of mcChallenges) {
            if (c.choices !== undefined) {
                const correct = c.choices.options.find((o) => o.correct);
                expect(correct).toBeDefined();
                expect(correct?.misconception).toBeUndefined();
            }
        }
    });

    it("all MC challenges pass the full invariant check", () => {
        for (const c of mcChallenges) {
            if (c.choices !== undefined) {
                checkMultipleChoice(c.choices);
            }
        }
    });
});

// ---------------------------------------------------------------------------
// Profile fields other than experience do not change the result
// ---------------------------------------------------------------------------

describe("getFilteredChallenges — backgrounds and familiarities are not filters", () => {
    it("two beginner profiles with different backgrounds return the same challenges", () => {
        const a = getFilteredChallenges(
            makeProfile("beginner", ["frontend"], ["python"])
        );
        const b = getFilteredChallenges(
            makeProfile("beginner", ["systems", "embedded"], ["cpp", "go"])
        );
        expect(a).toEqual(b);
    });

    it("two advanced profiles with different familiarities return the same challenges", () => {
        const a = getFilteredChallenges(
            makeProfile("advanced", [], ["typescript"])
        );
        const b = getFilteredChallenges(
            makeProfile("advanced", ["student"], [])
        );
        expect(a).toBe(b);
    });
});
