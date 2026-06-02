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
    X,
    ScanSearch,
    type LucideIcon,
} from "lucide-react";
import { vars } from "./theme/theme.css.ts";
import {
    shell,
    shellInner,
    stickyNav,
    stickyPinned,
    tabButton,
    tabButtonActive,
    tabButtonLabel,
    contentSection,
    tocLayout,
    tocContent,
    sectionHeading,
    footer,
    searchOverlay,
    searchPanel,
    searchInput,
    searchResults,
    searchHeaderBar,
    searchCloseButton,
} from "./theme/styles.css.ts";
import { LESSONS } from "./learn/lessons.ts";
import { useViewedLessons } from "./learn/useViewedLessons.ts";
import { LearnView } from "./learn/LearnView.tsx";
import { ChallengeView } from "./challenge/ChallengeView.tsx";
import { challengeReducer } from "./challenge/challengeReducer.ts";
import {
    loadChallengeAnswers,
    useChallengeAnswers,
} from "./challenge/useChallengeAnswers.ts";
import { useSpacedRepetition } from "./challenge/useSpacedRepetition.ts";
import type {
    ChallengeState,
    ChallengeAction,
} from "./challenge/challengeReducer.ts";
import { getFilteredChallenges } from "./challenge/challenges.ts";
import { CheatsheetView } from "./cheatsheet/CheatsheetView.tsx";
import { useCompiler } from "./compiler/useCompiler.ts";
import { MorphingTailoring } from "./settings/MorphingTailoring.tsx";
import { useUserProfile } from "./settings/useUserProfile.ts";
import { ComparisonView } from "./references/ComparisonView.tsx";
import { SyntaxView } from "./references/SyntaxView.tsx";
import { GlossaryView } from "./references/GlossaryView.tsx";
import { ErrorCatalogueView } from "./references/ErrorCatalogueView.tsx";
import { CompilerErrorsView } from "./references/CompilerErrorsView.tsx";
import { ProgressionView } from "./references/ProgressionView.tsx";
import { SearchView } from "./references/SearchView.tsx";
import { buildSearchResults } from "./references/searchResults.ts";
import { useThemeMode } from "./theme/useThemeMode.ts";
import {
    useActiveSection,
    scrollToSection,
    type SectionId,
} from "./layout/useActiveSection.ts";
import { getSectionGroups, resolveActiveHash } from "./layout/subSections.ts";
import { useActiveSubSection } from "./layout/useActiveSubSection.ts";
import { useActiveHash } from "./layout/useActiveHash.ts";
import { SubSectionToc } from "./layout/SubSectionToc.tsx";
import {
    useScrollNavigation,
    useHashNavigation,
} from "./layout/useScrollNavigation.ts";
import { useHasBeenVisible } from "./layout/useHasBeenVisible.ts";
import { useBodyScrollLock } from "./layout/useBodyScrollLock.ts";
import { useHeaderMorph } from "./layout/useHeaderMorph.ts";
import { ErrorBoundary } from "./layout/ErrorBoundary.tsx";

/** Section icons in canonical order — labels come from SECTION_META in
 *  subSections.ts so they never drift from the TOC tree. */
const SECTION_ICONS: Record<SectionId, LucideIcon> = {
    learn: BookOpen,
    challenge: ListChecks,
    path: GitBranch,
    compare: ArrowLeftRight,
    syntax: Braces,
    glossary: BookOpen,
    errors: AlertTriangle,
    "reading-errors": ScanSearch,
    cheatsheet: Code2,
};

const SECTION_GROUPS = getSectionGroups();

export function App() {
    const activeSection = useActiveSection();
    const [showSearch, setShowSearch] = useState(false);

    const [viewed, markViewed] = useViewedLessons();
    const {
        compiling,
        result: compileResult,
        blockId: compileBlockId,
        compile,
        clear: clearCompile,
    } = useCompiler();
    const [profile, setProfile] = useUserProfile();
    const { mode: themeMode, setMode: setThemeMode } = useThemeMode();
    const { containerRef, panelRef } = useHeaderMorph();

    const saveAnswers = useChallengeAnswers();
    const [challenge, setChallenge] = useState<ChallengeState>(() => ({
        answers: loadChallengeAnswers(),
    }));
    const { store: reviewStore, recordReview } = useSpacedRepetition();

    const dispatch = useCallback(
        (action: ChallengeAction) => {
            setChallenge((s) => {
                const next = challengeReducer(s, action);
                saveAnswers(next.answers);
                return next;
            });
        },
        [saveAnswers]
    );

    const filteredChallenges = useMemo(
        () => getFilteredChallenges(profile),
        [profile]
    );

    // Running score across the profile-filtered challenges, derived from the
    // per-challenge answers map.
    const challengeScore = useMemo(() => {
        let correct = 0;
        let total = 0;
        for (const c of filteredChallenges) {
            const g = challenge.answers[c.id];
            if (g !== undefined) {
                total += 1;
                if (g === c.compiles) correct += 1;
            }
        }
        return { correct, total };
    }, [filteredChallenges, challenge.answers]);

    // Inject the profile-filtered challenge entries into the TOC tree, numbered
    // by display position to match the rendered stack. Recomputed only when the
    // filtered set changes, so useActiveSubSection sees a stable id array.
    const sectionGroups = useMemo(() => {
        const challengeSubs = filteredChallenges.map((c, i) => ({
            id: c.id,
            label: `${String(i + 1)}. ${c.topic}`,
        }));
        return SECTION_GROUPS.map((g) =>
            g.id === "challenge" ? { ...g, subSections: challengeSubs } : g
        );
    }, [filteredChallenges]);

    const allSubIds = useMemo(
        () => sectionGroups.flatMap((g) => g.subSections.map((s) => s.id)),
        [sectionGroups]
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

    // Observe all sub-section IDs across all sections so the active entry
    // highlights correctly wherever the user has scrolled — not just within
    // the currently-active top-level section.
    //
    // mountVersion bumps when a deferred section mounts so the hook re-runs
    // its effect and attaches observers to elements that are now in the DOM.
    const activeSub = useActiveSubSection(
        allSubIds,
        Number(compareMounted) + Number(syntaxMounted) * 2
    );

    // Reflect the active section / sub-section in the URL hash as the reader
    // scrolls, so the address bar is always shareable and bookmarkable.
    useActiveHash(resolveActiveHash(sectionGroups, activeSection, activeSub));

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

    // Lock background scroll while the search overlay is open.
    useBodyScrollLock(showSearch);

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
            <div className={shellInner} ref={containerRef}>
                <div className={stickyPinned}>
                    <div ref={panelRef}>
                        <MorphingTailoring
                            profile={profile}
                            setProfile={setProfile}
                            viewedCount={viewed.size}
                            lessonCount={LESSONS.length}
                            challengeScore={challengeScore}
                            themeMode={themeMode}
                            setThemeMode={setThemeMode}
                        />
                    </div>
                    <nav className={stickyNav}>
                        {SECTION_GROUPS.map((s) => {
                            const Icon = SECTION_ICONS[s.id];
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
                                    <Icon size={15} aria-hidden="true" />
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
                            <Search size={15} aria-hidden="true" />
                            <span className={tabButtonLabel}>Search</span>
                        </button>
                    </nav>
                </div>

                <div className={tocLayout}>
                    <SubSectionToc
                        groups={sectionGroups}
                        activeSection={activeSection}
                        activeId={activeSub}
                        onSelectEntry={scrollToSubSection}
                        onSelectSection={scrollToSection}
                    />
                    <div className={tocContent}>
                        <section id="learn" className={contentSection}>
                            <h2 className={sectionHeading}>Learn</h2>
                            <ErrorBoundary section="Learn">
                                <LearnView
                                    viewed={viewed}
                                    onMarkViewed={markViewed}
                                    profile={profile}
                                    compiling={compiling}
                                    compileResult={compileResult}
                                    compileBlockId={compileBlockId}
                                    onCompile={compile}
                                    onClearCompile={clearCompile}
                                    onOpenReference={openConcept}
                                    onOpenLesson={openLesson}
                                />
                            </ErrorBoundary>
                        </section>

                        <section id="challenge" className={contentSection}>
                            <h2 className={sectionHeading}>Will it compile?</h2>
                            <ErrorBoundary section="Will it compile?">
                                <ChallengeView
                                    challenges={filteredChallenges}
                                    answers={challenge.answers}
                                    onAnswer={(id, guess) => {
                                        dispatch({
                                            type: "answer",
                                            id,
                                            guess,
                                        });
                                    }}
                                    onReset={() => {
                                        dispatch({ type: "reset" });
                                    }}
                                    profile={profile}
                                    reviewStore={reviewStore}
                                    onRecordReview={recordReview}
                                />
                            </ErrorBoundary>
                        </section>

                        <section id="path" className={contentSection}>
                            <h2 className={sectionHeading}>Learning path</h2>
                            <ErrorBoundary section="Learning path">
                                <ProgressionView
                                    onOpenLesson={openLesson}
                                    onOpenConcept={openConcept}
                                    viewed={viewed}
                                />
                            </ErrorBoundary>
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
                                <ErrorBoundary section="Compare">
                                    <ComparisonView
                                        profile={profile}
                                        onOpenLesson={openLesson}
                                    />
                                </ErrorBoundary>
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
                                <ErrorBoundary section="Syntax">
                                    <SyntaxView profile={profile} />
                                </ErrorBoundary>
                            ) : null}
                        </section>

                        <section id="glossary" className={contentSection}>
                            <h2 className={sectionHeading}>Glossary</h2>
                            <ErrorBoundary section="Glossary">
                                <GlossaryView onOpenConcept={openConcept} />
                            </ErrorBoundary>
                        </section>

                        <section id="errors" className={contentSection}>
                            <h2 className={sectionHeading}>Errors</h2>
                            <ErrorBoundary section="Errors">
                                <ErrorCatalogueView
                                    onOpenConcept={openConcept}
                                />
                            </ErrorBoundary>
                        </section>

                        <section id="reading-errors" className={contentSection}>
                            <h2 className={sectionHeading}>Reading errors</h2>
                            <ErrorBoundary section="Reading errors">
                                <CompilerErrorsView
                                    onOpenConcept={openConcept}
                                />
                            </ErrorBoundary>
                        </section>

                        <section id="cheatsheet" className={contentSection}>
                            <h2 className={sectionHeading}>Cheatsheet</h2>
                            <ErrorBoundary section="Cheatsheet">
                                <CheatsheetView
                                    onOpenReferences={() => {
                                        scrollToSection("compare");
                                    }}
                                    onOpenConcept={openConcept}
                                />
                            </ErrorBoundary>
                        </section>
                    </div>
                </div>

                <footer className={footer}>
                    Snippets are illustrative. Run them for real at{" "}
                    <a
                        href="https://play.rust-lang.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: vars.colour.accent }}
                    >
                        play.rust-lang.org
                    </a>
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
                        aria-expanded={true}
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
                        <X size={18} aria-hidden="true" />
                    </button>
                </div>
                {/* Visually-hidden live region: announces result count to
                    screen readers without disrupting keyboard focus. */}
                <div
                    role="status"
                    aria-live="polite"
                    style={{
                        position: "absolute",
                        width: 1,
                        height: 1,
                        padding: 0,
                        margin: -1,
                        overflow: "hidden",
                        clip: "rect(0,0,0,0)",
                        whiteSpace: "nowrap",
                        borderWidth: 0,
                    }}
                >
                    {query.trim().length >= 2
                        ? `${String(results.length)} result${results.length === 1 ? "" : "s"}`
                        : ""}
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
