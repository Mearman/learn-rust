import { useMemo } from "react";
import { TOK } from "../theme/colours.ts";

const KEYWORDS = [
    "as",
    "async",
    "await",
    "break",
    "const",
    "continue",
    "crate",
    "dyn",
    "else",
    "enum",
    "extern",
    "false",
    "fn",
    "for",
    "if",
    "impl",
    "in",
    "let",
    "loop",
    "match",
    "mod",
    "move",
    "mut",
    "pub",
    "ref",
    "return",
    "Self",
    "self",
    "static",
    "struct",
    "super",
    "trait",
    "true",
    "type",
    "unsafe",
    "use",
    "where",
    "while",
];

type TokenClass =
    | "comment"
    | "string"
    | "lifetime"
    | "macro"
    | "keyword"
    | "type"
    | "number"
    | "default";

interface Token {
    readonly t: string;
    readonly c: TokenClass;
}

const TOKEN_RE = new RegExp(
    [
        "(\\/\\/[^\\n]*)",
        '("(?:\\\\.|[^"\\\\])*")',
        "('(?:\\\\.|[^'\\\\])')",
        "('[a-z_][a-z0-9_]*\\b)",
        "([A-Za-z_][A-Za-z0-9_]*!)",
        "(\\b(?:" + KEYWORDS.join("|") + ")\\b)",
        "(\\b(?:[A-Z][A-Za-z0-9_]*|i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|f32|f64|bool|char|str)\\b)",
        "(\\b\\d[\\d_]*(?:\\.\\d+)?(?:[iuf](?:8|16|32|64|128|size))?\\b)",
    ].join("|"),
    "g"
);

function tokenize(code: string): readonly Token[] {
    const out: Token[] = [];
    let last = 0;
    let m: RegExpExecArray | null;
    TOKEN_RE.lastIndex = 0;
    while ((m = TOKEN_RE.exec(code)) !== null) {
        if (m.index > last)
            out.push({ t: code.slice(last, m.index), c: "default" });
        let cls: TokenClass = "default";
        if (m[1] !== undefined) cls = "comment";
        else if (m[2] !== undefined) cls = "string";
        else if (m[3] !== undefined) cls = "string";
        else if (m[4] !== undefined) cls = "lifetime";
        else if (m[5] !== undefined) cls = "macro";
        else if (m[6] !== undefined) cls = "keyword";
        else if (m[7] !== undefined) cls = "type";
        else if (m[8] !== undefined) cls = "number";
        out.push({ t: m[0], c: cls });
        last = m.index + m[0].length;
        if (m[0].length === 0) TOKEN_RE.lastIndex += 1;
    }
    if (last < code.length) out.push({ t: code.slice(last), c: "default" });
    return out;
}

interface CodeBlockProps {
    readonly code: string;
    readonly label?: string;
}

export function CodeBlock({ code, label }: CodeBlockProps) {
    const tokens = useMemo(() => tokenize(code), [code]);
    return (
        <div
            className="rounded-lg overflow-hidden"
            style={{
                border: `1px solid ${TOK.default}22`,
                background: "#100f0d",
            }}
        >
            {label ? (
                <div
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono"
                    style={{
                        borderBottom: `1px solid #221f1b`,
                        color: "#6e675d",
                    }}
                >
                    <span
                        style={{
                            width: 9,
                            height: 9,
                            borderRadius: 9,
                            background: "#3a3530",
                        }}
                    />
                    <span
                        style={{
                            width: 9,
                            height: 9,
                            borderRadius: 9,
                            background: "#3a3530",
                        }}
                    />
                    <span
                        style={{
                            width: 9,
                            height: 9,
                            borderRadius: 9,
                            background: "#3a3530",
                        }}
                    />
                    <span className="ml-1">{label}</span>
                </div>
            ) : null}
            <pre
                className="p-4 overflow-x-auto leading-relaxed m-0"
                style={{ fontSize: 13 }}
            >
                <code className="font-mono">
                    {tokens.map((tk, i) => (
                        <span
                            key={i}
                            style={{
                                color: TOK[tk.c],
                                fontStyle:
                                    tk.c === "comment" || tk.c === "lifetime"
                                        ? "italic"
                                        : "normal",
                            }}
                        >
                            {tk.t}
                        </span>
                    ))}
                </code>
            </pre>
        </div>
    );
}
