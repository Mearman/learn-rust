import { useCallback, useEffect, useState } from "react";
import {
    BookOpen,
    Code2,
    ArrowLeftRight,
    AlertTriangle,
    Braces,
    GitBranch,
    ListChecks,
    MagnifyingGlass,
    Trophy,
    type LucideIcon,
} from "lucide-react";
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
import { ChallengeView, challengeReducer } from "./challenge/ChallengeView.tsx";
import type {
    ChallengeState,
    ChallengeAction,
} from "./challenge/ChallengeView.tsx";
import { getFilteredChallenges } from "./challenge/challenges.ts";
import { CheatsheetView } from "./cheatsheet/CheatsheetView.tsx";
import { useCompiler } from "./compiler/useCompiler.ts";
import { SettingsPanel } from "./settings/SettingsPanel.tsx";
import { useUserProfile } from "./settings/useUserProfile.ts";
import { joinDeveloperBackgrounds } from "./settings/backgrounds.ts";
import { joinLanguageFamiliarities } from "./data/languages.ts";
import { ComparisonView } from "./references/ComparisonView.tsx";
import { SyntaxView } from "./references/SyntaxView.tsx";
import { GlossaryView } from "./references/GlossaryView.tsx";
import { ErrorCatalogueView } from "./references/ErrorCatalogueView.tsx";
import { ProgressionView } from "./references/ProgressionView.tsx";
import { SearchView } from "./references/SearchView.tsx";
import { SYNTAX_REFERENCES } from "./data/syntax-references.ts";
import { CONCEPTS } from "./data/concepts.ts";
import { GLOSSARY } from "./data/glossary.ts";
import { ERROR_CATALOGUE } from "./data/errors.ts";

type Mode =
    | "learn"
    | "challenge"
    | "compare"
    | "syntax"
    | "glossary"
    | "errors"
    | "progression"
    | "search"
    | "cheatsheet";

const TABS: readonly {
    readonly id: Mode;
    readonly label: string;
    readonly icon: LucideIcon;
}[] = [
    { id: "learn", label: "Learn", icon: BookOpen },
    { id: "challenge", label: "Will it compile?", icon: ListChecks },
    { id: "progression", label: "Path", icon: GitBranch },
    { id: "compare", label: "Compare", icon: ArrowLeftRight },
    { id: "syntax", label: "Syntax", icon: Braces },
    { id: "glossary", label: "Glossary", icon: BookOpen },
    { id: "errors", label: "Errors", icon: AlertTriangle },
    { id: "search", label: "Search", icon: MagnifyingGlass },
    { id: "cheatsheet", label: "Cheatsheet", icon: Code2 },
];

const ALL_TOPICS = SYNTAX_REFERENCES.reduce<string[]>((acc, entry) => {
    if (!acc.includes(entry.topic)) acc.push(entry.topic);
    return acc;
}, []);

const FIRST_LESSON_ID = LESSONS[0]?.id ?? "ownership";
const FIRST_CONCEPT_ID = (() => {
    const concept = CONCEPTS[0];
    if (concept === undefined) {
        throw new Error("No concepts configured");
    }
    return concept.id;
})();
const FIRST_GLOSSARY_ID = (() => {
    const entry = GLOSSARY[0];
    if (entry === undefined) {
        throw new Error("No glossary entries configured");
    }
    return entry.id;
})();
const FIRST_ERROR_ID = (() => {
    const entry = ERROR_CATALOGUE[0];
    if (entry === undefined) {
        throw new Error("No error entries configured");
    }
    return entry.id;
})();

export function App() {
    const [mode, setMode] = useState<Mode>("learn");
    const [active, setActive] = useState(FIRST_LESSON_ID);
    const [viewed, setViewed] = useState(() => new Set([FIRST_LESSON_ID]));
    const [concept, setConcept] = useState(FIRST_CONCEPT_ID);
    const [syntaxTopic, setSyntaxTopic] = useState<string>(() => {
        const first = ALL_TOPICS[0];
        if (first === undefined) {
            throw new Error("No syntax topics configured");
        }
        return first;
    });
    const [glossaryId, setGlossaryId] = useState(FIRST_GLOSSARY_ID);
    const [errorId, setErrorId] = useState(FIRST_ERROR_ID);
    const [challenge, setChallenge] = useState<ChallengeState>({
        index: 0,
        answered: false,
        guess: null,
        correct: 0,
        total: 0,
    });
    const {
        compiling,
        result: compileResult,
        compile,
        clear: clearCompile,
    } = useCompiler();
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

    const dispatch = useCallback(
        (action: ChallengeAction) => {
            setChallenge((s) =>
                challengeReducer(s, action, getFilteredChallenges(profile))
            );
        },
        [profile]
    );

    const selectLesson = useCallback((id: string) => {
        setActive(id);
        setViewed((prev) => {
            const next = new Set(prev);
            next.add(id);
            return next;
        });
        setMode("learn");
    }, []);

    const openCompare = useCallback((id: string) => {
        setConcept(id);
        setMode("compare");
    }, []);

    const openSyntax = useCallback((topic: string) => {
        setSyntaxTopic(topic);
        setMode("syntax");
    }, []);

    const openGlossary = useCallback((id: string) => {
        setGlossaryId(id);
        setMode("glossary");
    }, []);

    const openError = useCallback((id: string) => {
        setErrorId(id);
        setMode("errors");
    }, []);

    return (
        <div className={shell}>
            <div className={shellInner}>
                <header
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                    }}
                >
                    <div className={headerFlex}>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "0.25rem",
                            }}
                        >
                            <h1 className={heading}>
                                Rust{" "}
                                <span style={{ color: vars.colour.accent }}>
                                    by concept
                                </span>
                            </h1>
                            <p
                                style={{
                                    fontSize: "0.875rem",
                                    margin: 0,
                                    color: vars.colour.faint,
                                }}
                            >
                                The ten ideas that actually make Rust feel
                                different.
                            </p>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "1rem",
                                flexWrap: "wrap",
                            }}
                            className={monoSm}
                        >
                            <span
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.375rem",
                                }}
                            >
                                <BookOpen
                                    size={13}
                                    style={{ color: vars.colour.accent }}
                                />
                                {viewed.size}/{LESSONS.length} read
                            </span>
                            <span
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.375rem",
                                }}
                            >
                                <Trophy
                                    size={13}
                                    style={{ color: vars.colour.accent }}
                                />
                                {challenge.correct}/{challenge.total}
                            </span>
                            <span
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.375rem",
                                }}
                            >
                                <span style={{ color: vars.colour.accent }}>
                                    •
                                </span>
                                Backgrounds:{" "}
                                {joinDeveloperBackgrounds(profile.backgrounds)}
                            </span>
                            <span
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.375rem",
                                }}
                            >
                                <span style={{ color: vars.colour.accent }}>
                                    •
                                </span>
                                Familiarities:{" "}
                                {joinLanguageFamiliarities(
                                    profile.familiarities
                                )}
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
                            onOpenReference={openCompare}
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
                    {mode === "progression" ? (
                        <ProgressionView
                            profile={profile}
                            onOpenLesson={selectLesson}
                            onOpenConcept={openCompare}
                        />
                    ) : null}
                    {mode === "compare" ? (
                        <ComparisonView
                            profile={profile}
                            active={concept}
                            onSelect={setConcept}
                            onOpenLesson={selectLesson}
                        />
                    ) : null}
                    {mode === "syntax" ? (
                        <SyntaxView
                            profile={profile}
                            active={syntaxTopic}
                            onSelect={setSyntaxTopic}
                        />
                    ) : null}
                    {mode === "glossary" ? (
                        <GlossaryView
                            profile={profile}
                            active={glossaryId}
                            onSelect={setGlossaryId}
                            onOpenConcept={openCompare}
                        />
                    ) : null}
                    {mode === "errors" ? (
                        <ErrorCatalogueView
                            profile={profile}
                            active={errorId}
                            onSelect={setErrorId}
                            onOpenConcept={openCompare}
                        />
                    ) : null}
                    {mode === "search" ? (
                        <SearchView
                            profile={profile}
                            onOpenLesson={selectLesson}
                            onOpenConcept={openCompare}
                            onOpenSyntax={openSyntax}
                            onOpenGlossary={openGlossary}
                            onOpenError={openError}
                        />
                    ) : null}
                    {mode === "cheatsheet" ? (
                        <CheatsheetView
                            onOpenReferences={() => setMode("compare")}
                            onOpenConcept={openCompare}
                        />
                    ) : null}
                </main>

                <footer className={footer}>
                    Snippets are illustrative. Run them for real at
                    play.rust-lang.org
                </footer>
            </div>
        </div>
    );
}
