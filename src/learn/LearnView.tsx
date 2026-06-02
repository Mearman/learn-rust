import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Collapse } from "@mantine/core";
import { Lightbulb, ArrowUpRight } from "lucide-react";
import { vars } from "../theme/theme.css.ts";
import {
    lessonTitle,
    lessonTagline,
    navButton,
    noteBlock,
    subSection,
    cheatCard,
    cheatTitle,
} from "../theme/styles.css.ts";
import { Block } from "./Block.tsx";
import { LESSONS } from "./lessons.ts";
import type { LessonBlock } from "./lessons.ts";
import type { CompileResult } from "../compiler/types.ts";
import type { UserProfile, ExperienceLevel } from "../settings/types.ts";
import { backgroundContextNotes } from "../settings/background-context.ts";
import { CONCEPTS, LESSON_CONCEPT_MAP } from "../data/concepts.ts";
import { isLessonReady, CONCEPT_DEPENDENCIES } from "../data/dependencies.ts";
import type { PrerequisiteLesson } from "../data/dependencies.ts";

const LEVEL_ORDER: Record<ExperienceLevel, number> = {
    beginner: 0,
    intermediate: 1,
    advanced: 2,
};

// Time the user must keep a lesson in view before it is marked read (ms).
const DWELL_MS = 3000;

/**
 * Marks a lesson as read when it has been continuously visible for DWELL_MS.
 * Uses IntersectionObserver to detect visibility; cancels the timer if the
 * article scrolls out of view before the dwell threshold.
 */
function useDwellRead(
    lessonId: string,
    articleRef: React.RefObject<HTMLElement | null>,
    alreadyViewed: boolean,
    onMarkViewed: (id: string) => void
): void {
    // Keep a stable ref to the callback so the observer closure always calls
    // the latest version without needing it as an effect dependency.
    const onMarkViewedRef = useRef(onMarkViewed);
    useLayoutEffect(() => {
        onMarkViewedRef.current = onMarkViewed;
    }, [onMarkViewed]);

    useEffect(() => {
        if (alreadyViewed) return;
        const el = articleRef.current;
        if (el === null) return;

        let timerId: ReturnType<typeof window.setTimeout> | undefined;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        timerId = window.setTimeout(() => {
                            onMarkViewedRef.current(lessonId);
                        }, DWELL_MS);
                    } else {
                        window.clearTimeout(timerId);
                    }
                }
            },
            // Fire when at least 30 % of the article is in view.
            { threshold: 0.3 }
        );

        observer.observe(el);
        return () => {
            window.clearTimeout(timerId);
            observer.disconnect();
        };
    }, [lessonId, articleRef, alreadyViewed]);
}

function blockVisible(block: LessonBlock, level: ExperienceLevel): boolean {
    if (!("level" in block)) return true;
    const blockLevel = block.level;
    if (blockLevel === undefined) return true;
    return LEVEL_ORDER[blockLevel] <= LEVEL_ORDER[level];
}

interface LearnViewProps {
    readonly viewed: ReadonlySet<string>;
    readonly onMarkViewed: (id: string) => void;
    readonly profile: UserProfile;
    readonly compiling: boolean;
    readonly compileResult: CompileResult | null;
    onCompile: (code: string) => Promise<void>;
    onClearCompile: () => void;
    onOpenReference: (id: string) => void;
    onOpenLesson: (id: string) => void;
}

function referenceTitleForId(id: string): string {
    const concept = CONCEPTS.find((c) => c.id === id);
    if (concept === undefined) {
        throw new Error(`Unknown concept: ${id}`);
    }
    return concept.title;
}

interface LessonArticleProps {
    readonly lesson: (typeof LESSONS)[number];
    readonly conceptId: string;
    readonly viewed: ReadonlySet<string>;
    readonly onMarkViewed: (id: string) => void;
    readonly profile: UserProfile;
    readonly compiling: boolean;
    readonly compileResult: CompileResult | null;
    onCompile: (code: string) => Promise<void>;
    onClearCompile: () => void;
    onOpenReference: (id: string) => void;
    onOpenLesson: (id: string) => void;
}

function lessonTitleForId(id: string): string {
    const lesson = LESSONS.find((l) => l.id === id);
    return lesson !== undefined ? lesson.title : id;
}

function PrerequisiteLinks({
    missing,
    onOpenLesson,
}: {
    readonly missing: readonly PrerequisiteLesson[];
    onOpenLesson: (id: string) => void;
}) {
    return (
        <span>
            {"Best read first: "}
            {missing.map((prereq, i) => (
                <span key={prereq.lessonId}>
                    {i > 0 ? ", " : ""}
                    <button
                        type="button"
                        onClick={() => {
                            onOpenLesson(prereq.lessonId);
                        }}
                        style={{
                            background: "none",
                            border: "none",
                            padding: 0,
                            cursor: "pointer",
                            color: vars.colour.accent,
                            font: "inherit",
                            fontSize: "inherit",
                            textDecoration: "underline",
                            textUnderlineOffset: "2px",
                        }}
                    >
                        {lessonTitleForId(prereq.lessonId)}
                    </button>
                </span>
            ))}
        </span>
    );
}

function PrerequisiteBanner({
    missing,
    onOpenLesson,
}: {
    readonly missing: readonly PrerequisiteLesson[];
    onOpenLesson: (id: string) => void;
}) {
    return (
        <div className={noteBlock}>
            <ArrowUpRight
                size={16}
                style={{
                    color: vars.colour.accent,
                    flexShrink: 0,
                    marginTop: 2,
                }}
            />
            <PrerequisiteLinks missing={missing} onOpenLesson={onOpenLesson} />
        </div>
    );
}

function PrerequisiteGate({
    missing,
    onOpenLesson,
    onShowAnyway,
}: {
    readonly missing: readonly PrerequisiteLesson[];
    onOpenLesson: (id: string) => void;
    onShowAnyway: () => void;
}) {
    return (
        <div className={cheatCard}>
            <p className={cheatTitle}>Prerequisites incomplete</p>
            <PrerequisiteLinks missing={missing} onOpenLesson={onOpenLesson} />
            <button
                type="button"
                onClick={onShowAnyway}
                className={navButton}
                style={{
                    width: "auto",
                    padding: "0.45rem 0.75rem",
                }}
            >
                Show anyway
            </button>
        </div>
    );
}

function LessonArticle({
    lesson,
    conceptId,
    viewed,
    onMarkViewed,
    profile,
    compiling,
    compileResult,
    onCompile,
    onClearCompile,
    onOpenReference,
    onOpenLesson,
}: LessonArticleProps) {
    const articleRef = useRef<HTMLElement | null>(null);
    useDwellRead(lesson.id, articleRef, viewed.has(lesson.id), onMarkViewed);

    const readiness = isLessonReady(lesson.id, viewed, CONCEPT_DEPENDENCIES);
    const hardGated = profile.hardGating && !readiness.ready;
    const [showAnyway, setShowAnyway] = useState(false);
    const collapsed = hardGated && !showAnyway;

    return (
        <article
            ref={articleRef}
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

            {profile.hardGating && hardGated ? (
                <PrerequisiteGate
                    missing={readiness.missing}
                    onOpenLesson={onOpenLesson}
                    onShowAnyway={() => {
                        setShowAnyway(true);
                    }}
                />
            ) : !profile.hardGating && !readiness.ready ? (
                <PrerequisiteBanner
                    missing={readiness.missing}
                    onOpenLesson={onOpenLesson}
                />
            ) : null}

            <Collapse expanded={!collapsed}>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                    }}
                >
                    {backgroundContextNotes(profile.backgrounds, lesson.id).map(
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
                            .filter((b) => blockVisible(b, profile.experience))
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
                </div>
            </Collapse>
        </article>
    );
}

export function LearnView({
    viewed,
    onMarkViewed,
    profile,
    compiling,
    compileResult,
    onCompile,
    onClearCompile,
    onOpenReference,
    onOpenLesson,
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
                    <LessonArticle
                        key={lesson.id}
                        lesson={lesson}
                        conceptId={conceptId}
                        viewed={viewed}
                        onMarkViewed={onMarkViewed}
                        profile={profile}
                        compiling={compiling}
                        compileResult={compileResult}
                        onCompile={onCompile}
                        onClearCompile={onClearCompile}
                        onOpenReference={onOpenReference}
                        onOpenLesson={onOpenLesson}
                    />
                );
            })}
        </div>
    );
}
