import type { LanguageFamiliarity, UserProfile } from "../settings/types.ts";

export interface CrossLanguageMapping {
    readonly familiarity: LanguageFamiliarity;
    readonly summary: string;
}

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
    readonly mappings: readonly CrossLanguageMapping[];
}

export interface ReferenceViewProps {
    readonly profile: UserProfile;
    readonly active: string;
    readonly onSelect: (id: string) => void;
    readonly onOpenLesson: (id: string) => void;
}
