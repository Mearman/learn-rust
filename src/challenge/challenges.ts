import type { LanguageFamiliarity } from "../data/languages.ts";
import type { UserProfile } from "../settings/types.ts";

export interface ChallengeChoice {
    /** Stable id for the option, unique within the challenge (e.g. "a","b","c"). */
    readonly id: string;
    /** The option text shown to the reader. */
    readonly text: string;
    /** True for the single correct option. */
    readonly correct: boolean;
    /** Shown when this WRONG option is chosen — names the misconception.
     *  Omit on the correct option. */
    readonly misconception?: string;
}

export interface MultipleChoice {
    /** The recall question, e.g. "Which lifetime annotation is wrong?" */
    readonly prompt: string;
    /** 3–4 options. Exactly one has correct:true. */
    readonly options: readonly ChallengeChoice[];
}

export interface Challenge {
    /** Stable id derived from position in CHALLENGES; used as the scroll
     *  anchor element id and the sidebar sub-section id. */
    readonly id: string;
    readonly topic: string;
    readonly level: "warm-up" | "core" | "tricky";
    readonly compiles: boolean;
    readonly code: string;
    readonly why: string;
    readonly fix?: string;
    readonly whyPerLanguage?: Partial<Record<LanguageFamiliarity, string>>;
    /** When present, selects multiple-choice presentation instead of the
     *  binary "will it compile?" guess for this card. */
    readonly choices?: MultipleChoice;
}

const RAW_CHALLENGES: readonly Omit<Challenge, "id">[] = [
    {
        topic: "Ownership",
        level: "warm-up",
        compiles: false,
        code: `let s = String::from("hi");\nlet t = s;\nprintln!("{}", s);`,
        why: "String is not Copy, so let t = s moves ownership into t and invalidates s. Reading s afterwards is a use-after-move.",
        fix: `let s = String::from("hi");\nlet t = s.clone();   // deep copy, both stay valid\nprintln!("{} {}", s, t);`,
        whyPerLanguage: {
            python: "Python assigns by reference — t = s creates a second name for the same object and both remain valid. Rust moves ownership instead, so s becomes invalid after let t = s.",
            typescript:
                "In TypeScript, assigning an object creates another reference to it — both variables point to the same data. Rust moves ownership, so s becomes invalid after let t = s.",
            java: "Java shares object references on assignment — both variables point to the same object. Rust transfers ownership, making s unusable after let t = s.",
            kotlin: "Kotlin shares references like Java — both variables see the same object after assignment. Rust moves ownership instead, so s is no longer valid.",
            go: "Go copies the pointer in assignments, so both variables reference the same underlying string data. Rust moves ownership, making the original binding unusable.",
            csharp: "C# shares references for reference types — both variables point to the same object after assignment. Rust moves ownership, so s can no longer be used.",
            cpp: "Like std::unique_ptr, Rust transfers ownership on move — but the compiler enforces it statically rather than leaving a dangling pointer.",
        },
    },
    {
        topic: "Ownership",
        level: "warm-up",
        compiles: true,
        code: `let x = 5;\nlet y = x;\nprintln!("{} {}", x, y);`,
        why: "i32 implements Copy, so let y = x duplicates the value rather than moving it. x is still usable.",
        whyPerLanguage: {
            python: "In Python, integers are immutable and assigned by reference, but since they can't be mutated the effect is the same as a copy. Rust makes this explicit: types that implement Copy (like i32) are duplicated on assignment.",
            typescript:
                "In TypeScript, primitive values (numbers, strings, booleans) are copied on assignment. Rust works the same way for types that implement Copy — i32 is one of them.",
            java: "Java's int is a primitive, copied by value on assignment. Rust's i32 behaves identically — it implements the Copy trait and is duplicated rather than moved.",
            kotlin: "Kotlin's Int is a primitive at runtime, copied by value. Rust's i32 works the same way — it implements Copy and is duplicated on assignment.",
            go: "Go copies values on assignment for value types like int. Rust does the same for types that implement Copy — i32 is duplicated, not moved.",
            csharp: "C# copies int on assignment since it's a value type. Rust's i32 works the same — it implements Copy and is duplicated rather than moved.",
            cpp: "C++ copies int on assignment — trivially copyable types behave identically in Rust. The Copy trait is Rust's way of marking types where a bitwise copy is safe.",
        },
    },
    {
        topic: "Borrowing",
        level: "core",
        compiles: false,
        code: `let mut v = vec![1, 2, 3];\nlet a = &mut v;\nlet b = &mut v;\na.push(4);\nb.push(5);`,
        why: "Two &mut to the same value are alive at once (both a and b are used later). At most one exclusive borrow may exist at a time.",
        fix: `let mut v = vec![1, 2, 3];\n{ let a = &mut v; a.push(4); } // first borrow ends\nlet b = &mut v; b.push(5);     // now allowed`,
        whyPerLanguage: {
            python: "Python has no concept of exclusive references — you can hold as many references to the same object as you like and mutate through any of them. Rust forbids having two &mut to the same value simultaneously.",
            typescript:
                "TypeScript lets you hold multiple references to the same object and mutate through any of them. Rust enforces exclusivity: at most one &mut reference may exist at a time.",
            java: "Java allows multiple references to the same object with mutation through any of them. Rust enforces that only one &mut borrow can exist at a time, catching data races at compile time.",
            kotlin: "Kotlin, like Java, allows multiple references to the same mutable object. Rust requires exclusive access for mutation — only one &mut borrow may exist at a time.",
            go: "Go allows multiple goroutines to hold pointers to the same data (data races are a runtime problem, caught by the race detector). Rust rejects this at compile time: only one &mut borrow may exist.",
            csharp: "C# allows multiple references to the same mutable object. Rust enforces exclusivity — only one &mut borrow to a value can exist at any time.",
            cpp: "C++ allows multiple mutable pointers to the same object — it's your responsibility to avoid data races. Rust enforces this at compile time: at most one &mut may exist.",
        },
    },
    {
        topic: "Borrowing",
        level: "core",
        compiles: false,
        code: `let mut s = String::from("hello");\nlet r = &s;\ns.push_str(" world");\nprintln!("{}", r);`,
        why: "push_str needs &mut s, but the shared borrow r is still used afterwards in println, so a mutable and an immutable borrow overlap.",
        fix: `let mut s = String::from("hello");\ns.push_str(" world");\nlet r = &s;            // borrow after the mutation\nprintln!("{}", r);`,
        whyPerLanguage: {
            python: "In Python, you can read and mutate an object through different references simultaneously — there's no borrow checker. Rust forbids overlapping a shared borrow (&) with a mutable one (&mut).",
            typescript:
                "TypeScript lets you read and mutate an object through different references at the same time. Rust's borrow checker ensures shared and mutable borrows never overlap.",
            java: "Java freely allows reading and mutating an object through different references concurrently. Rust prevents this at compile time: shared borrows and mutable borrows may not coexist.",
            kotlin: "Kotlin allows reading and mutating through different references simultaneously. Rust's borrow checker enforces that shared and exclusive borrows never overlap.",
            go: "Go permits reading a slice through one variable while appending to it through another. Rust rejects this at compile time — shared and mutable borrows cannot coexist.",
            csharp: "C# allows reading and mutating an object through different references at once. Rust prevents overlapping shared and mutable borrows at compile time.",
            cpp: "C++ allows a reference and a mutable pointer to the same object to coexist — mutating through the pointer while holding the reference is undefined behaviour. Rust's borrow checker catches this at compile time.",
        },
    },
    {
        topic: "Borrowing",
        level: "core",
        compiles: true,
        code: `let mut s = String::from("hello");\nlet r = &s;\nprintln!("{}", r);\ns.push_str(" world");`,
        why: "r is last used in the println, so its borrow has ended before push_str takes a mutable borrow. Non-lexical lifetimes make this fine.",
        whyPerLanguage: {
            python: "Python has no borrow checker, so the idea of a reference 'expiring' doesn't exist. Rust's non-lexical lifetimes mean a borrow ends at its last use, not at the end of scope — so reusing the value afterwards is fine.",
            typescript:
                "TypeScript doesn't track reference lifetimes. Rust does, but smartly: a borrow ends at its last actual use (non-lexical), not at the closing brace. The shared borrow has ended before push_str takes a mutable one.",
            java: "Java doesn't restrict when references are valid. Rust does, but with non-lexical lifetimes a borrow ends at its last use rather than its scope end. The shared borrow r expires before push_str needs &mut.",
            kotlin: "Kotlin doesn't track reference lifetimes. Rust's non-lexical lifetimes mean a borrow ends at its last use — r expires after println!, so push_str can take a mutable borrow.",
            go: "Go doesn't restrict reference validity periods. Rust does, but non-lexical lifetimes end borrows at last use rather than scope end. Here r is dead after println!, so push_str can proceed.",
            csharp: "C# doesn't restrict when references are valid. Rust's non-lexical lifetimes end borrows at their last use — r expires after the println!, allowing push_str to take a mutable borrow.",
            cpp: "C++ references are valid until the end of their scope (lexical). Rust is smarter — non-lexical lifetimes end a borrow at its last use. Here r is dead after println!, so push_str can borrow mutably.",
        },
    },
    {
        topic: "Mutability",
        level: "warm-up",
        compiles: false,
        code: `let v = vec![1, 2, 3];\nv.push(4);`,
        why: "v is not declared mut, so no mutable borrow of it is allowed and push (which takes &mut self) is rejected.",
        fix: `let mut v = vec![1, 2, 3];\nv.push(4);`,
        whyPerLanguage: {
            python: "Python variables are mutable by default — there's no way to declare a variable as immutable (the closest is naming convention, like UPPER_CASE). Rust requires mut to allow mutation; without it, the binding is immutable.",
            typescript:
                "TypeScript has const (no reassignment) and let (reassignable), but const objects can still have their properties mutated. Rust's let mut controls whether the binding itself can be mutated — without mut, even calling push is rejected.",
            java: "Java's final prevents reassignment but doesn't stop mutation of object contents. Rust's let (without mut) makes the binding truly immutable — methods that need &mut self can't be called on it.",
            kotlin: "Kotlin's val prevents reassignment but doesn't stop mutation of mutable objects. Rust's let (without mut) is stricter — the binding can't be mutated at all, and &mut borrows are forbidden.",
            go: "Go has no immutability declarations for local variables — everything is mutable. Rust requires mut to allow mutation; omitting it makes the binding immutable and rejects methods like push.",
            csharp: "C# doesn't have local immutability (only readonly on fields). Rust requires mut to allow mutation — without it, the binding is immutable and push (which takes &mut self) is rejected.",
            cpp: "C++ has const — const vector<int> won't allow push_back. Rust's let (without mut) is analogous: it makes the binding immutable, rejecting any &mut operation.",
        },
    },
    {
        topic: "Borrowing",
        level: "tricky",
        compiles: false,
        code: `let mut v = vec![1, 2, 3];\nfor x in &v {\n    v.push(*x);\n}`,
        why: "for x in &v holds a shared borrow for the whole loop, while push needs an exclusive borrow. Mutating a collection while iterating it is rejected at compile time.",
        fix: `let mut v = vec![1, 2, 3];\nlet extra: Vec<i32> = v.iter().copied().collect();\nv.extend(extra);`,
        whyPerLanguage: {
            python: "Python raises RuntimeError at runtime if you modify a list while iterating it. Rust prevents this at compile time — the iterator holds a shared borrow, and push needs a mutable one.",
            typescript:
                "Modifying an array during a for...of loop in JavaScript can produce unexpected results but no error. Rust catches this at compile time: the loop's borrow and push's &mut overlap.",
            java: "Java throws ConcurrentModificationException at runtime when you modify a collection during iteration. Rust prevents this at compile time — the iterator's shared borrow conflicts with push's mutable borrow.",
            kotlin: "Kotlin, like Java, throws ConcurrentModificationException at runtime if you modify a collection during iteration. Rust catches this at compile time instead.",
            go: "Go's range over a slice takes a copy of the slice header, so appending during iteration may or may not be visible — it's subtly broken. Rust rejects this at compile time.",
            csharp: "C# throws InvalidOperationException if you modify a collection during foreach iteration. Rust prevents this at compile time — the shared borrow from iteration conflicts with mutation.",
            cpp: "C++ has undefined behaviour when you modify a vector while iterating — the iterator may be invalidated. Rust catches this at compile time by refusing overlapping shared and mutable borrows.",
        },
    },
    {
        topic: "Lifetimes",
        level: "core",
        compiles: false,
        code: `fn dangle() -> &String {\n    let s = String::from("x");\n    &s\n}`,
        why: "s is dropped when dangle returns, so &s would dangle. The compiler reports a missing lifetime and refuses to return a reference to a local.",
        fix: `fn no_dangle() -> String {\n    String::from("x")   // return ownership instead\n}`,
        whyPerLanguage: {
            python: "Python's garbage collector frees objects only when all references are gone, so returning a reference to a local is safe. Rust has no GC — the compiler must prove references don't outlive their data, and it rejects returning a reference to a dropped local.",
            typescript:
                "JavaScript's garbage collector keeps objects alive as long as any reference exists. Rust has no GC, so the compiler must statically verify that references don't outlive the data they point to.",
            java: "Java's garbage collector ensures objects live as long as any reference to them exists. Rust has no GC — the compiler prevents returning a reference to a local that will be dropped.",
            kotlin: "Kotlin, like Java, relies on garbage collection — objects survive as long as they're referenced. Rust has no GC and must prove at compile time that no reference outlives its data.",
            go: "Go's garbage collector keeps allocated memory alive while references exist. Rust has no GC and relies on compile-time lifetime checking to prevent dangling references.",
            csharp: "C#'s garbage collector keeps objects alive while referenced. Rust has no GC and prevents dangling references at compile time by checking lifetimes.",
            cpp: "Returning a reference to a local variable is undefined behaviour in C++ — the compiler may warn but doesn't stop you. Rust's borrow checker catches this at compile time and rejects it.",
        },
    },
    {
        topic: "Lifetimes",
        level: "core",
        compiles: false,
        code: `struct Holder {\n    part: &str,\n}`,
        why: "A struct that stores a reference must declare a lifetime so the compiler can ensure the struct never outlives the borrowed data.",
        fix: `struct Holder<'a> {\n    part: &'a str,\n}`,
        whyPerLanguage: {
            python: "Python's garbage collector manages object lifetimes automatically — structs can hold references without lifetime annotations. Rust requires explicit lifetime parameters on structs that store references so the compiler can verify they remain valid.",
            typescript:
                "TypeScript doesn't need lifetime annotations — the garbage collector handles object lifetimes. Rust structs holding references must declare lifetime parameters so the compiler can ensure the references outlive the struct.",
            java: "Java's garbage collector handles object lifetimes transparently. Rust structs that store references need lifetime annotations so the compiler can verify the referenced data lives long enough.",
            kotlin: "Kotlin relies on garbage collection, so classes can hold references without worrying about lifetimes. Rust structs need explicit lifetime parameters when they store references, giving the compiler the information to check validity.",
            go: "Go's garbage collector manages lifetimes — structs can hold slices and pointers without lifetime annotations. Rust requires lifetime parameters on structs that store references so the compiler can enforce memory safety.",
            csharp: "C# relies on garbage collection — classes can hold references without lifetime annotations. Rust structs need lifetime parameters when storing references so the compiler can verify they remain valid.",
            cpp: "C++ allows classes to store raw pointers and references without lifetime annotations — misuse causes undefined behaviour. Rust requires explicit lifetime parameters, letting the compiler prevent dangling references at compile time.",
        },
    },
    {
        topic: "Pattern matching",
        level: "core",
        compiles: false,
        code: `enum Dir { N, S, E, W }\nfn step(d: Dir) -> i32 {\n    match d {\n        Dir::N => 0,\n        Dir::S => 1,\n    }\n}`,
        why: "match must be exhaustive. Dir::E and Dir::W are not handled, so the compiler reports non-exhaustive patterns.",
        fix: `match d {\n    Dir::N => 0,\n    Dir::S => 1,\n    _ => -1,   // catch the rest\n}`,
        whyPerLanguage: {
            python: "Python's match statement doesn't enforce exhaustiveness — unmatched cases simply fall through. Rust requires match arms to cover every possible variant of the enum.",
            typescript:
                "TypeScript's switch doesn't enforce exhaustiveness — you can miss cases without error (unless you use a never-based trick). Rust's match must be exhaustive; every enum variant must be handled.",
            java: "Java's switch on enums doesn't require a default branch, though IDEs may warn. Rust enforces exhaustiveness at compile time — every variant must be explicitly handled or caught by a wildcard.",
            kotlin: "Kotlin's when is exhaustive for sealed classes and enums — you must cover every branch, similar to Rust's match. If you forget a case, the compiler reports it.",
            go: "Go's switch doesn't enforce exhaustiveness — missing cases do nothing. Rust requires every enum variant to be handled in a match expression.",
            csharp: "C#'s switch statements don't enforce exhaustiveness for enums. Rust requires match to cover every possible variant, catching missing cases at compile time.",
            cpp: "C++ has no built-in exhaustiveness checking for switch on enums — missing cases fall through silently. Rust's match must cover every variant of the enum.",
        },
    },
    {
        topic: "Option / Result",
        level: "core",
        compiles: true,
        code: `fn first_char(s: &str) -> Option<char> {\n    let c = s.chars().next()?;\n    Some(c)\n}`,
        why: "The function returns Option, so ? is allowed: it yields the char on Some and returns None early on None.",
        whyPerLanguage: {
            python: "In Python, you'd write if x is None: return None to exit early. Rust's ? operator does the same thing concisely — it returns early on None and unwraps the value on Some.",
            typescript:
                "TypeScript uses optional chaining (?.) and nullish coalescing (??) for null handling. Rust's ? operator goes further: it returns early from the function on None, propagating the absence up the call stack.",
            java: "Java's Optional requires methods like orElse and ifPresent — there's no early-return operator. Rust's ? extracts the value from Some or immediately returns None from the enclosing function.",
            kotlin: "Kotlin uses safe calls (?.) and the Elvis operator (?:) for null handling. Rust's ? operator is different — it returns early from the function on None, similar to Kotlin's require + return pattern but built into the language.",
            go: "Go uses explicit if err != nil { return err } checks everywhere. Rust's ? operator automates this pattern — on Some it unwraps the value, on None it returns early.",
            csharp: "C# uses null-conditional (?.) and null-coalescing (??) operators. Rust's ? is different — it returns early from the function on None, propagating the absence to the caller.",
            cpp: "C++'s std::optional requires manual checking (if (opt.has_value())). Rust's ? operator automatically unwraps Some or returns None early from the function, eliminating boilerplate.",
        },
    },
    {
        topic: "Option / Result",
        level: "tricky",
        compiles: false,
        code: `fn main() {\n    let n: i32 = "42".parse()?;\n    println!("{}", n);\n}`,
        why: "? can only be used in a function whose return type can carry the error. Plain main returns (), so ? has nothing to propagate into.",
        fix: `fn main() -> Result<(), std::num::ParseIntError> {\n    let n: i32 = "42".parse()?;\n    println!("{}", n);\n    Ok(())\n}`,
        whyPerLanguage: {
            python: "Python propagates exceptions automatically — any function can raise and the caller must handle it. Rust's ? propagates errors, but only into a compatible return type; () can't carry an error.",
            typescript:
                "JavaScript propagates exceptions automatically through the call stack. Rust's ? requires the enclosing function's return type to accept the error — main() returning () doesn't.",
            java: "Java uses checked exceptions (declared in the method signature) or unchecked exceptions (propagated automatically). Rust's ? is more like checked exceptions — the return type must be able to hold the error, and () can't.",
            kotlin: "Kotlin propagates exceptions automatically. Rust's ? operator requires the function's return type to accommodate the error variant — a bare () return type has nowhere to put it.",
            go: "Go requires explicit error returns — if err != nil { return err }. Rust's ? is shorthand for this, but it only works when the function's return type can carry the error. main() returning () cannot.",
            csharp: "C# propagates exceptions automatically. Rust's ? operator needs the return type to carry errors — () is not an error-carrying type, so ? is invalid here.",
            cpp: "C++ propagates exceptions automatically with throw/try/catch. Rust's ? is not exception-based — it's syntactic sugar for pattern matching and early return, and requires the return type to support error propagation.",
        },
    },
    {
        topic: "Types",
        level: "tricky",
        compiles: false,
        code: `let x: u8 = 5;\nlet y: i32 = 10;\nlet z = x + y;`,
        why: "Rust performs no implicit numeric coercion. u8 and i32 are distinct types, so x + y is a type mismatch.",
        fix: `let x: u8 = 5;\nlet y: i32 = 10;\nlet z = x as i32 + y;   // explicit cast`,
        whyPerLanguage: {
            python: "Python implicitly converts between numeric types — 5 + 10 works regardless of whether the operands are different integer types. Rust does no implicit coercion; u8 and i32 are distinct types and must be explicitly converted.",
            typescript:
                "TypeScript has only one number type (number), so mixed-type arithmetic never happens. Rust has many integer types (u8, i32, etc.) and requires explicit casts between them.",
            java: "Java implicitly widens byte to int in arithmetic expressions. Rust does not — u8 and i32 are separate types and you must cast explicitly with as.",
            kotlin: "Kotlin implicitly widens smaller numeric types to larger ones in arithmetic. Rust does not perform implicit coercion — you must explicitly cast u8 to i32 with as.",
            go: "Go requires explicit type conversion for different numeric types: int32(x) + y. Rust works the same way — u8 and i32 don't mix without an explicit as cast.",
            csharp: "C# implicitly widens smaller numeric types to larger ones (e.g. byte to int). Rust does not — u8 and i32 are incompatible without an explicit as cast.",
            cpp: "C++ implicitly promotes smaller integer types (unsigned char to int). Rust doesn't — u8 and i32 are distinct types and mixing them is a compile error without an explicit cast.",
        },
    },
    {
        topic: "Bindings",
        level: "warm-up",
        compiles: true,
        code: `let x = 5;\nlet x = x + 1;\nlet x = x * 2;\nprintln!("{}", x);`,
        why: "Each let re-declares x by shadowing the previous binding. This is allowed (and even lets the type change). It prints 12.",
        whyPerLanguage: {
            python: "In Python, x = x + 1 reassigns the same variable. Rust's let x = x + 1 creates a new binding that shadows the previous one — this is a distinct concept from reassignment and even allows changing the type.",
            typescript:
                "TypeScript doesn't allow redeclaring a let variable in the same scope — let x = 5; let x = 6; is an error. Rust's let creates a new binding each time, shadowing the previous one in the same scope.",
            java: "Java doesn't allow redeclaring a local variable in the same scope. Rust permits it — each let creates a new binding that shadows the previous one, and the type can even change.",
            kotlin: "Kotlin doesn't allow redeclaring a val or var in the same scope. Rust does — let creates a new binding that shadows the old one, and the shadowed binding can have a different type.",
            go: "Go's := only allows redeclaration if at least one variable on the left is new. Rust's let x = x + 1 freely shadows the previous x, even in the same scope.",
            csharp: "C# doesn't allow redeclaring a local variable in the same scope. Rust does — each let introduces a new binding that shadows the previous one, even allowing type changes.",
            cpp: "C++ allows shadowing in nested scopes but not the same scope. Rust permits same-scope shadowing — each let creates a new binding that hides the previous one.",
        },
    },
    {
        topic: "Closures",
        level: "tricky",
        compiles: false,
        code: `let s = String::from("hi");\nlet printer = move || println!("{}", s);\nprinter();\nprintln!("{}", s);`,
        why: "move forces the closure to take ownership of s. Using s again after the closure captured it is a use-after-move.",
        fix: `let s = String::from("hi");\nlet printer = || println!("{}", s); // borrow instead of move\nprinter();\nprintln!("{}", s);`,
        whyPerLanguage: {
            python: "Python closures capture variables by reference (late binding) — both the closure and the surrounding code can use s. Rust's move closure takes ownership of s, making the original binding unusable.",
            typescript:
                "JavaScript closures capture variables by reference — the closure and outer code share the variable. Rust's move || takes ownership of captured variables, so s is moved into the closure and can't be used afterwards.",
            java: "Java lambdas capture effectively final variables by value — but the original reference remains usable. Rust's move closure transfers ownership, so s is no longer valid in the outer scope.",
            kotlin: "Kotlin lambdas capture variables by reference — the original remains usable. Rust's move closure takes ownership of captured variables, invalidating them in the enclosing scope.",
            go: "Go closures capture variables by reference — both the closure and the surrounding function share them. Rust's move closure takes ownership, so the captured variable is no longer usable outside.",
            csharp: "C# lambdas capture local variables by reference into a generated closure class — the original remains usable. Rust's move closure takes ownership, so s is consumed and can't be used afterwards.",
            cpp: "C++ lambda [=] copies captured variables but the original remains valid. Rust's move closure is similar but actually moves ownership — the original binding becomes unusable.",
        },
    },
    {
        topic: "Traits",
        level: "core",
        compiles: true,
        code: `fn make_adder(x: i32) -> impl Fn(i32) -> i32 {\n    move |y| x + y\n}`,
        why: "The closure captures x by move and is returned as impl Fn. Returning an opaque closure type this way is fully supported.",
        whyPerLanguage: {
            python: "Python uses duck typing — any callable with the right signature works, no trait abstraction needed. Rust's impl Fn(i32) -> i32 returns an opaque closure type that implements the Fn trait, hiding the concrete type.",
            typescript:
                "TypeScript uses structural typing — any function matching the signature (x: number) => number is accepted. Rust's impl Trait hides the concrete type while guaranteeing it satisfies the trait.",
            java: "Java's lambdas implement functional interfaces (like Function<Integer, Integer>). Rust's impl Fn(i32) -> i32 is similar — it returns a type that implements the trait without naming the concrete type.",
            kotlin: "Kotlin's lambdas implement SAM interfaces like (Int) -> Int. Rust's impl Fn(i32) -> i32 similarly guarantees the returned value implements the Fn trait, while hiding the concrete closure type.",
            go: "Go returns named interface types for polymorphic return values. Rust's impl Fn(i32) -> i32 is analogous — it guarantees the returned value implements Fn without exposing the concrete type.",
            csharp: "C# can return Func<int, int> delegates, but the actual type is a named delegate. Rust's impl Fn(i32) -> i32 returns an opaque type — you know it implements Fn, but not what specific closure it is.",
            cpp: "C++ auto return type deduces the concrete type and exposes it in the header. Rust's impl Fn hides the concrete type — callers only know it satisfies the trait.",
        },
    },
    // ----- Multiple-choice challenges ----------------------------------------
    // These use the `choices` field instead of the binary compile-guess.
    // Code shown in options is verified to compile/fail as claimed.
    {
        topic: "Lifetimes",
        level: "core",
        // compiles: true so the code shown is the "correct" reference snippet;
        // the MC question tests understanding of the annotation, not the snippet itself.
        compiles: true,
        code: `fn first_word(s: &str) -> &str {\n    let bytes = s.as_bytes();\n    for (i, &b) in bytes.iter().enumerate() {\n        if b == b' ' { return &s[0..i]; }\n    }\n    &s[..]\n}`,
        why: "Rust's lifetime elision rules mean a function with exactly one input reference automatically assigns that lifetime to any output reference. Rules 1 and 2 together: each input ref gets its own lifetime (rule 1), then if there is exactly one input lifetime it propagates to the output (rule 2). No annotation is needed here.",
        choices: {
            prompt: "Which pair of elision rules allows `fn first_word(s: &str) -> &str` to compile without explicit lifetime annotations?",
            options: [
                {
                    id: "a",
                    text: "Rule 1 alone: each input reference gets its own lifetime parameter.",
                    correct: false,
                    misconception:
                        "Rule 1 assigns lifetimes to inputs, but on its own it doesn't tell the compiler what lifetime to give the output. Rule 2 is also needed.",
                },
                {
                    id: "b",
                    text: "Rules 1 and 2 together: each input gets its own lifetime, and because there is exactly one input lifetime, it is assigned to the output.",
                    correct: true,
                },
                {
                    id: "c",
                    text: "Rule 3: the output lifetime is assigned from &self, because str is special.",
                    correct: false,
                    misconception:
                        "Rule 3 applies only to methods with a &self or &mut self receiver — not to free functions. There is no &self here.",
                },
                {
                    id: "d",
                    text: "No rule is needed: output references to &str never require a lifetime because str is always 'static.",
                    correct: false,
                    misconception:
                        "&str can borrow from any string, not just static ones. The compiler must prove the output slice doesn't outlive the input — it uses elision rules 1 and 2 to do this automatically.",
                },
            ],
        },
    },
    {
        topic: "Lifetimes",
        level: "core",
        compiles: false,
        code: `fn longer(x: &str, y: &str) -> &str {\n    if x.len() > y.len() { x } else { y }\n}`,
        why: "When a function takes two input references and returns a reference, the compiler cannot determine which input the output borrows from. Explicit lifetime annotations are required: `fn longer<'a>(x: &'a str, y: &'a str) -> &'a str`.",
        fix: `fn longer<'a>(x: &'a str, y: &'a str) -> &'a str {\n    if x.len() > y.len() { x } else { y }\n}`,
        choices: {
            prompt: "This function fails to compile. Which annotation correctly fixes it so the output lifetime is at least as long as both inputs?",
            options: [
                {
                    id: "a",
                    text: "fn longer<'a>(x: &'a str, y: &'a str) -> &'a str",
                    correct: true,
                },
                {
                    id: "b",
                    text: "fn longer<'a>(x: &'a str, y: &str) -> &'a str",
                    correct: false,
                    misconception:
                        "This ties the output only to x's lifetime, but the body returns y in the else branch. rustc rejects the definition with E0621 (explicit lifetime required in the type of `y`): the signature promises to borrow only from x, yet a value borrowed from y can escape. The output must be bounded by both inputs.",
                },
                {
                    id: "c",
                    text: "fn longer<'a, 'b>(x: &'a str, y: &'b str) -> &'a str",
                    correct: false,
                    misconception:
                        "This annotation says the output lives as long as x's lifetime. But the body may return y — rustc will reject it because 'b does not necessarily outlive 'a.",
                },
                {
                    id: "d",
                    text: "fn longer(x: &'static str, y: &'static str) -> &'static str",
                    correct: false,
                    misconception:
                        "Requiring both inputs to be 'static is far too restrictive — the function would only work with string literals, not with references to local Strings.",
                },
            ],
        },
    },
    {
        topic: "Lifetimes",
        level: "tricky",
        compiles: true,
        code: `struct Excerpt<'a> {\n    line: &'a str,\n}\nimpl<'a> Excerpt<'a> {\n    fn announce(&self, msg: &str) -> &str {\n        println!("Attention: {}", msg);\n        self.line\n    }\n}`,
        why: "The method has &self as receiver, which triggers elision rule 3: the output lifetime is assigned from &self. The compiler knows the returned &str borrows from self.line, whose lifetime is 'a. No explicit annotation is needed on announce.",
        choices: {
            prompt: "The `announce` method returns `&str` without explicit lifetime annotations. Which elision rule makes this valid?",
            options: [
                {
                    id: "a",
                    text: "Rule 2: there is only one input reference, so its lifetime goes to the output.",
                    correct: false,
                    misconception:
                        "There are two input references here — &self and &str msg. Rule 2 applies only when there is exactly one input lifetime. With two, you need rule 3 or explicit annotations.",
                },
                {
                    id: "b",
                    text: "Rule 3: because the method takes &self, the output lifetime is automatically assigned from &self's lifetime.",
                    correct: true,
                },
                {
                    id: "c",
                    text: "The return type borrows from msg, so it inherits msg's anonymous lifetime.",
                    correct: false,
                    misconception:
                        "The body returns self.line, not msg. The lifetime comes from &self (rule 3), not from msg. If you tried to return msg's data the compiler would reject it, because that would require an explicit annotation.",
                },
                {
                    id: "d",
                    text: "str is always 'static so no lifetime annotation is ever needed on &str.",
                    correct: false,
                    misconception:
                        "&str is not always 'static — it can borrow from any String or slice. In this case self.line borrows from wherever the Excerpt was created, so the compiler must track its lifetime.",
                },
            ],
        },
    },
];

/** Challenges with a stable id derived from their position. */
export const CHALLENGES: readonly Challenge[] = RAW_CHALLENGES.map((c, i) => ({
    ...c,
    id: `challenge-${String(i)}`,
}));

export function getFilteredChallenges(
    profile: UserProfile
): readonly Challenge[] {
    if (profile.experience === "advanced") return CHALLENGES;
    if (profile.experience === "intermediate") {
        // Intermediate users see everything — warm-up, core, and tricky.
        return CHALLENGES;
    }
    // Beginners see warm-up and core challenges — warm-up alone is too thin;
    // core challenges reinforce the same concepts with natural next steps.
    // Tricky challenges are withheld until the user selects intermediate+.
    return CHALLENGES.filter(
        (c) => c.level === "warm-up" || c.level === "core"
    );
}
