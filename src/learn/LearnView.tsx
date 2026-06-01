import { Check, Lightbulb } from "lucide-react";
import { vars } from "../theme/theme.css.ts";
import {
    learnGrid,
    lessonTitle,
    lessonTagline,
    navButton,
    navButtonActive,
    noteBlock,
} from "../theme/styles.css.ts";
import { Block } from "./Block.tsx";
import { LESSONS } from "./lessons.ts";
import type { Lesson, LessonBlock } from "./lessons.ts";
import type { CompileResult } from "../compiler/types.ts";
import type { UserProfile, ExperienceLevel } from "../settings/types.ts";
import { backgroundContextNotes } from "../settings/background-context.ts";
import { LESSON_REFERENCE_LINKS, REFERENCE_CARDS } from "../references/references.ts";

const LEVEL_ORDER: Record<ExperienceLevel, number> = {
    beginner: 0,
    intermediate: 1,
    advanced: 2,
};

function blockVisible(block: LessonBlock, level: ExperienceLevel): boolean {
    if (!("level" in block)) return true;
    const blockLevel = block.level;
    if (blockLevel === undefined) return true;
    return LEVEL_ORDER[blockLevel] <= LEVEL_ORDER[level];
}

interface LearnViewProps {
    readonly active: string;
    readonly setActive: (id: string) => void;
    readonly viewed: ReadonlySet<string>;
    readonly profile: UserProfile;
    readonly compiling: boolean;
    readonly compileResult: CompileResult | null;
    onCompile: (code: string) => void;
    onClearCompile: () => void;
    onOpenReference: (id: string) => void;
}

function findLesson(id: string): Lesson {
    const lesson = LESSONS.find((l) => l.id === id);
    if (lesson === undefined) throw new Error(`Unknown lesson: ${id}`);
    return lesson;
}

function referenceTitleForId(id: string): string {
    const reference = REFERENCE_CARDS.find((card) => card.id === id);
    if (reference === undefined) {
        throw new Error(`Unknown reference: ${id}`);
    }
    return reference.title;
}

export function LearnView({ active, setActive, viewed, profile, compiling, compileResult, onCompile, onClearCompile, onOpenReference }: LearnViewProps) {
    const lesson = findLesson(active);
    return (
        <div className={learnGrid}>
            <nav style={{ minWidth: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                    {LESSONS.map((l) => {
                        const Icon = l.icon;
                        const on = l.id === active;
                        const seen = viewed.has(l.id);
                        return (
                            <button
                                key={l.id}
                                onClick={() => setActive(l.id)}
                                className={`${navButton} ${on ? navButtonActive : ""}`}
                            >
                                <Icon size={16} style={{ color: on ? vars.colour.accentSoft : vars.colour.faint, flexShrink: 0 }} />
                                <span style={{ flex: 1 }}>{l.title}</span>
                                {seen ? <Check size={13} style={{ color: vars.colour.good, flexShrink: 0 }} /> : null}
                            </button>
                        );
                    })}
                </div>
            </nav>

            <article style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: "1rem" }}>
                <header style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                    <h2 className={lessonTitle}>{lesson.title}</h2>
                    <p className={lessonTagline}>{lesson.tagline}</p>
                </header>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {(() => {
                        const related = LESSON_REFERENCE_LINKS[lesson.id];
                        if (related === undefined) {
                            throw new Error(`No references configured for lesson: ${lesson.id}`);
                        }
                        return related.map((id) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => onOpenReference(id)}
                                className={navButton}
                                style={{ width: "auto", padding: "0.45rem 0.75rem" }}
                            >
                                Open reference: {referenceTitleForId(id)}
                            </button>
                        ));
                    })()}
                </div>
                {backgroundContextNotes(profile.backgrounds).map((note) => (
                    <div key={note} className={noteBlock}>
                        <Lightbulb size={16} style={{ color: vars.colour.accent, flexShrink: 0, marginTop: 2 }} />
                        <span>{note}</span>
                    </div>
                ))}
                {lesson.blocks
                    .filter((b) => blockVisible(b, profile.experience))
                    .map((b, i) => (
                        <Block
                            key={i}
                            block={b}
                            profile={profile}
                            compiling={compiling}
                            onRun={b.kind === "code" ? () => onCompile(b.code) : undefined}
                            compileResult={compileResult}
                            onClearCompile={onClearCompile}
                        />
                    ))}
            </article>
        </div>
    );
}
