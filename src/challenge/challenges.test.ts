import { describe, expect, it } from "vitest";
import { getFilteredChallenges, CHALLENGES } from "./challenges.ts";
import type { UserProfile } from "../settings/types.ts";
import type { Challenge } from "./challenges.ts";

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
// beginner — warm-up only
// ---------------------------------------------------------------------------

describe("getFilteredChallenges — beginner", () => {
    const profile = makeProfile("beginner");
    const result = getFilteredChallenges(profile);

    it("returns only warm-up challenges", () => {
        expect(result.every((c) => c.level === "warm-up")).toBe(true);
    });

    it("returns at least one challenge", () => {
        expect(result.length).toBeGreaterThan(0);
    });

    it("excludes core challenges", () => {
        expect(result.some((c) => c.level === "core")).toBe(false);
    });

    it("excludes tricky challenges", () => {
        expect(result.some((c) => c.level === "tricky")).toBe(false);
    });

    it("is a subset of the full list in original order", () => {
        const allWarmUps = CHALLENGES.filter((c) => c.level === "warm-up");
        expect(result).toEqual(allWarmUps);
    });
});

// ---------------------------------------------------------------------------
// intermediate — warm-up + core, no tricky
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

    it("excludes tricky challenges", () => {
        expect(result.some((c) => c.level === "tricky")).toBe(false);
    });

    it("is a subset of the full list in original order", () => {
        const expected = CHALLENGES.filter((c) => c.level !== "tricky");
        expect(result).toEqual(expected);
    });

    it("returns more challenges than beginner", () => {
        const beginner = getFilteredChallenges(makeProfile("beginner"));
        expect(result.length).toBeGreaterThan(beginner.length);
    });
});

// ---------------------------------------------------------------------------
// advanced — all challenges
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

    it("returns more challenges than intermediate", () => {
        const intermediate = getFilteredChallenges(makeProfile("intermediate"));
        expect(result.length).toBeGreaterThan(intermediate.length);
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
