import { CONCEPTS, LESSON_CONCEPT_MAP } from "./concepts.ts";

export interface PrerequisiteLesson {
    readonly lessonId: string;
    readonly conceptId: string;
}

export interface LessonReadiness {
    readonly ready: boolean;
    /** Prerequisite lessons not yet in `viewed`, in dependency order. Empty when ready. */
    readonly missing: readonly PrerequisiteLesson[];
}

/**
 * Returns whether a lesson's prerequisite concepts have all been viewed.
 *
 * @param lessonId - The id of the lesson to check.
 * @param viewed - The set of lesson ids the reader has viewed.
 * @param dependencies - The concept dependency edges to consult (pass
 *   CONCEPT_DEPENDENCIES in production; a fixture in tests).
 */
export function isLessonReady(
    lessonId: string,
    viewed: ReadonlySet<string>,
    dependencies: readonly (readonly [string, string])[]
): LessonReadiness {
    const conceptId = LESSON_CONCEPT_MAP[lessonId];
    if (conceptId === undefined) {
        throw new Error(`Unknown lesson: ${lessonId}`);
    }

    const prereqConceptIds = conceptDependsOnWithDeps(conceptId, dependencies);

    const seen = new Set<string>();
    const missing: PrerequisiteLesson[] = [];

    for (const depConceptId of prereqConceptIds) {
        const concept = CONCEPTS.find((c) => c.id === depConceptId);
        if (concept === undefined) {
            throw new Error(
                `Dependency references unknown concept: ${depConceptId}`
            );
        }
        const canonicalLessonId = concept.lessonIds[0];
        if (canonicalLessonId === undefined) {
            throw new Error(`Concept ${depConceptId} has no lesson ids`);
        }
        if (seen.has(canonicalLessonId)) continue;
        seen.add(canonicalLessonId);
        if (!viewed.has(canonicalLessonId)) {
            missing.push({
                lessonId: canonicalLessonId,
                conceptId: depConceptId,
            });
        }
    }

    return { ready: missing.length === 0, missing };
}

/** Like conceptDependsOn but accepts an explicit dependency list (for purity). */
function conceptDependsOnWithDeps(
    conceptId: string,
    dependencies: readonly (readonly [string, string])[]
): readonly string[] {
    return dependencies
        .filter(([from]) => from === conceptId)
        .map(([, to]) => to);
}

/**
 * Directed edges: `[from, to]` means "from depends on to".
 * Learn `from` before `to` for the best experience.
 */
export const CONCEPT_DEPENDENCIES: readonly (readonly [string, string])[] = [
    // Memory management is the foundation
    ["reference-semantics", "memory-management"],
    ["string-types", "memory-management"],
    ["reference-validity", "reference-semantics"],
    ["reference-validity", "string-types"],
    // ADTs and error signalling are independent of the borrowing chain
    ["error-signalling", "algebraic-data-types"],
    // Traits and generics build on each other
    ["generics", "behaviour-abstraction"],
    // Collection pipelines use closures + traits
    ["collection-pipelines", "behaviour-abstraction"],
    // Smart pointers combine ownership + borrowing + interior mutability
    ["smart-pointers", "memory-management"],
    ["smart-pointers", "reference-semantics"],
    // Generics depend on understanding types through ADTs first
    ["generics", "algebraic-data-types"],
    // Collection pipelines rely on understanding iterators over owned data
    ["collection-pipelines", "memory-management"],
    // Error signalling with ? requires understanding Option/Result as types,
    // which in turn requires knowing how to pattern-match ADTs
    ["error-signalling", "reference-validity"],
    // Smart pointers require trait knowledge (Deref, Drop)
    ["smart-pointers", "behaviour-abstraction"],
];

export function conceptDependsOn(conceptId: string): readonly string[] {
    return CONCEPT_DEPENDENCIES.filter(([from]) => from === conceptId).map(
        ([, to]) => to
    );
}

export function conceptRequiredBy(conceptId: string): readonly string[] {
    return CONCEPT_DEPENDENCIES.filter(([, to]) => to === conceptId).map(
        ([from]) => from
    );
}
