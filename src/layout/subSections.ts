import { LESSONS } from "../learn/lessons.ts";
import { CONCEPTS } from "../data/concepts.ts";
import { GLOSSARY } from "../data/glossary.ts";
import { ERROR_CATALOGUE } from "../data/errors.ts";
import { SYNTAX_REFERENCES } from "../data/syntax-references.ts";
import { COMPILER_ERROR_TRANSCRIPTS } from "../data/compiler-errors.ts";
import { syntaxId } from "./sectionIds.ts";

export interface SubSection {
    readonly id: string;
    readonly label: string;
}

/** Canonical section id + label in display order. This is the single source of
 *  truth for the top-level sections: `SectionId` is derived from it, App.tsx
 *  reads it via getSectionGroups() so nav labels and TOC labels cannot drift
 *  apart, and useActiveSection iterates its ids for the scroll-spy. Declared
 *  `as const` so the ids stay literal for the derived union. Icons live in
 *  App.tsx alongside the nav buttons. */
export const SECTION_META = [
    { id: "learn", label: "Learn" },
    { id: "challenge", label: "Will it compile?" },
    { id: "path", label: "Path" },
    { id: "compare", label: "Compare" },
    { id: "syntax", label: "Syntax" },
    { id: "glossary", label: "Glossary" },
    { id: "errors", label: "Errors" },
    { id: "reading-errors", label: "Reading errors" },
    { id: "cheatsheet", label: "Cheatsheet" },
] as const;

/** A top-level section's stable id, derived from SECTION_META so the union and
 *  the rendered sections cannot drift. */
export type SectionId = (typeof SECTION_META)[number]["id"];

/** The canonical section ids in display order — the keys the scroll-spy
 *  observes. Derived from SECTION_META so they stay in lockstep with it. */
export const SECTION_IDS: readonly SectionId[] = SECTION_META.map((m) => m.id);

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
    id: syntaxId(topic),
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

const CERROR_SUBS: readonly SubSection[] = COMPILER_ERROR_TRANSCRIPTS.map(
    (t) => ({
        id: `cerror-${t.id}`,
        label: `${t.code}: ${t.title}`,
    })
);

const SUBSECTION_MAP: Record<SectionId, readonly SubSection[]> = {
    learn: LESSON_SUBS,
    challenge: [],
    path: [],
    compare: COMPARE_SUBS,
    syntax: SYNTAX_SUBS,
    glossary: GLOSSARY_SUBS,
    errors: ERRORS_SUBS,
    "reading-errors": CERROR_SUBS,
    cheatsheet: [],
};

// Maps a sub-section id prefix to the section it belongs to. The same naming
// convention drives the force-mount logic in useScrollNavigation.
const ID_PREFIX_SECTION: readonly (readonly [string, SectionId])[] = [
    ["lesson-", "learn"],
    ["concept-", "compare"],
    ["syntax-", "syntax"],
    ["glossary-", "glossary"],
    ["cerror-", "reading-errors"],
    ["error-", "errors"],
    ["challenge-", "challenge"],
];

/** The section an element id belongs to: the id itself if it is a section id,
 *  otherwise resolved from its prefix. Undefined for unrecognised ids. */
export function sectionForElementId(id: string): SectionId | undefined {
    const asSection = SECTION_META.find((m) => m.id === id);
    if (asSection !== undefined) return asSection.id;
    for (const [prefix, section] of ID_PREFIX_SECTION) {
        if (id.startsWith(prefix)) return section;
    }
    return undefined;
}

/** The nested hash path for an element id: `section/element-id` for a
 *  sub-section, or just `section` for a section header. Falls back to the bare
 *  id for unrecognised ids. */
export function nestedHashFor(id: string): string {
    const section = sectionForElementId(id);
    if (section === undefined || section === id) return id;
    return `${section}/${id}`;
}

/** The element id a (possibly nested) hash points at — the last path segment.
 *  Accepts the hash with or without a leading `#`. */
export function elementIdFromHash(hash: string): string {
    const raw = hash.startsWith("#") ? hash.slice(1) : hash;
    return raw.split("/").at(-1) ?? raw;
}

/**
 * Resolve the nested URL-hash path for the current scroll position:
 * `section/sub` when a sub-section is in view within the active section,
 * otherwise just the section id (so a section header — and sub-less sections
 * like path and cheatsheet — are linkable and reflected).
 */
export function resolveActiveHash(
    groups: readonly SectionGroup[],
    activeSection: SectionId,
    activeSub: string | undefined
): string {
    if (activeSub !== undefined) {
        const group = groups.find((g) => g.id === activeSection);
        if (group?.subSections.some((s) => s.id === activeSub) === true) {
            return `${activeSection}/${activeSub}`;
        }
    }
    return activeSection;
}

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
