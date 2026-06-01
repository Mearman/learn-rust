import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    searchHeaderBar,
    searchCloseButton,
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
import { buildSearchResults } from "./references/searchResults.ts";
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
import { useHasBeenVisible } from "./layout/useHasBeenVisible.ts";

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

    // Lazy-mount controls for the two heaviest sections.
    const {
        mounted: compareMounted,
        sentinelRef: compareSentinelRef,
        forceMount: forceCompareMount,
    } = useHasBeenVisible();
    const {
        mounted: syntaxMounted,
        sentinelRef: syntaxSentinelRef,
        forceMount: forceSyntaxMount,
    } = useHasBeenVisible();

    const sectionMounts = useMemo(
        () => ({
            compare: forceCompareMount,
            syntax: forceSyntaxMount,
        }),
        [forceCompareMount, forceSyntaxMount]
    );

    const {
        openLesson,
        openConcept,
        openSyntax,
        openGlossary,
        openError,
        scrollToSubSection,
    } = useScrollNavigation(markViewed, sectionMounts);

    // Scroll to the fragment from the initial URL on first mount.
    useHashNavigation(sectionMounts);

    // Global Cmd/Ctrl+K shortcut to open search overlay.
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                // Don't intercept when an input/textarea other than our
                // own search input already has focus.
                const tag = document.activeElement?.tagName.toLowerCase();
                if (tag === "input" || tag === "textarea") return;
                e.preventDefault();
                setShowSearch(true);
            }
        };
        window.addEventListener("keydown", handler);
        return () => {
            window.removeEventListener("keydown", handler);
        };
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
                        aria-label="Open search (Cmd+K)"
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
                            {/*
                             * Sentinel watched by useHasBeenVisible. When it
                             * nears the viewport the ComparisonView mounts.
                             * forceCompareMount() is called before any
                             * programmatic navigation to concept-* IDs so the
                             * target element exists before scrollIntoView runs.
                             */}
                            <div ref={compareSentinelRef} />
                            {compareMounted ? (
                                <ComparisonView
                                    profile={profile}
                                    onOpenLesson={openLesson}
                                />
                            ) : null}
                        </section>

                        <section id="syntax" className={contentSection}>
                            <h2 className={sectionHeading}>Syntax</h2>
                            {/*
                             * Same lazy-mount pattern as compare above.
                             * forceSyntaxMount() fires before syntax-*
                             * navigation.
                             */}
                            <div ref={syntaxSentinelRef} />
                            {syntaxMounted ? (
                                <SyntaxView profile={profile} />
                            ) : null}
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
    const [query, setQuery] = useState("");
    const [activeIndex, setActiveIndex] = useState(-1);

    // Ref to the panel so we can trap focus within it.
    const panelRef = useRef<HTMLDivElement>(null);
    // Ref to the search input so we can auto-focus it.
    const inputRef = useRef<HTMLInputElement>(null);

    // Remember which element had focus before the overlay opened so we can
    // restore it on close.
    const priorFocusRef = useRef<Element | null>(
        typeof document !== "undefined" ? document.activeElement : null
    );

    // Build results so we know the total count for keyboard navigation.
    // These are the same handlers passed into SearchView, so the result list
    // is in sync.
    const results = useMemo(
        () =>
            buildSearchResults(query, {
                onOpenLesson,
                onOpenConcept,
                onOpenSyntax,
                onOpenGlossary,
                onOpenError,
            }),
        [
            query,
            onOpenLesson,
            onOpenConcept,
            onOpenSyntax,
            onOpenGlossary,
            onOpenError,
        ]
    );

    // Auto-focus the input when the overlay mounts.
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Restore focus to the previously focused element on unmount.
    useEffect(() => {
        // Capture the ref value at setup time so the cleanup function sees
        // a stable reference (the linter warns about reading .current in
        // cleanup where the value may have changed).
        const prior = priorFocusRef.current;
        return () => {
            if (prior instanceof HTMLElement) {
                prior.focus();
            }
        };
    }, []);

    // Keyboard: Escape closes; ArrowUp/Down moves highlight; Enter activates.
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === "Escape") {
                e.preventDefault();
                onClose();
                return;
            }
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((i) =>
                    results.length === 0
                        ? -1
                        : Math.min(i + 1, results.length - 1)
                );
                return;
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, -1));
                return;
            }
            if (e.key === "Enter" && activeIndex >= 0) {
                e.preventDefault();
                const result = results[activeIndex];
                if (result !== undefined) {
                    result.action();
                }
            }
        },
        [onClose, results, activeIndex]
    );

    // Focus trap: keep focus inside the panel on Tab.
    const handleFocusTrap = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key !== "Tab") return;
            const panel = panelRef.current;
            if (panel === null) return;

            const focusable = Array.from(
                panel.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
                )
            );
            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (first === undefined || last === undefined) return;

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        },
        []
    );

    const handleCombinedKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            handleFocusTrap(e);
            handleKeyDown(e);
        },
        [handleFocusTrap, handleKeyDown]
    );

    // Scroll the active result into view when it changes.
    useEffect(() => {
        if (activeIndex < 0) return;
        const el = document.getElementById(
            `search-result-${String(activeIndex)}`
        );
        el?.scrollIntoView({ block: "nearest" });
    }, [activeIndex]);

    const inputId = "search-overlay-input";

    return (
        <div
            className={searchOverlay}
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            onKeyDown={handleCombinedKeyDown}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className={searchPanel} ref={panelRef}>
                <div className={searchHeaderBar}>
                    <Search
                        size={18}
                        style={{
                            marginLeft: "1rem",
                            color: vars.colour.faint,
                            flexShrink: 0,
                        }}
                        aria-hidden="true"
                    />
                    <input
                        ref={inputRef}
                        id={inputId}
                        type="text"
                        role="combobox"
                        aria-expanded={results.length > 0}
                        aria-controls="search-results-listbox"
                        aria-autocomplete="list"
                        aria-activedescendant={
                            activeIndex >= 0
                                ? `search-result-${String(activeIndex)}`
                                : undefined
                        }
                        className={searchInput}
                        placeholder="Search lessons, concepts, syntax, glossary, errors..."
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            // Reset keyboard selection whenever the query changes.
                            setActiveIndex(-1);
                        }}
                    />
                    <button
                        type="button"
                        onClick={onClose}
                        className={searchCloseButton}
                        aria-label="Close search"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div
                    id="search-results-listbox"
                    role="listbox"
                    aria-label="Search results"
                    className={searchResults}
                >
                    <SearchView
                        query={query}
                        activeIndex={activeIndex}
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
