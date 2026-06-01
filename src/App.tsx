import { useCallback, useState } from "react";
import {
    BookOpen,
    Code2,
    ArrowLeftRight,
    AlertTriangle,
    Braces,
    GitBranch,
    ListChecks,
    Search,
    Trophy,
    X,
    type LucideIcon,
} from "lucide-react";
import { vars } from "./theme/theme.css.ts";
import {
    shell,
    shellInner,
    headerFlex,
    heading,
    stickyNav,
    tabButton,
    tabButtonActive,
    tabButtonLabel,
    contentSection,
    sectionHeading,
    footer,
    monoSm,
    searchOverlay,
    searchPanel,
    searchInput,
    searchResults,
    hideOnMobile,
} from "./theme/styles.css.ts";
import { LESSONS } from "./learn/lessons.ts";
import { LearnView } from "./learn/LearnView.tsx";
import { ChallengeView } from "./challenge/ChallengeView.tsx";
import { challengeReducer } from "./challenge/challengeReducer.ts";
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
import { ThemeToggle } from "./theme/ThemeToggle.tsx";
import { useThemeMode } from "./theme/useThemeMode.ts";
import {
    useActiveSection,
    scrollToSection,
    type SectionId,
} from "./layout/useActiveSection.ts";

const SECTIONS: readonly {
    readonly id: SectionId;
    readonly label: string;
    readonly icon: LucideIcon;
}[] = [
    { id: "learn", label: "Learn", icon: BookOpen },
    { id: "challenge", label: "Will it compile?", icon: ListChecks },
    { id: "path", label: "Path", icon: GitBranch },
    { id: "compare", label: "Compare", icon: ArrowLeftRight },
    { id: "syntax", label: "Syntax", icon: Braces },
    { id: "glossary", label: "Glossary", icon: BookOpen },
    { id: "errors", label: "Errors", icon: AlertTriangle },
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
    const activeSection = useActiveSection();
    const [showSearch, setShowSearch] = useState(false);

    const [activeLesson, setActiveLesson] = useState(FIRST_LESSON_ID);
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
    const {
        compiling,
        result: compileResult,
        compile,
        clear: clearCompile,
    } = useCompiler();
    const [profile, setProfile] = useUserProfile();
    const { mode: themeMode, setMode: setThemeMode } = useThemeMode();

    const [challenge, setChallenge] = useState<ChallengeState>({
        index: 0,
        answered: false,
        guess: null,
        correct: 0,
        total: 0,
    });

    const dispatch = useCallback(
        (action: ChallengeAction) => {
            setChallenge((s) =>
                challengeReducer(s, action, getFilteredChallenges(profile))
            );
        },
        [profile]
    );

    const selectLesson = useCallback((id: string) => {
        setActiveLesson(id);
        setViewed((prev) => {
            const next = new Set(prev);
            next.add(id);
            return next;
        });
    }, []);

    const openCompare = useCallback((id: string) => {
        setConcept(id);
        scrollToSection("compare");
    }, []);

    const openSyntax = useCallback((topic: string) => {
        setSyntaxTopic(topic);
        scrollToSection("syntax");
    }, []);

    const openGlossary = useCallback((id: string) => {
        setGlossaryId(id);
        scrollToSection("glossary");
    }, []);

    const openError = useCallback((id: string) => {
        setErrorId(id);
        scrollToSection("errors");
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
                                className={hideOnMobile}
                                style={{
                                    display: "none",
                                    alignItems: "center",
                                    gap: "0.375rem",
                                }}
                            >
                                <span style={{ color: vars.colour.accent }}>
                                    •
                                </span>
                                {joinDeveloperBackgrounds(profile.backgrounds)}
                            </span>
                            <span
                                className={hideOnMobile}
                                style={{
                                    display: "none",
                                    alignItems: "center",
                                    gap: "0.375rem",
                                }}
                            >
                                <span style={{ color: vars.colour.accent }}>
                                    •
                                </span>
                                {joinLanguageFamiliarities(
                                    profile.familiarities
                                )}
                            </span>
                        </div>
                    </div>

                    <SettingsPanel profile={profile} setProfile={setProfile} />

                    <ThemeToggle mode={themeMode} onChange={setThemeMode} />
                </header>

                <nav className={stickyNav}>
                    {SECTIONS.map((s) => {
                        const Icon = s.icon;
                        const on = s.id === activeSection;
                        return (
                            <button
                                key={s.id}
                                type="button"
                                onClick={() => {
                                    scrollToSection(s.id);
                                }}
                                className={`${tabButton} ${on ? tabButtonActive : ""}`}
                            >
                                <Icon size={15} />
                                <span className={tabButtonLabel}>
                                    {s.label}
                                </span>
                            </button>
                        );
                    })}
                    <button
                        type="button"
                        onClick={() => {
                            setShowSearch(true);
                        }}
                        className={tabButton}
                    >
                        <Search size={15} />
                        <span className={tabButtonLabel}>Search</span>
                    </button>
                </nav>

                <section id="learn" className={contentSection}>
                    <h2 className={sectionHeading}>Learn</h2>
                    <LearnView
                        active={activeLesson}
                        setActive={selectLesson}
                        viewed={viewed}
                        profile={profile}
                        compiling={compiling}
                        compileResult={compileResult}
                        onCompile={compile}
                        onClearCompile={clearCompile}
                        onOpenReference={openCompare}
                    />
                </section>

                <section id="challenge" className={contentSection}>
                    <h2 className={sectionHeading}>Will it compile?</h2>
                    <ChallengeView
                        state={challenge}
                        dispatch={dispatch}
                        profile={profile}
                        compiling={compiling}
                        compileResult={compileResult}
                        onCompile={compile}
                        onClearCompile={clearCompile}
                    />
                </section>

                <section id="path" className={contentSection}>
                    <h2 className={sectionHeading}>Learning path</h2>
                    <ProgressionView
                        onOpenLesson={(id) => {
                            selectLesson(id);
                            scrollToSection("learn");
                        }}
                        onOpenConcept={openCompare}
                    />
                </section>

                <section id="compare" className={contentSection}>
                    <h2 className={sectionHeading}>Compare</h2>
                    <ComparisonView
                        profile={profile}
                        active={concept}
                        onSelect={setConcept}
                        onOpenLesson={(id) => {
                            selectLesson(id);
                            scrollToSection("learn");
                        }}
                    />
                </section>

                <section id="syntax" className={contentSection}>
                    <h2 className={sectionHeading}>Syntax</h2>
                    <SyntaxView
                        profile={profile}
                        active={syntaxTopic}
                        onSelect={setSyntaxTopic}
                    />
                </section>

                <section id="glossary" className={contentSection}>
                    <h2 className={sectionHeading}>Glossary</h2>
                    <GlossaryView
                        active={glossaryId}
                        onSelect={setGlossaryId}
                        onOpenConcept={openCompare}
                    />
                </section>

                <section id="errors" className={contentSection}>
                    <h2 className={sectionHeading}>Errors</h2>
                    <ErrorCatalogueView
                        active={errorId}
                        onSelect={setErrorId}
                        onOpenConcept={openCompare}
                    />
                </section>

                <section id="cheatsheet" className={contentSection}>
                    <h2 className={sectionHeading}>Cheatsheet</h2>
                    <CheatsheetView
                        onOpenReferences={() => {
                            scrollToSection("compare");
                        }}
                        onOpenConcept={openCompare}
                    />
                </section>

                <footer className={footer}>
                    Snippets are illustrative. Run them for real at
                    play.rust-lang.org
                </footer>
            </div>

            {showSearch ? (
                <SearchOverlay
                    onClose={() => {
                        setShowSearch(false);
                    }}
                    onOpenLesson={(id) => {
                        selectLesson(id);
                        setShowSearch(false);
                        scrollToSection("learn");
                    }}
                    onOpenConcept={openCompare}
                    onOpenSyntax={(topic) => {
                        openSyntax(topic);
                        setShowSearch(false);
                    }}
                    onOpenGlossary={(id) => {
                        openGlossary(id);
                        setShowSearch(false);
                    }}
                    onOpenError={(id) => {
                        openError(id);
                        setShowSearch(false);
                    }}
                />
            ) : null}
        </div>
    );
}

interface SearchOverlayProps {
    readonly onClose: () => void;
    readonly onOpenLesson: (id: string) => void;
    readonly onOpenConcept: (id: string) => void;
    readonly onOpenSyntax: (topic: string) => void;
    readonly onOpenGlossary: (id: string) => void;
    readonly onOpenError: (id: string) => void;
}

function SearchOverlay({
    onClose,
    onOpenLesson,
    onOpenConcept,
    onOpenSyntax,
    onOpenGlossary,
    onOpenError,
}: SearchOverlayProps) {
    return (
        <div
            className={searchOverlay}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className={searchPanel}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        borderBottom: `1px solid ${vars.colour.borderSoft}`,
                    }}
                >
                    <Search
                        size={18}
                        style={{
                            marginLeft: "1rem",
                            color: vars.colour.faint,
                            flexShrink: 0,
                        }}
                    />
                    <input
                        type="text"
                        className={searchInput}
                        placeholder="Search lessons, concepts, syntax, glossary, errors..."
                        autoFocus
                    />
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            background: "transparent",
                            border: "none",
                            color: vars.colour.dim,
                            cursor: "pointer",
                            padding: "0.75rem",
                        }}
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className={searchResults}>
                    <SearchView
                        onOpenLesson={(id) => {
                            onOpenLesson(id);
                            onClose();
                        }}
                        onOpenConcept={(id) => {
                            onOpenConcept(id);
                            onClose();
                        }}
                        onOpenSyntax={(topic) => {
                            onOpenSyntax(topic);
                            onClose();
                        }}
                        onOpenGlossary={(id) => {
                            onOpenGlossary(id);
                            onClose();
                        }}
                        onOpenError={(id) => {
                            onOpenError(id);
                            onClose();
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
