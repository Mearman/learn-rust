import { Lightbulb } from "lucide-react";
import { vars } from "../theme/theme.css.ts";
import {
    lessonTitle,
    lessonTagline,
    navButton,
    noteBlock,
    subSection,
} from "../theme/styles.css.ts";
import { Block } from "./Block.tsx";
import { LESSONS } from "./lessons.ts";
import type { Lesson, LessonBlock } from "./lessons.ts";
import type { CompileResult } from "../compiler/types.ts";
import type { UserProfile, ExperienceLevel } from "../settings/types.ts";
import { backgroundContextNotes } from "../settings/background-context.ts";
import { CONCEPTS } from "../data/concepts.ts";
import { LESSON_CONCEPT_MAP } from "../data/concepts.ts";

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
    readonly viewed: ReadonlySet<string>;
    readonly profile: UserProfile;
    readonly compiling: boolean;
    readonly compileResult: CompileResult | null;
    onCompile: (code: string) => Promise<void>;
    onClearCompile: () => void;
    onOpenReference: (id: string) => void;
}

function referenceTitleForId(id: string): string {
    const concept = CONCEPTS.find((c) => c.id === id);
    if (concept === undefined) {
        throw new Error(`Unknown concept: ${id}`);
    }
    return concept.title;
}

export function LearnView({
    viewed,
    profile,
    compiling,
    compileResult,
    onCompile,
    onClearCompile,
    onOpenReference,
}: LearnViewProps) {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "2.5rem",
            }}
        >
            {LESSONS.map((lesson) => {
                const conceptId = LESSON_CONCEPT_MAP[lesson.id];
                if (conceptId === undefined) {
                    throw new Error(
                        `No concept configured for lesson: ${lesson.id}`
                    );
                }

                return (
                    <article
                        key={lesson.id}
                        id={`lesson-${lesson.id}`}
                        className={subSection}
                    >
                        <header
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.375rem",
                            }}
                        >
                            <h3 className={lessonTitle}>
                                {lesson.title}
                                {viewed.has(lesson.id) ? (
                                    <span
                                        style={{
                                            fontSize: "0.75rem",
                                            marginLeft: "0.5rem",
                                            color: vars.colour.good,
                                        }}
                                    >
                                        ✓ read
                                    </span>
                                ) : null}
                            </h3>
                            <p className={lessonTagline}>{lesson.tagline}</p>
                        </header>

                        <div
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "0.5rem",
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => {
                                    onOpenReference(conceptId);
                                }}
                                className={navButton}
                                style={{
                                    width: "auto",
                                    padding: "0.45rem 0.75rem",
                                }}
                            >
                                Compare: {referenceTitleForId(conceptId)}
                            </button>
                        </div>

                        {backgroundContextNotes(profile.backgrounds).map(
                            (note) => (
                                <div key={note} className={noteBlock}>
                                    <Lightbulb
                                        size={16}
                                        style={{
                                            color: vars.colour.accent,
                                            flexShrink: 0,
                                            marginTop: 2,
                                        }}
                                    />
                                    <span>{note}</span>
                                </div>
                            )
                        )}

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "1rem",
                            }}
                        >
                            {lesson.blocks
                                .filter((b) =>
                                    blockVisible(b, profile.experience)
                                )
                                .map((b, i) => (
                                    <Block
                                        key={i}
                                        block={b}
                                        profile={profile}
                                        compiling={compiling}
                                        onRun={
                                            b.kind === "code"
                                                ? () => {
                                                      void onCompile(b.code);
                                                  }
                                                : undefined
                                        }
                                        compileResult={compileResult}
                                        onClearCompile={onClearCompile}
                                    />
                                ))}
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
