// Fix-section exercises: broken Rust snippets the learner repairs against the
// live Rust Playground oracle.
//
// Some exercises are adapted from Rustlings
// (https://github.com/rust-lang/rustlings), copyright (c) 2016
// Carol (Nichols || Goulding), distributed under the MIT licence. Adapted
// exercises carry an `// adapted: rustlings/<name>` marker in their broken
// code. See THIRD-PARTY-LICENSES.md at the repository root for the full
// licence text. The hint progression and idiomatic notes are original to this
// project.
//
// Every idiomaticFix snippet is verified manually against the Rust Playground
// (https://play.rust-lang.org) — there is no automated network test, so the
// snippets must be kept runnable by hand when edited.

import type { FixExercise } from "./types.ts";
import type { UserProfile } from "../settings/types.ts";

const RAW_FIX_EXERCISES: readonly Omit<FixExercise, "id">[] = [
    {
        // adapted: rustlings/variables2
        conceptId: "memory-management",
        topic: "Uninitialised binding",
        level: "warm-up",
        brokenCode: `fn main() {
    // adapted: rustlings/variables2
    let x;
    if x == 10 {
        println!("x is ten!");
    } else {
        println!("x is not ten!");
    }
}`,
        idiomaticFix: `fn main() {
    let x = 10;
    if x == 10 {
        println!("x is ten!");
    } else {
        println!("x is not ten!");
    }
}`,
        idiomaticNote:
            "Rust will not let you read a binding before a value has been assigned to it, and it cannot infer a type for x with nothing to go on. Initialising x at the point of declaration gives the compiler both the value and the type in one place, which is the idiomatic way to introduce a binding.",
        hints: [
            {
                label: "What is missing?",
                text: "The binding x is declared but never given a value before it is compared.",
            },
            {
                label: "What does the compiler need?",
                text: "Without an initial value the compiler cannot infer a type for x, and reading a possibly-uninitialised binding is rejected.",
            },
            {
                label: "The fix",
                text: "Assign a value when you declare it, for example `let x = 10;`, so x has both a value and a known type.",
            },
        ],
    },
    {
        conceptId: "memory-management",
        topic: "Mutating an immutable binding",
        level: "warm-up",
        brokenCode: `fn main() {
    let count = 0;
    count += 1;
    println!("{}", count);
}`,
        idiomaticFix: `fn main() {
    let mut count = 0;
    count += 1;
    println!("{}", count);
}`,
        idiomaticNote:
            "Bindings in Rust are immutable by default, so `count += 1` is rejected until you opt into mutation. Adding `mut` states the intent to mutate at the declaration, which keeps mutability visible at a glance rather than hidden in later code.",
        hints: [
            {
                label: "Why is it rejected?",
                text: "The binding count is reassigned with `+=`, but a plain `let` binding cannot be changed after it is set.",
            },
            {
                label: "What controls this?",
                text: "Rust makes bindings immutable unless you mark them otherwise — you have to ask for mutation explicitly.",
            },
            {
                label: "The fix",
                text: "Declare it as `let mut count = 0;` so the binding may be mutated.",
            },
        ],
    },
    {
        // adapted: rustlings/move_semantics1
        conceptId: "memory-management",
        topic: "Pushing to a moved vector",
        level: "core",
        brokenCode: `fn main() {
    let vec0 = vec![22, 44, 66];
    let vec1 = fill_vec(vec0);
    println!("{:?}", vec1);
}

// adapted: rustlings/move_semantics1
fn fill_vec(vec: Vec<i32>) -> Vec<i32> {
    vec.push(88);
    vec
}`,
        idiomaticFix: `fn main() {
    let vec0 = vec![22, 44, 66];
    let vec1 = fill_vec(vec0);
    println!("{:?}", vec1);
}

fn fill_vec(vec: Vec<i32>) -> Vec<i32> {
    let mut vec = vec;
    vec.push(88);
    vec
}`,
        idiomaticNote:
            "The vector is moved into fill_vec by value, so the function owns it — but the parameter binding is still immutable. Rebinding with `let mut vec = vec;` takes that owned value and makes it mutable without any clone, which is the cheap, idiomatic way to mutate a value you have just received by ownership.",
        hints: [
            {
                label: "Who owns the vector?",
                text: "fill_vec takes the vector by value, so it owns it — the problem is not ownership but mutability.",
            },
            {
                label: "What is immutable?",
                text: "Function parameters are immutable bindings by default, so calling `push` (which needs `&mut self`) on `vec` is rejected.",
            },
            {
                label: "The fix",
                text: "Rebind the owned value as mutable inside the function: `let mut vec = vec;` before the push.",
            },
        ],
    },
    {
        conceptId: "reference-semantics",
        topic: "Returning a reference to a local",
        level: "tricky",
        brokenCode: `fn greeting() -> &String {
    let message = String::from("hello");
    &message
}

fn main() {
    println!("{}", greeting());
}`,
        idiomaticFix: `fn greeting() -> String {
    let message = String::from("hello");
    message
}

fn main() {
    println!("{}", greeting());
}`,
        idiomaticNote:
            "The local `message` is dropped when greeting returns, so a reference to it would dangle — the borrow checker refuses it. Returning the `String` by value transfers ownership to the caller, which keeps the data alive exactly as long as it is needed and avoids lifetime annotations entirely.",
        hints: [
            {
                label: "What goes out of scope?",
                text: "message is a local that is dropped the moment greeting returns, so any reference to it would point at freed memory.",
            },
            {
                label: "Reference or value?",
                text: "You cannot return a borrow of something the function owns and then drops — the caller needs the data to outlive the call.",
            },
            {
                label: "The fix",
                text: "Return the owned `String` instead of a reference: change the signature to `-> String` and return `message` by value.",
            },
        ],
    },
];

/** Fix exercises with a stable id derived from their position. */
export const FIX_EXERCISES: readonly FixExercise[] = RAW_FIX_EXERCISES.map(
    (exercise, index) => ({
        ...exercise,
        id: `fix-exercise-${String(index)}`,
    })
);

export function getFilteredFixExercises(
    profile: UserProfile
): readonly FixExercise[] {
    if (profile.experience === "beginner") {
        // Beginners start with warm-up fixes only — core and tricky exercises
        // are withheld until the reader selects intermediate or advanced.
        return FIX_EXERCISES.filter((exercise) => exercise.level === "warm-up");
    }
    // Intermediate and advanced readers see every exercise.
    return FIX_EXERCISES;
}
