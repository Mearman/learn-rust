import {
    type LucideIcon,
    Package,
    GitBranch,
    Anchor,
    AlignLeft,
    Braces,
    Shield,
    Layers,
    Type,
    Repeat,
    Boxes,
} from "lucide-react";
import type {
    BackgroundLanguage,
    ExperienceLevel,
} from "../settings/types.ts";

// ---------------------------------------------------------------------------
// Block types
// ---------------------------------------------------------------------------

export interface LessonBlockBase {
    readonly kind: string;
    readonly text?: string;
}

export interface TextBlock extends LessonBlockBase {
    readonly kind: "text";
    readonly text: string;
    readonly level?: ExperienceLevel;
}

export interface CodeBlock extends LessonBlockBase {
    readonly kind: "code";
    readonly label: string;
    readonly code: string;
    readonly level?: ExperienceLevel;
}

export interface NoteBlock extends LessonBlockBase {
    readonly kind: "note";
    readonly text: string;
    readonly level?: ExperienceLevel;
}

export interface AnalogyBlock extends LessonBlockBase {
    readonly kind: "analogy";
    readonly text: string;
    readonly comparisons?: Partial<
        Record<Exclude<BackgroundLanguage, "none">, string>
    >;
}

export interface ComparisonBlock extends LessonBlockBase {
    readonly kind: "comparison";
    readonly rustCode: string;
    readonly comparisons: Partial<
        Record<
            Exclude<BackgroundLanguage, "none">,
            {
                readonly code: string;
                readonly notes?: string;
            }
        >
    >;
}

export interface DeepDiveBlock extends LessonBlockBase {
    readonly kind: "deep-dive";
    readonly title: string;
    readonly blocks: readonly LessonBlock[];
}

export type LessonBlock =
    | TextBlock
    | CodeBlock
    | NoteBlock
    | AnalogyBlock
    | ComparisonBlock
    | DeepDiveBlock;

export interface Lesson {
    readonly id: string;
    readonly title: string;
    readonly icon: LucideIcon;
    readonly tagline: string;
    readonly blocks: readonly LessonBlock[];
}

// ---------------------------------------------------------------------------
// Language comparison helper — the code for all 7 languages in one place
// ---------------------------------------------------------------------------


// ---------------------------------------------------------------------------
// Lessons
// ---------------------------------------------------------------------------

export const LESSONS: readonly Lesson[] = [
    // ── 1. Ownership ────────────────────────────────────────────────────
    {
        id: "ownership",
        title: "Ownership",
        icon: Package,
        tagline:
            "One owner per value. Memory freed on scope exit. No GC, no manual free.",
        blocks: [
            {
                kind: "text",
                level: "beginner",
                text: "Every value in Rust has exactly one owner. When the owner goes out of scope the value is dropped and its memory is reclaimed automatically. There is no garbage collector and no manual free.",
            },
            {
                kind: "text",
                text: "Assigning or passing a value that is not Copy moves it. The source binding becomes invalid, so a value can never be freed twice or read after it is gone. The check happens entirely at compile time.",
            },
            {
                kind: "code",
                label: "move.rs",
                code: `fn main() {\n    let s1 = String::from("owned");\n    let s2 = s1;          // ownership moves into s2\n    // println!("{}", s1); // error: s1 was moved\n    println!("{}", s2);   // fine\n} // s2 dropped here, heap buffer freed`,
            },
            {
                kind: "comparison",
                rustCode: `// Rust: ownership moves, old binding invalid\nlet s1 = String::from("hello");\nlet s2 = s1;\n// s1 is now invalid; compile error if used`,
                comparisons: {
                    python: {
                        code: `# Python: variables are references;\n# GC tracks object lifetime\ns1 = "hello"\ns2 = s1  # both names point to same object\n# no concept of "moved from"`,
                        notes:
                            "Python uses reference counting + a cycle collector. Both names remain valid until they go out of scope or are deleted.",
                    },
                    typescript: {
                        code: `// TypeScript/JS: all values are GC-tracked\nconst s1 = "hello";\nconst s2 = s1;  // primitive is copied, string is immutable\n// both are always valid`,
                        notes:
                            "JS primitives (including strings) are copied on assignment. Objects share the reference and are GC'd when unreachable.",
                    },
                    java: {
                        code: `// Java: references with GC\nString s1 = "hello";\nString s2 = s1;  // copies the reference, not the object\n// both references remain valid`,
                        notes:
                            "Java has no move semantics. All objects live on the heap and are garbage collected. Identity is by reference.",
                    },
                    kotlin: {
                        code: `// Kotlin: same JVM model as Java\nval s1 = "hello"\nval s2 = s1  // reference copy\n// both valid, GC-managed`,
                        notes:
                            "Kotlin runs on the JVM (or JS/native) with the same GC model. No move semantics exist.",
                    },
                    go: {
                        code: `// Go: escape analysis + GC\nfunc main() {\n    s1 := "hello"\n    s2 := s1  // copies the string header (pointer + len)\n    // both valid until GC collects`,
                        notes:
                            "Go strings are immutable slices (pointer + length). Assignment copies the header. The underlying data is GC'd.",
                    },
                    csharp: {
                        code: `// C#: references with GC\nstring s1 = "hello";\nstring s2 = s1;  // copies the reference\n// both valid, GC-managed`,
                        notes:
                            "C# strings are immutable reference types. Assignment copies the reference, not the data.",
                    },
                    cpp: {
                        code: `// C++: unique_ptr models single ownership\nauto s1 = std::make_unique<std::string>("hello");\nauto s2 = std::move(s1);  // explicit move required\n// s1 is now nullptr; accessing it is UB`,
                        notes:
                            "Rust's ownership is like unique_ptr but enforced at compile time. No need for std::move — the compiler tracks it.",
                    },
                },
            },
            {
                kind: "note",
                text: "Scalar types (integers, bool, char, and tuples/arrays of Copy types) implement Copy, so they are duplicated on assignment instead of moved.",
            },
            {
                kind: "analogy",
                text: "Close to a std::unique_ptr whose moves the compiler tracks for you, except the old binding is statically forbidden rather than left dangling.",
                comparisons: {
                    python:
                        "Like a variable that can only have one name — except Python has no such concept. The GC lets any number of names point to the same object.",
                    typescript:
                        "Like const with an object that can only be held by one variable at a time — JS doesn't enforce this; the GC just waits until nothing references it.",
                    java: "Like a reference you can only hand off, never duplicate — but Java has no mechanism for this. Everything is shared and GC'd.",
                    kotlin:
                        "Like a val that transfers ownership — but Kotlin shares all references freely and relies on the JVM GC.",
                    go: "Like passing a pointer that invalidates the old variable — Go doesn't do this; everything shared is GC'd.",
                    csharp:
                        "Like a ref that can only belong to one variable at a time — C# doesn't enforce this. References are shared and GC'd.",
                    cpp: "Close to a std::unique_ptr whose moves the compiler tracks for you, except the old binding is statically forbidden rather than left dangling.",
                },
            },
            {
                kind: "deep-dive",
                title: "How ownership interacts with Drop",
                blocks: [
                    {
                        kind: "text",
                        text: "When an owner goes out of scope, Rust automatically calls the Drop::drop method if the type implements the Drop trait. This is the single place cleanup happens — there is no finaliser, no destructor chain, no RAII ambiguity.",
                    },
                    {
                        kind: "code",
                        label: "drop.rs",
                        code: `struct Guard {\n    name: String,\n}\n\nimpl Drop for Guard {\n    fn drop(&mut self) {\n        println!("dropping {}", self.name);\n    }\n}\n\nfn main() {\n    let _g1 = Guard { name: String::from("first") };\n    {\n        let _g2 = Guard { name: String::from("second") };\n    } // g2 dropped here\n    println!("between drops");\n} // g1 dropped here`,
                    },
                    {
                        kind: "text",
                        text: "Drop runs in reverse declaration order within a scope, mirroring C++'s RAII destruction order. Because ownership is single, drop is guaranteed to execute exactly once — no double-free.",
                    },
                ],
            },
        ],
    },

    // ── 2. Borrowing & references ───────────────────────────────────────
    {
        id: "borrowing",
        title: "Borrowing & references",
        icon: GitBranch,
        tagline:
            "Access without owning. Many shared reads xor one exclusive write.",
        blocks: [
            {
                kind: "text",
                level: "beginner",
                text: "A reference lets you read or mutate a value without taking ownership. &T is a shared (immutable) reference; &mut T is an exclusive (mutable) reference.",
            },
            {
                kind: "text",
                text: "The central rule: at any point you may hold either one &mut T, or any number of &T, but never both at once. This single constraint is what makes data races impossible in safe Rust.",
            },
            {
                kind: "code",
                label: "borrow.rs",
                code: `fn main() {\n    let mut total = 0;\n    let nums = vec![1, 2, 3];\n\n    let view = &nums;           // shared borrow\n    for n in view { total += n; }\n\n    let slot = &mut total;      // exclusive borrow (view no longer used)\n    *slot += 10;\n\n    println!("{}", total);      // 16\n}`,
            },
            {
                kind: "comparison",
                rustCode: `// Rust: &T for shared, &mut T for exclusive\nfn add_one(v: &mut Vec<i32>) {\n    v.push(1);\n}\n\nfn peek(v: &Vec<i32>) -> i32 {\n    v[0]\n}`,
                comparisons: {
                    python: {
                        code: `# Python: all variables are references;\n# mutation is always visible to all names\ndef add_one(v):\n    v.append(1)\n\ndef peek(v):\n    return v[0]`,
                        notes:
                            "No concept of shared vs exclusive. Any reference can mutate at any time — data races are possible in threaded code.",
                    },
                    typescript: {
                        code: `// TypeScript: const prevents reassignment,\n// not mutation\nfunction addOne(v: number[]) {\n    v.push(1);\n}\n\nfunction peek(v: number[]): number {\n    return v[0];\n}`,
                        notes:
                            "No aliasing control. const only prevents reassigning the variable, not mutating the object it points to.",
                    },
                    java: {
                        code: `// Java: references are shared by default\nvoid addOne(List<Integer> v) {\n    v.add(1);\n}\n\nint peek(List<Integer> v) {\n    return v.get(0);  // v could be mutated elsewhere\n}`,
                        notes:
                            "No mechanism to prevent aliasing. Collections.unmodifiableList creates a read-only wrapper but doesn't prevent the backing list from changing.",
                    },
                    kotlin: {
                        code: `// Kotlin: val prevents reassignment, not mutation\nfun addOne(v: MutableList<Int>) {\n    v.add(1)\n}\n\nfun peek(v: List<Int>): Int = v[0]`,
                        notes:
                            "val is like const in JS — prevents reassignment only. List vs MutableList distinguishes read-only from mutable, but read-only is a view, not a guarantee.",
                    },
                    go: {
                        code: `// Go: pointers allow mutation; no aliasing rules\nfunc addOne(v *[]int) {\n    *v = append(*v, 1)\n}\n\nfunc peek(v []int) int {\n    return v[0]  // slice passed by value (descriptor)\n}`,
                        notes:
                            "Slices are reference-like (pointer + len + cap). No aliasing protection. The race detector catches bugs at runtime, not compile time.",
                    },
                    csharp: {
                        code: `// C#: ref parameters for explicit references\nvoid AddOne(ref List<int> v) {\n    v.Add(1);\n}\n\nint Peek(List<int> v) {\n    return v[0];  // v could be mutated on another thread\n}`,
                        notes:
                            "ref is close to &mut but without the aliasing guarantee. in (C# 7.2+) is close to &T but also not enforced for thread safety.",
                    },
                    cpp: {
                        code: `// C++: T& for shared, no built-in exclusivity\nvoid add_one(std::vector<int>& v) {\n    v.push_back(1);\n}\n\nint peek(const std::vector<int>& v) {\n    return v[0];  // const reference, but others\n                   // might hold non-const refs\n}`,
                        notes:
                            "const T& is like &T, T& is like &mut T — but the compiler doesn't enforce exclusive access. Data races compile fine.",
                    },
                },
            },
            {
                kind: "note",
                text: "A borrow ends at its last use, not at the closing brace (non-lexical lifetimes). Code that looks like it conflicts often compiles because the earlier borrow is already finished.",
            },
            {
                kind: "deep-dive",
                title: "Non-lexical lifetimes and the borrow checker's MIR",
                blocks: [
                    {
                        kind: "text",
                        text: "Rust's borrow checker operates on the Mid-level Intermediate Representation (MIR), not the AST. MIR models control flow as a graph of basic blocks, and lifetimes are regions in that graph — not lexical scopes.",
                    },
                    {
                        kind: "text",
                        text: "A reference's lifetime starts at its creation and ends at its last use (not at the enclosing scope's closing brace). This is why NLL allows patterns that would fail under a lexical model.",
                    },
                    {
                        kind: "code",
                        label: "nll.rs",
                        code: `fn main() {\n    let mut x = 1;\n    let r = &x;         // borrow starts\n    println!("{}", r);  // last use of r → borrow ends\n    x += 1;            // fine: r is no longer live\n    println!("{}", x);\n}`,
                    },
                ],
            },
        ],
    },

    // ── 3. Lifetimes ────────────────────────────────────────────────────
    {
        id: "lifetimes",
        title: "Lifetimes",
        icon: Anchor,
        tagline: "A reference may never outlive the data it points at.",
        blocks: [
            {
                kind: "text",
                level: "beginner",
                text: "A lifetime is the region of code during which a reference is valid. The borrow checker uses lifetimes to guarantee no reference outlives its data.",
            },
            {
                kind: "text",
                text: "Most lifetimes are inferred. You annotate them only when the compiler cannot relate input and output references on its own, which mostly happens in function signatures and in structs that hold references.",
            },
            {
                kind: "code",
                label: "lifetimes.rs",
                code: `// 'a says: the result lives at least as long as both inputs\nfn longest<'a>(x: &'a str, y: &'a str) -> &'a str {\n    if x.len() > y.len() { x } else { y }\n}\n\nstruct Excerpt<'a> {\n    part: &'a str,  // a struct holding a reference needs a lifetime\n}`,
            },
            {
                kind: "comparison",
                rustCode: `// Rust: explicit lifetime relationship\nfn longest<'a>(x: &'a str, y: &'a str) -> &'a str {\n    if x.len() > y.len() { x } else { y }\n}`,
                comparisons: {
                    python: {
                        code: `# Python: no lifetime concept;\n# GC keeps objects alive as long as\n# any reference exists\ndef longest(x, y):\n    return x if len(x) > len(y) else y`,
                        notes:
                            "Python's GC ensures objects live as long as any reference exists. No lifetime annotations needed — but also no compile-time guarantee.",
                    },
                    typescript: {
                        code: `// TypeScript: GC-managed, no lifetimes\nfunction longest(x: string, y: string): string {\n    return x.length > y.length ? x : y;\n}`,
                        notes:
                            "JS strings are primitives and always valid. For objects, the GC handles lifetimes at runtime.",
                    },
                    java: {
                        code: `// Java: GC-managed, no lifetime annotations\nstatic String longest(String x, String y) {\n    return x.length() > y.length() ? x : y;\n}`,
                        notes:
                            "Java references are always valid (or null). No way to express that a return value depends on an argument's lifetime.",
                    },
                    kotlin: {
                        code: `// Kotlin: same JVM model\nfun longest(x: String, y: String): String =\n    if (x.length > y.length) x else y`,
                        notes:
                            "Same as Java — GC manages lifetimes. No compile-time lifetime tracking.",
                    },
                    go: {
                        code: `// Go: escape analysis handles this;\n// no lifetime annotations\nfunc longest(x, y string) string {\n    if len(x) > len(y) {\n        return x\n    }\n    return y\n}`,
                        notes:
                            "Go's escape analysis decides stack vs heap. No way to express lifetime constraints — the GC handles it.",
                    },
                    csharp: {
                        code: `// C#: GC-managed, no lifetimes\nstatic string Longest(string x, string y) {\n    return x.Length > y.Length ? x : y;\n}`,
                        notes:
                            "C# references are GC-managed. ref struct and Span<T> (C# 7.2+) introduce stack-only constraints somewhat similar to lifetimes.",
                    },
                    cpp: {
                        code: `// C++: no lifetime annotations;\n// dangling references are UB\nconst std::string& longest(\n    const std::string& x,\n    const std::string& y) {\n    return x.size() > y.size() ? x : y;\n}`,
                        notes:
                            "Same signature shape, but the compiler can't verify the returned reference outlives its callers. Dangling references are undefined behaviour.",
                    },
                },
            },
            {
                kind: "note",
                text: "Annotations never change how long anything lives. They only describe a relationship the compiler then verifies.",
            },
            {
                kind: "deep-dive",
                title: "Variance and how lifetimes compose",
                blocks: [
                    {
                        kind: "text",
                        text: "Lifetimes have variance — a subtyping relationship. &'a T is covariant in 'a: a longer lifetime satisfies a shorter one. &mut T is invariant: you cannot shorten or lengthen the lifetime of an exclusive reference.",
                    },
                    {
                        kind: "text",
                        text: "This is why you can assign &'static str to a variable expecting &'a str, but cannot assign &mut &'static str to a variable expecting &mut &'a str. Invariance prevents the shorter-lived reference from being written through the longer-lived one.",
                    },
                    {
                        kind: "code",
                        label: "variance.rs",
                        code: `fn covariance() {\n    let s: &'static str = "static";\n    let x: &str = s;  // fine: 'static outlives any 'a\n}\n\nfn invariance() {\n    let mut s: &'static str = "static";\n    // let r: &mut &str = &mut s;  // error: &mut is invariant\n}`,
                    },
                ],
            },
        ],
    },

    // ── 4. Slices & strings ─────────────────────────────────────────────
    {
        id: "slices",
        title: "Slices & strings",
        icon: AlignLeft,
        tagline:
            "Borrowed windows into contiguous data. String owns, &str views.",
        blocks: [
            {
                kind: "text",
                level: "beginner",
                text: "A slice &[T] (and its string form &str) is a borrowed view into a contiguous run of elements: a pointer plus a length. It owns nothing and allocates nothing.",
            },
            {
                kind: "text",
                text: "String is a growable, heap-allocated, owned UTF-8 buffer. &str is a borrowed view into one (or into a string literal). Prefer &str for parameters so callers can pass either.",
            },
            {
                kind: "code",
                label: "slices.rs",
                code: `fn first_word(s: &str) -> &str {\n    for (i, b) in s.bytes().enumerate() {\n        if b == b' ' { return &s[..i]; }\n    }\n    s\n}\n\nfn main() {\n    let owned = String::from("hello world");\n    println!("{}", first_word(&owned)); // "hello"\n    println!("{}", first_word("loose"));// literal is already &str\n}`,
            },
            {
                kind: "comparison",
                rustCode: `// Rust: &str is a borrowed view, String owns\nfn greet(name: &str) -> String {\n    format!("Hello, {}!", name)\n}\n\nlet s = greet("world");  // &str literal\nlet s2 = greet(&owned);  // &String coerces to &str`,
                comparisons: {
                    python: {
                        code: `# Python: str is immutable, always "borrowed"\ndef greet(name: str) -> str:\n    return f"Hello, {name}!"\n\ns = greet("world")  # no owned/borrowed distinction`,
                        notes:
                            "Python has one string type. All strings are immutable and GC'd. No slice/view distinction — slicing creates a new string.",
                    },
                    typescript: {
                        code: `// TypeScript: string is immutable primitive\nfunction greet(name: string): string {\n    return \`Hello, \${name}!\`;\n}\n\nconst s = greet("world");  // always a new string`,
                        notes:
                            "JS strings are immutable primitives. No owned/borrowed distinction. Substring creates a new string.",
                    },
                    java: {
                        code: `// Java: String is immutable heap object\nstatic String greet(String name) {\n    return "Hello, " + name + "!";\n}\n\nString s = greet("world");`,
                        notes:
                            "Java String is an immutable reference type. Substring used to share the backing array (Java 6) but now copies. StringBuilder is the mutable analogue.",
                    },
                    kotlin: {
                        code: `// Kotlin: String is same as Java\nfun greet(name: String): String =\n    "Hello, $name!"\n\nval s = greet("world")`,
                        notes:
                            "Kotlin shares Java's String. String templates are built-in. buildString {} is the mutable builder analogue.",
                    },
                    go: {
                        code: `// Go: string is immutable slice header\nfunc greet(name string) string {\n    return fmt.Sprintf("Hello, %s!", name)\n}\n\ns := greet("world")\n// []byte(s) for mutable view`,
                        notes:
                            "Go strings are immutable byte slices (pointer + length). []byte converts to a mutable copy. No separate owned/borrowed string types.",
                    },
                    csharp: {
                        code: `// C#: string is immutable reference type\nstatic string Greet(string name) {\n    return $"Hello, {name}!";\n}\n\nstring s = Greet("world");\n// Span<char> / ReadOnlySpan<char> for views`,
                        notes:
                            "C# string is immutable. ReadOnlySpan<char> is the closest analogue to &str — a borrowed view without allocation.",
                    },
                    cpp: {
                        code: `// C++: std::string owns, std::string_view borrows\nstd::string greet(std::string_view name) {\n    return "Hello, " + std::string(name) + "!";\n}\n\nstd::string s = greet("world");  // literal → string_view`,
                        notes:
                            "string_view is the direct equivalent of &str. std::string is the equivalent of String. The same owned/borrowed split exists.",
                    },
                },
            },
            {
                kind: "analogy",
                text: "string_view is &str, std::string is String. Rust enforces at compile time that a &str never outlives its backing storage.",
                comparisons: {
                    python:
                        "Python's str is always immutable and GC'd — there's no owned/borrowed split. Every string operation creates a new string.",
                    typescript:
                        "JS strings are always GC'd primitives. There's no borrowed view of a string — substring always allocates.",
                    java: "Java's String is always heap-allocated and GC'd. Substring now copies the backing array. StringBuilder is the mutable builder.",
                    kotlin:
                        "Kotlin uses Java's String — always GC'd. buildString {} is the mutable builder pattern.",
                    go: "Go's string is an immutable byte slice header. []byte creates a mutable copy. Go has no separate owned string type.",
                    csharp:
                        "C#'s string is immutable. ReadOnlySpan<char> is the closest thing to &str — a borrowed view without allocation.",
                    cpp: "string_view is &str, std::string is String. Rust enforces at compile time that a &str never outlives its backing storage.",
                },
            },
            {
                kind: "deep-dive",
                title: "String internals and UTF-8 validity",
                blocks: [
                    {
                        kind: "text",
                        text: "Rust strings are guaranteed valid UTF-8. This is enforced at the type level: &str and String only expose operations that preserve UTF-8. To work with bytes directly, you use &[u8] or the bytes() method.",
                    },
                    {
                        kind: "code",
                        label: "utf8.rs",
                        code: `fn main() {\n    let s = "café";\n    println!("chars: {}", s.chars().count());   // 4\n    println!("bytes: {}", s.bytes().count());    // 5 (é is 2 bytes)\n\n    // s[0] would panic — index by byte, not char\n    // use .chars().nth(0) for the first char\n}`,
                    },
                    {
                        kind: "text",
                        text: "The Deref impl on String to str is what lets &String coerce to &str transparently — a zero-cost conversion that makes the owned/borrowed boundary seamless.",
                    },
                ],
            },
        ],
    },

    // ── 5. Enums & pattern matching ─────────────────────────────────────
    {
        id: "enums",
        title: "Enums & pattern matching",
        icon: Braces,
        tagline: "Algebraic data types. match must cover every variant.",
        blocks: [
            {
                kind: "text",
                level: "beginner",
                text: "Enums are algebraic data types: each variant can carry its own payload. match destructures a value and binds its inner data, and the compiler rejects any match that does not cover every variant.",
            },
            {
                kind: "code",
                label: "match.rs",
                code: `enum Shape {\n    Circle(f64),\n    Rect { w: f64, h: f64 },\n}\n\nfn area(s: &Shape) -> f64 {\n    match s {\n        Shape::Circle(r) => std::f64::consts::PI * r * r,\n        Shape::Rect { w, h } => w * h,\n    } // omit a variant and it will not compile\n}`,
            },
            {
                kind: "comparison",
                rustCode: `// Rust: algebraic enum with exhaustive match\nenum Event {\n    Click { x: i32, y: i32 },\n    KeyPress(char),\n    Quit,\n}\n\nfn handle(e: Event) {\n    match e {\n        Event::Click { x, y } => {\n            println!("clicked at {},{}", x, y);\n        }\n        Event::KeyPress(c) => {\n            println!("key: {}", c);\n        }\n        Event::Quit => println!("bye"),\n    }\n}`,
                comparisons: {
                    python: {
                        code: `# Python: dataclasses + isinstance, or\nclass Click:\n    x: int; y: int\nclass KeyPress:\n    key: str\nclass Quit: pass\n\ndef handle(e):\n    match e:  # Python 3.10+ structural pattern matching\n        case Click(x=x, y=y):\n            print(f"clicked at {x},{y}")\n        case KeyPress(key=c):\n            print(f"key: {c}")\n        case Quit():\n            print("bye")`,
                        notes:
                            "Python 3.10 added structural pattern matching (PEP 634), but exhaustiveness is not enforced by the language.",
                    },
                    typescript: {
                        code: `// TypeScript: discriminated unions\ntype Event =\n    | { kind: "click"; x: number; y: number }\n    | { kind: "keypress"; key: string }\n    | { kind: "quit" };\n\nfunction handle(e: Event) {\n    switch (e.kind) {\n        case "click":\n            console.log(\`clicked at \${e.x},\${e.y}\`);\n            break;\n        case "keypress":\n            console.log(\`key: \${e.key}\`);\n            break;\n        case "quit":\n            console.log("bye"); break;\n    }\n}`,
                        notes:
                            "Discriminated unions + switch give you exhaustiveness checking via the never type — very close to Rust's match.",
                    },
                    java: {
                        code: `// Java 21+: sealed interfaces + pattern matching\nsealed interface Event {\n    record Click(int x, int y) implements Event {}\n    record KeyPress(char key) implements Event {}\n    record Quit() implements Event {}\n}\n\nvoid handle(Event e) {\n    switch (e) {\n        case Event.Click(var x, var y) ->\n            System.out.println("clicked at " + x + "," + y);\n        case Event.KeyPress(var c) ->\n            System.out.println("key: " + c);\n        case Event.Quit() ->\n            System.out.println("bye");\n    } // exhaustive for sealed types\n}`,
                        notes:
                            "Java 21 sealed classes + pattern matching in switches provide exhaustiveness checking — the closest Java has come to Rust enums.",
                    },
                    kotlin: {
                        code: `// Kotlin: sealed class hierarchy\nsealed class Event {\n    data class Click(val x: Int, val y: Int) : Event()\n    data class KeyPress(val key: Char) : Event()\n    data object Quit : Event()\n}\n\nfun handle(e: Event) = when (e) {\n    is Event.Click -> println("clicked at \${e.x},\${e.y}")\n    is Event.KeyPress -> println("key: \${e.key}")\n    is Event.Quit -> println("bye")\n} // when is exhaustive for sealed classes`,
                        notes:
                            "Sealed classes + when provide exhaustiveness checking. Very close to Rust's enum + match.",
                    },
                    go: {
                        code: `// Go: no sum types; use interfaces + type switch\ntype Event interface{ isEvent() }\n\ntype Click struct{ X, Y int }\nfunc (Click) isEvent() {}\n\ntype KeyPress struct{ Key rune }\nfunc (KeyPress) isEvent() {}\n\ntype Quit struct{}\nfunc (Quit) isEvent() {}\n\nfunc handle(e Event) {\n    switch v := e.(type) {\n    case Click:\n        fmt.Printf("clicked at %d,%d\\n", v.X, v.Y)\n    case KeyPress:\n        fmt.Printf("key: %c\\n", v.Key)\n    case Quit:\n        fmt.Println("bye")\n    }\n} // no exhaustiveness check`,
                        notes:
                            "Go uses interfaces and type switches. No compiler-enforced exhaustiveness — you can forget a case.",
                    },
                    csharp: {
                        code: `// C# 8+: discriminated unions via one-of types\n// (no native ADTs — use OneOf library or manual)\nabstract record Event {\n    public sealed record Click(int X, int Y) : Event;\n    public sealed record KeyPress(char Key) : Event;\n    public sealed record Quit() : Event;\n}\n\nvoid Handle(Event e) => e switch {\n    Event.Click(var x, var y) =>\n        Console.WriteLine($"clicked at {x},{y}"),\n    Event.KeyPress(var c) =>\n        Console.WriteLine($"key: {c}"),\n    Event.Quit =>\n        Console.WriteLine("bye"),\n    _ => throw new NotSupportedException()\n};`,
                        notes:
                            "C# records + switch expressions approximate ADTs. Exhaustiveness requires a default case unless the compiler can prove completeness.",
                    },
                    cpp: {
                        code: `// C++: std::variant + std::visit\nusing Event = std::variant<\n    struct Click { int x, y; },\n    struct KeyPress { char key; },\n    struct Quit {};\n>;\n\n// std::visit with an overloaded functor\n// no exhaustiveness check at compile time\nstd::visit(overloaded{\n    [](const Click& c) { /* ... */ },\n    [](const KeyPress& k) { /* ... */ },\n    [](const Quit&) { /* ... */ }\n}, event);`,
                        notes:
                            "std::variant + std::visit is the closest analogue. The compiler warns about missing cases but doesn't reject them by default.",
                    },
                },
            },
            {
                kind: "note",
                text: "if let and while let are concise forms when you only care about one pattern. Use _ as a catch-all arm when a full match is overkill.",
            },
            {
                kind: "deep-dive",
                title: "Enum layout, niche optimisation, and representation",
                blocks: [
                    {
                        kind: "text",
                        text: "Rust enums use a tag + payload layout. The compiler picks the smallest tag width needed (u8, u16, etc.). For Option<&T>, the niche optimisation reuses the null pointer representation for None, making Option<&T> the same size as &T.",
                    },
                    {
                        kind: "code",
                        label: "niche.rs",
                        code: `use std::mem::size_of;\n\nfn main() {\n    // Option<&T> is the same size as &T (niche optimisation)\n    assert_eq!(size_of::<Option<&i32>>(), size_of::<&i32>());\n\n    // Option<bool> is 1 byte (niche: 2 is None)\n    assert_eq!(size_of::<Option<bool>>(), 1);\n}`,
                    },
                    {
                        kind: "text",
                        text: "The #[repr(u8)], #[repr(u16)], etc. attributes let you control the tag size and ABI layout, which matters for FFI and serialisation.",
                    },
                ],
            },
        ],
    },

    // ── 6. Option & Result ──────────────────────────────────────────────
    {
        id: "option-result",
        title: "Option & Result",
        icon: Shield,
        tagline:
            "No null. Absence and failure are ordinary values you must handle.",
        blocks: [
            {
                kind: "text",
                level: "beginner",
                text: "Rust has no null. Absence is modelled by Option<T> with Some and None; recoverable failure by Result<T, E> with Ok and Err. Both force the missing or error path into the open.",
            },
            {
                kind: "text",
                text: "The ? operator unwraps an Ok or Some, or returns the Err or None early from the enclosing function, so success paths stay flat and readable.",
            },
            {
                kind: "code",
                label: "result.rs",
                code: `fn parse_sum(a: &str, b: &str) -> Result<i32, std::num::ParseIntError> {\n    let x: i32 = a.parse()?;   // early-return on Err\n    let y: i32 = b.parse()?;\n    Ok(x + y)\n}\n\nfn main() {\n    match parse_sum("20", "22") {\n        Ok(n)  => println!("sum = {}", n),\n        Err(e) => println!("bad input: {}", e),\n    }\n}`,
            },
            {
                kind: "comparison",
                rustCode: `// Rust: Option for absence, Result for errors\nfn find_user(id: i32) -> Option<String> {\n    if id == 1 {\n        Some(String::from("Alice"))\n    } else {\n        None\n    }\n}\n\nfn parse_age(s: &str) -> Result<u32, String> {\n    s.parse::<u32>()\n        .map_err(|_| format!("invalid: {}", s))\n}`,
                comparisons: {
                    python: {
                        code: `# Python: None for absence, exceptions for errors\ndef find_user(id: int) -> str | None:\n    if id == 1:\n        return "Alice"\n    return None\n\ndef parse_age(s: str) -> int:\n    try:\n        return int(s)\n    except ValueError:\n        raise ValueError(f"invalid: {s}")`,
                        notes:
                            "Optional values use None (PEP 484: T | None). Errors use exceptions — there's no Result type, no ? operator. try/except is the control flow.",
                    },
                    typescript: {
                        code: `// TypeScript: null/undefined for absence,\n// exceptions for errors\nfunction findUser(id: number): string | null {\n    return id === 1 ? "Alice" : null;\n}\n\nfunction parseAge(s: string): number {\n    const n = parseInt(s, 10);\n    if (isNaN(n)) throw new Error(\`invalid: \${s}\`);\n    return n;\n}`,
                        notes:
                            "TypeScript has null and undefined built in. No Result type in the language — some libraries add it. Exceptions are unchecked.",
                    },
                    java: {
                        code: `// Java: null for absence, exceptions for errors\nOptional<String> findUser(int id) {\n    return id == 1\n        ? Optional.of("Alice")\n        : Optional.empty();\n}\n\nint parseAge(String s) throws NumberFormatException {\n    return Integer.parseInt(s);  // throws on bad input\n}`,
                        notes:
                            "Optional<T> (Java 8+) is like Option<T>. Checked exceptions are like Result but less composable. The ? operator has no equivalent.",
                    },
                    kotlin: {
                        code: `// Kotlin: nullable types + sealed Result-like classes\nfun findUser(id: Int): String? =\n    if (id == 1) "Alice" else null\n\nfun parseAge(s: String): Result<Int> =\n    s.toIntOrNull()\n        ?.let { Result.success(it) }\n        ?: Result.failure(IllegalArgumentException("invalid: $s"))`,
                        notes:
                            "Kotlin's T? is like Option<T>. Result<T> exists but isn't used for control flow the same way. No ? operator.",
                    },
                    go: {
                        code: `// Go: zero value + ok bool, error returns\nfunc findUser(id int) (string, bool) {\n    if id == 1 {\n        return "Alice", true\n    }\n    return "", false\n}\n\nfunc parseAge(s string) (int, error) {\n    n, err := strconv.Atoi(s)\n    if err != nil {\n        return 0, fmt.Errorf("invalid: %s", s)\n    }\n    return n, nil\n}`,
                        notes:
                            "Go uses (value, ok) tuples and error returns. No Option or Result type — the convention is to return an error as the last value.",
                    },
                    csharp: {
                        code: `// C#: nullable types + exceptions\nstring? FindUser(int id) =>\n    id == 1 ? "Alice" : null;\n\nint ParseAge(string s) {\n    if (!int.TryParse(s, out var n))\n        throw new FormatException($"invalid: {s}");\n    return n;\n}`,
                        notes:
                            "C# nullable reference types (C# 8+) annotate nullability. TryParse patterns avoid exceptions. No built-in Result type.",
                    },
                    cpp: {
                        code: `// C++: std::optional + std::expected (C++23)\nstd::optional<std::string> find_user(int id) {\n    if (id == 1) return "Alice";\n    return std::nullopt;\n}\n\n// C++23: std::expected<T, E>\nstd::expected<int, std::string> parse_age(std::string_view s);\n// No ? operator — use .and_then() or explicit checks`,
                        notes:
                            "std::optional (C++17) is like Option. std::expected (C++23) is like Result. No ? operator — monadic chaining uses .and_then().",
                    },
                },
            },
            {
                kind: "analogy",
                text: "Option is a T or nothing that the type system refuses to let you ignore; Result is a value-based, checked alternative to throwing exceptions.",
                comparisons: {
                    python:
                        "Option is like T | None but the compiler forces you to handle None. Result is like exceptions you must catch at the call site — no silent ignoring.",
                    typescript:
                        "Option is like T | null but the compiler won't let you use it without checking. Result replaces try/catch with a value you handle explicitly.",
                    java: "Option is Optional<T> but built into every API. Result is like a checked exception that composes with ? instead of cluttering signatures.",
                    kotlin:
                        "Option is like T? but you can't bypass the check with !!. Result is like Kotlin's Result<T> but integrated into control flow with ?.",
                    go: "Option is like the (T, bool) pattern but the compiler enforces handling. Result is like (T, error) but the ? operator chains them cleanly instead of if err != nil everywhere.",
                    csharp:
                        "Option is like T? with compiler-enforced null checking. Result is like exceptions that are values, composed with ? instead of try/catch.",
                    cpp: "Option is a T or nothing that the type system refuses to let you ignore; Result is a value-based, checked alternative to throwing exceptions.",
                },
            },
            {
                kind: "deep-dive",
                title: "From/Into and the ? operator's type coercion",
                blocks: [
                    {
                        kind: "text",
                        text: "The ? operator doesn't just propagate errors — it converts them. When the error type doesn't match the function's return type, ? calls .into() via the From trait. This is why you can use ? with different error types in the same function as long as they convert to the return type.",
                    },
                    {
                        kind: "code",
                        label: "from.rs",
                        code: `use std::fs;\nuse std::io;\n\n#[derive(Debug)]\nenum AppError {\n    Io(io::Error),\n    Parse(std::num::ParseIntError),\n}\n\nimpl From<io::Error> for AppError {\n    fn from(e: io::Error) -> Self { Self::Io(e) }\n}\n\nimpl From<std::num::ParseIntError> for AppError {\n    fn from(e: std::num::ParseIntError) -> Self { Self::Parse(e) }\n}\n\nfn run() -> Result<(), AppError> {\n    let text = fs::read_to_string("data.txt")?;  // io::Error → AppError\n    let n: i32 = text.trim().parse()?;           // ParseIntError → AppError\n    println!("{}", n);\n    Ok(())\n}`,
                    },
                ],
            },
        ],
    },

    // ── 7. Traits ───────────────────────────────────────────────────────
    {
        id: "traits",
        title: "Traits",
        icon: Layers,
        tagline:
            "Shared behaviour. Like interfaces, with default methods and orphan impls.",
        blocks: [
            {
                kind: "text",
                level: "beginner",
                text: "A trait declares a set of methods a type can implement. It resembles an interface, but you may implement a trait for a type you did not define, and traits can ship default method bodies.",
            },
            {
                kind: "code",
                label: "traits.rs",
                code: `trait Summary {\n    fn title(&self) -> String;\n    fn preview(&self) -> String {       // default method\n        format!("{} ...", self.title())\n    }\n}\n\nstruct Article { headline: String }\n\nimpl Summary for Article {\n    fn title(&self) -> String { self.headline.clone() }\n}\n\nfn announce(item: &impl Summary) {       // static dispatch\n    println!("New: {}", item.preview());\n}`,
            },
            {
                kind: "comparison",
                rustCode: `// Rust: trait with default method + impl\ntrait Printable {\n    fn format(&self) -> String;\n    fn debug(&self) -> String {\n        format!("[{}]", self.format())\n    }\n}\n\nstruct User { name: String }\n\nimpl Printable for User {\n    fn format(&self) -> String {\n        format!("User({})", self.name)\n    }\n}\n\nfn print(p: &impl Printable) {\n    println!("{}", p.format());\n}`,
                comparisons: {
                    python: {
                        code: `# Python: duck typing + abstract base classes\nfrom abc import ABC, abstractmethod\n\nclass Printable(ABC):\n    @abstractmethod\n    def format(self) -> str: ...\n\n    def debug(self) -> str:\n        return f"[{self.format()}]"\n\nclass User(Printable):\n    def __init__(self, name):\n        self.name = name\n    def format(self) -> str:\n        return f"User({self.name})"`,
                        notes:
                            "ABCs approximate traits but Python mostly relies on duck typing. No static dispatch — all method calls are dynamic.",
                    },
                    typescript: {
                        code: `// TypeScript: interfaces with default impl via classes\ninterface Printable {\n    format(): string;\n    debug(): string;  // can't have default in interface\n}\n\n// Use a base class for defaults:\nabstract class PrintableBase implements Printable {\n    abstract format(): string;\n    debug(): string { return \`[\${this.format()}]\`; }\n}\n\nclass User extends PrintableBase {\n    constructor(readonly name: string) { super(); }\n    format() { return \`User(\${this.name})\`; }\n}`,
                        notes:
                            "Interfaces can't have default implementations — you need abstract classes. TypeScript's structural typing gives you duck typing for free.",
                    },
                    java: {
                        code: `// Java: interfaces with default methods\ninterface Printable {\n    String format();\n    default String debug() {\n        return "[" + format() + "]";\n    }\n}\n\nrecord User(String name) implements Printable {\n    @Override\n    public String format() {\n        return "User(" + name + ")";\n    }\n}`,
                        notes:
                            "Java 8+ interfaces with default methods are very close to Rust traits. The main difference: Java doesn't have orphan impls — you can't add an interface to a class you didn't write.",
                    },
                    kotlin: {
                        code: `// Kotlin: interfaces with default implementations\ninterface Printable {\n    fun format(): String\n    fun debug(): String = "[\${format()}]"\n}\n\ndata class User(val name: String) : Printable {\n    override fun format() = "User(\${name})"\n}`,
                        notes:
                            "Kotlin interfaces can have default implementations, just like Rust traits. Same orphan impl limitation as Java — you can't implement an interface on a class you don't own.",
                    },
                    go: {
                        code: `// Go: interfaces are satisfied structurally\ntype Printable interface {\n    Format() string\n    // no default methods in Go interfaces\n}\n\ntype User struct{ Name string }\n\nfunc (u User) Format() string {\n    return fmt.Sprintf("User(%s)", u.Name)\n}\n\n// User implicitly satisfies Printable`,
                        notes:
                            "Go interfaces are structural — no impl declaration needed. But no default methods and no generics-based dispatch until recently.",
                    },
                    csharp: {
                        code: `// C#: interfaces with default implementations (C# 8)\ninterface IPrintable {\n    string Format();\n    string Debug() => $"[{Format()}]";\n}\n\nrecord User(string Name) : IPrintable {\n    public string Format() => $"User({Name})";\n}`,
                        notes:
                            "C# 8+ interfaces with default implementations are close to traits. Same limitation: no orphan impls for classes you don't own.",
                    },
                    cpp: {
                        code: `// C++: concepts (C++20) for compile-time constraints\ntemplate<typename T>\nconcept Printable = requires(T t) {\n    { t.format() } -> std::convertible_to<std::string>;\n};\n\nstruct User {\n    std::string name;\n    std::string format() const {\n        return "User(" + name + ")";\n    }\n};\n\nstatic_assert(Printable<User>);`,
                        notes:
                            "C++20 concepts check that a type satisfies a constraint, but they don't provide default methods. Virtual functions + inheritance are the traditional interface pattern.",
                    },
                },
            },
            {
                kind: "text",
                text: "Constrain generics with trait bounds (T: Summary) for monomorphised static dispatch, or use &dyn Summary for runtime polymorphism behind a single pointer.",
            },
            {
                kind: "deep-dive",
                title: "Trait objects, vtables, and dynamic dispatch",
                blocks: [
                    {
                        kind: "text",
                        text: "A trait object &dyn Trait is a fat pointer: (data pointer, vtable pointer). The vtable is a static array of function pointers generated by the compiler for each concrete type. Calling a method through &dyn Trait indirects through this vtable.",
                    },
                    {
                        kind: "code",
                        label: "dyn_trait.rs",
                        code: `fn static_dispatch(item: &impl Summary) {\n    // monomorphised: the compiler emits a dedicated copy\n    // for each concrete type\n    println!("{}", item.preview());\n}\n\nfn dynamic_dispatch(item: &dyn Summary) {\n    // one copy of this function, vtable indirect on each call\n    println!("{}", item.preview());\n}\n\nfn main() {\n    let a = Article { headline: String::from("hi") };\n    static_dispatch(&a);\n    dynamic_dispatch(&a);\n}`,
                    },
                    {
                        kind: "text",
                        text: "Trait objects are subject to object safety rules: methods must not return Self, must not have generic type parameters, and must not use Self in argument position. These constraints ensure the vtable has a fixed layout.",
                    },
                ],
            },
        ],
    },

    // ── 8. Generics ─────────────────────────────────────────────────────
    {
        id: "generics",
        title: "Generics",
        icon: Type,
        tagline:
            "Monomorphised at compile time. Bounds say what a type must support.",
        blocks: [
            {
                kind: "text",
                level: "beginner",
                text: "Generics are monomorphised: the compiler emits a specialised copy of the code for each concrete type used, so abstraction carries no runtime cost. Bounds restrict a type parameter to what the body actually needs.",
            },
            {
                kind: "code",
                label: "generics.rs",
                code: `fn largest<T: PartialOrd + Copy>(items: &[T]) -> T {\n    let mut best = items[0];\n    for &x in &items[1..] {\n        if x > best { best = x; }\n    }\n    best\n}\n\nfn main() {\n    println!("{}", largest(&[3, 9, 4, 1]));        // 9\n    println!("{}", largest(&[1.5, 0.2, 7.8]));     // 7.8\n}`,
            },
            {
                kind: "comparison",
                rustCode: `// Rust: monomorphised generics with trait bounds\nfn wrap_in_vec<T>(value: T) -> Vec<T> {\n    vec![value]\n}\n\nlet ints = wrap_in_vec(42);\nlet strs = wrap_in_vec("hello");`,
                comparisons: {
                    python: {
                        code: `# Python: generics via typing (runtime: just objects)\nfrom typing import TypeVar, Generic, List\n\nT = TypeVar("T")\n\ndef wrap_in_list(value: T) -> list[T]:\n    return [value]\n\nints = wrap_in_list(42)\nstrs = wrap_in_list("hello")`,
                        notes:
                            "Python generics are type-annotations only — at runtime, everything is a dynamic object. No monomorphisation.",
                    },
                    typescript: {
                        code: `// TypeScript: generics erased at runtime\nfunction wrapInArray<T>(value: T): T[] {\n    return [value];\n}\n\nconst ints = wrapInArray(42);\nconst strs = wrapInArray("hello");`,
                        notes:
                            "TypeScript generics are erased at compile time. No specialised copies — one implementation handles all types at runtime.",
                    },
                    java: {
                        code: `// Java: type erasure — one copy, Object at runtime\n<T> List<T> wrapInList(T value) {\n    return List.of(value);\n}\n\nList<Integer> ints = wrapInList(42);\nList<String> strs = wrapInList("hello");`,
                        notes:
                            "Java uses type erasure — generics become Object at runtime. No monomorphisation, no specialisation. Primitive types must be boxed.",
                    },
                    kotlin: {
                        code: `// Kotlin: same JVM erasure as Java\nfun <T> wrapInList(value: T): List<T> = listOf(value)\n\nval ints = wrapInList(42)\nval strs = wrapInList("hello")`,
                        notes:
                            "Kotlin shares Java's erasure. Inline functions with reified type parameters recover some type info at runtime.",
                    },
                    go: {
                        code: `// Go: generics (1.18+) — monomorphised for\n// different types but GC-shaped only\nfunc wrapInSlice[T any](value T) []T {\n    return []T{value}\n}\n\nints := wrapInSlice(42)\nstrs := wrapInSlice("hello")`,
                        notes:
                            "Go 1.18 generics use a hybrid of dictionaries and GCshapes. Roughly monomorphised, but less aggressively than C++ or Rust.",
                    },
                    csharp: {
                        code: `// C#: reified generics (specialised for value types)\nList<T> WrapInList<T>(T value) {\n    return new List<T> { value };\n}\n\nvar ints = WrapInList(42);     // specialised for int\nvar strs = WrapInList("hello"); // shared reference impl`,
                        notes:
                            "C# reified generics specialise for value types but share a single implementation for all reference types.",
                    },
                    cpp: {
                        code: `// C++: templates — monomorphised, duck-typed\ntemplate<typename T>\nstd::vector<T> wrap_in_vector(T value) {\n    return {std::move(value)};\n}\n\nauto ints = wrap_in_vector(42);\nauto strs = wrap_in_vector("hello"s);`,
                        notes:
                            "C++ templates are the closest analogue — fully monomorphised, no runtime cost. Concepts (C++20) add bounds similar to trait bounds.",
                    },
                },
            },
            {
                kind: "deep-dive",
                title: "Monomorphisation vs. dynamic dispatch trade-offs",
                blocks: [
                    {
                        kind: "text",
                        text: "Monomorphisation produces fast, specialisable code at the cost of binary size and compile time. Each concrete type gets its own copy of the generic function. For a function used with 10 types, that's 10 copies.",
                    },
                    {
                        kind: "text",
                        text: "When binary size or compile time matters more, you can opt into dynamic dispatch with dyn Trait at a single pointer indirection cost. Rust lets you choose per call site — not per type definition.",
                    },
                    {
                        kind: "code",
                        label: "mono_vs_dyn.rs",
                        code: `// Static: monomorphised, zero-cost abstraction\nfn sum_static<T: std::ops::Add<Output = T> + Default>(items: &[T]) -> T {\n    items.iter().fold(T::default(), |a, b| a + *b)\n}\n\n// Dynamic: one copy, indirect call\nfn sum_dynamic(items: &[&dyn std::fmt::Display]) {\n    for item in items { print!("{} ", item); }\n}`,
                    },
                ],
            },
        ],
    },

    // ── 9. Iterators & closures ─────────────────────────────────────────
    {
        id: "iterators",
        title: "Iterators & closures",
        icon: Repeat,
        tagline: "Lazy pipelines. Closures capture the environment.",
        blocks: [
            {
                kind: "text",
                level: "beginner",
                text: "Iterators are lazy. Adapters such as map and filter only describe work; nothing runs until a consumer like collect, sum, or a for loop drives the chain. The result is allocation-free, fused pipelines.",
            },
            {
                kind: "code",
                label: "iter.rs",
                code: `fn main() {\n    let evens_squared: Vec<i32> = (1..=10)\n        .filter(|n| n % 2 == 0)   // closure capturing nothing\n        .map(|n| n * n)\n        .collect();\n\n    println!("{:?}", evens_squared); // [4, 16, 36, 64, 100]\n\n    let total: i32 = evens_squared.iter().sum();\n    println!("{}", total);\n}`,
            },
            {
                kind: "comparison",
                rustCode: `// Rust: lazy iterator chain\nlet results: Vec<i32> = (1..=100)\n    .filter(|&n| n % 3 == 0)\n    .map(|n| n * 2)\n    .take(5)\n    .collect();`,
                comparisons: {
                    python: {
                        code: `# Python: generators are lazy, list() forces evaluation\nresults = list(\n    (n * 2 for n in range(1, 101) if n % 3 == 0)\n)[:5]\n\n# Or with itertools:\nfrom itertools import islice\nresults = list(islice(\n    (n * 2 for n in range(1, 101) if n % 3 == 0), 5\n))`,
                        notes:
                            "Generator expressions are lazy like Rust iterators. list() or for loops consume them. itertools provides adapters like islice.",
                    },
                    typescript: {
                        code: `// TypeScript: lazy with generators, eager with array methods\n// Array methods (eager):\nconst results = Array.from({length: 100}, (_, i) => i + 1)\n    .filter(n => n % 3 === 0)\n    .map(n => n * 2)\n    .slice(0, 5);\n\n// Generators (lazy):\nfunction* filtered() {\n    for (let n = 1; n <= 100; n++) {\n        if (n % 3 === 0) yield n * 2;\n    }\n}`,
                        notes:
                            "Array methods are eager (create intermediate arrays). Generator functions are lazy but less ergonomic than Rust's iterator adapters.",
                    },
                    java: {
                        code: `// Java: Streams are lazy\nList<Integer> results = IntStream.rangeClosed(1, 100)\n    .filter(n -> n % 3 == 0)\n    .map(n -> n * 2)\n    .limit(5)\n    .boxed()\n    .toList();`,
                        notes:
                            "Java Streams are lazy like Rust iterators. Terminal operations (collect, toList) drive evaluation. Primitive streams avoid boxing.",
                    },
                    kotlin: {
                        code: `// Kotlin: sequences are lazy\nval results = (1..100).asSequence()\n    .filter { it % 3 == 0 }\n    .map { it * 2 }\n    .take(5)\n    .toList()`,
                        notes:
                            "Sequences are lazy (like Rust iterators). Without .asSequence(), Kotlin collections use eager evaluation with intermediate lists.",
                    },
                    go: {
                        code: `// Go: no built-in lazy iterators (pre-1.23)\n// Go 1.23 adds iter package with range-over-func\nresults := []int{}\nfor n := range iter.Filter(\n    iter.Range(1, 101),\n    func(n int) bool { return n%3 == 0 },\n) {\n    if len(results) >= 5 { break }\n    results = append(results, n*2)\n}`,
                        notes:
                            "Go 1.23 added range-over-function iterators. Before that, you wrote loops or used channels. Less ergonomic than Rust's chain.",
                    },
                    csharp: {
                        code: `// C#: LINQ is lazy for IEnumerable\nvar results = Enumerable.Range(1, 100)\n    .Where(n => n % 3 == 0)\n    .Select(n => n * 2)\n    .Take(5)\n    .ToList();`,
                        notes:
                            "LINQ to Objects is lazy (yield return under the hood). ToList() forces evaluation. Very close to Rust's iterator model.",
                    },
                    cpp: {
                        code: `// C++: ranges (C++20) are lazy\nauto results = std::views::iota(1, 101)\n    | std::views::filter([](int n) { return n % 3 == 0; })\n    | std::views::transform([](int n) { return n * 2; })\n    | std::views::take(5);\n\n// materialise:\nauto vec = std::vector<int>(results.begin(), results.end());`,
                        notes:
                            "C++20 ranges are lazy views composed with |. Very similar to Rust's iterator adapters. Materialisation requires explicit iteration.",
                    },
                },
            },
            {
                kind: "note",
                text: "Closures capture their environment. The Fn, FnMut, and FnOnce traits encode whether a closure only reads, mutates, or consumes what it captured.",
            },
            {
                kind: "deep-dive",
                title: "Closure capture modes and the Fn/FnMut/FnOnce hierarchy",
                blocks: [
                    {
                        kind: "text",
                        text: "Every closure desugars to an anonymous struct that stores its captures and implements one or more of the Fn, FnMut, FnOnce traits. The compiler picks the least restrictive trait that works:",
                    },
                    {
                        kind: "text",
                        text: "FnOnce — the closure consumes its captures (moves them out). Callable once. FnMut — the closure mutates its captures. Callable multiple times. Fn — the closure only reads its captures. Callable multiple times, even from shared references.",
                    },
                    {
                        kind: "code",
                        label: "capture.rs",
                        code: `fn main() {\n    let name = String::from("Alice");\n\n    // FnOnce: consumes name\n    let greet = move || {\n        println!("Hello, {}", name);  // name moved into closure\n    };\n    greet();\n    // greet();  // error: name already consumed\n\n    let mut count = 0;\n    // FnMut: mutates count\n    let mut increment = || {\n        count += 1;\n        count\n    };\n    increment();\n    increment();\n    println!("{}", count);  // 2\n}`,
                    },
                    {
                        kind: "text",
                        text: "A closure that implements Fn also implements FnMut and FnOnce. A closure that implements FnMut also implements FnOnce. The hierarchy is: Fn ⊂ FnMut ⊂ FnOnce.",
                    },
                ],
            },
        ],
    },

    // ── 10. Smart pointers ──────────────────────────────────────────────
    {
        id: "smart-pointers",
        title: "Smart pointers",
        icon: Boxes,
        tagline:
            "Box for heap, Rc/Arc for shared ownership, RefCell for runtime borrows.",
        blocks: [
            {
                kind: "text",
                level: "beginner",
                text: "Box<T> stores a value on the heap under single ownership and is the building block for recursive types. Rc<T> grants shared ownership by reference counting on a single thread; Arc<T> is the atomic, thread-safe equivalent.",
            },
            {
                kind: "text",
                text: "RefCell<T> moves borrow checking from compile time to runtime, enabling interior mutability behind a shared reference. Break the borrow rules and it panics rather than letting the bug through.",
            },
            {
                kind: "code",
                label: "rc.rs",
                code: `use std::rc::Rc;\nuse std::cell::RefCell;\n\nfn main() {\n    let shared = Rc::new(RefCell::new(vec![1, 2, 3]));\n    let other = Rc::clone(&shared);     // second owner, count = 2\n\n    shared.borrow_mut().push(4);        // mutate through a shared ref\n    println!("{:?}", other.borrow());   // [1, 2, 3, 4]\n}`,
            },
            {
                kind: "comparison",
                rustCode: `// Rust: Box<T> — heap allocation, single owner\nlet b = Box::new(42);\n\n// Rc<T> — shared ownership (single-threaded)\nuse std::rc::Rc;\nlet a = Rc::new(vec![1, 2, 3]);\nlet b = Rc::clone(&a);  // count = 2`,
                comparisons: {
                    python: {
                        code: `# Python: all objects are heap-allocated\n# reference counting + cycle collector\nimport sys\n\nclass Node:\n    def __init__(self, val):\n        self.val = val\n        self.children = []\n\na = Node(1)\nb = a  # reference count increased\nprint(sys.getrefcount(a) - 1)  # 2`,
                        notes:
                            "Every Python object is heap-allocated with reference counting. There's no Box equivalent — it's the default. Shared ownership is the default too.",
                    },
                    typescript: {
                        code: `// TypeScript: all objects are GC'd heap allocations\nconst obj = { val: 42 };\nconst ref = obj;  // shared reference, GC tracked\n// no Box, Rc, or RefCell — everything is shared`,
                        notes:
                            "JS objects are always on the heap and GC'd. No distinction between Box, Rc, or raw references — everything is a shared GC reference.",
                    },
                    java: {
                        code: `// Java: all objects are heap-allocated + GC'd\nvar list = new ArrayList<>(List.of(1, 2, 3));\nvar ref = list;  // shared reference\n// no Box — heap allocation is the default\n// no Rc — GC handles shared ownership`,
                        notes:
                            "All Java objects live on the heap. GC handles shared ownership. No equivalent of RefCell — all objects allow interior mutability.",
                    },
                    kotlin: {
                        code: `// Kotlin: same JVM model\nval list = mutableListOf(1, 2, 3)\nval ref = list  // shared reference\n// heap-allocated and GC'd by default`,
                        notes:
                            "Same as Java — all objects heap-allocated, GC-managed. No Box/Rc/RefCell distinction.",
                    },
                    go: {
                        code: `// Go: escape analysis decides heap vs stack\n// all shared pointers are GC'd\nlist := []int{1, 2, 3}\nref := &list  // pointer, GC-tracked\n// no Box — compiler decides allocation\n// no Rc — GC handles sharing`,
                        notes:
                            "Go's escape analysis decides stack vs heap. Pointers are GC'd. No explicit shared ownership types.",
                    },
                    csharp: {
                        code: `// C#: heap objects are GC'd\nvar list = new List<int> { 1, 2, 3 };\nvar ref = list;  // shared reference\n// no Box — heap allocation is default for classes\n// no Rc — GC handles shared ownership`,
                        notes:
                            "C# classes are always heap-allocated. Structs are value types (stack). No Box/Rc distinction — GC handles everything.",
                    },
                    cpp: {
                        code: `// C++: explicit smart pointers\n// Box → std::unique_ptr\nauto b = std::make_unique<int>(42);\n\n// Rc → std::shared_ptr\nauto a = std::make_shared<std::vector<int>>(\n    std::initializer_list<int>{1, 2, 3});\nauto b2 = a;  // reference count = 2`,
                        notes:
                            "unique_ptr ≈ Box, shared_ptr ≈ Rc, weak_ptr ≈ Weak. No built-in RefCell — std::vector is always mutable, no runtime borrow checking.",
                    },
                },
            },
            {
                kind: "analogy",
                text: "Box is unique_ptr, Rc is shared_ptr, RefCell is a runtime-checked version of const correctness.",
                comparisons: {
                    python:
                        "Everything is already on the heap and shared by default. Box/Rc are unnecessary. RefCell's runtime borrow checking has no Python equivalent — Python freely allows mutation from any reference.",
                    typescript:
                        "All objects are heap-allocated and GC'd. Box/Rc are the default model. There's no runtime borrow checking — any reference can mutate at any time.",
                    java: "All objects are heap-allocated GC references. Box is the default. Shared ownership is the default. No runtime borrow checking — all mutable objects allow mutation through any reference.",
                    kotlin:
                        "Same as Java. All objects are GC'd heap references. No Box/Rc/RefCell distinction needed.",
                    go: "Escape analysis handles heap allocation. Pointers are GC'd. No explicit smart pointer types. Go allows mutation from any pointer at any time.",
                    csharp:
                        "Classes are heap-allocated and GC'd by default. Structs are value types. No runtime borrow checking — mutation is unrestricted.",
                    cpp: "Box is unique_ptr, Rc is shared_ptr, RefCell is a runtime-checked version of const correctness.",
                },
            },
            {
                kind: "deep-dive",
                title: "Interior mutability patterns: Cell, RefCell, and UnsafeCell",
                blocks: [
                    {
                        kind: "text",
                        text: "UnsafeCell<T> is the only way to get a &mut T from a &T in safe Rust — but only inside unsafe blocks. Every safe interior mutability type builds on it: Cell<T> for Copy types, RefCell<T> for types with dynamic borrow tracking.",
                    },
                    {
                        kind: "code",
                        label: "cell.rs",
                        code: `use std::cell::Cell;\n\nfn main() {\n    let x = Cell::new(1);\n    let ref1 = &x;\n    let ref2 = &x;\n    ref1.set(2);          // mutate through a shared reference\n    println!("{}", ref2.get());  // 2\n}`,
                    },
                    {
                        kind: "text",
                        text: "Cell<T> replaces the value wholesale (no borrowing, just get/set). It works for Copy types or when replacement is acceptable. RefCell<T> tracks borrows at runtime — borrow()/borrow_mut() panic on conflict. The choice between them is about whether you need a reference into the interior or just want to swap the whole value.",
                    },
                ],
            },
        ],
    },
];
