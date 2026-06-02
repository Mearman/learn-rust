import {
    lazy,
    Suspense,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import {
    BookOpen,
    Code2,
    ArrowLeftRight,
    AlertTriangle,
    Braces,
    GitBranch,
    ListChecks,
    Search,
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
    skipLink,
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
import { useCompiler } from "./compiler/useCompiler.ts";
import { MorphingTailoring } from "./settings/MorphingTailoring.tsx";
import { useUserProfile } from "./settings/useUserProfile.ts";
import { GlossaryView } from "./references/GlossaryView.tsx";
import { ErrorCatalogueView } from "./references/ErrorCatalogueView.tsx";
import { useThemeMode } from "./theme/useThemeMode.ts";
import {
    useActiveSection,
    scrollToSection,
} from "./layout/useActiveSection.ts";
import { getSectionGroups, resolveActiveHash } from "./layout/subSections.ts";
import type { SectionId } from "./layout/subSections.ts";
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

// Below-the-fold views are code-split: each pulls in heavy data modules
// (concepts, languages, syntax references, errors, …) that the reader does not
// need until they scroll to — or navigate into — that section. `lazy` defers
// fetching the chunk until the view first renders, which composes with the
// useHasBeenVisible lazy-MOUNT for Compare/Syntax (mount triggers the fetch)
// and with the force-mount navigation path (scrollToId retries across frames
// until the chunk's DOM lands). The modules use named exports, so each is
// adapted to the default export `lazy` expects.
const ComparisonView = lazy(() =>
    import("./references/ComparisonView.tsx").then((m) => ({
        default: m.ComparisonView,
    }))
);
const SyntaxView = lazy(() =>
    import("./references/SyntaxView.tsx").then((m) => ({
        default: m.SyntaxView,
    }))
);
const CompilerErrorsView = lazy(() =>
    import("./references/CompilerErrorsView.tsx").then((m) => ({
        default: m.CompilerErrorsView,
    }))
);
const ProgressionView = lazy(() =>
    import("./references/ProgressionView.tsx").then((m) => ({
        default: m.ProgressionView,
    }))
);
const CheatsheetView = lazy(() =>
    import("./cheatsheet/CheatsheetView.tsx").then((m) => ({
        default: m.CheatsheetView,
    }))
);
// The search overlay is only reachable via the Cmd/Ctrl+K shortcut, so the
// whole feature — the overlay UI, the result list view, and the search-index
// builder that pulls in every data module — should not load until it opens.
const SearchOverlay = lazy(() =>
    import("./references/SearchOverlay.tsx").then((m) => ({
        default: m.SearchOverlay,
    }))
);

/**
 * Placeholder shown while a code-split section view's chunk loads. Kept to a
 * single full-width line of muted text: no fixed widths (so it cannot trigger
 * the horizontal-overflow regression the responsive test guards) and no
 * spinner (a section that loads in a frame or two should not flash one).
 */
const sectionFallback = (
    <p style={{ color: vars.colour.faint, fontSize: "0.9rem" }}>Loading…</p>
);

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

    // Warm the code-split view chunks once the page is idle. The whole app is
    // one long scroll, so a chunk that loads while the reader scrolls towards
    // its section flashes a fallback and shifts layout under them; prefetching
    // keeps the initial bundle small while making navigation immediate. The
    // search overlay is deliberately excluded — it stays on-demand (Cmd/Ctrl+K).
    useEffect(() => {
        const prefetch = (): void => {
            void import("./references/ComparisonView.tsx");
            void import("./references/SyntaxView.tsx");
            void import("./references/CompilerErrorsView.tsx");
            void import("./references/ProgressionView.tsx");
            void import("./cheatsheet/CheatsheetView.tsx");
        };
        const handle = window.requestIdleCallback(prefetch);
        return () => {
            window.cancelIdleCallback(handle);
        };
    }, []);

    return (
        <div className={shell}>
            <a href="#main-content" className={skipLink}>
                Skip to content
            </a>
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
                                    aria-label={s.label}
                                    aria-current={on ? "true" : undefined}
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
                    <main id="main-content" className={tocContent}>
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
                                <Suspense fallback={sectionFallback}>
                                    <ProgressionView
                                        onOpenLesson={openLesson}
                                        onOpenConcept={openConcept}
                                        viewed={viewed}
                                    />
                                </Suspense>
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
                                    <Suspense fallback={sectionFallback}>
                                        <ComparisonView
                                            profile={profile}
                                            onOpenLesson={openLesson}
                                        />
                                    </Suspense>
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
                                    <Suspense fallback={sectionFallback}>
                                        <SyntaxView profile={profile} />
                                    </Suspense>
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
                                <Suspense fallback={sectionFallback}>
                                    <CompilerErrorsView
                                        onOpenConcept={openConcept}
                                    />
                                </Suspense>
                            </ErrorBoundary>
                        </section>

                        <section id="cheatsheet" className={contentSection}>
                            <h2 className={sectionHeading}>Cheatsheet</h2>
                            <ErrorBoundary section="Cheatsheet">
                                <Suspense fallback={sectionFallback}>
                                    <CheatsheetView
                                        onOpenReferences={() => {
                                            scrollToSection("compare");
                                        }}
                                        onOpenConcept={openConcept}
                                    />
                                </Suspense>
                            </ErrorBoundary>
                        </section>
                    </main>
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
                // No visible fallback: the overlay chunk is tiny and loads in a
                // frame or two, and flashing a spinner over the dimmed page
                // reads as jank. An empty fallback keeps the dim backdrop until
                // the panel is ready.
                <Suspense fallback={null}>
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
                </Suspense>
            ) : null}
        </div>
    );
}
