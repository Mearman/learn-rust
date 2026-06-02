import { LESSONS } from "../learn/lessons.ts";
import { CONCEPTS } from "../data/concepts.ts";
import { GLOSSARY } from "../data/glossary.ts";
import { ERROR_CATALOGUE } from "../data/errors.ts";
import { SYNTAX_REFERENCES } from "../data/syntax-references.ts";
import type { SectionId } from "./useActiveSection.ts";

export interface SubSection {
    readonly id: string;
    readonly label: string;
}

/** Canonical id + label for a top-level section, shared between the nav and
 *  the TOC tree. Icons live in App.tsx alongside the nav buttons. */
export interface SectionMeta {
    readonly id: SectionId;
    readonly label: string;
}

/** Canonical section id + label in display order. App.tsx imports this via
 *  getSectionGroups() so nav labels and TOC labels cannot drift apart. */
export const SECTION_META: readonly SectionMeta[] = [
    { id: "learn", label: "Learn" },
    { id: "challenge", label: "Will it compile?" },
    { id: "path", label: "Path" },
    { id: "compare", label: "Compare" },
    { id: "syntax", label: "Syntax" },
    { id: "glossary", label: "Glossary" },
    { id: "errors", label: "Errors" },
    { id: "cheatsheet", label: "Cheatsheet" },
];

/** A section group for the combined TOC tree. */
export interface SectionGroup {
    readonly id: SectionId;
    readonly label: string;
    /** Empty for sections that have no sub-sections (challenge, path,
     *  cheatsheet). */
    readonly subSections: readonly SubSection[];
}

const SYNTAX_TOPICS = SYNTAX_REFERENCES.reduce<string[]>((acc, entry) => {
    if (!acc.includes(entry.topic)) acc.push(entry.topic);
    return acc;
}, []);

const LESSON_SUBS: readonly SubSection[] = LESSONS.map((l) => ({
    id: `lesson-${l.id}`,
    label: l.title,
}));

const COMPARE_SUBS: readonly SubSection[] = CONCEPTS.map((c) => ({
    id: `concept-${c.id}`,
    label: c.title,
}));

const SYNTAX_SUBS: readonly SubSection[] = SYNTAX_TOPICS.map((topic) => ({
    id: `syntax-${topic.replace(/\s+/g, "-").toLowerCase()}`,
    label: topic,
}));

const GLOSSARY_SUBS: readonly SubSection[] = GLOSSARY.map((g) => ({
    id: `glossary-${g.id}`,
    label: g.term,
}));

const ERRORS_SUBS: readonly SubSection[] = ERROR_CATALOGUE.map((e) => ({
    id: `error-${e.id}`,
    label: `${e.code}: ${e.title}`,
}));

const SUBSECTION_MAP: Record<SectionId, readonly SubSection[]> = {
    learn: LESSON_SUBS,
    challenge: [],
    path: [],
    compare: COMPARE_SUBS,
    syntax: SYNTAX_SUBS,
    glossary: GLOSSARY_SUBS,
    errors: ERRORS_SUBS,
    cheatsheet: [],
};

/** All sections as a flat list of groups in canonical display order. The
 *  challenge group's sub-sections are empty here — App.tsx injects them from
 *  the profile-filtered challenge list, since which challenges show (and their
 *  order) depends on the reader's experience level. */
export function getSectionGroups(): readonly SectionGroup[] {
    return SECTION_META.map((meta) => ({
        id: meta.id,
        label: meta.label,
        subSections: SUBSECTION_MAP[meta.id],
    }));
}
