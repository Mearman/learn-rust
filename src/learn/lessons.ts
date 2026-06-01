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

export interface LessonBlockBase {
    readonly kind: string;
    readonly text?: string;
}

export interface TextBlock extends LessonBlockBase {
    readonly kind: "text";
    readonly text: string;
}

export interface CodeBlock {
    readonly kind: "code";
    readonly label: string;
    readonly code: string;
}

export interface NoteBlock extends LessonBlockBase {
    readonly kind: "note";
    readonly text: string;
}

export interface AnalogyBlock extends LessonBlockBase {
    readonly kind: "analogy";
    readonly text: string;
}

export type LessonBlock = TextBlock | CodeBlock | NoteBlock | AnalogyBlock;

export interface Lesson {
    readonly id: string;
    readonly title: string;
    readonly icon: LucideIcon;
    readonly tagline: string;
    readonly blocks: readonly LessonBlock[];
}

export const LESSONS: readonly Lesson[] = [
    {
        id: "ownership",
        title: "Ownership",
        icon: Package,
        tagline:
            "One owner per value. Memory freed on scope exit. No GC, no manual free.",
        blocks: [
            {
                kind: "text",
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
                kind: "note",
                text: "Scalar types (integers, bool, char, and tuples/arrays of Copy types) implement Copy, so they are duplicated on assignment instead of moved.",
            },
            {
                kind: "analogy",
                text: "Close to a std::unique_ptr whose moves the compiler tracks for you, except the old binding is statically forbidden rather than left dangling.",
            },
        ],
    },
    {
        id: "borrowing",
        title: "Borrowing & references",
        icon: GitBranch,
        tagline:
            "Access without owning. Many shared reads xor one exclusive write.",
        blocks: [
            {
                kind: "text",
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
                kind: "note",
                text: "A borrow ends at its last use, not at the closing brace (non-lexical lifetimes). Code that looks like it conflicts often compiles because the earlier borrow is already finished.",
            },
        ],
    },
    {
        id: "lifetimes",
        title: "Lifetimes",
        icon: Anchor,
        tagline: "A reference may never outlive the data it points at.",
        blocks: [
            {
                kind: "text",
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
                kind: "note",
                text: "Annotations never change how long anything lives. They only describe a relationship the compiler then verifies.",
            },
        ],
    },
    {
        id: "slices",
        title: "Slices & strings",
        icon: AlignLeft,
        tagline:
            "Borrowed windows into contiguous data. String owns, &str views.",
        blocks: [
            {
                kind: "text",
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
        ],
    },
    {
        id: "enums",
        title: "Enums & pattern matching",
        icon: Braces,
        tagline: "Algebraic data types. match must cover every variant.",
        blocks: [
            {
                kind: "text",
                text: "Enums are algebraic data types: each variant can carry its own payload. match destructures a value and binds its inner data, and the compiler rejects any match that does not cover every variant.",
            },
            {
                kind: "code",
                label: "match.rs",
                code: `enum Shape {\n    Circle(f64),\n    Rect { w: f64, h: f64 },\n}\n\nfn area(s: &Shape) -> f64 {\n    match s {\n        Shape::Circle(r) => std::f64::consts::PI * r * r,\n        Shape::Rect { w, h } => w * h,\n    } // omit a variant and it will not compile\n}`,
            },
            {
                kind: "note",
                text: "if let and while let are concise forms when you only care about one pattern. Use _ as a catch-all arm when a full match is overkill.",
            },
        ],
    },
    {
        id: "option-result",
        title: "Option & Result",
        icon: Shield,
        tagline:
            "No null. Absence and failure are ordinary values you must handle.",
        blocks: [
            {
                kind: "text",
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
                kind: "analogy",
                text: "Option is a T or nothing that the type system refuses to let you ignore; Result is a value-based, checked alternative to throwing exceptions.",
            },
        ],
    },
    {
        id: "traits",
        title: "Traits",
        icon: Layers,
        tagline:
            "Shared behaviour. Like interfaces, with default methods and orphan impls.",
        blocks: [
            {
                kind: "text",
                text: "A trait declares a set of methods a type can implement. It resembles an interface, but you may implement a trait for a type you did not define, and traits can ship default method bodies.",
            },
            {
                kind: "code",
                label: "traits.rs",
                code: `trait Summary {\n    fn title(&self) -> String;\n    fn preview(&self) -> String {       // default method\n        format!("{} ...", self.title())\n    }\n}\n\nstruct Article { headline: String }\n\nimpl Summary for Article {\n    fn title(&self) -> String { self.headline.clone() }\n}\n\nfn announce(item: &impl Summary) {       // static dispatch\n    println!("New: {}", item.preview());\n}`,
            },
            {
                kind: "text",
                text: "Constrain generics with trait bounds (T: Summary) for monomorphised static dispatch, or use &dyn Summary for runtime polymorphism behind a single pointer.",
            },
        ],
    },
    {
        id: "generics",
        title: "Generics",
        icon: Type,
        tagline:
            "Monomorphised at compile time. Bounds say what a type must support.",
        blocks: [
            {
                kind: "text",
                text: "Generics are monomorphised: the compiler emits a specialised copy of the code for each concrete type used, so abstraction carries no runtime cost. Bounds restrict a type parameter to what the body actually needs.",
            },
            {
                kind: "code",
                label: "generics.rs",
                code: `fn largest<T: PartialOrd + Copy>(items: &[T]) -> T {\n    let mut best = items[0];\n    for &x in &items[1..] {\n        if x > best { best = x; }\n    }\n    best\n}\n\nfn main() {\n    println!("{}", largest(&[3, 9, 4, 1]));        // 9\n    println!("{}", largest(&[1.5, 0.2, 7.8]));     // 7.8\n}`,
            },
        ],
    },
    {
        id: "iterators",
        title: "Iterators & closures",
        icon: Repeat,
        tagline: "Lazy pipelines. Closures capture the environment.",
        blocks: [
            {
                kind: "text",
                text: "Iterators are lazy. Adapters such as map and filter only describe work; nothing runs until a consumer like collect, sum, or a for loop drives the chain. The result is allocation-free, fused pipelines.",
            },
            {
                kind: "code",
                label: "iter.rs",
                code: `fn main() {\n    let evens_squared: Vec<i32> = (1..=10)\n        .filter(|n| n % 2 == 0)   // closure capturing nothing\n        .map(|n| n * n)\n        .collect();\n\n    println!("{:?}", evens_squared); // [4, 16, 36, 64, 100]\n\n    let total: i32 = evens_squared.iter().sum();\n    println!("{}", total);\n}`,
            },
            {
                kind: "note",
                text: "Closures capture their environment. The Fn, FnMut, and FnOnce traits encode whether a closure only reads, mutates, or consumes what it captured.",
            },
        ],
    },
    {
        id: "smart-pointers",
        title: "Smart pointers",
        icon: Boxes,
        tagline:
            "Box for heap, Rc/Arc for shared ownership, RefCell for runtime borrows.",
        blocks: [
            {
                kind: "text",
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
        ],
    },
];
