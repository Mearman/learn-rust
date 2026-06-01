import type { ReferenceCard } from "./types.ts";
import { CONCEPT_SYNTAX_IDS } from "./language-syntax.ts";

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
        syntaxIds: CONCEPT_SYNTAX_IDS["ownership"] ?? (() => { throw new Error("No syntax IDs for ownership"); })(),
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
        syntaxIds: CONCEPT_SYNTAX_IDS["borrowing"] ?? (() => { throw new Error("No syntax IDs for borrowing"); })(),
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
        syntaxIds: CONCEPT_SYNTAX_IDS["slices-strings"] ?? (() => { throw new Error("No syntax IDs for slices-strings"); })(),
    },
    {
        id: "lifetimes",
        title: "Lifetimes",
        summary: "Lifetimes are the compiler's proof that borrowed data outlives every reference to it.",
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
        syntaxIds: CONCEPT_SYNTAX_IDS["lifetimes"] ?? (() => { throw new Error("No syntax IDs for lifetimes"); })(),
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
        syntaxIds: CONCEPT_SYNTAX_IDS["enums"] ?? (() => { throw new Error("No syntax IDs for enums"); })(),
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
        syntaxIds: CONCEPT_SYNTAX_IDS["option-result"] ?? (() => { throw new Error("No syntax IDs for option-result"); })(),
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
        syntaxIds: CONCEPT_SYNTAX_IDS["traits"] ?? (() => { throw new Error("No syntax IDs for traits"); })(),
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
        syntaxIds: CONCEPT_SYNTAX_IDS["generics"] ?? (() => { throw new Error("No syntax IDs for generics"); })(),
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
        syntaxIds: CONCEPT_SYNTAX_IDS["iterators"] ?? (() => { throw new Error("No syntax IDs for iterators"); })(),
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
        syntaxIds: CONCEPT_SYNTAX_IDS["smart-pointers"] ?? (() => { throw new Error("No syntax IDs for smart-pointers"); })(),
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
