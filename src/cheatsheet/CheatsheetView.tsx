import { vars } from "../theme/theme.css.ts";
import { cheatsGrid, cheatCard, cheatTitle, navButton, noteBlock } from "../theme/styles.css.ts";

interface CheatSection {
    readonly title: string;
    readonly rows: readonly (readonly [string, string])[];
}

const CHEATS: readonly CheatSection[] = [
    {
        title: "The three ownership rules",
        rows: [
            ["1", "Each value has a single owner."],
            ["2", "There is only one owner at a time."],
            ["3", "When the owner goes out of scope, the value is dropped."],
        ],
    },
    {
        title: "The borrowing rules",
        rows: [
            ["&T", "Any number of shared (read-only) references."],
            ["&mut T", "Exactly one exclusive reference, and no &T alongside it."],
            ["scope", "A borrow lasts only until its final use, not the whole block."],
        ],
    },
    {
        title: "Option<T> in practice",
        rows: [
            ["map(f)", "Transform the Some value, leave None untouched."],
            ["and_then(f)", "Chain another Option-returning step."],
            ["unwrap_or(d)", "Value if Some, else fallback d."],
            ["ok_or(e)", "Convert to Result, using e for the None case."],
            ["?", "Return None early from an Option-returning fn."],
        ],
    },
    {
        title: "Result<T, E> in practice",
        rows: [
            ["?", "Unwrap Ok or return Err early."],
            ["map / map_err", "Transform the Ok value or the Err value."],
            ["unwrap_or_else", "Compute a fallback from the error."],
            ["ok()", "Discard the error, becoming Option<T>."],
            ["expect(msg)", "Unwrap or panic with your own message."],
        ],
    },
    {
        title: "String <-> &str",
        rows: [
            ['"lit"', "A string literal is already &'static str."],
            [".to_string()", "&str to an owned String."],
            ["&s / s.as_str()", "String to a borrowed &str."],
            ["param: &str", "Accept both String and literals."],
        ],
    },
];

interface CheatsheetViewProps {
    readonly onOpenReferences: () => void;
}

export function CheatsheetView({ onOpenReferences }: CheatsheetViewProps) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className={noteBlock}>
                <span>
                    These are the short-form notes. The standalone reference cards are the source of truth.
                </span>
                <button
                    type="button"
                    onClick={onOpenReferences}
                    className={navButton}
                    style={{ width: "auto", padding: "0.5rem 0.75rem" }}
                >
                    Open comparisons
                </button>
            </div>
            <div className={cheatsGrid}>
                {CHEATS.map((c) => (
                    <div key={c.title} className={cheatCard}>
                        <h3 className={cheatTitle}>{c.title}</h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                            {c.rows.map((r, i) => (
                                <div key={i} style={{ display: "flex", gap: "0.75rem", fontSize: "0.875rem" }}>
                                    <code
                                        style={{ fontFamily: "ui-monospace, monospace", flexShrink: 0, color: vars.colour.text, minWidth: 92 }}
                                    >
                                        {r[0]}
                                    </code>
                                    <span style={{ color: vars.colour.dim }}>{r[1]}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
