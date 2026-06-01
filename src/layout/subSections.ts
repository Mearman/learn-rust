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

export function getSubSections(sectionId: SectionId): readonly SubSection[] {
    return SUBSECTION_MAP[sectionId];
}
