import type { LanguageFamiliarity, UserProfile } from "../settings/types.ts";

// ---------------------------------------------------------------------------
// Standalone language syntax entries
// ---------------------------------------------------------------------------

/** A single language's take on a Rust concept, with actual code. */
export interface LanguageSyntax {
    readonly id: string;
    readonly language: LanguageFamiliarity;
    readonly conceptIds: readonly string[];
    readonly title: string;
    readonly code: string;
    readonly explanation: string;
}

// ---------------------------------------------------------------------------
// Reference cards
// ---------------------------------------------------------------------------

export interface ReferenceSection {
    readonly title: string;
    readonly code: string;
}

export interface ReferenceCard {
    readonly id: string;
    readonly title: string;
    readonly summary: string;
    readonly lessonIds: readonly string[];
    readonly syntax: ReferenceSection;
    readonly pattern: ReferenceSection;
    readonly example: ReferenceSection;
    /** IDs of LanguageSyntax entries for this concept. */
    readonly syntaxIds: readonly string[];
}

export interface ReferenceViewProps {
    readonly profile: UserProfile;
    readonly active: string;
    readonly onSelect: (id: string) => void;
    readonly onOpenLesson: (id: string) => void;
}
