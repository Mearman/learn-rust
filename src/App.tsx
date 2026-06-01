import { useState, useCallback } from "react";
import { BookOpen, Code2, ListChecks, Trophy } from "lucide-react";
import { C } from "./theme/colours.ts";
import { LAYOUT_CSS } from "./theme/layout.ts";
import { LESSONS } from "./learn/lessons.ts";
import { LearnView } from "./learn/LearnView.tsx";
import { ChallengeView, challengeReducer } from "./challenge/ChallengeView.tsx";
import type {
    ChallengeState,
    ChallengeAction,
} from "./challenge/ChallengeView.tsx";
import { CheatsheetView } from "./cheatsheet/CheatsheetView.tsx";

type Mode = "learn" | "challenge" | "cheatsheet";

const TABS: readonly {
    readonly id: Mode;
    readonly label: string;
    readonly icon: typeof BookOpen;
}[] = [
    { id: "learn", label: "Learn", icon: BookOpen },
    { id: "challenge", label: "Will it compile?", icon: ListChecks },
    { id: "cheatsheet", label: "Cheatsheet", icon: Code2 },
];

const FIRST_LESSON_ID = LESSONS[0]?.id ?? "ownership";

export function App() {
    const [mode, setMode] = useState<Mode>("learn");
    const [active, setActive] = useState(FIRST_LESSON_ID);
    const [viewed, setViewed] = useState(() => new Set([FIRST_LESSON_ID]));
    const [challenge, setChallenge] = useState<ChallengeState>({
        index: 0,
        answered: false,
        guess: null,
        correct: 0,
        total: 0,
    });

    const dispatch = useCallback((action: ChallengeAction) => {
        setChallenge((s) => challengeReducer(s, action));
    }, []);

    const selectLesson = useCallback((id: string) => {
        setActive(id);
        setViewed((prev) => {
            const next = new Set(prev);
            next.add(id);
            return next;
        });
    }, []);

    return (
        <div
            className="font-sans w-full min-h-screen"
            style={{ background: C.bg, color: C.text }}
        >
            <style>{LAYOUT_CSS}</style>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
                <header className="flex flex-col gap-4">
                    <div className="flex items-end justify-between gap-4 flex-wrap">
                        <div className="flex flex-col gap-1">
                            <h1
                                className="text-2xl sm:text-3xl font-bold m-0 tracking-tight"
                                style={{ color: C.text }}
                            >
                                Rust{" "}
                                <span style={{ color: C.accent }}>
                                    by concept
                                </span>
                            </h1>
                            <p
                                className="text-sm m-0"
                                style={{ color: C.faint }}
                            >
                                The ten ideas that actually make Rust feel
                                different.
                            </p>
                        </div>
                        <div
                            className="flex items-center gap-4 text-xs font-mono"
                            style={{ color: C.faint }}
                        >
                            <span className="flex items-center gap-1.5">
                                <BookOpen
                                    size={13}
                                    style={{ color: C.accent }}
                                />
                                {viewed.size}/{LESSONS.length} read
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Trophy size={13} style={{ color: C.accent }} />
                                {challenge.correct}/{challenge.total}
                            </span>
                        </div>
                    </div>

                    <nav
                        className="flex gap-1 p-1 rounded-xl self-start"
                        style={{
                            background: C.panel,
                            border: `1px solid ${C.border}`,
                        }}
                    >
                        {TABS.map((t) => {
                            const Icon = t.icon;
                            const on = t.id === mode;
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => {
                                        setMode(t.id);
                                    }}
                                    className="flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors"
                                    style={{
                                        background: on
                                            ? C.accent
                                            : "transparent",
                                        color: on ? "#1a0f08" : C.dim,
                                    }}
                                >
                                    <Icon size={15} />
                                    <span className="whitespace-nowrap">
                                        {t.label}
                                    </span>
                                </button>
                            );
                        })}
                    </nav>
                </header>

                <main
                    className="rounded-2xl p-4 sm:p-6"
                    style={{
                        background: C.panel,
                        border: `1px solid ${C.border}`,
                    }}
                >
                    {mode === "learn" ? (
                        <LearnView
                            active={active}
                            setActive={selectLesson}
                            viewed={viewed}
                        />
                    ) : null}
                    {mode === "challenge" ? (
                        <ChallengeView state={challenge} dispatch={dispatch} />
                    ) : null}
                    {mode === "cheatsheet" ? <CheatsheetView /> : null}
                </main>

                <footer
                    className="text-center text-xs"
                    style={{ color: C.faint }}
                >
                    Snippets are illustrative. Run them for real at
                    play.rust-lang.org
                </footer>
            </div>
        </div>
    );
}
