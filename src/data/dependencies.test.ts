import { describe, expect, it } from "vitest";
import { isLessonReady, CONCEPT_DEPENDENCIES } from "./dependencies.ts";

// ---------------------------------------------------------------------------
// isLessonReady
// ---------------------------------------------------------------------------

describe("isLessonReady — ownership (no prerequisites)", () => {
    it("is ready when viewed is empty", () => {
        const result = isLessonReady(
            "ownership",
            new Set(),
            CONCEPT_DEPENDENCIES
        );
        expect(result.ready).toBe(true);
        expect(result.missing).toHaveLength(0);
    });

    it("is ready when viewed contains unrelated lessons", () => {
        const result = isLessonReady(
            "ownership",
            new Set(["borrowing", "slices"]),
            CONCEPT_DEPENDENCIES
        );
        expect(result.ready).toBe(true);
        expect(result.missing).toHaveLength(0);
    });
});

describe("isLessonReady — smart-pointers (has prerequisites)", () => {
    it("is not ready when viewed is empty", () => {
        const result = isLessonReady(
            "smart-pointers",
            new Set(),
            CONCEPT_DEPENDENCIES
        );
        expect(result.ready).toBe(false);
    });

    it("missing includes the canonical lesson for each unmet prerequisite concept", () => {
        const result = isLessonReady(
            "smart-pointers",
            new Set(),
            CONCEPT_DEPENDENCIES
        );
        // smart-pointers depends on: memory-management, reference-semantics,
        // behaviour-abstraction (per CONCEPT_DEPENDENCIES).
        // Canonical lessons: ownership, borrowing, traits.
        const missingIds = result.missing.map((m) => m.lessonId);
        expect(missingIds).toContain("ownership");
        expect(missingIds).toContain("borrowing");
        expect(missingIds).toContain("traits");
    });

    it("is ready when all prerequisite lessons are viewed", () => {
        const result = isLessonReady(
            "smart-pointers",
            new Set(["ownership", "borrowing", "traits"]),
            CONCEPT_DEPENDENCIES
        );
        expect(result.ready).toBe(true);
        expect(result.missing).toHaveLength(0);
    });

    it("reflects partially-met prerequisites in missing", () => {
        const result = isLessonReady(
            "smart-pointers",
            new Set(["ownership"]),
            CONCEPT_DEPENDENCIES
        );
        expect(result.ready).toBe(false);
        const missingIds = result.missing.map((m) => m.lessonId);
        expect(missingIds).not.toContain("ownership");
        expect(missingIds).toContain("borrowing");
        expect(missingIds).toContain("traits");
    });
});

describe("isLessonReady — unknown lesson", () => {
    it("throws for an unregistered lesson id", () => {
        expect(() =>
            isLessonReady("not-a-real-lesson", new Set(), CONCEPT_DEPENDENCIES)
        ).toThrow("Unknown lesson: not-a-real-lesson");
    });
});

describe("isLessonReady — each missing entry carries the concept id", () => {
    it("missing entries have correct conceptId set", () => {
        const result = isLessonReady(
            "smart-pointers",
            new Set(),
            CONCEPT_DEPENDENCIES
        );
        for (const m of result.missing) {
            expect(typeof m.conceptId).toBe("string");
            expect(m.conceptId.length).toBeGreaterThan(0);
        }
    });
});

describe("isLessonReady — de-duplication", () => {
    it("a lessonId that would appear twice is only listed once", () => {
        // Craft a synthetic dependency list where two concepts both map to
        // the same canonical lesson (ownership -> memory-management has
        // lessonIds[0] = "ownership"; smart-pointers -> memory-management
        // also has the same canonical lesson).
        const deps: readonly (readonly [string, string])[] = [
            ["smart-pointers", "memory-management"],
            ["smart-pointers", "memory-management"],
        ];
        const result = isLessonReady("smart-pointers", new Set(), deps);
        const ownershipOccurrences = result.missing.filter(
            (m) => m.lessonId === "ownership"
        ).length;
        expect(ownershipOccurrences).toBe(1);
    });
});
