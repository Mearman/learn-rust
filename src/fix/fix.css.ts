import { style } from "@vanilla-extract/css";
import { vars } from "../theme/theme.css.ts";

// ---------------------------------------------------------------------------
// Fix-section styles
//
// The fix cards share the challenge section's card visual language: the card
// shell, header, editor body, solved line, explanation block and "one way to
// fix it" snippet are imported from challenge.css.ts rather than duplicated.
// Only the styles unique to the fix section — the intro, the progressive hint
// list, and the hint/action row — live here.
// ---------------------------------------------------------------------------

/** Intro paragraph above the fix-exercise stack. */
export const fixIntro = style({
    fontSize: "0.9rem",
    lineHeight: 1.6,
    margin: 0,
    color: vars.colour.dim,
});

/** Footer row holding the hint and give-up controls. Wraps on narrow viewports
 *  so the two buttons never force horizontal overflow. */
export const fixActionRow = style({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "0.75rem",
    flexWrap: "wrap",
});

/** Ordered list of revealed hints inside a fix card. */
export const hintList = style({
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    margin: 0,
    padding: 0,
});

/** A single revealed hint: label lead-in stacked above its body text. */
export const hintItem = style({
    display: "flex",
    flexDirection: "column",
    gap: "0.125rem",
    padding: "0.5rem 0.625rem 0.5rem 0.75rem",
    borderLeft: `2px solid ${vars.colour.accent}`,
    background: vars.colour.accentDim,
    borderRadius: "0 0.375rem 0.375rem 0",
});

/** The bolded "What is missing?" lead-in of a hint. */
export const hintLabel = style({
    fontSize: "0.75rem",
    fontWeight: 600,
    color: vars.colour.accentSoft,
});

/** The body text of a hint. */
export const hintText = style({
    fontSize: "0.8125rem",
    lineHeight: 1.5,
    color: vars.colour.dim,
});

/** The "Need a hint?" / "Another hint" reveal button. */
export const hintButton = style({
    display: "inline-flex",
    alignItems: "center",
    gap: "0.375rem",
    padding: "0.375rem 0.75rem",
    borderRadius: "0.375rem",
    fontSize: "0.8125rem",
    fontWeight: 500,
    background: vars.colour.accentDim,
    color: vars.colour.accent,
    border: `1px solid ${vars.colour.accent}`,
    cursor: "pointer",
});
