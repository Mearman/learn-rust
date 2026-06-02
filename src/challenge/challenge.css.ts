import { style } from "@vanilla-extract/css";
import { vars } from "../theme/theme.css.ts";

// ---------------------------------------------------------------------------
// Challenge card styles
//
// These classes replace the inline style={{}} objects that previously lived in
// ChallengeView/ChallengeCard. Only the genuinely dynamic, per-state values
// (the level colour, the multiple-choice option colours, and the fix-mode
// toggle colours, which depend on runtime state) remain as inline styles at the
// call sites — everything static is promoted here.
// ---------------------------------------------------------------------------

// --- Card header --------------------------------------------------------------

/** The "challenge N / total" header row. */
export const cardHeader = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
});

/** Right-hand cluster of the header: level badge plus topic. */
export const cardHeaderMeta = style({
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
});

// --- Multiple-choice block ----------------------------------------------------

/** Vertical container for the MC prompt and its option list. */
export const mcBlock = style({
    display: "flex",
    flexDirection: "column",
    gap: "0.625rem",
});

/** The MC prompt text. */
export const mcPrompt = style({
    color: vars.colour.dim,
    fontSize: "0.8rem",
});

/** The list of MC option rows. */
export const mcOptionList = style({
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
});

/** A single MC option: the button plus its (optional) misconception note. */
export const mcOption = style({
    display: "flex",
    flexDirection: "column",
    gap: "0.375rem",
});

/** The clickable MC option button. The colour-driven properties (background,
 *  colour, border, font-weight, cursor) are applied inline because they depend
 *  on the answered/correct/chosen runtime state. */
export const mcOptionButton = style({
    textAlign: "left",
    display: "flex",
    alignItems: "flex-start",
    gap: "0.5rem",
    padding: "0.625rem 0.75rem",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    transition: "background 0.15s, border-color 0.15s",
    width: "100%",
    lineHeight: 1.5,
});

/** The monospaced option-id prefix (e.g. "a."). Its colour is set inline as it
 *  depends on the answered/chosen runtime state. */
export const mcOptionId = style({
    fontFamily: "ui-monospace, monospace",
    fontSize: "0.75rem",
    flexShrink: 0,
    marginTop: "0.1rem",
});

/** The tick/cross icon trailing an MC option. */
export const mcOptionIcon = style({
    flexShrink: 0,
    marginLeft: "auto",
    marginTop: "0.15rem",
});

/** Misconception note shown below a chosen wrong option. */
export const mcMisconception = style({
    marginLeft: "0.75rem",
    padding: "0.5rem 0.625rem 0.5rem 0.75rem",
    borderLeft: `2px solid ${vars.colour.bad}`,
    fontSize: "0.8125rem",
    lineHeight: 1.5,
    color: vars.colour.dim,
    background: vars.colour.badDim,
    borderRadius: "0 0.375rem 0.375rem 0",
});

// --- Fix-mode toggle ----------------------------------------------------------

/** Right-aligned row holding a single action button (fix toggle / give up). */
export const actionRow = style({
    display: "flex",
    justifyContent: "flex-end",
});

/** The "Try fixing it" / "Close fix mode" toggle. The background, colour and
 *  border are inline because they switch on the active state. */
export const fixToggleButton = style({
    display: "inline-flex",
    alignItems: "center",
    gap: "0.375rem",
    padding: "0.375rem 0.75rem",
    borderRadius: "0.375rem",
    fontSize: "0.8125rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 0.15s",
});

// --- Fix-mode body (editor) ---------------------------------------------------

/** Vertical container for the fix-mode editor / solved view. */
export const fixBody = style({
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
});

/** The "Fixed!" success line shown once the edited code compiles. */
export const fixSolvedLine = style({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: 600,
    color: vars.colour.good,
});

/** "Show me the fix" give-up button. */
export const giveUpButton = style({
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

// --- Explanation block --------------------------------------------------------

/** Vertical container wrapping the revealed explanation and canonical fix. */
export const explanation = style({
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
});

/** The verdict line ("Correct" / "Not quite") inside a feedback box. The colour
 *  is inline because it depends on whether the answer was correct. */
export const verdictLine = style({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: 600,
});

/** The "— this code compiles/does not compile." dim suffix on the verdict. */
export const verdictSuffix = style({
    color: vars.colour.dim,
    fontWeight: 400,
});

/** Body paragraph inside a feedback / explanation box. */
export const explanationText = style({
    fontSize: "0.875rem",
    lineHeight: 1.625,
    margin: 0,
    color: vars.colour.text,
});

/** Neutral feedback box used when fix mode resolves without a compile guess. */
export const neutralFeedback = style({
    background: vars.colour.panel2,
    border: `1px solid ${vars.colour.borderSoft}`,
});

/** Container for the canonical "one way to fix it" snippet. */
export const fixSnippet = style({
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
});

// --- Per-language notes -------------------------------------------------------

/** Outer wrapper for the per-language explanatory notes. */
export const perLanguageNotes = style({
    borderTop: `1px solid ${vars.colour.borderSoft}`,
    paddingTop: "0.5rem",
});

/** Stack of per-language note paragraphs. */
export const perLanguageList = style({
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
});

/** A single per-language note paragraph. */
export const perLanguageNote = style({
    fontSize: "0.875rem",
    lineHeight: 1.625,
    margin: 0,
    color: vars.colour.text,
});

/** The "If you're familiar with X:" lead-in span. */
export const perLanguageLead = style({
    color: vars.colour.accentSoft,
    fontWeight: 600,
});

// ---------------------------------------------------------------------------
// Due-for-review bucket (rendered above the summary in ChallengeView)
// ---------------------------------------------------------------------------

/** Container box for the due-for-review bucket. */
export const dueBucket = style({
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    padding: "0.875rem",
    borderRadius: "0.5rem",
    border: `1px solid ${vars.colour.accent}`,
    background: vars.colour.accentDim,
});

/** Header row of the due-for-review bucket. */
export const dueHeader = style({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.8125rem",
    fontWeight: 600,
    color: vars.colour.accent,
});

/** Wrapping flex row of due-for-review chips. */
export const dueChips = style({
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
});

/** A single due-for-review chip linking to its challenge anchor. */
export const dueChip = style({
    display: "inline-flex",
    alignItems: "center",
    gap: "0.25rem",
    padding: "0.25rem 0.625rem",
    borderRadius: "0.375rem",
    fontSize: "0.8125rem",
    fontWeight: 500,
    background: vars.colour.accentDim,
    color: vars.colour.accent,
    border: `1px solid ${vars.colour.accent}`,
    textDecoration: "none",
});

/** Lightbulb icon inside a background-context note block. */
export const noteIcon = style({
    color: vars.colour.accent,
    flexShrink: 0,
    marginTop: 2,
});

/** Trophy icon inside the summary tally. */
export const summaryTrophy = style({
    color: vars.colour.accent,
});

/** The summary tally line (correct / answered). */
export const summaryTally = style({
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
});
