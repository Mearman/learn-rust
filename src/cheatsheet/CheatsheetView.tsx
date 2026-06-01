import { C } from "../theme/colours.ts";

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
            [
                "&mut T",
                "Exactly one exclusive reference, and no &T alongside it.",
            ],
            [
                "scope",
                "A borrow lasts only until its final use, not the whole block.",
            ],
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

export function CheatsheetView() {
    return (
        <div className="rbc-cheats">
            {CHEATS.map((c) => (
                <div
                    key={c.title}
                    className="rounded-lg p-4 flex flex-col gap-3"
                    style={{
                        background: C.panel2,
                        border: `1px solid ${C.border}`,
                    }}
                >
                    <h3
                        className="text-sm font-semibold m-0"
                        style={{ color: C.accentSoft }}
                    >
                        {c.title}
                    </h3>
                    <div className="flex flex-col gap-2">
                        {c.rows.map((r, i) => (
                            <div key={i} className="flex gap-3 text-sm">
                                <code
                                    className="font-mono flex-shrink-0"
                                    style={{ color: C.text, minWidth: 92 }}
                                >
                                    {r[0]}
                                </code>
                                <span style={{ color: C.dim }}>{r[1]}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
