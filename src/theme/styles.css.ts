import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "./theme.css.js";

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
    background: "#3a3530",
});

export const codePre = style({
    padding: "1rem",
    overflowX: "auto",
    lineHeight: 1.625,
    margin: 0,
    fontSize: 13,
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
    color: vars.colour.faint,
});

export const textBlock = style({
    lineHeight: 1.625,
    margin: 0,
    color: vars.colour.text,
    fontSize: 15,
});

// ---------------------------------------------------------------------------
// LearnView
// ---------------------------------------------------------------------------

export const learnGrid = style({
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "1.25rem",
    "@media": {
        "screen and (min-width: 760px)": {
            gridTemplateColumns: "240px minmax(0, 1fr)",
        },
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
// CheatsheetView
// ---------------------------------------------------------------------------

export const cheatsGrid = style({
    display: "grid",
    gap: "1rem",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
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
    maxWidth: "56rem",
    margin: "0 auto",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    "@media": {
        "screen and (min-width: 640px)": {
            paddingLeft: "1.5rem",
            paddingRight: "1.5rem",
        },
    },
});

export const headerFlex = style({
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "1rem",
    flexWrap: "wrap",
});

export const heading = style({
    fontSize: "1.875rem",
    fontWeight: 700,
    margin: 0,
    letterSpacing: "-0.025em",
    color: vars.colour.text,
    "@media": {
        "screen and (min-width: 640px)": {
            fontSize: "1.875rem",
        },
    },
});

export const mainPanel = style({
    borderRadius: "1rem",
    padding: "1rem",
    background: vars.colour.panel,
    border: `1px solid ${vars.colour.border}`,
    "@media": {
        "screen and (min-width: 640px)": {
            padding: "1.5rem",
        },
    },
});

export const tabNav = style({
    display: "flex",
    gap: "0.25rem",
    padding: "0.25rem",
    borderRadius: "0.75rem",
    alignSelf: "flex-start",
    background: vars.colour.panel,
    border: `1px solid ${vars.colour.border}`,
});

export const tabButton = style({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    borderRadius: "0.5rem",
    padding: "0.5rem 0.875rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    transition: "background 0.15s, color 0.15s",
    background: "transparent",
    color: vars.colour.dim,
    border: "none",
    cursor: "pointer",
    whiteSpace: "nowrap",
});

export const tabButtonActive = style({
    background: vars.colour.accent,
    color: "#1a0f08",
});

export const footer = style({
    textAlign: "center",
    fontSize: "0.75rem",
    color: vars.colour.faint,
});

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

export const settingsTrigger = style({
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 32,
    height: 32,
    borderRadius: "0.5rem",
    border: `1px solid ${vars.colour.border}`,
    background: "transparent",
    color: vars.colour.dim,
    cursor: "pointer",
    transition: "color 0.15s, border-color 0.15s",
    selectors: {
        "&:hover": {
            color: vars.colour.text,
            borderColor: vars.colour.accent,
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
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
    "@media": {
        "screen and (max-width: 759px)": {
            gridTemplateColumns: "1fr",
        },
    },
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
    fontSize: 13,
    fontFamily: "ui-monospace, monospace",
    lineHeight: 1.625,
    overflowX: "auto",
    whiteSpace: "pre-wrap" as const,
    wordBreak: "break-word" as const,
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
