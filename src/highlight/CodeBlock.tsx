import { useMemo } from "react";
import { vars } from "../theme/theme.css.ts";
import {
    codeBlock,
    codeHeader,
    codeDot,
    codePre,
    tokenCommentOrLifetime,
    runButton,
} from "../theme/styles.css.ts";
import { PlayCircle } from "lucide-react";

const KEYWORDS = [
    "as", "async", "await", "break", "const", "continue", "crate", "dyn",
    "else", "enum", "extern", "false", "fn", "for", "if", "impl", "in",
    "let", "loop", "match", "mod", "move", "mut", "pub", "ref", "return",
    "Self", "self", "static", "struct", "super", "trait", "true", "type",
    "unsafe", "use", "where", "while",
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
        "(\"(?:\\\\.|[^\"\\\\])*\")",
        "('(?:\\\\.|[^'\\\\])')",
        "('[a-z_][a-z0-9_]*\\b)",
        "([A-Za-z_][A-Za-z0-9_]*!)",
        "(\\b(?:" + KEYWORDS.join("|") + ")\\b)",
        "(\\b(?:[A-Z][A-Za-z0-9_]*|i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|f32|f64|bool|char|str)\\b)",
        "(\\b\\d[\\d_]*(?:\\.\\d+)?(?:[iuf](?:8|16|32|64|128|size))?\\b)",
    ].join("|"),
    "g",
);

function tokenize(code: string): readonly Token[] {
    const out: Token[] = [];
    let last = 0;
    let m: RegExpExecArray | null;
    TOKEN_RE.lastIndex = 0;
    while ((m = TOKEN_RE.exec(code)) !== null) {
        if (m.index > last) out.push({ t: code.slice(last, m.index), c: "default" });
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

const tokenColour: Record<TokenClass, string> = {
    default: vars.tok.default,
    comment: vars.tok.comment,
    string: vars.tok.string,
    lifetime: vars.tok.lifetime,
    macro: vars.tok.macro,
    keyword: vars.tok.keyword,
    type: vars.tok.type,
    number: vars.tok.number,
};

interface CodeBlockProps {
    readonly code: string;
    readonly label?: string;
    readonly onRun?: () => void;
    readonly compiling?: boolean;
}

export function CodeBlock({ code, label, onRun, compiling }: CodeBlockProps) {
    const tokens = useMemo(() => tokenize(code), [code]);
    return (
        <div className={codeBlock}>
            {label ? (
                <div className={codeHeader}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1 }}>
                        <span className={codeDot} />
                        <span className={codeDot} />
                        <span className={codeDot} />
                        <span style={{ marginLeft: "0.25rem" }}>{label}</span>
                    </div>
                    {onRun ? (
                        <button className={runButton} onClick={onRun} disabled={compiling}>
                            <PlayCircle size={13} />
                            {compiling ? "Running…" : "Run"}
                        </button>
                    ) : null}
                </div>
            ) : null}
            <pre className={codePre}>
                <code style={{ fontFamily: "ui-monospace, monospace" }}>
                    {tokens.map((tk, i) => (
                        <span
                            key={i}
                            className={tk.c === "comment" || tk.c === "lifetime" ? tokenCommentOrLifetime : undefined}
                            style={{ color: tokenColour[tk.c] }}
                        >
                            {tk.t}
                        </span>
                    ))}
                </code>
            </pre>
        </div>
    );
}
