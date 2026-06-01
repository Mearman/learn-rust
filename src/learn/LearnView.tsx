import { Check } from "lucide-react";
import { C } from "../theme/colours.ts";
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
        <div className="rbc-learn">
            <nav className="min-w-0">
                <div className="flex flex-col gap-1.5">
                    {LESSONS.map((l) => {
                        const Icon = l.icon;
                        const on = l.id === active;
                        const seen = viewed.has(l.id);
                        return (
                            <button
                                key={l.id}
                                onClick={() => {
                                    setActive(l.id);
                                }}
                                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition-colors"
                                style={{
                                    background: on
                                        ? C.accentDim
                                        : "transparent",
                                    color: on ? C.text : C.dim,
                                    border: `1px solid ${on ? C.accent : "transparent"}`,
                                }}
                            >
                                <Icon
                                    size={16}
                                    style={{
                                        color: on ? C.accentSoft : C.faint,
                                        flexShrink: 0,
                                    }}
                                />
                                <span className="flex-1">{l.title}</span>
                                {seen ? (
                                    <Check
                                        size={13}
                                        style={{ color: C.good, flexShrink: 0 }}
                                    />
                                ) : null}
                            </button>
                        );
                    })}
                </div>
            </nav>

            <article className="min-w-0 flex flex-col gap-4">
                <header className="flex flex-col gap-1.5">
                    <h2
                        className="text-2xl font-bold m-0"
                        style={{ color: C.text }}
                    >
                        {lesson.title}
                    </h2>
                    <p className="text-sm m-0" style={{ color: C.accentSoft }}>
                        {lesson.tagline}
                    </p>
                </header>
                {lesson.blocks.map((b, i) => (
                    <Block key={i} block={b} />
                ))}
            </article>
        </div>
    );
}
