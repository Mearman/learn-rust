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
    tocLayout,
    tocContent,
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
import { useViewedLessons } from "./learn/useViewedLessons.ts";
import { LearnView } from "./learn/LearnView.tsx";
import { ChallengeView } from "./challenge/ChallengeView.tsx";
import { challengeReducer } from "./challenge/challengeReducer.ts";
import {
    loadChallengeScore,
    useChallengeScore,
} from "./challenge/useChallengeScore.ts";
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
import { ThemeToggle } from "./theme/ThemeToggle.tsx";
import { useThemeMode } from "./theme/useThemeMode.ts";
import {
    useActiveSection,
    scrollToSection,
    type SectionId,
} from "./layout/useActiveSection.ts";
import { getSubSections } from "./layout/subSections.ts";
import { useActiveSubSection } from "./layout/useActiveSubSection.ts";
import { SubSectionToc } from "./layout/SubSectionToc.tsx";
import {
    useScrollNavigation,
    useHashNavigation,
} from "./layout/useScrollNavigation.ts";

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

export function App() {
    const activeSection = useActiveSection();
    const [showSearch, setShowSearch] = useState(false);

    const subSections = getSubSections(activeSection);
    const subIds = subSections.map((s) => s.id);
    const activeSub = useActiveSubSection(subIds);

    const [viewed, markViewed] = useViewedLessons();
    const {
        compiling,
        result: compileResult,
        compile,
        clear: clearCompile,
    } = useCompiler();
    const [profile, setProfile] = useUserProfile();
    const { mode: themeMode, setMode: setThemeMode } = useThemeMode();

    const saveScore = useChallengeScore();
    const [challenge, setChallenge] = useState<ChallengeState>(() => {
        const { correct, total } = loadChallengeScore();
        return { index: 0, answered: false, guess: null, correct, total };
    });

    const dispatch = useCallback(
        (action: ChallengeAction) => {
            setChallenge((s) => {
                const next = challengeReducer(
                    s,
                    action,
                    getFilteredChallenges(profile)
                );
                // Persist only the cumulative score; per-session fields
                // (index, answered, guess) reset on the next load.
                saveScore(next.correct, next.total);
                return next;
            });
        },
        [profile, saveScore]
    );

    const {
        openLesson,
        openConcept,
        openSyntax,
        openGlossary,
        openError,
        scrollToSubSection,
    } = useScrollNavigation(markViewed);

    // Scroll to the fragment from the initial URL on first mount.
    useHashNavigation();

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

                <div className={tocLayout}>
                    <SubSectionToc
                        items={subSections}
                        activeId={activeSub}
                        onSelect={scrollToSubSection}
                    />
                    <div className={tocContent}>
                        <section id="learn" className={contentSection}>
                            <h2 className={sectionHeading}>Learn</h2>
                            <LearnView
                                viewed={viewed}
                                profile={profile}
                                compiling={compiling}
                                compileResult={compileResult}
                                onCompile={compile}
                                onClearCompile={clearCompile}
                                onOpenReference={openConcept}
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
                                onOpenLesson={openLesson}
                                onOpenConcept={openConcept}
                            />
                        </section>

                        <section id="compare" className={contentSection}>
                            <h2 className={sectionHeading}>Compare</h2>
                            <ComparisonView
                                profile={profile}
                                onOpenLesson={openLesson}
                            />
                        </section>

                        <section id="syntax" className={contentSection}>
                            <h2 className={sectionHeading}>Syntax</h2>
                            <SyntaxView profile={profile} />
                        </section>

                        <section id="glossary" className={contentSection}>
                            <h2 className={sectionHeading}>Glossary</h2>
                            <GlossaryView onOpenConcept={openConcept} />
                        </section>

                        <section id="errors" className={contentSection}>
                            <h2 className={sectionHeading}>Errors</h2>
                            <ErrorCatalogueView onOpenConcept={openConcept} />
                        </section>

                        <section id="cheatsheet" className={contentSection}>
                            <h2 className={sectionHeading}>Cheatsheet</h2>
                            <CheatsheetView
                                onOpenReferences={() => {
                                    scrollToSection("compare");
                                }}
                                onOpenConcept={openConcept}
                            />
                        </section>
                    </div>
                </div>

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
                        openLesson(id);
                        setShowSearch(false);
                    }}
                    onOpenConcept={(id) => {
                        openConcept(id);
                        setShowSearch(false);
                    }}
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
