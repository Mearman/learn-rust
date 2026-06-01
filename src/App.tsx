import { useCallback, useEffect, useState } from "react";
import { BookOpen, Code2, FileText, ListChecks, Trophy, type LucideIcon } from "lucide-react";
import { vars } from "./theme/theme.css.ts";
import {
    shell,
    shellInner,
    headerFlex,
    heading,
    mainPanel,
    tabNav,
    tabButton,
    tabButtonActive,
    footer,
    monoSm,
} from "./theme/styles.css.ts";
import { LESSONS } from "./learn/lessons.ts";
import { LearnView } from "./learn/LearnView.tsx";
import {
    ChallengeView,
    challengeReducer,
} from "./challenge/ChallengeView.tsx";
import type { ChallengeState, ChallengeAction } from "./challenge/ChallengeView.tsx";
import { getFilteredChallenges } from "./challenge/challenges.ts";
import { CheatsheetView } from "./cheatsheet/CheatsheetView.tsx";
import { useCompiler } from "./compiler/useCompiler.ts";
import { SettingsPanel } from "./settings/SettingsPanel.tsx";
import { useUserProfile } from "./settings/useUserProfile.ts";
import { joinDeveloperBackgrounds } from "./settings/backgrounds.ts";
import { joinLanguageFamiliarities } from "./settings/languages.ts";
import { ReferenceView } from "./references/ReferenceView.tsx";
import { REFERENCE_CARDS } from "./references/references.ts";

type Mode = "learn" | "challenge" | "references" | "cheatsheet";

const TABS: readonly { readonly id: Mode; readonly label: string; readonly icon: LucideIcon }[] = [
    { id: "learn", label: "Learn", icon: BookOpen },
    { id: "challenge", label: "Will it compile?", icon: ListChecks },
    { id: "references", label: "References", icon: FileText },
    { id: "cheatsheet", label: "Cheatsheet", icon: Code2 },
];

const FIRST_LESSON_ID = LESSONS[0]?.id ?? "ownership";
const FIRST_REFERENCE_ID = (() => {
    const reference = REFERENCE_CARDS[0];
    if (reference === undefined) {
        throw new Error("No reference cards configured");
    }
    return reference.id;
})();

export function App() {
    const [mode, setMode] = useState<Mode>("learn");
    const [active, setActive] = useState(FIRST_LESSON_ID);
    const [viewed, setViewed] = useState(() => new Set([FIRST_LESSON_ID]));
    const [reference, setReference] = useState(FIRST_REFERENCE_ID);
    const [challenge, setChallenge] = useState<ChallengeState>({
        index: 0,
        answered: false,
        guess: null,
        correct: 0,
        total: 0,
    });
    const { compiling, result: compileResult, compile, clear: clearCompile } = useCompiler();
    const [profile, setProfile] = useUserProfile();

    useEffect(() => {
        setChallenge({
            index: 0,
            answered: false,
            guess: null,
            correct: 0,
            total: 0,
        });
    }, [profile.experience]);

    const dispatch = useCallback((action: ChallengeAction) => {
        setChallenge((s) => challengeReducer(s, action, getFilteredChallenges(profile)));
    }, [profile]);

    const selectLesson = useCallback((id: string) => {
        setActive(id);
        setViewed((prev) => {
            const next = new Set(prev);
            next.add(id);
            return next;
        });
        setMode("learn");
    }, []);

    const openReference = useCallback((id: string) => {
        setReference(id);
        setMode("references");
    }, []);

    return (
        <div className={shell}>
            <div className={shellInner}>
                <header style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div className={headerFlex}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                            <h1 className={heading}>
                                Rust{" "}
                                <span style={{ color: vars.colour.accent }}>by concept</span>
                            </h1>
                            <p style={{ fontSize: "0.875rem", margin: 0, color: vars.colour.faint }}>
                                The ten ideas that actually make Rust feel different.
                            </p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }} className={monoSm}>
                            <span style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                                <BookOpen size={13} style={{ color: vars.colour.accent }} />
                                {viewed.size}/{LESSONS.length} read
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                                <Trophy size={13} style={{ color: vars.colour.accent }} />
                                {challenge.correct}/{challenge.total}
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                                <span style={{ color: vars.colour.accent }}>•</span>
                                Backgrounds: {joinDeveloperBackgrounds(profile.backgrounds)}
                            </span>
                            <span style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                                <span style={{ color: vars.colour.accent }}>•</span>
                                Familiarities: {joinLanguageFamiliarities(profile.familiarities)}
                            </span>
                        </div>
                    </div>

                    <SettingsPanel profile={profile} setProfile={setProfile} />

                    <nav className={tabNav}>
                        {TABS.map((t) => {
                            const Icon = t.icon;
                            const on = t.id === mode;
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => setMode(t.id)}
                                    className={`${tabButton} ${on ? tabButtonActive : ""}`}
                                >
                                    <Icon size={15} />
                                    <span>{t.label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </header>

                <main className={mainPanel}>
                    {mode === "learn" ? (
                        <LearnView
                            active={active}
                            setActive={selectLesson}
                            viewed={viewed}
                            profile={profile}
                            compiling={compiling}
                            compileResult={compileResult}
                            onCompile={compile}
                            onClearCompile={clearCompile}
                            onOpenReference={openReference}
                        />
                    ) : null}
                    {mode === "challenge" ? (
                        <ChallengeView
                            state={challenge}
                            dispatch={dispatch}
                            profile={profile}
                            compiling={compiling}
                            compileResult={compileResult}
                            onCompile={compile}
                            onClearCompile={clearCompile}
                        />
                    ) : null}
                    {mode === "references" ? (
                        <ReferenceView
                            profile={profile}
                            active={reference}
                            onSelect={setReference}
                            onOpenLesson={selectLesson}
                        />
                    ) : null}
                    {mode === "cheatsheet" ? <CheatsheetView onOpenReferences={() => setMode("references")} /> : null}
                </main>

                <footer className={footer}>
                    Snippets are illustrative. Run them for real at play.rust-lang.org
                </footer>
            </div>
        </div>
    );
}
