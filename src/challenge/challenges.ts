export interface Challenge {
    readonly topic: string;
    readonly level: "warm-up" | "core" | "tricky";
    readonly compiles: boolean;
    readonly code: string;
    readonly why: string;
    readonly fix?: string;
}

export const CHALLENGES: readonly Challenge[] = [
    {
        topic: "Ownership", level: "warm-up", compiles: false,
        code: `let s = String::from("hi");\nlet t = s;\nprintln!("{}", s);`,
        why: "String is not Copy, so let t = s moves ownership into t and invalidates s. Reading s afterwards is a use-after-move.",
        fix: `let s = String::from("hi");\nlet t = s.clone();   // deep copy, both stay valid\nprintln!("{} {}", s, t);`,
    },
    {
        topic: "Ownership", level: "warm-up", compiles: true,
        code: `let x = 5;\nlet y = x;\nprintln!("{} {}", x, y);`,
        why: "i32 implements Copy, so let y = x duplicates the value rather than moving it. x is still usable.",
    },
    {
        topic: "Borrowing", level: "core", compiles: false,
        code: `let mut v = vec![1, 2, 3];\nlet a = &mut v;\nlet b = &mut v;\na.push(4);\nb.push(5);`,
        why: "Two &mut to the same value are alive at once (both a and b are used later). At most one exclusive borrow may exist at a time.",
        fix: `let mut v = vec![1, 2, 3];\n{ let a = &mut v; a.push(4); } // first borrow ends\nlet b = &mut v; b.push(5);     // now allowed`,
    },
    {
        topic: "Borrowing", level: "core", compiles: false,
        code: `let mut s = String::from("hello");\nlet r = &s;\ns.push_str(" world");\nprintln!("{}", r);`,
        why: "push_str needs &mut s, but the shared borrow r is still used afterwards in println, so a mutable and an immutable borrow overlap.",
        fix: `let mut s = String::from("hello");\ns.push_str(" world");\nlet r = &s;            // borrow after the mutation\nprintln!("{}", r);`,
    },
    {
        topic: "Borrowing", level: "core", compiles: true,
        code: `let mut s = String::from("hello");\nlet r = &s;\nprintln!("{}", r);\ns.push_str(" world");`,
        why: "r is last used in the println, so its borrow has ended before push_str takes a mutable borrow. Non-lexical lifetimes make this fine.",
    },
    {
        topic: "Mutability", level: "warm-up", compiles: false,
        code: `let v = vec![1, 2, 3];\nv.push(4);`,
        why: "v is not declared mut, so no mutable borrow of it is allowed and push (which takes &mut self) is rejected.",
        fix: `let mut v = vec![1, 2, 3];\nv.push(4);`,
    },
    {
        topic: "Borrowing", level: "tricky", compiles: false,
        code: `let mut v = vec![1, 2, 3];\nfor x in &v {\n    v.push(*x);\n}`,
        why: "for x in &v holds a shared borrow for the whole loop, while push needs an exclusive borrow. Mutating a collection while iterating it is rejected at compile time.",
        fix: `let mut v = vec![1, 2, 3];\nlet extra: Vec<i32> = v.iter().copied().collect();\nv.extend(extra);`,
    },
    {
        topic: "Lifetimes", level: "core", compiles: false,
        code: `fn dangle() -> &String {\n    let s = String::from("x");\n    &s\n}`,
        why: "s is dropped when dangle returns, so &s would dangle. The compiler reports a missing lifetime and refuses to return a reference to a local.",
        fix: `fn no_dangle() -> String {\n    String::from("x")   // return ownership instead\n}`,
    },
    {
        topic: "Lifetimes", level: "core", compiles: false,
        code: `struct Holder {\n    part: &str,\n}`,
        why: "A struct that stores a reference must declare a lifetime so the compiler can ensure the struct never outlives the borrowed data.",
        fix: `struct Holder<'a> {\n    part: &'a str,\n}`,
    },
    {
        topic: "Pattern matching", level: "core", compiles: false,
        code: `enum Dir { N, S, E, W }\nfn step(d: Dir) -> i32 {\n    match d {\n        Dir::N => 0,\n        Dir::S => 1,\n    }\n}`,
        why: "match must be exhaustive. Dir::E and Dir::W are not handled, so the compiler reports non-exhaustive patterns.",
        fix: `match d {\n    Dir::N => 0,\n    Dir::S => 1,\n    _ => -1,   // catch the rest\n}`,
    },
    {
        topic: "Option / Result", level: "core", compiles: true,
        code: `fn first_char(s: &str) -> Option<char> {\n    let c = s.chars().next()?;\n    Some(c)\n}`,
        why: "The function returns Option, so ? is allowed: it yields the char on Some and returns None early on None.",
    },
    {
        topic: "Option / Result", level: "tricky", compiles: false,
        code: `fn main() {\n    let n: i32 = "42".parse()?;\n    println!("{}", n);\n}`,
        why: "? can only be used in a function whose return type can carry the error. Plain main returns (), so ? has nothing to propagate into.",
        fix: `fn main() -> Result<(), std::num::ParseIntError> {\n    let n: i32 = "42".parse()?;\n    println!("{}", n);\n    Ok(())\n}`,
    },
    {
        topic: "Types", level: "tricky", compiles: false,
        code: `let x: u8 = 5;\nlet y: i32 = 10;\nlet z = x + y;`,
        why: "Rust performs no implicit numeric coercion. u8 and i32 are distinct types, so x + y is a type mismatch.",
        fix: `let x: u8 = 5;\nlet y: i32 = 10;\nlet z = x as i32 + y;   // explicit cast`,
    },
    {
        topic: "Bindings", level: "warm-up", compiles: true,
        code: `let x = 5;\nlet x = x + 1;\nlet x = x * 2;\nprintln!("{}", x);`,
        why: "Each let re-declares x by shadowing the previous binding. This is allowed (and even lets the type change). It prints 12.",
    },
    {
        topic: "Closures", level: "tricky", compiles: false,
        code: `let s = String::from("hi");\nlet printer = move || println!("{}", s);\nprinter();\nprintln!("{}", s);`,
        why: "move forces the closure to take ownership of s. Using s again after the closure captured it is a use-after-move.",
        fix: `let s = String::from("hi");\nlet printer = || println!("{}", s); // borrow instead of move\nprinter();\nprintln!("{}", s);`,
    },
    {
        topic: "Traits", level: "core", compiles: true,
        code: `fn make_adder(x: i32) -> impl Fn(i32) -> i32 {\n    move |y| x + y\n}`,
        why: "The closure captures x by move and is returned as impl Fn. Returning an opaque closure type this way is fully supported.",
    },
];
