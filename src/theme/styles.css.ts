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
    color: "#1a0f08",
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

export const headerFlex = style({
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    "@media": {
        [md]: {
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
        },
    },
});

export const heading = style({
    fontSize: "1.5rem",
    fontWeight: 700,
    margin: 0,
    letterSpacing: "-0.025em",
    color: vars.colour.text,
    "@media": {
        [sm]: { fontSize: "1.875rem" },
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
 *  nav pinned as a unit at the top of the viewport. */
export const stickyPinned = style({
    position: "sticky",
    top: 0,
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
});

// ---------------------------------------------------------------------------
// Compact always-visible tailoring strip
// ---------------------------------------------------------------------------

export const compactStrip = style({
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "0.5rem",
    padding: "0.375rem 0.625rem",
    borderRadius: "0.625rem",
    background: vars.colour.panel,
    border: `1px solid ${vars.colour.border}`,
    backdropFilter: "blur(8px)",
});

export const compactStripTitle = style({
    fontSize: "0.75rem",
    fontWeight: 700,
    letterSpacing: "-0.01em",
    color: vars.colour.text,
    whiteSpace: "nowrap",
    flexShrink: 0,
    marginRight: "0.25rem",
    "@media": {
        [md]: { fontSize: "0.8125rem" },
    },
});

export const compactStripControls = style({
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "0.5rem",
    flex: 1,
    minWidth: 0,
});

export const compactStripField = style({
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    // Keep the field at its natural width (label + a usable control) and let
    // the row wrap instead of shrinking controls to an unclickable sliver.
    flexShrink: 0,
});

export const compactStripLabel = style({
    fontSize: "0.625rem",
    fontFamily: "ui-monospace, monospace",
    color: vars.colour.accentSoft,
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    whiteSpace: "nowrap",
    flexShrink: 0,
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
    color: "#1a0f08",
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

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export const settingsPanel = style({
    display: "flex",
    flexDirection: "column",
    gap: "0.875rem",
    padding: "0.875rem 1rem",
    borderRadius: "0.875rem",
    background: vars.colour.panel2,
    border: `1px solid ${vars.colour.border}`,
});

export const settingsPanelHeader = style({
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
});

export const settingsGrid = style({
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "0.875rem",
    "@media": {
        [md]: { gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))" },
    },
});

export const settingsField = style({
    display: "flex",
    flexDirection: "column",
    gap: "0.375rem",
    minWidth: 0,
});

export const settingsLabel = style({
    fontSize: "0.6875rem",
    fontFamily: "ui-monospace, monospace",
    color: vars.colour.accentSoft,
    fontWeight: 600,
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
});

export const settingsHelp = style({
    fontSize: "0.75rem",
    lineHeight: 1.5,
    color: vars.colour.dim,
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
    color: "#1a0f08",
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

export const hideOnMobile = style({
    display: "none",
    "@media": { [md]: { display: "inline" } },
});
