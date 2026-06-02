import { describe, expect, it } from "vitest";
import { isLessonReady, CONCEPT_DEPENDENCIES } from "./dependencies.ts";
import { CONCEPTS } from "./concepts.ts";

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

// ---------------------------------------------------------------------------
// Data integrity: the dependency graph references real concepts, is acyclic,
// and every concept has at least one lesson.
// ---------------------------------------------------------------------------

describe("CONCEPT_DEPENDENCIES — data integrity", () => {
    const conceptIds = new Set(CONCEPTS.map((c) => c.id));

    it("every edge endpoint is a real concept id", () => {
        for (const [from, to] of CONCEPT_DEPENDENCIES) {
            expect(
                conceptIds.has(from),
                `edge from "${from}" references an unknown concept`
            ).toBe(true);
            expect(
                conceptIds.has(to),
                `edge to "${to}" references an unknown concept`
            ).toBe(true);
        }
    });

    it("the dependency graph is acyclic and drains fully (Kahn's algorithm)", () => {
        // Build in-degree per node and an adjacency list. An edge [from, to]
        // means "from depends on to", so `to` must come first — treat `to` as
        // the prerequisite (incoming) of `from`.
        const inDegree = new Map<string, number>();
        const dependents = new Map<string, string[]>();
        for (const id of conceptIds) {
            inDegree.set(id, 0);
            dependents.set(id, []);
        }
        for (const [from, to] of CONCEPT_DEPENDENCIES) {
            inDegree.set(from, (inDegree.get(from) ?? 0) + 1);
            const list = dependents.get(to);
            if (list === undefined) {
                throw new Error(`prerequisite "${to}" missing from node set`);
            }
            list.push(from);
        }

        // Seed the queue with every node that has no prerequisites.
        const queue: string[] = [];
        for (const [id, degree] of inDegree) {
            if (degree === 0) queue.push(id);
        }

        let drained = 0;
        while (queue.length > 0) {
            const node = queue.shift();
            if (node === undefined) break;
            drained += 1;
            const list = dependents.get(node);
            if (list === undefined) continue;
            for (const dependent of list) {
                const next = (inDegree.get(dependent) ?? 0) - 1;
                inDegree.set(dependent, next);
                if (next === 0) queue.push(dependent);
            }
        }

        // A full drain (every node emitted) proves the graph is acyclic; a
        // residual count would mean a cycle left some nodes with in-degree > 0.
        expect(drained).toBe(conceptIds.size);
    });

    it("no concept has an empty lessonIds (guards the complete-on-empty node bug)", () => {
        for (const concept of CONCEPTS) {
            expect(
                concept.lessonIds.length,
                `concept "${concept.id}" has no lessons`
            ).toBeGreaterThan(0);
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
