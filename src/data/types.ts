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

/** A single progressive hint for a fix exercise. */
export interface FixHint {
    readonly label: string;
    readonly text: string;
}

/** A broken Rust snippet the learner repairs until the live compiler accepts it. */
export interface FixExercise {
    readonly id: string;
    /** Maps to a Concept.id in concepts.ts. */
    readonly conceptId: string;
    /** Card header and TOC label. */
    readonly topic: string;
    readonly level: "warm-up" | "core" | "tricky";
    /** Must NOT compile as written. */
    readonly brokenCode: string;
    /** Shown only after the oracle accepts the learner's edit. */
    readonly idiomaticFix: string;
    /** Why the fix is idiomatic. */
    readonly idiomaticNote: string;
    /** Non-empty tuple — the first hint needs no index guard. */
    readonly hints: readonly [FixHint, ...FixHint[]];
}

/** One annotated line (or contiguous span of lines) within a rustc transcript. */
export interface TranscriptAnnotation {
    /** 0-based index of the first transcript line this annotation covers. */
    readonly line: number;
    /** Inclusive count of lines covered. */
    readonly span: number;
    /** What this part of the output means and what to do about it. */
    readonly note: string;
    /** Which structural role this line plays — drives the marker colour/label. */
    readonly role:
        | "error-code"
        | "primary-span"
        | "secondary-span"
        | "note"
        | "help";
}

/** A full annotated rustc error transcript for the "reading errors" skill section. */
export interface CompilerErrorTranscript {
    readonly id: string;
    /** rustc error code, e.g. "E0308". */
    readonly code: string;
    readonly title: string;
    /** Difficulty ordering for progressive presentation. */
    readonly level: "warm-up" | "core" | "tricky";
    /** The Rust source that triggers the error (shown as a CodeBlock). */
    readonly source: string;
    /** The raw rustc stderr transcript, line-split-friendly (literal newlines). */
    readonly transcript: string;
    /** Inline annotations keyed to transcript line indices. */
    readonly annotations: readonly TranscriptAnnotation[];
    /** "Decode this error" exercise prompt — asked before the answer is revealed. */
    readonly question: string;
    /** The root-cause + fix answer revealed after the reader attempts the question. */
    readonly answer: string;
    /** Optional cross-link into the Compare section. */
    readonly conceptId?: string;
}
