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

export type TokenClass =
    | "comment"
    | "docComment"
    | "string"
    | "lifetime"
    | "macro"
    | "keyword"
    | "type"
    | "number"
    | "attribute"
    | "default";

export interface Token {
    readonly t: string;
    readonly c: TokenClass;
}

// Raw strings enumerate fixed hash counts (1–4) rather than using
// backreferences, which do not work across top-level alternation branches.
//
// Group 1:  doc comments  (/// or //! — must precede plain //)
// Group 2:  line comments (//)
// Group 3:  block comments (/* … */) — non-nested
// Group 4:  attributes     (#![…] or #[…])
// Group 5:  raw byte strings (br/rb prefix, up to 4 # delimiters)
// Group 6:  raw strings    (r prefix, up to 4 # delimiters)
// Group 7:  byte strings   (b"…")
// Group 8:  regular strings ("…")
// Group 9:  byte char literals (b'x')
// Group 10: char literals  ('x')
// Group 11: lifetimes      ('ident)
// Group 12: macros         (ident!)
// Group 13: keywords
// Group 14: types
// Group 15: numbers
const TOKEN_RE = new RegExp(
    [
        // 1 — doc comments (/// or //!)
        "(\\/\\/[\\/!][^\\n]*)",
        // 2 — line comments
        "(\\/\\/[^\\n]*)",
        // 3 — block comments (/* … */)
        "(\\/\\*[\\s\\S]*?\\*\\/)",
        // 4 — attributes (#![…] or #[…])
        "(#!?\\[[^\\]]*\\])",
        // 5 — raw byte strings: br"…" / rb"…" with 0–4 # delimiters
        '((?:br|rb)(?:"[^"]*"|#{1}"[^"]*"#{1}|#{2}"[^"]*"#{2}|#{3}"[^"]*"#{3}|#{4}"[^"]*"#{4}))',
        // 6 — raw strings: r"…" / r#"…"# / r##"…"## (0–4 # delimiters)
        '(r(?:"[^"]*"|#{1}"[^"]*"#{1}|#{2}"[^"]*"#{2}|#{3}"[^"]*"#{3}|#{4}"[^"]*"#{4}))',
        // 7 — byte strings: b"…"
        '(b"(?:\\\\.|[^"\\\\])*")',
        // 8 — regular strings
        '("(?:\\\\.|[^"\\\\])*")',
        // 9 — byte char literals: b'x'
        "(b'(?:\\\\.|[^'\\\\])')",
        // 10 — char literals: 'x'
        "('(?:\\\\.|[^'\\\\])')",
        // 11 — lifetimes: 'ident
        "('[a-z_][a-z0-9_]*\\b)",
        // 12 — macros
        "([A-Za-z_][A-Za-z0-9_]*!)",
        // 13 — keywords
        "(\\b(?:" + KEYWORDS.join("|") + ")\\b)",
        // 14 — types
        "(\\b(?:[A-Z][A-Za-z0-9_]*|i8|i16|i32|i64|i128|isize|u8|u16|u32|u64|u128|usize|f32|f64|bool|char|str)\\b)",
        // 15 — numbers
        "(\\b\\d[\\d_]*(?:\\.\\d+)?(?:[iuf](?:8|16|32|64|128|size))?\\b)",
    ].join("|"),
    "g"
);

export function tokenize(code: string): readonly Token[] {
    const out: Token[] = [];
    let last = 0;
    let m: RegExpExecArray | null;
    TOKEN_RE.lastIndex = 0;
    while ((m = TOKEN_RE.exec(code)) !== null) {
        if (m.index > last)
            out.push({ t: code.slice(last, m.index), c: "default" });
        let cls: TokenClass = "default";
        if (m[1] !== undefined) cls = "docComment";
        else if (m[2] !== undefined) cls = "comment";
        else if (m[3] !== undefined) cls = "comment";
        else if (m[4] !== undefined) cls = "attribute";
        else if (m[5] !== undefined) cls = "string";
        else if (m[6] !== undefined) cls = "string";
        else if (m[7] !== undefined) cls = "string";
        else if (m[8] !== undefined) cls = "string";
        else if (m[9] !== undefined) cls = "string";
        else if (m[10] !== undefined) cls = "string";
        else if (m[11] !== undefined) cls = "lifetime";
        else if (m[12] !== undefined) cls = "macro";
        else if (m[13] !== undefined) cls = "keyword";
        else if (m[14] !== undefined) cls = "type";
        else if (m[15] !== undefined) cls = "number";
        out.push({ t: m[0], c: cls });
        last = m.index + m[0].length;
        if (m[0].length === 0) TOKEN_RE.lastIndex += 1;
    }
    if (last < code.length) out.push({ t: code.slice(last), c: "default" });
    return out;
}
