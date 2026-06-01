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
    LanguageFamiliarity,
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
        Record<LanguageFamiliarity, string>
    >;
}

export interface ComparisonBlock extends LessonBlockBase {
    readonly kind: "comparison";
    readonly conceptId: string;
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
                conceptId: "memory-management",
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
                conceptId: "reference-semantics",
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
                conceptId: "reference-validity",
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
                conceptId: "string-types",
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
                conceptId: "algebraic-data-types",
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
                conceptId: "error-signalling",
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
                conceptId: "behaviour-abstraction",
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
                conceptId: "generics",
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
                conceptId: "collection-pipelines",
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
                conceptId: "smart-pointers",
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
