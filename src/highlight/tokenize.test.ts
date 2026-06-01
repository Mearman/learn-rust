import { describe, expect, it } from "vitest";
import { tokenize } from "./tokenize.ts";
import type { Token, TokenClass } from "./tokenize.ts";

// Helper: the first token matching the given text, or undefined.
function findToken(tokens: readonly Token[], text: string): Token | undefined {
    return tokens.find((tk) => tk.t === text);
}

// Helper: assert that joining every token's `.t` reproduces the input exactly.
function assertLossless(source: string): void {
    const tokens = tokenize(source);
    const rebuilt = tokens.map((tk) => tk.t).join("");
    expect(rebuilt).toBe(source);
}

// Helper: tokenise and return the class of the *first* token that matches text.
function classOf(source: string, text: string): TokenClass | undefined {
    return findToken(tokenize(source), text)?.c;
}

// ─── Losslessness ─────────────────────────────────────────────────────────────

describe("losslessness — every token.t concatenates to the original source", () => {
    it("empty string", () => {
        assertLossless("");
    });

    it("plain identifier", () => {
        assertLossless("hello_world");
    });

    it("keyword", () => {
        assertLossless("fn main() {}");
    });

    it("string literal", () => {
        assertLossless('"hello, world"');
    });

    it("line comment", () => {
        assertLossless("// a comment\n");
    });

    it("block comment", () => {
        assertLossless("/* block\n   comment */");
    });

    it("doc comment ///", () => {
        assertLossless("/// doc comment\n");
    });

    it("doc comment //!", () => {
        assertLossless("//! inner doc\n");
    });

    it("attribute", () => {
        assertLossless("#[derive(Debug, Clone)]");
    });

    it("inner attribute", () => {
        assertLossless("#![allow(dead_code)]");
    });

    it("char literal", () => {
        assertLossless("'a'");
    });

    it("lifetime annotation", () => {
        assertLossless("'lifetime");
    });

    it("macro invocation", () => {
        assertLossless("println!(");
    });

    it("number literal", () => {
        assertLossless("42u32");
    });

    it("raw string r#", () => {
        assertLossless('r#"raw string"#');
    });

    it("realistic snippet", () => {
        const src = `fn main() {
    let x: i32 = 42;
    // a comment
    println!("{}", x);
}`;
        assertLossless(src);
    });

    it("all token classes together", () => {
        const src = [
            "/// doc comment",
            "//! inner doc",
            "// line comment",
            "/* block comment */",
            "#[derive(Debug)]",
            "#![allow(dead_code)]",
            'br#"raw byte"#',
            'r#"raw string"#',
            'b"byte str"',
            '"regular string"',
            "b'x'",
            "'z'",
            "'lifetime",
            "println!",
            "fn let match",
            "String i32 Vec",
            "42 3.14 1_000u64",
        ].join("\n");
        assertLossless(src);
    });
});

// ─── Keywords ─────────────────────────────────────────────────────────────────

describe("keywords", () => {
    const kws = [
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
    ] as const;

    for (const kw of kws) {
        it(`"${kw}" is classified as keyword`, () => {
            // Wrap in spaces so word-boundary matching works correctly.
            expect(classOf(` ${kw} `, kw)).toBe("keyword");
        });
    }

    it("keyword embedded in identifier is NOT a keyword", () => {
        // 'letter' contains 'let' but should not match.
        const tokens = tokenize("letter");
        const kw = findToken(tokens, "let");
        expect(kw).toBeUndefined();
    });

    it("fn at start of line is keyword", () => {
        expect(classOf("fn foo()", "fn")).toBe("keyword");
    });
});

// ─── Types ────────────────────────────────────────────────────────────────────

describe("types", () => {
    const types = [
        "String",
        "Vec",
        "Option",
        "Result",
        "Box",
        "HashMap",
        "HashSet",
        "i8",
        "i16",
        "i32",
        "i64",
        "i128",
        "isize",
        "u8",
        "u16",
        "u32",
        "u64",
        "u128",
        "usize",
        "f32",
        "f64",
        "bool",
        "char",
        "str",
    ] as const;

    for (const ty of types) {
        it(`"${ty}" is classified as type`, () => {
            expect(classOf(` ${ty} `, ty)).toBe("type");
        });
    }

    it("PascalCase identifier is classified as type", () => {
        expect(classOf("MyStruct", "MyStruct")).toBe("type");
    });

    it("PascalCase embedded in snake_case is not extracted as type", () => {
        // `some_Type_here` — the capital T is inside a word, not at a boundary.
        const tokens = tokenize("some_Type_here");
        expect(findToken(tokens, "Type")).toBeUndefined();
    });
});

// ─── Comments ─────────────────────────────────────────────────────────────────

describe("line comments", () => {
    it("simple line comment", () => {
        const tokens = tokenize("// this is a comment\n");
        const comment = findToken(tokens, "// this is a comment");
        expect(comment?.c).toBe("comment");
    });

    it("line comment does not consume the newline", () => {
        const tokens = tokenize("// comment\nx");
        const comment = tokens.find((tk) => tk.c === "comment");
        expect(comment?.t).toBe("// comment");
    });

    it("line comment after code", () => {
        expect(classOf("let x = 1; // comment", "// comment")).toBe("comment");
    });
});

describe("block comments", () => {
    it("simple block comment", () => {
        const tokens = tokenize("/* hello */");
        expect(tokens[0]?.c).toBe("comment");
        expect(tokens[0]?.t).toBe("/* hello */");
    });

    it("multiline block comment", () => {
        const src = "/* line one\n   line two */";
        const tokens = tokenize(src);
        expect(tokens[0]?.c).toBe("comment");
        expect(tokens[0]?.t).toBe(src);
    });

    it("block comment does not bleed into surrounding code", () => {
        const tokens = tokenize("x /* comment */ y");
        const comment = tokens.find((tk) => tk.c === "comment");
        expect(comment?.t).toBe("/* comment */");
    });
});

describe("doc comments", () => {
    it("/// doc comment is docComment", () => {
        const tokens = tokenize("/// This is a doc comment\n");
        const doc = findToken(tokens, "/// This is a doc comment");
        expect(doc?.c).toBe("docComment");
    });

    it("//! inner doc comment is docComment", () => {
        const tokens = tokenize("//! inner doc\n");
        const doc = findToken(tokens, "//! inner doc");
        expect(doc?.c).toBe("docComment");
    });

    it("/// is not classified as plain comment", () => {
        const tokens = tokenize("/// doc\n");
        const cmt = tokens.find((tk) => tk.c === "comment");
        expect(cmt).toBeUndefined();
    });

    it("// (double slash only) is a plain comment", () => {
        const tokens = tokenize("// plain\n");
        const cmt = findToken(tokens, "// plain");
        expect(cmt?.c).toBe("comment");
    });
});

// ─── Strings ──────────────────────────────────────────────────────────────────

describe("regular strings", () => {
    it("basic string", () => {
        const tokens = tokenize('"hello"');
        expect(tokens[0]?.c).toBe("string");
        expect(tokens[0]?.t).toBe('"hello"');
    });

    it("string with escape sequences", () => {
        const tokens = tokenize('"hello\\nworld"');
        expect(tokens[0]?.c).toBe("string");
    });

    it("empty string", () => {
        const tokens = tokenize('""');
        expect(tokens[0]?.c).toBe("string");
        expect(tokens[0]?.t).toBe('""');
    });
});

describe("raw strings", () => {
    it('r"..." (0 hashes)', () => {
        const tokens = tokenize('r"no escapes here"');
        expect(tokens[0]?.c).toBe("string");
        expect(tokens[0]?.t).toBe('r"no escapes here"');
    });

    it('r#"..."# (1 hash)', () => {
        const tokens = tokenize('r#"contains "quotes""#');
        expect(tokens[0]?.c).toBe("string");
        expect(tokens[0]?.t).toBe('r#"contains "quotes""#');
    });

    it('r##"..."## (2 hashes)', () => {
        const tokens = tokenize('r##"contains #"hashes"# inside"##');
        expect(tokens[0]?.c).toBe("string");
        expect(tokens[0]?.t).toBe('r##"contains #"hashes"# inside"##');
    });

    it('r###"..."### (3 hashes)', () => {
        const tokens = tokenize('r###"triple"###');
        expect(tokens[0]?.c).toBe("string");
        expect(tokens[0]?.t).toBe('r###"triple"###');
    });

    it('r####"..."#### (4 hashes)', () => {
        const tokens = tokenize('r####"quad"####');
        expect(tokens[0]?.c).toBe("string");
        expect(tokens[0]?.t).toBe('r####"quad"####');
    });
});

describe("raw byte strings", () => {
    it('br"..." (0 hashes)', () => {
        const tokens = tokenize('br"bytes"');
        expect(tokens[0]?.c).toBe("string");
        expect(tokens[0]?.t).toBe('br"bytes"');
    });

    it('br#"..."# (1 hash)', () => {
        const tokens = tokenize('br#"raw bytes"#');
        expect(tokens[0]?.c).toBe("string");
        expect(tokens[0]?.t).toBe('br#"raw bytes"#');
    });

    it('rb"..." prefix variant (0 hashes)', () => {
        const tokens = tokenize('rb"bytes"');
        expect(tokens[0]?.c).toBe("string");
        expect(tokens[0]?.t).toBe('rb"bytes"');
    });
});

describe("byte strings", () => {
    it('b"..." byte string', () => {
        const tokens = tokenize('b"byte string"');
        expect(tokens[0]?.c).toBe("string");
        expect(tokens[0]?.t).toBe('b"byte string"');
    });
});

// ─── Char literals and lifetimes ──────────────────────────────────────────────

describe("char literals vs lifetimes", () => {
    it("single-char literal 'a'", () => {
        const tokens = tokenize("'a'");
        expect(tokens[0]?.c).toBe("string");
        expect(tokens[0]?.t).toBe("'a'");
    });

    it("escape char literal '\\n'", () => {
        const tokens = tokenize("'\\n'");
        expect(tokens[0]?.c).toBe("string");
        expect(tokens[0]?.t).toBe("'\\n'");
    });

    it("lifetime 'a (no closing quote)", () => {
        // 'a in a generic context, e.g. &'a str
        const tokens = tokenize("&'a str");
        const lifetime = findToken(tokens, "'a");
        expect(lifetime?.c).toBe("lifetime");
    });

    it("lifetime 'lifetime (multi-char)", () => {
        const tokens = tokenize("'lifetime");
        expect(tokens[0]?.c).toBe("lifetime");
        expect(tokens[0]?.t).toBe("'lifetime");
    });

    it("'static is a lifetime, not the keyword static", () => {
        // In Rust, 'static is a lifetime.
        const tokens = tokenize("'static");
        expect(tokens[0]?.c).toBe("lifetime");
        expect(tokens[0]?.t).toBe("'static");
    });

    it("byte char literal b'x'", () => {
        const tokens = tokenize("b'x'");
        expect(tokens[0]?.c).toBe("string");
        expect(tokens[0]?.t).toBe("b'x'");
    });
});

// ─── Macros ───────────────────────────────────────────────────────────────────

describe("macros", () => {
    it("println! is classified as macro", () => {
        const tokens = tokenize("println!");
        expect(tokens[0]?.c).toBe("macro");
        expect(tokens[0]?.t).toBe("println!");
    });

    it("vec! is classified as macro", () => {
        expect(classOf("vec!", "vec!")).toBe("macro");
    });

    it("format! is classified as macro", () => {
        expect(classOf("format!", "format!")).toBe("macro");
    });

    it("panic! is classified as macro", () => {
        expect(classOf("panic!", "panic!")).toBe("macro");
    });

    it("eprintln! is classified as macro", () => {
        expect(classOf("eprintln!", "eprintln!")).toBe("macro");
    });

    it("assert_eq! is classified as macro", () => {
        expect(classOf("assert_eq!", "assert_eq!")).toBe("macro");
    });

    it("macro token includes the exclamation mark", () => {
        const tokens = tokenize("println!(");
        expect(tokens[0]?.t).toBe("println!");
    });
});

// ─── Attributes ───────────────────────────────────────────────────────────────

describe("attributes", () => {
    it("#[derive(...)] is attribute", () => {
        const tokens = tokenize("#[derive(Debug, Clone)]");
        expect(tokens[0]?.c).toBe("attribute");
        expect(tokens[0]?.t).toBe("#[derive(Debug, Clone)]");
    });

    it("#[inline] is attribute", () => {
        const tokens = tokenize("#[inline]");
        expect(tokens[0]?.c).toBe("attribute");
        expect(tokens[0]?.t).toBe("#[inline]");
    });

    it("#![allow(dead_code)] is inner attribute", () => {
        const tokens = tokenize("#![allow(dead_code)]");
        expect(tokens[0]?.c).toBe("attribute");
        expect(tokens[0]?.t).toBe("#![allow(dead_code)]");
    });

    it("#![allow(...)] does not bleed into following code", () => {
        const tokens = tokenize("#![allow(dead_code)]\nfn foo() {}");
        const attr = findToken(tokens, "#![allow(dead_code)]");
        expect(attr?.c).toBe("attribute");
    });
});

// ─── Numbers ──────────────────────────────────────────────────────────────────

describe("numbers", () => {
    it("integer literal", () => {
        expect(classOf("42", "42")).toBe("number");
    });

    it("float literal", () => {
        expect(classOf("3.14", "3.14")).toBe("number");
    });

    it("integer with type suffix", () => {
        expect(classOf("42u32", "42u32")).toBe("number");
    });

    it("integer with isize suffix", () => {
        expect(classOf("100isize", "100isize")).toBe("number");
    });

    it("integer with usize suffix", () => {
        expect(classOf("0usize", "0usize")).toBe("number");
    });

    it("integer with f64 suffix", () => {
        expect(classOf("2f64", "2f64")).toBe("number");
    });

    it("underscore-separated integer", () => {
        expect(classOf("1_000_000", "1_000_000")).toBe("number");
    });

    it("underscore-separated with suffix", () => {
        expect(classOf("1_000u64", "1_000u64")).toBe("number");
    });

    it("zero", () => {
        expect(classOf("0", "0")).toBe("number");
    });
});

// ─── Realistic code snippets ──────────────────────────────────────────────────

describe("realistic Rust snippets", () => {
    it("function definition", () => {
        const src = "fn add(a: i32, b: i32) -> i32 { a + b }";
        assertLossless(src);
        const tokens = tokenize(src);
        expect(findToken(tokens, "fn")?.c).toBe("keyword");
        expect(findToken(tokens, "i32")?.c).toBe("type");
    });

    it("struct definition", () => {
        const src = "struct Point { x: f32, y: f32 }";
        assertLossless(src);
        const tokens = tokenize(src);
        expect(findToken(tokens, "struct")?.c).toBe("keyword");
        expect(findToken(tokens, "Point")?.c).toBe("type");
        expect(findToken(tokens, "f32")?.c).toBe("type");
    });

    it("match expression", () => {
        const src = `match x {
    Some(v) => v,
    None => 0,
}`;
        assertLossless(src);
        const tokens = tokenize(src);
        expect(findToken(tokens, "match")?.c).toBe("keyword");
        expect(findToken(tokens, "Some")?.c).toBe("type");
        expect(findToken(tokens, "None")?.c).toBe("type");
    });

    it("use statement", () => {
        const src = "use std::collections::HashMap;";
        assertLossless(src);
        expect(findToken(tokenize(src), "use")?.c).toBe("keyword");
    });

    it("generic function with lifetime", () => {
        const src = "fn first<'a>(slice: &'a [i32]) -> &'a i32 { &slice[0] }";
        assertLossless(src);
        const tokens = tokenize(src);
        expect(findToken(tokens, "fn")?.c).toBe("keyword");
        expect(findToken(tokens, "'a")?.c).toBe("lifetime");
    });

    it("impl block with doc comment", () => {
        const src = `/// Returns the area.
impl Rectangle {
    pub fn area(&self) -> f64 {
        self.width * self.height
    }
}`;
        assertLossless(src);
        const tokens = tokenize(src);
        const doc = tokens.find((tk) => tk.c === "docComment");
        expect(doc?.t).toBe("/// Returns the area.");
        expect(findToken(tokens, "impl")?.c).toBe("keyword");
        expect(findToken(tokens, "pub")?.c).toBe("keyword");
        expect(findToken(tokens, "f64")?.c).toBe("type");
    });

    it("macro with string argument", () => {
        const src = 'println!("Value: {}", x);';
        assertLossless(src);
        const tokens = tokenize(src);
        expect(findToken(tokens, "println!")?.c).toBe("macro");
        expect(findToken(tokens, '"Value: {}"')?.c).toBe("string");
    });

    it("derive attribute above struct", () => {
        const src = `#[derive(Debug, Clone, PartialEq)]
struct Foo {
    bar: String,
}`;
        assertLossless(src);
        const tokens = tokenize(src);
        expect(findToken(tokens, "#[derive(Debug, Clone, PartialEq)]")?.c).toBe(
            "attribute"
        );
        expect(findToken(tokens, "struct")?.c).toBe("keyword");
        expect(findToken(tokens, "String")?.c).toBe("type");
    });
});

// ─── Token class shape ────────────────────────────────────────────────────────

describe("Token shape", () => {
    it("every token has a non-empty .t and a defined .c", () => {
        const src = `fn main() {
    let x: Vec<String> = vec!["hello"];
    // comment
    println!("{:?}", x);
}`;
        const tokens = tokenize(src);
        for (const tk of tokens) {
            expect(tk.t.length).toBeGreaterThan(0);
            expect(tk.c).toBeDefined();
        }
    });

    it("no overlapping tokens — adjacent tokens cover consecutive characters", () => {
        const src = "let x: i32 = 42; // done\n";
        const tokens = tokenize(src);
        let pos = 0;
        for (const tk of tokens) {
            expect(src.indexOf(tk.t, pos)).toBe(pos);
            pos += tk.t.length;
        }
        expect(pos).toBe(src.length);
    });
});
