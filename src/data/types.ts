/** A programming language with metadata. */
export interface Language {
    readonly id: string;
    readonly name: string;
    readonly paradigm: readonly string[];
    readonly typeSystem: string;
    readonly runtimeModel: string;
}

/** A language-independent domain concept. */
export interface Concept {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    /** Lesson IDs that teach this concept with a Rust focus. */
    readonly lessonIds: readonly string[];
}

/** How a specific language implements a specific concept. */
export interface LanguageConcept {
    readonly id: string;
    readonly languageId: string;
    readonly conceptId: string;
    readonly title: string;
    readonly code: string;
    readonly explanation: string;
}

/** Pure language mechanics — syntax references not tied to any concept. */
export interface SyntaxReference {
    readonly id: string;
    readonly languageId: string;
    readonly topic: string;
    readonly title: string;
    readonly code: string;
    readonly explanation: string;
}
