export interface ErrorEntry {
    readonly id: string;
    readonly code: string;
    readonly title: string;
    readonly message: string;
    readonly explanation: string;
    readonly fix: string;
    readonly conceptId?: string;
}

export const ERROR_CATALOGUE: readonly ErrorEntry[] = [
    // ── Ownership / move errors ──────────────────────────────────────────

    {
        id: "e0382",
        code: "E0382",
        title: "Use of moved value",
        message: "use of moved value: `x`",
        explanation:
            "A value was moved out of a variable and then used again. In Rust, moving a value transfers ownership — the original binding is no longer valid. This happens with types that don't implement `Copy`, such as `String`, `Vec`, and most heap-allocated types.",
        fix: "Clone the value before the move (`x.clone()`), or restructure so the original is no longer needed after the move. If the type is small and cheap (numbers, booleans), it may already implement `Copy` — check the type.",
        conceptId: "memory-management",
    },
    {
        id: "e0505",
        code: "E0505",
        title: "Cannot borrow after move",
        message: "cannot borrow `x` after move",
        explanation:
            "A borrow was attempted on a value that has already been moved elsewhere. Once ownership is transferred, the original variable can no longer be borrowed — there is nothing left to borrow.",
        fix: "Avoid the move by passing a reference instead of the owned value, or clone the value before the move if you need both copies.",
        conceptId: "memory-management",
    },
    {
        id: "e0381",
        code: "E0381",
        title: "Used binding is possibly-uninitialised",
        message: "used binding `x` is possibly-uninitialised",
        explanation:
            "A variable was declared but might not have been assigned a value on every code path before it was read. Rust requires that every variable is definitely initialised before use.",
        fix: "Assign a default value at declaration (`let mut x = 0;`) or restructure the control flow so every path assigns a value before the first read.",
        conceptId: "memory-management",
    },

    // ── Borrowing errors ─────────────────────────────────────────────────

    {
        id: "e0502",
        code: "E0502",
        title: "Cannot borrow as mutable because also borrowed as immutable",
        message: "cannot borrow `x` as mutable because it is also borrowed as immutable",
        explanation:
            "Rust's borrowing rules forbid holding a mutable reference while any immutable reference to the same data is still alive. Mutable borrows require exclusive access — no other references may exist.",
        fix: "Ensure the immutable borrow's lifetime ends before the mutable borrow begins. Introduce a new scope or restructure so the shared reference is dropped first.",
        conceptId: "reference-semantics",
    },
    {
        id: "e0499",
        code: "E0499",
        title: "Cannot borrow as mutable more than once",
        message: "cannot borrow `x` as mutable more than once at a time",
        explanation:
            "Rust only allows one mutable reference to a given piece of data at any point. Two simultaneous mutable borrows would allow aliasing, which the borrow checker prevents.",
        fix: "Let the first mutable borrow go out of scope before starting the second. If you genuinely need shared mutation, use interior mutability types such as `RefCell<T>` or `Mutex<T>`.",
        conceptId: "reference-semantics",
    },
    {
        id: "e0506",
        code: "E0506",
        title: "Cannot assign to variable because it is borrowed",
        message: "cannot assign to `x` because it is borrowed",
        explanation:
            "An assignment was attempted to a variable that is currently borrowed. While a reference to `x` exists, the value cannot be changed — that would invalidate the reference.",
        fix: "Wait for the borrow to end (drop the reference) before reassigning, or change the design to avoid needing to mutate borrowed data.",
        conceptId: "reference-semantics",
    },

    // ── Lifetime errors ──────────────────────────────────────────────────

    {
        id: "e0106",
        code: "E0106",
        title: "Missing lifetime specifier",
        message: "missing lifetime specifier",
        explanation:
            "A function returns a reference but the compiler cannot determine how long that reference is valid. When a function takes multiple references as inputs and returns a reference, the compiler needs to know which input's lifetime the output is tied to.",
        fix: "Add explicit lifetime parameters to the function signature (e.g. `fn first<'a>(a: &'a str, b: &'a str) -> &'a str`) to tell the compiler which input lifetime the return value borrows from.",
        conceptId: "reference-validity",
    },
    {
        id: "e0623",
        code: "E0623",
        title: "Lifetime mismatch",
        message: "lifetime mismatch",
        explanation:
            "The lifetimes expected by a function or type do not match what was actually provided. This often occurs when a reference is expected to live longer than the value it points to.",
        fix: "Make the lifetime annotations consistent — ensure the output lifetime does not outlive the input it borrows from. If necessary, return an owned type instead of a reference.",
        conceptId: "reference-validity",
    },
    {
        id: "e0597",
        code: "E0597",
        title: "Value does not live long enough",
        message: "`x` does not live long enough",
        explanation:
            "A reference is trying to outlive the value it points to. The borrowed value will be dropped while the reference is still in use, which would create a dangling pointer.",
        fix: "Ensure the owned value lives at least as long as the reference. This may involve returning an owned value, restructuring ownership, or using a type like `String` instead of `&str`.",
        conceptId: "reference-validity",
    },

    // ── Type errors ──────────────────────────────────────────────────────

    {
        id: "e0308",
        code: "E0308",
        title: "Mismatched types",
        message: "mismatched types: expected `String`, found `&str`",
        explanation:
            "The compiler expected one type but found a different one. The most common form is mixing owned and borrowed string types, but it can occur with any type mismatch.",
        fix: "Convert the value to the expected type (`to_string()`, `&[...]`, `as` casts for numeric types) or change the function signature to accept what you actually have.",
        conceptId: "string-types",
    },
    {
        id: "e0277",
        code: "E0277",
        title: "The trait bound is not satisfied",
        message: "the trait bound `T: Display` is not satisfied",
        explanation:
            "A function or method requires a type to implement a specific trait, but the type in question does not. Generic code places trait bounds on its parameters — if a concrete type doesn't meet those bounds, it can't be used there.",
        fix: "Implement the required trait for your type, or use a type that already implements it. If you're working with generics, add the missing trait bound to the type parameter.",
        conceptId: "behaviour-abstraction",
    },
    {
        id: "e0282",
        code: "E0282",
        title: "Type annotations needed",
        message: "type annotations needed: cannot infer type for type parameter `T`",
        explanation:
            "The compiler cannot figure out what type a variable or expression should be. This happens when a generic function is called without enough context for type inference.",
        fix: "Add an explicit type annotation to the variable (`let x: i32 = ...`) or use the turbofish syntax (`parse::<i32>()`) to specify the type at the call site.",
        conceptId: "generics",
    },
    {
        id: "e0283",
        code: "E0283",
        title: "Type ambiguity",
        message: "type annotations needed: multiple `impl`s satisfying ... found",
        explanation:
            "Multiple types could satisfy the required trait bounds, and the compiler cannot choose between them. This is common with numeric literals (could be `i32`, `f64`, etc.) or when several types implement the same trait.",
        fix: "Add a concrete type annotation or use the turbofish operator to disambiguate. For numeric literals, suffix them (`42i32`, `3.14f64`).",
        conceptId: "generics",
    },

    // ── Pattern matching ─────────────────────────────────────────────────

    {
        id: "e0004",
        code: "E0004",
        title: "Non-exhaustive patterns",
        message: "non-exhaustive patterns: `None` not covered",
        explanation:
            "A `match` expression does not handle every possible variant of the type being matched. Rust requires exhaustive matching — every possible value must be accounted for.",
        fix: "Add a catch-all arm (`_ => ...`) or handle the missing variant explicitly. For enums, list every variant or use `_` as a default.",
        conceptId: "algebraic-data-types",
    },
    {
        id: "e0162",
        code: "E0162",
        title: "Unreachable pattern",
        message: "unreachable pattern",
        explanation:
            "A `match` arm can never be reached because an earlier arm already matches all the values this arm would match. This usually happens when a wildcard `_` is placed before a more specific pattern.",
        fix: "Reorder the match arms so more specific patterns come before the wildcard, or remove the unreachable arm entirely.",
        conceptId: "algebraic-data-types",
    },

    // ── Method / field errors ────────────────────────────────────────────

    {
        id: "e0596",
        code: "E0596",
        title: "Cannot borrow as mutable behind a shared reference",
        message: "cannot borrow `*self.items` as mutable, as `self` is a `&` reference",
        explanation:
            "A method tried to mutate data through a shared (`&self`) reference. Shared references only allow reading, not writing. This is a core aliasing rule — if multiple shared references exist, none of them can mutate.",
        fix: "Use interior mutability (`RefCell<T>`, `Cell<T>`, `Mutex<T>`) if the type design requires mutation through a shared reference, or change the method to take `&mut self`.",
        conceptId: "smart-pointers",
    },
    {
        id: "e0599",
        code: "E0599",
        title: "No method named X found for type Y",
        message: "no method named `push` found for reference `&Vec<T>` in the current scope",
        explanation:
            "A method was called on a type that doesn't have it, or the method requires `&mut self` but only a `&self` reference is available. The method might also require a trait to be in scope.",
        fix: "Check that the correct type is being used and that any required traits are imported. If the method needs `&mut self`, ensure you have a mutable reference to the value.",
        conceptId: "collection-pipelines",
    },
    {
        id: "e0609",
        code: "E0609",
        title: "No field X on type Y",
        message: "no field `name` on type `Option<User>`",
        explanation:
            "A field was accessed on a type that doesn't have that field directly. This often happens when a value is wrapped in a container type like `Option`, `Result`, or `Box`, and the field is on the inner type.",
        fix: "Unwrap or pattern-match the outer type first. For `Option<T>`, use `.unwrap()`, `.expect()`, or a `match`/`if let` to access the inner value and its fields.",
        conceptId: "error-signalling",
    },

    // ── Scope / resolution errors ────────────────────────────────────────

    {
        id: "e0425",
        code: "E0425",
        title: "Cannot find value in scope",
        message: "cannot find value `foo` in this scope",
        explanation:
            "A name was used that hasn't been defined in the current scope. The variable may not have been declared, may be in a different module, or may have been moved and is no longer accessible.",
        fix: "Check the spelling. If the value is in another module, import it with `use`. If it was moved, clone it before the move or pass it by reference.",
        conceptId: "memory-management",
    },
    {
        id: "e0433",
        code: "E0433",
        title: "Failed to resolve",
        message: "failed to resolve: use of undeclared crate or module `serde`",
        explanation:
            "A module or crate was referenced that the compiler cannot find. The crate may not be listed in `Cargo.toml`, or the module path may be incorrect.",
        fix: "Add the missing crate to `Cargo.toml` under `[dependencies]`. For modules, check the path and ensure the file or directory exists in the correct location.",
        conceptId: "behaviour-abstraction",
    },

    // ── Entry-point errors ───────────────────────────────────────────────

    {
        id: "e0601",
        code: "E0601",
        title: "Main function not found",
        message: "main function not found in crate `my_crate`",
        explanation:
            "The compiler could not find a `main` function to use as the entry point. Every binary crate must have a `fn main()` at the crate root.",
        fix: "Add `fn main() { ... }` to `src/main.rs`. If this is a library crate, change the crate type in `Cargo.toml` to `[lib]`.",
        conceptId: "memory-management",
    },
    {
        id: "e0602",
        code: "E0602",
        title: "Expected item",
        message: "expected item, found `let`",
        explanation:
            "Something that can only appear inside a function body was written at the module level. Items like `struct`, `enum`, `fn`, and `impl` are allowed at module scope — `let` bindings and statements are not.",
        fix: "Move the code inside a function. Top-level code is not allowed in Rust — all logic must live within a function body.",
        conceptId: "memory-management",
    },

    // ── Additional common beginner errors ────────────────────────────────

    {
        id: "e0301",
        code: "E0301",
        title: "Expected mutable reference",
        message: "expected mutable reference, found `&` reference",
        explanation:
            "A function or method expected a `&mut` reference but received a shared `&` reference. Shared references don't allow mutation, so they can't be used where mutable access is required.",
        fix: "Pass a mutable reference by using `&mut` at the call site. Ensure the variable itself is declared as `mut`.",
        conceptId: "reference-semantics",
    },
    {
        id: "e0133",
        code: "E0133",
        title: "Using an unsafe function requires unsafe block",
        message: "call to unsafe function requires unsafe function or block",
        explanation:
            "An unsafe function was called outside of an `unsafe` block. Unsafe operations require the programmer to manually uphold safety invariants, so the compiler forces an explicit `unsafe` block to mark that responsibility.",
        fix: "Wrap the unsafe call in an `unsafe { ... }` block. Before doing so, verify that the call actually satisfies the safety requirements documented for that function.",
        conceptId: "memory-management",
    },
    {
        id: "e0061",
        code: "E0061",
        title: "Invalid number of function arguments",
        message: "this function takes 2 arguments but 3 were supplied",
        explanation:
            "A function was called with the wrong number of arguments. Rust does not support optional or variadic arguments in the way some languages do — the call must match the signature exactly.",
        fix: "Check the function definition and pass the correct number of arguments. If you need optional parameters, consider using `Option<T>` or the builder pattern.",
        conceptId: "behaviour-abstraction",
    },
    {
        id: "e0261",
        code: "E0261",
        title: "Use of undeclared lifetime",
        message: "use of undeclared lifetime name `'a`",
        explanation:
            "A lifetime name was used in a type annotation but was never declared as a lifetime parameter on the enclosing function, struct, or impl block.",
        fix: "Declare the lifetime on the function or struct (e.g. `fn parse<'a>(input: &'a str) -> &'a str`). Lifetime names must be introduced before they can be used.",
        conceptId: "reference-validity",
    },
    {
        id: "e0583",
        code: "E0583",
        title: "File not found for module",
        message: "file not found for module `utils`",
        explanation:
            "A `mod utils;` declaration was found but the corresponding file (`src/utils.rs` or `src/utils/mod.rs`) does not exist. Every module declaration must have a matching source file.",
        fix: "Create the missing file (`src/utils.rs` or `src/utils/mod.rs`). Alternatively, if the module is inline, change the declaration to `mod utils { ... }`.",
        conceptId: "behaviour-abstraction",
    },
    {
        id: "e0119",
        code: "E0119",
        title: "Conflicting implementations of trait",
        message: "conflicting implementations of trait `Display` for type `MyStruct`",
        explanation:
            "Two `impl` blocks define the same trait for the same type. Rust's coherence rules (orphan rules) ensure each trait is implemented for each type at most once to prevent ambiguity.",
        fix: "Remove the duplicate implementation. If you're trying to extend a foreign trait on a foreign type, consider using the newtype pattern instead.",
        conceptId: "behaviour-abstraction",
    },
    {
        id: "e0369",
        code: "E0369",
        title: "Binary operation cannot be applied to type",
        message: "binary operation `+` cannot be applied to type `&str`",
        explanation:
            "An operator was used with types that don't support it. Not all types implement all operators — for instance, `&str` cannot be added to `&str` because string concatenation requires at least one owned `String`.",
        fix: "Convert to the appropriate type before using the operator. For strings: `String::from("hello") + " world"` or use `format!`. For custom types, implement the relevant trait (`Add`, `Sub`, etc.).",
        conceptId: "string-types",
    },
    {
        id: "e0271",
        code: "E0271",
        title: "Type mismatch resolving a trait bound",
        message: "type mismatch resolving `<T as Iterator>::Item == i32`",
        explanation:
            "A generic type parameter's associated type doesn't match what was expected. This often occurs with iterators, futures, or other traits that have associated types.",
        fix: "Check that the iterator chain produces the expected item type. Add `.map()` or `.collect()` conversions as needed, or adjust the trait bound to match the actual associated type.",
        conceptId: "collection-pipelines",
    },
    {
        id: "e0220",
        code: "E0220",
        title: "Associated type not found",
        message: "associated type `Output` not found for `MyTrait`",
        explanation:
            "An associated type was referenced that doesn't exist on the trait in question. The trait either doesn't define that associated type, or the name is misspelled.",
        fix: "Check the trait definition for the correct associated type name. If the trait doesn't have one, you may need to use a generic parameter instead of an associated type.",
        conceptId: "behaviour-abstraction",
    },
    {
        id: "e0046",
        code: "E0046",
        title: "Not all trait items implemented",
        message: "not all trait items implemented, missing: `bar`",
        explanation:
            "A trait was implemented for a type but one or more of its required methods were not provided. Traits with required methods demand that every one of them has an implementation.",
        fix: "Add the missing method implementation(s) to the `impl` block. Check the trait definition for the full list of required methods.",
        conceptId: "behaviour-abstraction",
    },
    {
        id: "e0451",
        code: "E0451",
        title: "Attempted to implement a trait on a foreign type",
        message: "only traits defined in the current crate can be implemented for a type defined outside of the crate",
        explanation:
            "Both the trait and the type are defined in external crates. Rust's orphan rule prevents implementing a foreign trait on a foreign type — this avoids conflicting implementations across crates.",
        fix: "Use the newtype pattern: wrap the foreign type in a local struct (`struct MyString(String);`) and implement the foreign trait on the wrapper. Alternatively, implement a local trait instead.",
        conceptId: "behaviour-abstraction",
    },
    {
        id: "e0321",
        code: "E0321",
        title: "Cross-thread borrow",
        message: "`Rc<T>` cannot be sent between threads safely",
        explanation:
            "A type that is not `Send` was used in a context that requires thread safety (e.g. spawning a thread or using `Arc`). `Rc<T>` uses non-atomic reference counting and cannot be safely shared across threads.",
        fix: "Replace `Rc<T>` with `Arc<T>` for cross-thread sharing. If the inner value needs mutation, use `Arc<Mutex<T>>` or `Arc<RwLock<T>>`.",
        conceptId: "smart-pointers",
    },
    {
        id: "e0507",
        code: "E0507",
        title: "Cannot move out of borrowed content",
        message: "cannot move out of borrowed content",
        explanation:
            "Code tried to take ownership of a value that is only borrowed. A borrow gives temporary access, not ownership — you can't move something you don't own.",
        fix: "Clone the value instead of moving it, or return a reference rather than an owned value. If the type implements `Copy`, this error won't occur because copies are implicit.",
        conceptId: "reference-semantics",
    },
] as const;
