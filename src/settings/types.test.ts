import { describe, expect, it } from "vitest";
import {
    isUserProfile,
    isDeveloperBackground,
    isExperienceLevel,
    isLanguageFamiliarity,
} from "./types.ts";

// ---------------------------------------------------------------------------
// isLanguageFamiliarity
// ---------------------------------------------------------------------------

describe("isLanguageFamiliarity", () => {
    it("accepts every known familiarity language", () => {
        const known = [
            "python",
            "typescript",
            "java",
            "kotlin",
            "go",
            "csharp",
            "cpp",
        ] as const;
        for (const lang of known) {
            expect(isLanguageFamiliarity(lang)).toBe(true);
        }
    });

    it("rejects rust (the target language)", () => {
        expect(isLanguageFamiliarity("rust")).toBe(false);
    });

    it("rejects arbitrary strings", () => {
        expect(isLanguageFamiliarity("haskell")).toBe(false);
        expect(isLanguageFamiliarity("")).toBe(false);
        expect(isLanguageFamiliarity("PYTHON")).toBe(false);
    });
});

// ---------------------------------------------------------------------------
// isDeveloperBackground
// ---------------------------------------------------------------------------

describe("isDeveloperBackground", () => {
    it("accepts every valid background", () => {
        const valid = [
            "frontend",
            "backend",
            "mobile",
            "systems",
            "devops",
            "data",
            "game-dev",
            "embedded",
            "student",
            "self-taught",
            "other",
        ] as const;
        for (const bg of valid) {
            expect(isDeveloperBackground(bg)).toBe(true);
        }
    });

    it("rejects unknown backgrounds", () => {
        expect(isDeveloperBackground("fullstack")).toBe(false);
        expect(isDeveloperBackground("")).toBe(false);
        expect(isDeveloperBackground("Frontend")).toBe(false);
    });
});

// ---------------------------------------------------------------------------
// isExperienceLevel
// ---------------------------------------------------------------------------

describe("isExperienceLevel", () => {
    it("accepts the three valid levels", () => {
        expect(isExperienceLevel("beginner")).toBe(true);
        expect(isExperienceLevel("intermediate")).toBe(true);
        expect(isExperienceLevel("advanced")).toBe(true);
    });

    it("rejects unknown strings", () => {
        expect(isExperienceLevel("expert")).toBe(false);
        expect(isExperienceLevel("")).toBe(false);
        expect(isExperienceLevel("Beginner")).toBe(false);
    });
});

// ---------------------------------------------------------------------------
// isUserProfile — accepts valid shapes
// ---------------------------------------------------------------------------

describe("isUserProfile — valid inputs", () => {
    it("accepts a fully populated profile", () => {
        expect(
            isUserProfile({
                backgrounds: ["frontend", "backend"],
                familiarities: ["python", "typescript"],
                experience: "intermediate",
            })
        ).toBe(true);
    });

    it("accepts a profile with empty arrays", () => {
        expect(
            isUserProfile({
                backgrounds: [],
                familiarities: [],
                experience: "beginner",
            })
        ).toBe(true);
    });

    it("accepts every valid experience level", () => {
        for (const level of ["beginner", "intermediate", "advanced"] as const) {
            expect(
                isUserProfile({
                    backgrounds: ["student"],
                    familiarities: ["go"],
                    experience: level,
                })
            ).toBe(true);
        }
    });

    it("accepts all known background values in one profile", () => {
        expect(
            isUserProfile({
                backgrounds: [
                    "frontend",
                    "backend",
                    "mobile",
                    "systems",
                    "devops",
                    "data",
                    "game-dev",
                    "embedded",
                    "student",
                    "self-taught",
                    "other",
                ],
                familiarities: ["java"],
                experience: "advanced",
            })
        ).toBe(true);
    });

    it("accepts all known familiarity values in one profile", () => {
        expect(
            isUserProfile({
                backgrounds: ["backend"],
                familiarities: [
                    "python",
                    "typescript",
                    "java",
                    "kotlin",
                    "go",
                    "csharp",
                    "cpp",
                ],
                experience: "advanced",
            })
        ).toBe(true);
    });
});

// ---------------------------------------------------------------------------
// isUserProfile — rejects malformed inputs
// ---------------------------------------------------------------------------

describe("isUserProfile — rejects non-objects", () => {
    it("rejects null", () => {
        expect(isUserProfile(null)).toBe(false);
    });

    it("rejects undefined", () => {
        expect(isUserProfile(undefined)).toBe(false);
    });

    it("rejects a number", () => {
        expect(isUserProfile(42)).toBe(false);
    });

    it("rejects a string", () => {
        expect(isUserProfile("profile")).toBe(false);
    });

    it("rejects an array (even an empty one)", () => {
        expect(isUserProfile([])).toBe(false);
    });

    it("rejects a boolean", () => {
        expect(isUserProfile(true)).toBe(false);
    });
});

describe("isUserProfile — rejects missing fields", () => {
    it("rejects object missing backgrounds", () => {
        expect(
            isUserProfile({
                familiarities: ["python"],
                experience: "beginner",
            })
        ).toBe(false);
    });

    it("rejects object missing familiarities", () => {
        expect(
            isUserProfile({
                backgrounds: ["frontend"],
                experience: "beginner",
            })
        ).toBe(false);
    });

    it("rejects object missing experience", () => {
        expect(
            isUserProfile({
                backgrounds: ["frontend"],
                familiarities: ["python"],
            })
        ).toBe(false);
    });

    it("rejects empty object", () => {
        expect(isUserProfile({})).toBe(false);
    });
});

describe("isUserProfile — rejects wrong field types", () => {
    it("rejects backgrounds that is a string rather than an array", () => {
        expect(
            isUserProfile({
                backgrounds: "frontend",
                familiarities: [],
                experience: "beginner",
            })
        ).toBe(false);
    });

    it("rejects backgrounds containing an invalid value", () => {
        expect(
            isUserProfile({
                backgrounds: ["frontend", "fullstack"],
                familiarities: [],
                experience: "beginner",
            })
        ).toBe(false);
    });

    it("rejects familiarities containing an invalid language", () => {
        expect(
            isUserProfile({
                backgrounds: ["backend"],
                familiarities: ["rust"],
                experience: "beginner",
            })
        ).toBe(false);
    });

    it("rejects familiarities containing a non-string item", () => {
        expect(
            isUserProfile({
                backgrounds: [],
                familiarities: [42],
                experience: "beginner",
            })
        ).toBe(false);
    });

    it("rejects backgrounds containing a non-string item", () => {
        expect(
            isUserProfile({
                backgrounds: [null],
                familiarities: [],
                experience: "beginner",
            })
        ).toBe(false);
    });

    it("rejects experience as an invalid string", () => {
        expect(
            isUserProfile({
                backgrounds: [],
                familiarities: [],
                experience: "expert",
            })
        ).toBe(false);
    });

    it("rejects experience as a number", () => {
        expect(
            isUserProfile({
                backgrounds: [],
                familiarities: [],
                experience: 1,
            })
        ).toBe(false);
    });

    it("rejects experience as null", () => {
        expect(
            isUserProfile({
                backgrounds: [],
                familiarities: [],
                experience: null,
            })
        ).toBe(false);
    });
});

describe("isUserProfile — extra fields are irrelevant", () => {
    it("accepts a valid profile that also has extra properties", () => {
        // Extra properties on a plain object do not invalidate the guard.
        expect(
            isUserProfile({
                backgrounds: ["frontend"],
                familiarities: ["python"],
                experience: "beginner",
                extraField: "ignored",
            })
        ).toBe(true);
    });
});
