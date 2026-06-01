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
