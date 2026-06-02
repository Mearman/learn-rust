import { style, globalStyle, keyframes } from "@vanilla-extract/css";
import { vars } from "./theme.css.js";

// ---------------------------------------------------------------------------
// Breakpoints
// ---------------------------------------------------------------------------

const sm = "screen and (min-width: 640px)";
const md = "screen and (min-width: 768px)";
const lg = "screen and (min-width: 1024px)";
const xl = "screen and (min-width: 1280px)";

// ---------------------------------------------------------------------------
// Global base
// ---------------------------------------------------------------------------

globalStyle("*, *::before, *::after", {
    boxSizing: "border-box",
});

globalStyle("body", {
    margin: 0,
    minHeight: "100vh",
});

globalStyle("html", {
    scrollPaddingTop: "120px",
    // The tailoring panel condenses with scroll, which moves the content below
    // it. The browser's default scroll anchoring fights that by nudging the
    // scroll position to keep content still, which feeds back into the
    // scroll-driven morph and makes it jitter. Disable anchoring on the scroll
    // root so the condense moves content freely. (Deferred sections mount below
    // the viewport, so nothing relies on anchoring to hold position.)
    overflowAnchor: "none",
    "@media": { [md]: { scrollPaddingTop: "88px" } },
});

// Keyboard focus outline using the accent token so it adapts to both themes.
globalStyle(":focus-visible", {
    outline: `2px solid ${vars.colour.accent}`,
    outlineOffset: "2px",
});

// Spinner used by the compiler loading indicator.
// The keyframes are defined here and gated behind the reduced-motion media
// query so the animation is suppressed for users who prefer reduced motion.
const spinFrames = keyframes({
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" },
});

export const spin = style({
    "@media": {
        "not (prefers-reduced-motion: reduce)": {
            animation: `${spinFrames} 1s linear infinite`,
        },
    },
});

// Fade-in-out keyframe used by the tailoring-saved badge.
const fadeInOutFrames = keyframes({
    "0%": { opacity: 0 },
    "15%": { opacity: 1 },
    "70%": { opacity: 1 },
    "100%": { opacity: 0 },
});

/** Transient "✓ Applied" badge shown after a tailoring change. */
export const savedBadge = style({
    fontSize: "0.625rem",
    fontFamily: "ui-monospace, monospace",
    fontWeight: 600,
    color: vars.colour.good,
    whiteSpace: "nowrap",
    flexShrink: 0,
    "@media": {
        "not (prefers-reduced-motion: reduce)": {
            animation: `${fadeInOutFrames} 2s ease-in-out forwards`,
        },
    },
});

// ---------------------------------------------------------------------------
// CodeBlock
// ---------------------------------------------------------------------------

export const codeBlock = style({
    borderRadius: "0.5rem",
    overflow: "hidden",
    border: `1px solid ${vars.colour.border}`,
    background: vars.colour.code,
});

export const codeHeader = style({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.375rem 0.75rem",
    fontSize: "0.75rem",
    fontFamily: "ui-monospace, monospace",
    borderBottom: `1px solid ${vars.colour.borderSoft}`,
    color: vars.colour.faint,
});

export const codeDot = style({
    width: 9,
    height: 9,
    borderRadius: 9,
    background: vars.colour.borderSoft,
});

export const codePre = style({
    padding: "1rem",
    overflowX: "auto",
    lineHeight: 1.625,
    margin: 0,
    fontSize: 12,
    "@media": { [md]: { fontSize: 13 } },
});

export const tokenCommentOrLifetime = style({
    fontStyle: "italic",
});

// ---------------------------------------------------------------------------
// Block
// ---------------------------------------------------------------------------

export const noteBlock = style({
    borderRadius: "0.5rem",
    padding: "0.75rem",
    fontSize: "0.875rem",
    lineHeight: 1.625,
    display: "flex",
    gap: "0.625rem",
    background: vars.colour.panel2,
    border: `1px solid ${vars.colour.borderSoft}`,
    color: vars.colour.dim,
});

export const analogyBlock = style({
    borderRadius: "0.5rem",
    padding: "0.75rem",
    fontSize: "0.875rem",
    lineHeight: 1.625,
    borderLeft: `3px solid ${vars.colour.accentDim}`,
    background: "transparent",
    color: vars.colour.dim,
});

export const textBlock = style({
    lineHeight: 1.625,
    margin: 0,
    color: vars.colour.text,
    fontSize: 15,
});

// ---------------------------------------------------------------------------
// Learn grid (sidebar + content)
// ---------------------------------------------------------------------------

export const learnGrid = style({
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "1.25rem",
    "@media": {
        [md]: { gridTemplateColumns: "220px minmax(0, 1fr)" },
        [lg]: { gridTemplateColumns: "260px minmax(0, 1fr)" },
        [xl]: { gridTemplateColumns: "280px minmax(0, 1fr)" },
    },
});

export const lessonTitle = style({
    fontSize: "1.5rem",
    fontWeight: 700,
    margin: 0,
    color: vars.colour.text,
});

export const lessonTagline = style({
    fontSize: "0.875rem",
    margin: 0,
    color: vars.colour.accentSoft,
});

// ---------------------------------------------------------------------------
// Nav buttons (lesson sidebar, comparison sidebar, etc.)
// ---------------------------------------------------------------------------

export const navButton = style({
    display: "flex",
    alignItems: "center",
    gap: "0.625rem",
    borderRadius: "0.5rem",
    padding: "0.625rem 0.75rem",
    textAlign: "left",
    fontSize: "0.875rem",
    transition: "color 0.15s",
    background: "transparent",
    color: vars.colour.dim,
    border: "1px solid transparent",
    cursor: "pointer",
    width: "100%",
    minWidth: 0,
    overflow: "hidden",
    selectors: {
        "&:hover": {
            color: vars.colour.text,
        },
    },
});

export const navButtonActive = style({
    background: vars.colour.accentDim,
    color: vars.colour.text,
    border: `1px solid ${vars.colour.accent}`,
});

// ---------------------------------------------------------------------------
// ChallengeView
// ---------------------------------------------------------------------------

export const challengeResult = style({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    gap: "1rem",
    padding: "3rem 0",
});

export const answerGrid = style({
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.75rem",
});

export const answerButton = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    borderRadius: "0.5rem",
    padding: "0.75rem",
    fontSize: "0.875rem",
    fontWeight: 600,
    transition: "color 0.15s",
    background: vars.colour.panel2,
    border: `1px solid ${vars.colour.border}`,
    cursor: "pointer",
    minWidth: 0,
});

export const feedbackBox = style({
    borderRadius: "0.5rem",
    padding: "0.875rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
});

export const feedbackCorrect = style({
    background: vars.colour.goodDim,
    border: `1px solid ${vars.colour.good}`,
});

export const feedbackIncorrect = style({
    background: vars.colour.badDim,
    border: `1px solid ${vars.colour.bad}`,
});

export const nextButton = style({
    alignSelf: "flex-end",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    borderRadius: "0.5rem",
    padding: "0.625rem 1rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    transition: "background 0.15s",
    background: vars.colour.accent,
    color: vars.colour.accentText,
    border: "none",
    cursor: "pointer",
});

// ---------------------------------------------------------------------------
// Cheatsheet
// ---------------------------------------------------------------------------

export const cheatsGrid = style({
    display: "grid",
    gap: "1rem",
    gridTemplateColumns: "1fr",
});

export const cheatCard = style({
    borderRadius: "0.5rem",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    background: vars.colour.panel2,
    border: `1px solid ${vars.colour.border}`,
});

export const cheatTitle = style({
    fontSize: "0.875rem",
    fontWeight: 600,
    margin: 0,
    color: vars.colour.accentSoft,
});

// ---------------------------------------------------------------------------
// Reference list grid (glossary, errors)
// ---------------------------------------------------------------------------

export const referenceListGrid = style({
    display: "grid",
    gap: "1rem",
    gridTemplateColumns: "1fr",
});

/** Vertical stack of "Will it compile?" challenge cards. */
export const challengeStack = style({
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
});

/** A single challenge card; anchored as a sidebar sub-section. */
export const challengeCard = style({
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "1.25rem",
    borderRadius: "0.75rem",
    border: `1px solid ${vars.colour.border}`,
    background: vars.colour.panel,
    // Keep the anchored card clear of the sticky nav when scrolled to.
    scrollMarginTop: "5rem",
});

/** Answered/correct tally and reset control above the challenge stack. */
export const challengeSummary = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    flexWrap: "wrap",
});

// ---------------------------------------------------------------------------
// App shell
// ---------------------------------------------------------------------------

export const shell = style({
    width: "100%",
    minHeight: "100vh",
    background: vars.colour.bg,
    color: vars.colour.text,
    fontFamily: "system-ui, -apple-system, sans-serif",
});

export const shellInner = style({
    maxWidth: "100%",
    margin: "0 auto",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    "@media": {
        [sm]: { paddingLeft: "1.5rem", paddingRight: "1.5rem" },
        [lg]: { maxWidth: "72rem" },
        [xl]: { maxWidth: "80rem" },
    },
});

// ---------------------------------------------------------------------------
// Section headings
// ---------------------------------------------------------------------------

export const sectionHeading = style({
    fontSize: "1.25rem",
    fontWeight: 700,
    margin: 0,
    color: vars.colour.text,
    paddingBottom: "0.5rem",
    borderBottom: `1px solid ${vars.colour.border}`,
    "@media": {
        [sm]: { fontSize: "1.375rem" },
    },
});

// ---------------------------------------------------------------------------
// Sticky pinned wrapper (compact strip + section nav together)
// ---------------------------------------------------------------------------

/** Outer sticky container that keeps both the tailoring strip and the section
 *  nav pinned as a unit at the top of the viewport.
 *
 *  No flex `gap` here: the spacing between the strip and the nav is supplied by
 *  `morphStripCollapse`'s morph-scaled `marginBottom`, so the gap collapses to
 *  zero along with the strip at the top of the page (no phantom space above the
 *  nav while the strip is hidden). */
export const stickyPinned = style({
    position: "sticky",
    top: 0,
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
});

// ---------------------------------------------------------------------------
// Scroll-linked tailoring panel morph (one element, two forms)
//
// `useHeaderMorph` writes a `--morph` custom property (0 at the top of the
// page, 1 once the panel's expanded height has been scrolled past) onto the
// shell container. The *same* tailoring elements — title, the three controls,
// their labels — read that property and transform between an expanded card and
// a compact strip: font sizes, padding and gaps interpolate, and the
// expanded-only parts (subtitle, stats, theme toggle, per-field help) collapse
// to nothing. Nothing is rendered twice; there is no separate strip to fade in.
//
// No CSS `transition` is used: the value updates every animation frame, so a
// transition would smear the motion against the scroll instead of tracking it.
// The panel sits in the sticky bar, so as it condenses the bar shrinks and the
// content below rises to meet it — a deliberate condense, scaled gently by
// tying the scroll distance to the panel's full height.
// ---------------------------------------------------------------------------

/** The morphing tailoring panel: a card when expanded, a slim strip when
 *  condensed. Padding, gap and corner radius interpolate with `--morph`. */
export const morphPanel = style({
    display: "flex",
    flexDirection: "column",
    gap: "calc(0.875rem - var(--morph, 0) * 0.625rem)",
    padding:
        "calc(0.875rem - var(--morph, 0) * 0.5rem)" +
        " calc(1rem - var(--morph, 0) * 0.375rem)",
    borderRadius: "calc(0.875rem - var(--morph, 0) * 0.25rem)",
    background: vars.colour.panel2,
    border: `1px solid ${vars.colour.border}`,
    backdropFilter: "blur(8px)",
    willChange: "gap, padding",
});

/** Top row: title block on the left, meta (progress + theme) on the right,
 *  justified to the full width so the title never sits in front of dead space. */
export const morphTopRow = style({
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "0.5rem 1.5rem",
});

/** Title column: the always-present title plus the collapsing subtitle. */
export const morphTitleCol = style({
    display: "flex",
    flexDirection: "column",
    gap: "calc(0.25rem - var(--morph, 0) * 0.25rem)",
    minWidth: 0,
});

/** Page title — present in both forms; its font size shrinks from heading to
 *  strip-label scale. A real font-size change (not a transform) so it keeps the
 *  surrounding layout honest as it condenses. */
export const morphPanelTitle = style({
    margin: 0,
    fontWeight: 700,
    letterSpacing: "-0.02em",
    lineHeight: 1.1,
    whiteSpace: "nowrap",
    color: vars.colour.text,
    fontSize: "calc(1.875rem - var(--morph, 0) * 1.0625rem)",
    willChange: "font-size",
});

/** Subtitle: expanded-only, collapses to zero height and fades on condense. */
export const morphSubtitle = style({
    margin: 0,
    overflow: "hidden",
    fontSize: "0.875rem",
    color: vars.colour.faint,
    maxHeight: "calc((1 - var(--morph, 0)) * 2.5rem)",
    opacity: "calc(1 - var(--morph, 0) * 1.8)",
    willChange: "max-height, opacity",
});

/** Meta cluster (progress stats + theme toggle): sits top-right in both forms.
 *  It stays visible when condensed — only its internal spacing tightens and the
 *  theme toggle sheds its label (see `morphThemeToggle`/`morphThemeLabel`). */
export const morphMeta = style({
    display: "flex",
    alignItems: "center",
    gap: "calc(1rem - var(--morph, 0) * 0.4rem)",
    flexWrap: "wrap",
    flexShrink: 0,
});

/** Theme toggle wrapper: label above the control when expanded, label collapsed
 *  away when condensed so the toggle sits inline with the progress stats. */
export const morphThemeToggle = style({
    display: "flex",
    flexDirection: "column",
    gap: "calc(0.25rem - var(--morph, 0) * 0.25rem)",
});

/** The "Theme" label above the toggle: expanded-only, collapses on condense. */
export const morphThemeLabel = style({
    fontSize: "0.6875rem",
    fontFamily: "ui-monospace, monospace",
    color: vars.colour.accentSoft,
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    overflow: "hidden",
    maxHeight: "calc((1 - var(--morph, 0)) * 1.25rem)",
    opacity: "calc(1 - var(--morph, 0) * 2)",
    willChange: "max-height, opacity",
});

/** Control grid: an even, responsive set of columns that tighten as the panel
 *  condenses. `auto-fit` keeps the columns balanced rather than wrapping
 *  unevenly the way a flex row does. */
export const morphFields = style({
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(13rem, 1fr))",
    alignItems: "start",
    gap: "calc(0.875rem - var(--morph, 0) * 0.5rem)",
});

/** A single control field: label, control, and collapsing help. */
export const morphField = style({
    display: "flex",
    flexDirection: "column",
    gap: "calc(0.375rem - var(--morph, 0) * 0.2rem)",
    minWidth: 0,
});

/** Field label — present in both forms, shrinks slightly when condensed. */
export const morphFieldLabel = style({
    fontFamily: "ui-monospace, monospace",
    color: vars.colour.accentSoft,
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    whiteSpace: "nowrap",
    fontSize: "calc(0.6875rem - var(--morph, 0) * 0.0625rem)",
});

/** Per-field help text: expanded-only, collapses as the panel condenses. */
export const morphFieldHelp = style({
    overflow: "hidden",
    maxHeight: "calc((1 - var(--morph, 0)) * 3rem)",
    opacity: "calc(1 - var(--morph, 0) * 1.6)",
    fontSize: "0.75rem",
    lineHeight: 1.5,
    color: vars.colour.dim,
    willChange: "max-height, opacity",
});

// ---------------------------------------------------------------------------
// Sticky section nav
// ---------------------------------------------------------------------------

export const stickyNav = style({
    display: "flex",
    flexWrap: "wrap",
    gap: "0.25rem",
    padding: "0.5rem",
    borderRadius: "0.75rem",
    background: vars.colour.panel,
    border: `1px solid ${vars.colour.border}`,
    backdropFilter: "blur(8px)",
    "@media": {
        [md]: {
            flexWrap: "nowrap",
            overflowX: "auto",
            padding: "0.25rem",
        },
    },
});

export const tabButton = style({
    display: "flex",
    alignItems: "center",
    gap: "0.375rem",
    borderRadius: "0.5rem",
    padding: "0.5rem 0.625rem",
    fontSize: "0.8125rem",
    fontWeight: 500,
    transition: "background 0.15s, color 0.15s",
    background: "transparent",
    color: vars.colour.dim,
    border: "none",
    cursor: "pointer",
    whiteSpace: "nowrap",
    "@media": {
        [md]: {
            padding: "0.5rem 0.875rem",
            fontSize: "0.875rem",
        },
    },
});

export const tabButtonActive = style({
    background: vars.colour.accent,
    color: vars.colour.accentText,
});

export const tabButtonLabel = style({
    display: "none",
    "@media": { [md]: { display: "inline" } },
});

// ---------------------------------------------------------------------------
// Subsection TOC (sidebar + mobile sheet)
// ---------------------------------------------------------------------------

export const tocSidebar = style({
    display: "none",
    "@media": {
        [lg]: {
            display: "flex",
            flexDirection: "column",
            position: "sticky",
            top: "6rem",
            width: "200px",
            minWidth: "200px",
            maxHeight: "calc(100vh - 7.5rem)",
            overflowY: "auto",
            flexShrink: 0,
            alignSelf: "flex-start",
        },
    },
});

/** Native scroll container for the TOC tree.
 *
 *  Replaces Mantine's `ScrollArea.Autosize`, whose content element is
 *  `display: table; min-width: 100%` and which (in the Autosize variant) also
 *  gets `min-width: min-content`. Together those size the scroll area to the
 *  widest `white-space: nowrap` label, so once an entry's text exceeds the
 *  200px column the area overflows and a horizontal scrollbar appears. A plain
 *  block scroller fills the column width instead, so the labels ellipsis-
 *  truncate as intended. `position: relative` keeps the active-entry
 *  scroll-into-view maths (`button.offsetTop` within this viewport) correct. */
export const tocScroll = style({
    position: "relative",
    overflowY: "auto",
    overflowX: "hidden",
    minWidth: 0,
    scrollbarWidth: "thin",
    scrollbarGutter: "stable",
});

export const tocFab = style({
    position: "fixed",
    bottom: "calc(1.25rem + env(safe-area-inset-bottom))",
    left: "calc(1.25rem + env(safe-area-inset-left))",
    zIndex: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: vars.colour.accent,
    color: vars.colour.panel,
    border: "none",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
    transition: "transform 0.15s",
    selectors: {
        "&:hover": {
            transform: "scale(1.1)",
        },
    },
    "@media": {
        [lg]: {
            display: "none",
        },
    },
});

export const tocSheetBackdrop = style({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: 20,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
});

export const tocSheet = style({
    width: "100%",
    maxWidth: "32rem",
    maxHeight: "70vh",
});

export const tocSheetContent = style({
    background: vars.colour.panel,
    borderRadius: "0.75rem 0.75rem 0 0",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
});

export const tocSheetHeader = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.75rem",
    borderBottom: `1px solid ${vars.colour.border}`,
});

export const tocItem = style({
    display: "block",
    flex: "1 1 auto",
    minWidth: 0,
    textAlign: "left",
    padding: "0.375rem 0.5rem",
    fontSize: "0.8rem",
    lineHeight: 1.4,
    borderRadius: "0.375rem",
    border: "none",
    background: "transparent",
    color: vars.colour.dim,
    cursor: "pointer",
    transition: "background 0.15s, color 0.15s",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    selectors: {
        "&:hover": {
            background: vars.colour.panel2,
            color: vars.colour.text,
        },
    },
});

export const tocItemActive = style({
    background: vars.colour.accentDim,
    color: vars.colour.text,
    fontWeight: 500,
});

/** Section header row in the combined TOC tree. */
export const tocSectionHeader = style({
    display: "flex",
    alignItems: "center",
    gap: "0.375rem",
    width: "100%",
    textAlign: "left",
    padding: "0.375rem 0.5rem",
    fontSize: "0.75rem",
    fontWeight: 600,
    letterSpacing: "0.025em",
    textTransform: "uppercase" as const,
    lineHeight: 1.4,
    borderRadius: "0.375rem",
    border: "none",
    background: "transparent",
    color: vars.colour.dim,
    cursor: "pointer",
    transition: "background 0.15s, color 0.15s",
    selectors: {
        "&:hover": {
            background: vars.colour.panel2,
            color: vars.colour.text,
        },
    },
});

/** Active section header — accent highlight. */
export const tocSectionHeaderActive = style({
    color: vars.colour.accent,
});

/** Caret icon that rotates when the group is expanded. */
export const tocCaret = style({
    flexShrink: 0,
    transition: "transform 0.15s",
});

export const tocCaretOpen = style({
    transform: "rotate(90deg)",
});

/** Entry count badge shown on collapsed groups. */
export const tocCount = style({
    marginLeft: "auto",
    fontSize: "0.7rem",
    color: vars.colour.faint,
    flexShrink: 0,
});

/** Flex column container for the TOC tree root. */
export const tocTree = style({
    display: "flex",
    flexDirection: "column",
    gap: "0.125rem",
});

/** Label span inside a section header — truncates with ellipsis. */
export const tocSectionLabel = style({
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    minWidth: 0,
});

/** Wrapper for the indented entry list inside a group. */
export const tocGroupEntries = style({
    display: "flex",
    flexDirection: "column",
    gap: 0,
    paddingLeft: "0.75rem",
    borderLeft: `1px solid ${vars.colour.border}`,
    marginLeft: "0.625rem",
    marginBottom: "0.25rem",
});

/** Row wrapping an entry's label button and its star toggle. */
export const tocEntryRow = style({
    display: "flex",
    alignItems: "center",
    gap: "0.125rem",
});

/** Star toggle button on an entry row. */
export const tocStarButton = style({
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.25rem",
    border: "none",
    background: "transparent",
    color: vars.colour.faint,
    cursor: "pointer",
    borderRadius: "0.25rem",
    transition: "color 0.15s, background 0.15s",
    selectors: {
        "&:hover": {
            color: vars.colour.accent,
            background: vars.colour.panel2,
        },
    },
});

/** Starred state — filled, accent-coloured star. */
export const tocStarButtonActive = style({
    color: vars.colour.accent,
});

// ---------------------------------------------------------------------------
// Sections
// ---------------------------------------------------------------------------

export const contentSection = style({
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    paddingTop: "0.5rem",
});

export const tocLayout = style({
    display: "flex",
    gap: "1rem",
    alignItems: "flex-start",
});

export const tocContent = style({
    flex: 1,
    minWidth: 0,
});

export const subSection = style({
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    paddingTop: "0.5rem",
    "@media": {
        [md]: {
            paddingTop: "1rem",
        },
    },
});

export const accentLabel = style({
    color: vars.colour.accent,
    fontWeight: 600,
});

// ---------------------------------------------------------------------------
// Comparison grid
// ---------------------------------------------------------------------------

export const comparisonGrid = style({
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "1rem",
});

export const comparisonColumn = style({
    display: "flex",
    flexDirection: "column",
    gap: "0.375rem",
    minWidth: 0,
});

export const comparisonLabel = style({
    fontSize: "0.6875rem",
    fontFamily: "ui-monospace, monospace",
    color: vars.colour.accent,
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
});

export const comparisonNotes = style({
    fontSize: "0.75rem",
    color: vars.colour.dim,
    lineHeight: 1.5,
});

export const comparisonUnavailable = style({
    fontSize: "0.8125rem",
    color: vars.colour.faint,
    fontStyle: "italic",
    padding: "0.75rem 0",
});

// ---------------------------------------------------------------------------
// Deep dive
// ---------------------------------------------------------------------------

export const deepDiveToggle = style({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    width: "100%",
    padding: "0.625rem 0.75rem",
    borderRadius: "0.5rem",
    border: `1px solid ${vars.colour.borderSoft}`,
    background: "transparent",
    color: vars.colour.dim,
    fontSize: "0.8125rem",
    fontWeight: 500,
    cursor: "pointer",
    textAlign: "left" as const,
    transition: "color 0.15s, border-color 0.15s",
    selectors: {
        "&:hover": {
            color: vars.colour.text,
            borderColor: vars.colour.accentDim,
        },
    },
});

export const deepDiveContent = style({
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    paddingTop: "0.75rem",
    paddingLeft: "0.75rem",
    borderLeft: `2px solid ${vars.colour.accentDim}`,
});

// ---------------------------------------------------------------------------
// Compiler output
// ---------------------------------------------------------------------------

export const outputPanel = style({
    borderRadius: "0.5rem",
    overflow: "hidden",
    border: `1px solid ${vars.colour.border}`,
    background: vars.colour.code,
});

export const outputHeader = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.5rem 0.75rem",
    borderBottom: `1px solid ${vars.colour.borderSoft}`,
    fontSize: "0.75rem",
    fontFamily: "ui-monospace, monospace",
    color: vars.colour.faint,
});

export const outputPre = style({
    padding: "0.75rem 1rem",
    margin: 0,
    fontSize: 12,
    fontFamily: "ui-monospace, monospace",
    lineHeight: 1.625,
    overflowX: "auto",
    whiteSpace: "pre-wrap" as const,
    wordBreak: "break-word" as const,
    "@media": { [md]: { fontSize: 13 } },
});

export const runButton = style({
    display: "inline-flex",
    alignItems: "center",
    gap: "0.375rem",
    padding: "0.375rem 0.75rem",
    borderRadius: "0.375rem",
    fontSize: "0.8125rem",
    fontWeight: 500,
    background: vars.colour.accent,
    color: vars.colour.accentText,
    border: "none",
    cursor: "pointer",
    transition: "opacity 0.15s",
    selectors: {
        "&:disabled": {
            opacity: 0.5,
            cursor: "not-allowed",
        },
    },
});

export const clearButton = style({
    display: "inline-flex",
    alignItems: "center",
    gap: "0.375rem",
    padding: "0.375rem 0.75rem",
    borderRadius: "0.375rem",
    fontSize: "0.8125rem",
    fontWeight: 500,
    background: "transparent",
    color: vars.colour.dim,
    border: `1px solid ${vars.colour.border}`,
    cursor: "pointer",
});

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

export const monoSm = style({
    fontSize: "0.75rem",
    fontFamily: "ui-monospace, monospace",
    color: vars.colour.faint,
});

export const dimSm = style({
    fontSize: "0.75rem",
    fontFamily: "ui-monospace, monospace",
    color: vars.colour.dim,
});

export const footer = style({
    textAlign: "center",
    fontSize: "0.75rem",
    color: vars.colour.faint,
    padding: "2rem 0 1rem",
});

// ---------------------------------------------------------------------------
// Search overlay
// ---------------------------------------------------------------------------

export const searchOverlay = style({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0, 0, 0, 0.5)",
    zIndex: 20,
    display: "flex",
    justifyContent: "center",
    padding: "4rem 1rem 1rem",
    "@media": {
        [md]: { padding: "6rem 2rem 2rem" },
    },
});

export const searchPanel = style({
    width: "100%",
    maxWidth: "40rem",
    maxHeight: "100%",
    borderRadius: "0.75rem",
    background: vars.colour.panel,
    border: `1px solid ${vars.colour.border}`,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
});

export const searchInput = style({
    padding: "1rem",
    border: "none",
    outline: "none",
    background: "transparent",
    color: vars.colour.text,
    fontSize: "1rem",
    fontFamily: "inherit",
    borderBottom: `1px solid ${vars.colour.borderSoft}`,
});

export const searchResults = style({
    overflowY: "auto",
    padding: "0.75rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
});

export const searchResultItem = style({
    cursor: "pointer",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
    borderRadius: "0.5rem",
    padding: "0.75rem",
    background: vars.colour.panel2,
    border: `1px solid ${vars.colour.border}`,
    width: "100%",
    transition: "border-color 0.1s, background 0.1s",
    selectors: {
        "&:hover": {
            borderColor: vars.colour.accent,
        },
    },
});

export const searchResultItemActive = style({
    borderColor: vars.colour.accent,
    background: vars.colour.accentDim,
});

export const searchCloseButton = style({
    background: "transparent",
    border: "none",
    color: vars.colour.dim,
    cursor: "pointer",
    padding: "0.75rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    transition: "color 0.15s",
    selectors: {
        "&:hover": {
            color: vars.colour.text,
        },
    },
});

export const searchHeaderBar = style({
    display: "flex",
    alignItems: "center",
    borderBottom: `1px solid ${vars.colour.borderSoft}`,
});

// ---------------------------------------------------------------------------
// Compiler error reading section
// ---------------------------------------------------------------------------

/** Full-width transcript article in the reading-errors section. */
export const transcriptArticle = style({
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "1.25rem",
    borderRadius: "0.75rem",
    border: `1px solid ${vars.colour.border}`,
    background: vars.colour.panel,
    scrollMarginTop: "5rem",
});

/** Level badge (warm-up / core / tricky). */
export const levelBadge = style({
    display: "inline-block",
    fontSize: "0.625rem",
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    padding: "0.15rem 0.45rem",
    borderRadius: "0.25rem",
    fontFamily: "ui-monospace, monospace",
});

/** Annotation popup below an annotated transcript line. */
export const annotationNote = style({
    marginTop: "0.25rem",
    marginBottom: "0.375rem",
    marginLeft: "1.5rem",
    padding: "0.375rem 0.625rem",
    borderRadius: "0.375rem",
    fontSize: "0.8rem",
    lineHeight: 1.55,
    borderLeft: "2px solid currentColor",
    background: vars.colour.panel2,
});

/** Transcript line that has an associated annotation — slightly highlighted. */
export const annotatedLine = style({
    background: vars.colour.panel2,
    borderRadius: "0.2rem",
});

/** "Decode this error" exercise box. */
export const exerciseBox = style({
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    padding: "1rem",
    borderRadius: "0.5rem",
    border: `1px solid ${vars.colour.borderSoft}`,
    background: vars.colour.panel2,
});

/** Reveal-answer button. */
export const revealButton = style({
    alignSelf: "flex-start",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.375rem",
    padding: "0.5rem 0.875rem",
    borderRadius: "0.375rem",
    fontSize: "0.8125rem",
    fontWeight: 500,
    background: vars.colour.accent,
    color: vars.colour.accentText,
    border: "none",
    cursor: "pointer",
    transition: "opacity 0.15s",
});
