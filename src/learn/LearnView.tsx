import { Check } from "lucide-react";
import { vars } from "../theme/theme.css.ts";
import {
    learnGrid,
    lessonTitle,
    lessonTagline,
    navButton,
    navButtonActive,
} from "../theme/styles.css.ts";
import { Block } from "./Block.tsx";
import { LESSONS } from "./lessons.ts";
import type { Lesson } from "./lessons.ts";

interface LearnViewProps {
    readonly active: string;
    readonly setActive: (id: string) => void;
    readonly viewed: ReadonlySet<string>;
}

function findLesson(id: string): Lesson {
    const lesson = LESSONS.find((l) => l.id === id);
    if (lesson === undefined) throw new Error(`Unknown lesson: ${id}`);
    return lesson;
}

export function LearnView({ active, setActive, viewed }: LearnViewProps) {
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
                {lesson.blocks.map((b, i) => (
                    <Block key={i} block={b} />
                ))}
            </article>
        </div>
    );
}
