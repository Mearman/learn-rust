import type { CompilerErrorTranscript } from "./types.ts";

/**
 * Annotated rustc error transcripts for the "reading errors" skill section.
 *
 * Every `transcript` below is the real, unedited stderr emitted by
 * `rustc 1.95.0` (edition 2024) when compiling the matching `source`. The
 * annotation `line` indices are 0-based positions into `transcript.split("\n")`.
 *
 * Ordered by structural complexity, per the pedagogy proposal: E0308 (type
 * mismatch) -> E0502/E0505 (borrow conflicts) -> E0597 (lifetime) -> E0277
 * (trait bound).
 */
export const COMPILER_ERROR_TRANSCRIPTS: readonly CompilerErrorTranscript[] = [
    {
        id: "e0308-let-binding",
        code: "E0308",
        title: "Mismatched types",
        level: "warm-up",
        source: `fn main() {
    let count: u32 = "42";
    println!("{count}");
}`,
        transcript: `error[E0308]: mismatched types
 --> e0308.rs:2:22
  |
2 |     let count: u32 = "42";
  |                ---   ^^^^ expected \`u32\`, found \`&str\`
  |                |
  |                expected due to this

error: aborting due to 1 previous error

For more information about this error, try \`rustc --explain E0308\`.`,
        annotations: [
            {
                line: 0,
                span: 1,
                role: "error-code",
                note: "The error code and one-line summary. E0308 always means the type the compiler inferred or required does not match the type you supplied. Run `rustc --explain E0308` for the canonical description.",
            },
            {
                line: 1,
                span: 1,
                role: "primary-span",
                note: "The location header: file `e0308.rs`, line 2, column 22. This points at the expression whose type is wrong — the string literal, not the annotation.",
            },
            {
                line: 4,
                span: 1,
                role: "primary-span",
                note: 'The caret span `^^^^` underlines `"42"` and states the mismatch directly: `expected u32, found &str`. "Found" is what you wrote; "expected" is what that position demands.',
            },
            {
                line: 6,
                span: 1,
                role: "secondary-span",
                note: "The secondary span `expected due to this` ties the requirement back to the `: u32` annotation — that is *why* a `u32` was expected here. Secondary spans explain where a constraint came from.",
            },
        ],
        question:
            'The compiler says `expected u32, found &str`. Which part of the line is wrong — the annotation `: u32` or the value `"42"` — and what is the smallest fix?',
        answer: 'Neither is "wrong" in isolation; they disagree. The value `"42"` is a string slice (`&str`), but `: u32` requires an unsigned integer. The smallest fix is to use a numeric literal: `let count: u32 = 42;`. If the value genuinely arrives as text, parse it: `let count: u32 = "42".parse().unwrap();` (which returns a `Result` you must handle).',
        conceptId: "string-types",
    },
    {
        id: "e0502-push-while-borrowed",
        code: "E0502",
        title: "Cannot borrow as mutable because also borrowed as immutable",
        level: "core",
        source: `fn main() {
    let mut v = vec![1, 2, 3];
    let first = &v[0];
    v.push(4);
    println!("{first}");
}`,
        transcript: `error[E0502]: cannot borrow \`v\` as mutable because it is also borrowed as immutable
 --> e0502.rs:4:5
  |
3 |     let first = &v[0];
  |                  - immutable borrow occurs here
4 |     v.push(4);
  |     ^^^^^^^^^ mutable borrow occurs here
5 |     println!("{first}");
  |                ----- immutable borrow later used here

error: aborting due to 1 previous error

For more information about this error, try \`rustc --explain E0502\`.`,
        annotations: [
            {
                line: 0,
                span: 1,
                role: "error-code",
                note: "E0502: a mutable borrow was attempted while an immutable borrow of the same value is still live. Rust forbids a `&mut` while any `&` to the same data exists.",
            },
            {
                line: 1,
                span: 1,
                role: "primary-span",
                note: "The header points at line 4, column 5 — `v.push(4)` — because that is the mutable borrow the compiler rejected.",
            },
            {
                line: 4,
                span: 1,
                role: "secondary-span",
                note: "First of three spans that tell the *story* of the conflict. `immutable borrow occurs here` marks where `first = &v[0]` took a shared reference into `v`.",
            },
            {
                line: 6,
                span: 1,
                role: "primary-span",
                note: "`mutable borrow occurs here` (caret span) is the offending line: `push` needs `&mut self`, an exclusive borrow.",
            },
            {
                line: 8,
                span: 1,
                role: "secondary-span",
                note: "`immutable borrow later used here` is the crucial third span — it proves the shared borrow `first` is still alive *after* the `push`, so the two borrows genuinely overlap.",
            },
        ],
        question:
            "Three spans describe this conflict. Read them in order: which line creates the immutable borrow, which line needs the mutable borrow, and what keeps the immutable borrow alive long enough to clash?",
        answer: '`let first = &v[0]` creates the immutable borrow. `v.push(4)` needs a mutable (exclusive) borrow. The `println!("{first}")` on the last line *uses* `first` after the push, so the immutable borrow\'s lifetime extends past the push and the two overlap. Fix it by ending the shared borrow before mutating — e.g. read and copy the value first (`let first = v[0];`, since `i32` is `Copy`), or move the `println!` before the `push`.',
        conceptId: "reference-semantics",
    },
    {
        id: "e0505-move-while-borrowed",
        code: "E0505",
        title: "Cannot move out of value because it is borrowed",
        level: "core",
        source: `fn main() {
    let s = String::from("hello");
    let r = &s;
    drop(s);
    println!("{r}");
}`,
        transcript: `error[E0505]: cannot move out of \`s\` because it is borrowed
 --> e0505.rs:4:10
  |
2 |     let s = String::from("hello");
  |         - binding \`s\` declared here
3 |     let r = &s;
  |             -- borrow of \`s\` occurs here
4 |     drop(s);
  |          ^ move out of \`s\` occurs here
5 |     println!("{r}");
  |                - borrow later used here
  |
help: consider cloning the value if the performance cost is acceptable
  |
3 |     let r = &s.clone();
  |               ++++++++

error: aborting due to 1 previous error

For more information about this error, try \`rustc --explain E0505\`.`,
        annotations: [
            {
                line: 0,
                span: 1,
                role: "error-code",
                note: "E0505: a value was moved while a reference to it is still live. Closely related to E0502 — here the conflict is a move (passing `s` by value to `drop`) rather than a second borrow.",
            },
            {
                line: 1,
                span: 1,
                role: "primary-span",
                note: "Header points at line 4, column 10 — the `s` argument inside `drop(s)`, where ownership of `s` is moved out.",
            },
            {
                line: 4,
                span: 1,
                role: "secondary-span",
                note: "`binding s declared here` orients you to where the owned value lives. Background context, not the problem itself.",
            },
            {
                line: 6,
                span: 1,
                role: "secondary-span",
                note: "`borrow of s occurs here` marks `let r = &s` — the reference that conflicts with the move.",
            },
            {
                line: 8,
                span: 1,
                role: "primary-span",
                note: "`move out of s occurs here` (caret span): `drop(s)` takes `s` by value, which would invalidate any outstanding reference.",
            },
            {
                line: 10,
                span: 1,
                role: "secondary-span",
                note: "`borrow later used here` proves `r` is still needed after the move, so the borrow really does outlive it.",
            },
            {
                line: 12,
                span: 4,
                role: "help",
                note: "The `help:` block (lines 12–15) suggests a concrete edit — `&s.clone()` — and shows it inline with `++++++++` marking the inserted text. rustc's suggestions are sometimes the right fix and sometimes a hint; here cloning works but the better fix is to reorder.",
            },
        ],
        question:
            "rustc helpfully suggests changing line 3 to `&s.clone()`. Would that compile, and is it the fix you actually want here?",
        answer: "Cloning would compile: `r` would borrow a clone, leaving the original `s` free to move into `drop`. But it allocates a second `String` purely to satisfy the borrow checker, which is wasteful. The real intent is unclear — if you wanted to free `s` early, you should not still be using a reference to it afterwards. The cleaner fix is to reorder so the borrow ends before the move: use `r` (the `println!`) before `drop(s)`, or simply drop the explicit `drop` call and let `s` fall out of scope.",
        conceptId: "reference-semantics",
    },
    {
        id: "e0597-borrow-outlives-scope",
        code: "E0597",
        title: "Value does not live long enough",
        level: "tricky",
        source: `fn main() {
    let r;
    {
        let x = 5;
        r = &x;
    }
    println!("{r}");
}`,
        transcript: `error[E0597]: \`x\` does not live long enough
 --> e0597.rs:5:13
  |
4 |         let x = 5;
  |             - binding \`x\` declared here
5 |         r = &x;
  |             ^^ borrowed value does not live long enough
6 |     }
  |     - \`x\` dropped here while still borrowed
7 |     println!("{r}");
  |                - borrow later used here

error: aborting due to 1 previous error

For more information about this error, try \`rustc --explain E0597\`.`,
        annotations: [
            {
                line: 0,
                span: 1,
                role: "error-code",
                note: "E0597: a borrow outlives the value it points to. This is the dangling-reference error the borrow checker exists to prevent.",
            },
            {
                line: 1,
                span: 1,
                role: "primary-span",
                note: "Header points at line 5, column 13 — the `&x` that takes a reference into the short-lived `x`.",
            },
            {
                line: 4,
                span: 1,
                role: "secondary-span",
                note: "`binding x declared here` shows where the borrowed value is created — inside the inner `{ }` block.",
            },
            {
                line: 6,
                span: 1,
                role: "primary-span",
                note: "`borrowed value does not live long enough` (caret span) is the heart of the error: the reference is fine *now*, but it cannot survive past `x`.",
            },
            {
                line: 8,
                span: 1,
                role: "secondary-span",
                note: "`x dropped here while still borrowed` points at the closing brace `}` — the exact point where `x` is destroyed. This is the deadline the borrow misses.",
            },
            {
                line: 10,
                span: 1,
                role: "secondary-span",
                note: "`borrow later used here` shows `r` being read *after* the block, i.e. after `x` is gone. Together these two spans bracket the dangling window.",
            },
        ],
        question:
            "E0597 says `x does not live long enough`. Long enough for what, exactly — and why does moving the `println!` inside the block fix it?",
        answer: '`x` is declared inside the inner block, so it is dropped at the closing `}` on line 6. The reference `r = &x` must remain valid for as long as `r` is used, but `r` is read on line 7 *after* `x` is gone — that would be a dangling pointer. `x` does not live long enough to cover that final use. Moving `println!("{r}")` inside the block keeps the use within `x`\'s lifetime. Alternatively, give `x` the outer scope (declare it before the block) or store an owned value in `r` instead of a borrow.',
        conceptId: "reference-validity",
    },
    {
        id: "e0277-display-not-implemented",
        code: "E0277",
        title: "Trait bound not satisfied",
        level: "tricky",
        source: `use std::fmt::Display;

fn show<T: Display>(value: T) {
    println!("{value}");
}

struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let p = Point { x: 1, y: 2 };
    show(p);
}`,
        transcript: `error[E0277]: \`Point\` doesn't implement \`std::fmt::Display\`
  --> e0277.rs:14:10
   |
14 |     show(p);
   |     ---- ^ unsatisfied trait bound
   |     |
   |     required by a bound introduced by this call
   |
help: the trait \`std::fmt::Display\` is not implemented for \`Point\`
  --> e0277.rs:7:1
   |
 7 | struct Point {
   | ^^^^^^^^^^^^
note: required by a bound in \`show\`
  --> e0277.rs:3:12
   |
 3 | fn show<T: Display>(value: T) {
   |            ^^^^^^^ required by this bound in \`show\`

error: aborting due to 1 previous error

For more information about this error, try \`rustc --explain E0277\`.`,
        annotations: [
            {
                line: 0,
                span: 1,
                role: "error-code",
                note: "E0277: a required trait bound is not satisfied. The summary names both the type (`Point`) and the missing trait (`std::fmt::Display`).",
            },
            {
                line: 1,
                span: 1,
                role: "primary-span",
                note: "Header points at line 14, column 10 — the call site `show(p)`, where the unmet bound is triggered.",
            },
            {
                line: 4,
                span: 1,
                role: "primary-span",
                note: "`unsatisfied trait bound` (caret span) underlines the argument `p` whose type does not meet `show`'s requirement.",
            },
            {
                line: 6,
                span: 1,
                role: "secondary-span",
                note: "`required by a bound introduced by this call` explains *why* the bound matters here: it is this specific call that demands it.",
            },
            {
                line: 8,
                span: 6,
                role: "help",
                note: "The `help:` block (lines 8–13) restates the problem precisely — `Display` is not implemented for `Point` — and points at the `struct Point` definition, the place you would add the implementation.",
            },
            {
                line: 14,
                span: 5,
                role: "note",
                note: "The `note:` block (lines 14–18) is the key to E0277: it shows *where the bound comes from* — `fn show<T: Display>`. The `T: Display` constraint on line 3 is the requirement `Point` failed to meet. Trace from the call site (primary span) to this note to find the contract.",
            },
        ],
        question:
            "Two locations are highlighted: the `struct Point` definition and the `fn show` signature. Which one states the *requirement*, and what are your two options for satisfying it?",
        answer: "The `note: required by a bound in show` block points at `fn show<T: Display>` — line 3 is where the requirement is stated: any `T` passed to `show` must implement `Display`. The `help` block points at `struct Point`, which is where you would *satisfy* it. Two options: implement `Display` for `Point` (`impl std::fmt::Display for Point { ... }`), or change `show`'s bound to one `Point` can meet — e.g. derive `Debug` on `Point` and use `T: Debug` with `{value:?}` formatting.",
        conceptId: "behaviour-abstraction",
    },
];
