import type { ReferenceCard } from "./types.ts";

export const REFERENCE_CARDS: readonly ReferenceCard[] = [
    {
        id: "ownership",
        title: "Ownership",
        summary: "One binding owns one value. Moves transfer that ownership; Drop runs when the owner goes out of scope.",
        lessonIds: ["ownership", "smart-pointers"],
        syntax: {
            title: "Basic syntax",
            code: `let s1 = String::from("hello");
let s2 = s1; // move
`,
        },
        pattern: {
            title: "Pattern",
            code: `Use ownership to make invalid states impossible:
- move values into the next owner
- clone only when you truly need two copies
- let Drop clean up at scope end`,
        },
        example: {
            title: "Example",
            code: `fn takes_ownership(s: String) {
    println!("{}", s);
}

fn main() {
    let s = String::from("hi");
    takes_ownership(s);
    // s cannot be used here
}`,
        },
        mappings: [
            { familiarity: "python", summary: "Python names alias objects; Rust moves the binding instead of leaving two live names." },
            { familiarity: "typescript", summary: "TypeScript/JavaScript share object references; Rust makes the hand-off explicit and compile-time checked." },
            { familiarity: "java", summary: "Java shares references and relies on GC; Rust transfers ownership and frees deterministically." },
            { familiarity: "kotlin", summary: "Kotlin shares references like Java; Rust uses ownership to stop accidental aliasing." },
            { familiarity: "go", summary: "Go copies values or pointers, but ownership stays implicit; Rust makes the owner visible." },
            { familiarity: "csharp", summary: "C# shares reference types freely; Rust forces a single owner for move-only values." },
            { familiarity: "cpp", summary: "C++ unique_ptr is the closest fit: single ownership, explicit moves, deterministic cleanup." },
        ],
    },
    {
        id: "borrowing",
        title: "Borrowing & references",
        summary: "Borrow to read or mutate without taking ownership. Shared references can multiply; mutable ones are exclusive.",
        lessonIds: ["borrowing", "slices"],
        syntax: {
            title: "Basic syntax",
            code: `let r = &value;
let m = &mut value;`,
        },
        pattern: {
            title: "Pattern",
            code: `Borrow when you want:
- read-only access: &T
- one writer: &mut T
- the compiler to prove reads and writes do not overlap`,
        },
        example: {
            title: "Example",
            code: `fn push_one(v: &mut Vec<i32>) {
    v.push(1);
}

fn first(v: &Vec<i32>) -> i32 {
    v[0]
}`,
        },
        mappings: [
            { familiarity: "python", summary: "Python hands around aliases to the same object, but Rust distinguishes read-only and exclusive borrows." },
            { familiarity: "typescript", summary: "TypeScript has references everywhere; Rust makes aliasing rules part of the type system." },
            { familiarity: "java", summary: "Java references are shared by default; Rust only allows one mutable borrow at a time." },
            { familiarity: "kotlin", summary: "Kotlin shares references freely; Rust uses borrows to stop read/write overlap." },
            { familiarity: "go", summary: "Go’s pointers are ordinary values; Rust’s references carry lifetime and exclusivity rules." },
            { familiarity: "csharp", summary: "C# reference types are shared, but Rust’s borrow checker enforces who may write." },
            { familiarity: "cpp", summary: "C++ references and pointers are unchecked; Rust’s borrows prevent undefined aliasing patterns." },
        ],
    },
    {
        id: "slices-strings",
        title: "Slices & strings",
        summary: "Borrowed string slices and owned Strings are different shapes; the conversion points are part of the contract.",
        lessonIds: ["slices"],
        syntax: {
            title: "Basic syntax",
            code: `let s: &str = "hello";
let owned = s.to_string();`,
        },
        pattern: {
            title: "Pattern",
            code: `Use &str for borrowed text and String for owned text.
Accept &str in APIs so callers can pass literals or owned strings without friction.`,
        },
        example: {
            title: "Example",
            code: `fn greet(name: &str) {
    println!("Hello, {}", name);
}`,
        },
        mappings: [
            { familiarity: "python", summary: "Python strings are immutable and shared by reference; Rust splits borrowed slices from owned strings." },
            { familiarity: "typescript", summary: "JavaScript strings are immutable values; Rust makes ownership explicit when text must be stored." },
            { familiarity: "java", summary: "Java strings are immutable and GC-managed; Rust separates borrowed text from owned buffers." },
            { familiarity: "kotlin", summary: "Kotlin String behaves like Java String; Rust distinguishes borrowed views from owned allocations." },
            { familiarity: "go", summary: "Go strings are immutable slices; Rust’s &str is a borrowed slice with lifetime checking." },
            { familiarity: "csharp", summary: "C# strings are immutable references; Rust makes the borrow vs ownership boundary explicit." },
            { familiarity: "cpp", summary: "C++ string_view is the borrowed counterpart, while std::string owns the storage." },
        ],
    },
    {
        id: "lifetimes",
        title: "Lifetimes",
        summary: "Lifetimes are the compiler’s proof that borrowed data outlives every reference to it.",
        lessonIds: ["lifetimes"],
        syntax: {
            title: "Basic syntax",
            code: `fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}`,
        },
        pattern: {
            title: "Pattern",
            code: `Add lifetime parameters when the compiler cannot infer the relationship between inputs and outputs, especially for:
- functions returning references
- structs that store references`,
        },
        example: {
            title: "Example",
            code: `struct Holder<'a> {
    item: &'a str,
}`,
        },
        mappings: [
            { familiarity: "python", summary: "Python uses GC, so borrowed-object lifetimes are managed at runtime instead of proven statically." },
            { familiarity: "typescript", summary: "TypeScript does not model reference lifetimes; Rust makes them explicit when ownership is borrowed." },
            { familiarity: "java", summary: "Java GC keeps objects alive; Rust needs lifetimes because it has no GC safety net." },
            { familiarity: "kotlin", summary: "Kotlin’s GC removes the need for lifetime annotations; Rust uses them to prove references stay valid." },
            { familiarity: "go", summary: "Go’s GC handles reachability, while Rust tracks outlives relationships at compile time." },
            { familiarity: "csharp", summary: "C# GC and Span-style APIs solve this differently; Rust uses lifetime parameters instead." },
            { familiarity: "cpp", summary: "C++ has the same problem but no static proof, so dangling references become undefined behaviour." },
        ],
    },
    {
        id: "enums",
        title: "Enums & pattern matching",
        summary: "Enums model a value that can be one of several shapes; match lets you handle every case explicitly.",
        lessonIds: ["enums"],
        syntax: {
            title: "Basic syntax",
            code: `match value {
    Some(v) => v,
    None => 0,
}`,
        },
        pattern: {
            title: "Pattern",
            code: `Use enums when a value has a closed set of shapes.
Use match when each shape needs a distinct branch.`,
        },
        example: {
            title: "Example",
            code: `enum Direction { North, South, East, West }

fn to_int(d: Direction) -> i32 {
    match d {
        Direction::North => 0,
        Direction::South => 1,
        Direction::East => 2,
        Direction::West => 3,
    }
}`,
        },
        mappings: [
            { familiarity: "python", summary: "Python dataclasses and match can model this, but exhaustiveness is not enforced." },
            { familiarity: "typescript", summary: "TypeScript discriminated unions are the nearest match; exhaustiveness usually needs a helper." },
            { familiarity: "java", summary: "Java sealed classes and switch pattern matching are the closest analogue." },
            { familiarity: "kotlin", summary: "Kotlin sealed classes plus when are very close to Rust enums plus match." },
            { familiarity: "go", summary: "Go uses interfaces and type switches, but the compiler cannot prove you handled every case." },
            { familiarity: "csharp", summary: "C# records and switch expressions approximate the pattern, but default branches are still common." },
            { familiarity: "cpp", summary: "C++ std::variant and std::visit get close, but exhaustiveness is not the default." },
        ],
    },
    {
        id: "option-result",
        title: "Option & Result",
        summary: "Option models absence; Result models recoverable failure. Both force you to handle the non-happy path.",
        lessonIds: ["option-result"],
        syntax: {
            title: "Basic syntax",
            code: `let maybe = Some(10);
let value = maybe?;
`,
        },
        pattern: {
            title: "Pattern",
            code: `Use Option when a value may not exist.
Use Result when work may fail and the caller should decide what to do next.`,
        },
        example: {
            title: "Example",
            code: `fn parse_age(s: &str) -> Result<u32, std::num::ParseIntError> {
    let age = s.parse()?;
    Ok(age)
}`,
        },
        mappings: [
            { familiarity: "python", summary: "Python uses None plus exceptions; Rust splits absence and failure into different value types." },
            { familiarity: "typescript", summary: "TypeScript uses null/undefined and exceptions; Rust makes the branch explicit at the type level." },
            { familiarity: "java", summary: "Java Optional and checked exceptions approximate the split, but Rust’s ? is more composable." },
            { familiarity: "kotlin", summary: "Kotlin nullable types and Result are close, though the language still leans on exceptions." },
            { familiarity: "go", summary: "Go’s (value, ok) and (value, error) tuples are the nearest shape, just without a dedicated type." },
            { familiarity: "csharp", summary: "C# nullable reference types and TryParse patterns map well, but Result is usually a library type." },
            { familiarity: "cpp", summary: "C++ std::optional and std::expected are the obvious counterparts, albeit with less ergonomic propagation." },
        ],
    },
    {
        id: "traits",
        title: "Traits",
        summary: "Traits describe shared behaviour. They can have default methods and work with static or dynamic dispatch.",
        lessonIds: ["traits"],
        syntax: {
            title: "Basic syntax",
            code: `trait Summary {
    fn title(&self) -> String;
    fn preview(&self) -> String {
        self.title()
    }
}`,
        },
        pattern: {
            title: "Pattern",
            code: `Use a trait when several types should support the same behaviour.
Use impl Trait for static dispatch and dyn Trait when you want one runtime type.`,
        },
        example: {
            title: "Example",
            code: `fn announce(item: &impl Summary) {
    println!("{}", item.preview());
}`,
        },
        mappings: [
            { familiarity: "python", summary: "Python tends to rely on duck typing or ABCs; Rust traits make the contract explicit and checked." },
            { familiarity: "typescript", summary: "TypeScript interfaces are close, though Rust traits can supply defaults and control dispatch more tightly." },
            { familiarity: "java", summary: "Java interfaces with default methods are the nearest analogue, minus Rust’s orphan rules." },
            { familiarity: "kotlin", summary: "Kotlin interfaces with defaults are similar, but Rust also lets you opt into dynamic dispatch explicitly." },
            { familiarity: "go", summary: "Go interfaces are structural, while Rust traits are nominal and more precise about implementations." },
            { familiarity: "csharp", summary: "C# interfaces with default implementations are close, though Rust keeps static and dynamic dispatch distinct." },
            { familiarity: "cpp", summary: "C++ concepts and templates approximate trait bounds, but they do not give you the same trait-object story." },
        ],
    },
    {
        id: "generics",
        title: "Generics",
        summary: "Generics let one definition work for many types while staying fully type-safe and often zero-cost.",
        lessonIds: ["generics"],
        syntax: {
            title: "Basic syntax",
            code: `fn wrap<T>(value: T) -> Vec<T> {
    vec![value]
}`,
        },
        pattern: {
            title: "Pattern",
            code: `Use generics when the code cares about behaviour or shape, not one concrete type.
Add trait bounds for the capabilities you actually need.`,
        },
        example: {
            title: "Example",
            code: `fn first<T: Copy>(items: &[T]) -> T {
    items[0]
}`,
        },
        mappings: [
            { familiarity: "python", summary: "Python type hints describe intent, but runtime remains dynamically typed and not monomorphised." },
            { familiarity: "typescript", summary: "TypeScript generics are erased; Rust monomorphises the code for concrete types." },
            { familiarity: "java", summary: "Java uses type erasure, so Rust’s compile-time specialisation feels much closer to C++ templates." },
            { familiarity: "kotlin", summary: "Kotlin shares Java’s erased generics, with reified types only in special cases." },
            { familiarity: "go", summary: "Go generics are newer and ergonomic, but still don’t look exactly like Rust’s bounds-first style." },
            { familiarity: "csharp", summary: "C# generics are reified on the CLR, which is closer to Rust than Java is, though the language model differs." },
            { familiarity: "cpp", summary: "C++ templates are the classic zero-cost generic system; Rust aims for that with better error messages and safety." },
        ],
    },
    {
        id: "iterators",
        title: "Iterators & closures",
        summary: "Iterators chain transformations lazily; closures capture values or borrows from the surrounding scope.",
        lessonIds: ["iterators"],
        syntax: {
            title: "Basic syntax",
            code: `let total = items
    .iter()
    .map(|n| n * 2)
    .sum::<i32>();`,
        },
        pattern: {
            title: "Pattern",
            code: `Prefer iterator adapters over hand-written loops when the transformation is a pipeline of steps.` ,
        },
        example: {
            title: "Example",
            code: `let names = vec!["a", "bb", "ccc"];
let lengths: Vec<_> = names.iter().map(|s| s.len()).collect();`,
        },
        mappings: [
            { familiarity: "python", summary: "Python comprehensions and generator pipelines are the closest mental model." },
            { familiarity: "typescript", summary: "JavaScript array methods and iterables feel similar, though Rust keeps borrowing and allocation rules explicit." },
            { familiarity: "java", summary: "Java streams are a close analogue: lazy until terminal operation, with explicit mapping and filtering steps." },
            { familiarity: "kotlin", summary: "Kotlin sequences and collection operators map nicely to Rust iterators." },
            { familiarity: "go", summary: "Go usually writes loops by hand; Rust’s iterators make the pipeline explicit instead." },
            { familiarity: "csharp", summary: "C# LINQ is the nearest everyday equivalent, especially for lazy chained transformations." },
            { familiarity: "cpp", summary: "C++ ranges are the closest structural analogue, though Rust’s closure ergonomics are often cleaner." },
        ],
    },
    {
        id: "smart-pointers",
        title: "Smart pointers",
        summary: "Box, Rc, Arc, and RefCell encode ownership, sharing, and interior mutability as types.",
        lessonIds: ["smart-pointers"],
        syntax: {
            title: "Basic syntax",
            code: `let boxed = Box::new(10);
let shared = Rc::new("hi");
let cell = RefCell::new(0);`,
        },
        pattern: {
            title: "Pattern",
            code: `Choose the pointer that matches the ownership story:
- Box<T> for heap allocation
- Rc<T>/Arc<T> for shared ownership
- RefCell<T> when mutability must happen through a shared reference`,
        },
        example: {
            title: "Example",
            code: `use std::rc::Rc;
let data = Rc::new(String::from("shared"));
let a = Rc::clone(&data);
let b = Rc::clone(&data);`,
        },
        mappings: [
            { familiarity: "python", summary: "Python objects are heap-allocated and shared by default, so ownership is mostly invisible there." },
            { familiarity: "typescript", summary: "JavaScript objects are shared GC references, closer to Rc than to Box or unique ownership." },
            { familiarity: "java", summary: "Java and Kotlin mostly live in the GC world, so Rust’s pointer types make the sharing policy explicit." },
            { familiarity: "go", summary: "Go’s pointers are simple references; Rust distinguishes heap ownership, sharing, and borrow-checked mutation." },
            { familiarity: "csharp", summary: "C# reference types behave like shared heap objects; Rust splits the options into distinct pointer types." },
            { familiarity: "cpp", summary: "C++ unique_ptr/shared_ptr/weak_ptr map quite closely to Box/Rc/Arc in spirit." },
        ],
    },
] as const;

export const LESSON_REFERENCE_LINKS: Readonly<Record<string, readonly string[]>> = {
    ownership: ["ownership"],
    borrowing: ["borrowing", "slices-strings"],
    lifetimes: ["lifetimes"],
    slices: ["slices-strings", "borrowing"],
    enums: ["enums"],
    "option-result": ["option-result"],
    traits: ["traits"],
    generics: ["generics"],
    iterators: ["iterators"],
    "smart-pointers": ["smart-pointers", "ownership"],
};
