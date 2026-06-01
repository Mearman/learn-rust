export interface GlossaryEntry {
    readonly id: string;
    readonly term: string;
    readonly definition: string;
    readonly relatedTerms: readonly string[];
    readonly conceptId?: string;
}

export const GLOSSARY: readonly GlossaryEntry[] = [
    {
        id: "shared-reference",
        term: "&T (shared reference)",
        definition:
            "An immutable reference that grants read-only access to a value without taking ownership. Any number of shared references to the same data may exist simultaneously, but none of them can coexist with a mutable reference to that data. The value being borrowed must outlive the reference, which is tracked by lifetimes.",
        relatedTerms: ["mutable-reference", "borrowing-rules", "aliasing", "lifetimes"],
        conceptId: "reference-semantics",
    },
    {
        id: "mutable-reference",
        term: "&mut T (mutable reference)",
        definition:
            "A reference that grants exclusive read-write access to the borrowed value. Only one mutable reference to a particular piece of data may exist at a time, and no shared references to the same data may coexist alongside it. This exclusivity is enforced at compile time and is the cornerstone of Rust's data-race freedom guarantee.",
        relatedTerms: ["shared-reference", "borrowing-rules", "aliasing"],
        conceptId: "reference-semantics",
    },
    {
        id: "question-mark-operator",
        term: "? operator",
        definition:
            "A postfix operator that propagates errors concisely. When applied to a Result, it returns the Ok value or early-returns the Err from the enclosing function. When applied to an Option, it returns the Some value or early-returns None. The function using ? must have a compatible return type (Result or Option with matching error type). This operator replaces verbose match-based error propagation with a single character, making fallible code almost as readable as infallible code.",
        relatedTerms: ["result", "option", "panic"],
        conceptId: "error-signalling",
    },
    {
        id: "affine-types",
        term: "Affine types",
        definition:
            "A type system discipline where each value must be used at most once. Rust's ownership system is affine rather than linear — values may be silently dropped without being consumed, but they can never be used more than once. This is what makes move semantics sound without requiring explicit deallocation at every code path.",
        relatedTerms: ["move-semantics", "ownership", "drop-trait", "copy-trait"],
        conceptId: "memory-management",
    },
    {
        id: "aliasing",
        term: "Aliasing",
        definition:
            "When two or more references point to the same memory location. Rust's borrowing rules restrict aliasing: while a mutable reference (&mut T) exists, no other reference (mutable or shared) to the same data may coexist. This guarantee is what enables the compiler to perform aggressive optimisations without fear of data races or unexpected mutations through aliased pointers.",
        relatedTerms: ["borrowing-rules", "mutable-reference", "shared-reference"],
        conceptId: "reference-semantics",
    },
    {
        id: "arc",
        term: "Arc<T>",
        definition:
            "Atomically Reference Counted smart pointer. Arc provides shared ownership of a heap-allocated value across multiple threads, using atomic operations on the reference count for thread safety. It implements Clone but not DerefMut — to mutate through an Arc, pair it with a Mutex or RwLock. Arc has a small performance cost over Rc because of the atomic counter, so prefer Rc for single-threaded scenarios.",
        relatedTerms: ["rc", "mutex", "rwlock", "send-trait", "sync-trait"],
        conceptId: "smart-pointers",
    },
    {
        id: "associated-types",
        term: "Associated types",
        definition:
            "Types declared within a trait definition that implementors must specify. Unlike generic parameters (which let callers choose the type), associated types are chosen by the impl and are uniquely determined by the implementing type. This avoids needing to annotate the type at every call site and signals that each implementing type has exactly one meaningful choice for that type. The Iterator trait's associated Item type is the canonical example.",
        relatedTerms: ["traits", "generics", "trait-bounds"],
        conceptId: "behaviour-abstraction",
    },
    {
        id: "borrow-checker",
        term: "Borrow checker",
        definition:
            "The compiler component that enforces Rust's ownership and borrowing rules at compile time. It tracks which variables own, borrow, or have been moved from at every program point, rejecting code that would violate the aliasing guarantees. Errors from the borrow checker are the most common hurdle for newcomers, but they prevent entire classes of runtime bugs: use-after-free, double-free, and data races.",
        relatedTerms: ["ownership", "borrowing-rules", "lifetimes", "move-semantics"],
        conceptId: "memory-management",
    },
    {
        id: "borrowing-rules",
        term: "Borrowing rules",
        definition:
            "The two compile-time rules governing references: (1) at any given time, you may have either one mutable reference or any number of shared references, but never both simultaneously; (2) every reference must remain valid for the duration of its use. Together these rules guarantee that no data race can occur in safe Rust and that the compiler can reason precisely about aliasing for optimisation.",
        relatedTerms: ["borrow-checker", "aliasing", "shared-reference", "mutable-reference"],
        conceptId: "reference-semantics",
    },
    {
        id: "box",
        term: "Box<T>",
        definition:
            "A smart pointer that heap-allocates its contents. Box provides single ownership of a value on the heap and is primarily used when a value's size is unknown at compile time (such as recursive types), when you need to transfer ownership of a large value without copying the data, or when you want to own a trait object. Box has zero runtime overhead beyond the allocation itself — there is no reference counting or lock.",
        relatedTerms: ["rc", "arc", "trait-objects", "smart-pointers"],
        conceptId: "smart-pointers",
    },
    {
        id: "builder-pattern",
        term: "Builder pattern",
        definition:
            "A creational pattern where a separate builder object accumulates configuration through method calls and then produces the final value. In Rust it is especially useful for structs with many optional fields or complex validation, because the builder's type state can encode which fields have been set — attempting to build without required fields simply won't compile. It pairs well with the ownership system since the builder consumes itself on the final .build() call.",
        relatedTerms: ["ownership", "move-semantics"],
    },
    {
        id: "cargo",
        term: "Cargo",
        definition:
            "Rust's build system and package manager. Cargo handles compiling projects, downloading and resolving dependencies from crates.io, running tests, generating documentation, and publishing crates. It is invoked through the cargo command and is the standard toolchain for virtually all Rust projects. Configuration lives in Cargo.toml at the project root.",
        relatedTerms: ["rustup", "clippy", "rustfmt"],
    },
    {
        id: "channels",
        term: "Channels",
        definition:
            "A concurrency primitive for sending messages between threads. Rust's standard library provides mpsc (multi-producer, single-consumer) channels through std::sync::mpsc. The sender half is moved or cloned to producer threads, while the receiver stays on the consumer thread. Channels enforce Rust's ownership discipline across thread boundaries: values sent through a channel are moved, so the sending thread can no longer access them.",
        relatedTerms: ["send-trait", "ownership", "move-semantics"],
    },
    {
        id: "clippy",
        term: "Clippy",
        definition:
            "Rust's official linter, invoked as cargo clippy. It checks for common mistakes, idiomatic improvements, performance issues, and readability concerns that the compiler itself does not warn about. Clippy's lint categories (style, correctness, complexity, perf, pedantic, nursery) let you control how strict it is. Running Clippy regularly helps newcomers learn idiomatic Rust.",
        relatedTerms: ["cargo", "rustfmt", "rustup"],
    },
    {
        id: "clone-trait",
        term: "Clone",
        definition:
            "A trait for explicitly creating a deep copy of a value. Types that implement Clone define a .clone() method that produces a new, independent value with the same contents. Unlike Copy (which is implicit), Clone requires an explicit method call, signalling to the reader that a potentially expensive duplication is happening. Most standard library types implement Clone.",
        relatedTerms: ["copy-trait", "ownership"],
        conceptId: "memory-management",
    },
    {
        id: "copy-trait",
        term: "Copy",
        definition:
            "A marker trait indicating that a type is copied bitwise on assignment rather than moved. Copy types are implicitly duplicated whenever they are passed by value or assigned, so the original variable remains usable. Only types where a bitwise copy is equivalent to a full clone — and that have no ownership of heap data or other resources — may implement Copy. Most primitive types (integers, floats, booleans, char, tuples of Copy types) are Copy.",
        relatedTerms: ["clone-trait", "move-semantics", "ownership"],
        conceptId: "memory-management",
    },
    {
        id: "cow",
        term: "Cow<T>",
        definition:
            "Clone-on-Write smart pointer from std::borrow. Cow wraps either a borrowed reference (&T) or an owned value (T), letting functions accept borrowed data while still being able to mutate it when necessary — in which case the borrowed data is cloned into an owned copy. It is commonly used in string processing where most transformations leave the data unchanged but some require modification.",
        relatedTerms: ["borrow-trait", "smart-pointers", "box"],
        conceptId: "smart-pointers",
    },
    {
        id: "dangling-pointer",
        term: "Dangling pointer",
        definition:
            "A reference that points to memory that has already been freed or deallocated. In languages like C this is a common source of undefined behaviour. Rust's borrow checker and lifetime system prevent dangling pointers at compile time: a reference's lifetime must not outlive the owner of the data it borrows, so the compiler rejects any code that could produce a dangling reference in safe Rust.",
        relatedTerms: ["lifetimes", "borrow-checker", "ownership"],
        conceptId: "reference-validity",
    },
    {
        id: "drop-trait",
        term: "Drop",
        definition:
            "A trait for defining custom destruction logic. When a value goes out of scope, Rust automatically calls its Drop::drop method (if implemented), which is used to release resources such as file handles, network sockets, or heap memory. This is the mechanism behind RAII in Rust — resource acquisition happens during construction, and release is guaranteed by the Drop trait when the owner is destroyed.",
        relatedTerms: ["ownership", "raii", "move-semantics"],
        conceptId: "memory-management",
    },
    {
        id: "enums",
        term: "Enums",
        definition:
            "Algebraic sum types that can carry different sets of data in each variant. Rust enums are far more powerful than C-style enumerations: each variant can hold named fields, tuple-like payloads, or no data at all. They are the foundation of Rust's error handling (Option and Result are enums) and are always used with match for exhaustive pattern matching. Enum values occupy as much memory as the largest variant plus a discriminant tag.",
        relatedTerms: ["match", "option", "result", "pattern-matching"],
        conceptId: "algebraic-data-types",
    },
    {
        id: "generics",
        term: "Generics",
        definition:
            "A mechanism for writing functions, structs, enums, and traits that operate over abstract types, parameterised at compile time. Generic code is written once but instantiated for each concrete type it is used with (via monomorphisation), producing specialised, optimised code with no runtime overhead. Generic parameters can be constrained with trait bounds to require specific capabilities.",
        relatedTerms: ["trait-bounds", "monomorphisation", "traits", "associated-types"],
        conceptId: "generics",
    },
    {
        id: "interior-mutability",
        term: "Interior mutability",
        definition:
            "A design pattern where you mutate data through a shared reference, bypassing the usual borrowing rules by moving the enforcement to runtime. The standard library provides Cell<T> for Copy types and RefCell<T> for general types, both of which let you obtain a mutable reference (&mut T) from a &self method. This is necessary when the mutation is an implementation detail that does not affect the logical immutability of the container.",
        relatedTerms: ["refcell", "borrowing-rules", "cell", "shared-reference"],
        conceptId: "smart-pointers",
    },
    {
        id: "lifetimes",
        term: "Lifetimes",
        definition:
            "Annotations that tell the compiler how long a reference is expected to remain valid. Every reference in Rust has a lifetime, though most are inferred automatically by the compiler via lifetime elision rules. When the compiler cannot infer the relationship between reference lifetimes (for example, in functions that return a reference), you must annotate them explicitly using the 'a syntax. Lifetimes do not change how code runs — they are a compile-time analysis tool to guarantee memory safety.",
        relatedTerms: ["borrow-checker", "borrowing-rules", "dangling-pointer"],
        conceptId: "reference-validity",
    },
    {
        id: "monomorphisation",
        term: "Monomorphisation",
        definition:
            "The process by which the compiler generates a separate copy of a generic function or type for each concrete type it is used with. This eliminates runtime dispatch overhead — each instantiation is compiled as if you had written a specialised version by hand. The trade-off is binary size: heavily used generics across many types produce more machine code. Monomorphisation is the reason Rust generics have zero runtime cost.",
        relatedTerms: ["generics", "trait-bounds", "dyn"],
        conceptId: "generics",
    },
    {
        id: "move-semantics",
        term: "Move semantics",
        definition:
            "The rule that when a value is assigned to a new variable, passed to a function, or returned from a function, ownership of that value is transferred — the original variable can no longer be used. For types that do not implement Copy, this transfer is a move (the bits may or may not be physically copied, but the source is statically invalidated). Move semantics prevent double-free bugs by ensuring exactly one owner is responsible for each value's lifetime.",
        relatedTerms: ["ownership", "copy-trait", "clone-trait", "borrow-checker"],
        conceptId: "memory-management",
    },
    {
        id: "mutex",
        term: "Mutex<T>",
        definition:
            "A mutual exclusion primitive that provides interior mutability across threads. Mutex<T> wraps a value and guarantees that only one thread can access it at a time by requiring a lock() call that returns a MutexGuard. The guard implements Deref and DerefMut, providing access to the inner value, and automatically releases the lock when dropped. Mutex implements Sync, so the wrapped value can be shared across threads (typically via Arc<Mutex<T>>).",
        relatedTerms: ["arc", "rwlock", "interior-mutability", "send-trait", "sync-trait"],
        conceptId: "smart-pointers",
    },
    {
        id: "newtype-pattern",
        term: "Newtype pattern",
        definition:
            "Wrapping an existing type in a new struct with a single field to give it a distinct type identity. This lets you implement your own traits on the wrapper (which you cannot do directly on foreign types), enforce type safety at compile time (preventing accidental mixing of values that share the same underlying type but represent different concepts), and encapsulate validation logic. The wrapper has no runtime overhead because the compiler eliminates the indirection.",
        relatedTerms: ["structs", "traits", "generics"],
    },
    {
        id: "option",
        term: "Option<T>",
        definition:
            "An enum representing the possible absence of a value: Some(T) when a value is present, and None when it is not. Option replaces the use of null pointers found in other languages, forcing the programmer to explicitly handle the absent case (usually via match, if let, or combinator methods like unwrap_or, map, and and_then). Because Option is a normal enum with no special runtime treatment, the type system guarantees that null-pointer dereferences cannot occur.",
        relatedTerms: ["result", "match", "if-let", "enums"],
        conceptId: "error-signalling",
    },
    {
        id: "ownership",
        term: "Ownership",
        definition:
            "Rust's core memory management discipline: every value has exactly one owner (a variable, struct field, or collection element), and when the owner goes out of scope the value is dropped. Ownership can be transferred (moved) to another variable, but it cannot be duplicated implicitly. This single-owner model allows the compiler to insert deallocation code at deterministic points without a garbage collector, while guaranteeing that no two pieces of code believe they own the same resource.",
        relatedTerms: ["borrow-checker", "move-semantics", "drop-trait", "borrowing-rules"],
        conceptId: "memory-management",
    },
    {
        id: "raii",
        term: "RAII",
        definition:
            "Resource Acquisition Is Initialisation — a pattern where acquiring a resource (memory, file handle, network socket, lock) is tied to constructing an object, and releasing it is tied to the object's destruction. In Rust this is implemented through the Drop trait: when an owner goes out of scope, its drop method runs automatically, releasing the held resource. RAII makes resource leaks far less common because the compiler guarantees cleanup on every code path, including early returns and panics.",
        relatedTerms: ["drop-trait", "ownership", "move-semantics"],
        conceptId: "memory-management",
    },
    {
        id: "rc",
        term: "Rc<T>",
        definition:
            "Reference Counted smart pointer for single-threaded scenarios. Rc enables shared ownership of a heap-allocated value by maintaining a count of how many Rc pointers reference it; the value is dropped when the count reaches zero. Rc does not implement Send, so it cannot be transferred across threads. For thread-safe reference counting, use Arc instead. Rc is cheaper than Arc because it uses a non-atomic counter.",
        relatedTerms: ["arc", "box", "ownership", "send-trait"],
        conceptId: "smart-pointers",
    },
    {
        id: "refcell",
        term: "RefCell<T>",
        definition:
            "A smart pointer that enforces Rust's borrowing rules at runtime rather than compile time, providing interior mutability behind a shared reference. Calling borrow() returns a Ref<T> (analogous to &T) and borrow_mut() returns a RefMut<T> (analogous to &mut T). If the borrowing rules are violated at runtime — for example, calling borrow_mut() while a borrow() is active — the program panics. RefCell is single-threaded; for multi-threaded interior mutability use Mutex or RwLock.",
        relatedTerms: ["interior-mutability", "borrowing-rules", "rc", "mutex"],
        conceptId: "smart-pointers",
    },
    {
        id: "result",
        term: "Result<T, E>",
        definition:
            "An enum representing the outcome of a fallible operation: Ok(T) on success and Err(E) on failure, where E is the error type. Result forces callers to acknowledge and handle the error case explicitly, either through pattern matching, the ? operator, or combinator methods (map_err, unwrap, expect, etc.). It is the standard mechanism for recoverable errors in Rust, as opposed to panic for unrecoverable ones.",
        relatedTerms: ["option", "panic", "expect", "unwrap", "question-mark-operator"],
        conceptId: "error-signalling",
    },
    {
        id: "rustup",
        term: "Rustup",
        definition:
            "The official toolchain installer and manager for Rust. Rustup installs and manages multiple Rust toolchains (stable, beta, nightly, and specific versions), associated components (clippy, rustfmt, rust-src), and cross-compilation targets. It is the standard way to install Rust and keeps toolchains up to date via rustup update.",
        relatedTerms: ["cargo", "clippy", "rustfmt"],
    },
    {
        id: "rwlock",
        term: "RwLock<T>",
        definition:
            "A reader-writer lock that allows multiple concurrent readers or a single exclusive writer, but not both simultaneously. RwLock is the multi-threaded counterpart of RefCell: read() returns a guard that provides shared access (&T), while write() returns a guard providing exclusive access (&mut T). It is typically paired with Arc for cross-thread sharing (Arc<RwLock<T>>). Prefer RwLock over Mutex when reads significantly outnumber writes.",
        relatedTerms: ["mutex", "arc", "refcell", "interior-mutability"],
        conceptId: "smart-pointers",
    },
    {
        id: "send-trait",
        term: "Send",
        definition:
            "A marker trait indicating that a type can be safely transferred across thread boundaries. If a type implements Send, the compiler permits moving it to another thread (for example, via thread::spawn or a channel). Nearly all types are Send by default because ownership transfer is safe — the notable exceptions are types with non-thread-safe interior mutability (such as Rc) or raw pointers.",
        relatedTerms: ["sync-trait", "arc", "mutex", "channels"],
    },
    {
        id: "smart-pointers",
        term: "Smart pointers",
        definition:
            "Data structures that own the memory they point to and provide additional capabilities beyond a plain reference — such as reference counting (Rc, Arc), interior mutability (RefCell, Mutex), or heap allocation (Box). Smart pointers implement the Deref trait (so they can be used like regular references) and often implement Drop for custom cleanup. They are the primary way Rust manages resources beyond simple stack allocation.",
        relatedTerms: ["box", "rc", "arc", "refcell", "mutex"],
        conceptId: "smart-pointers",
    },
    {
        id: "sync-trait",
        term: "Sync",
        definition:
            "A marker trait indicating that a type can be safely shared between threads via a shared reference (&T). If T implements Sync, then &T may be sent to another thread — which effectively means the type supports concurrent read access without data races. Most types are Sync by default; counter-examples include Cell and RefCell, which allow mutation through shared references without synchronisation.",
        relatedTerms: ["send-trait", "arc", "mutex", "refcell"],
    },
    {
        id: "trait-bounds",
        term: "Trait bounds",
        definition:
            "Constraints placed on generic type parameters to restrict which types may be used, by requiring them to implement specified traits. Written as <T: Display + Clone> or using a where clause for readability. Trait bounds allow generic code to call methods and use operators defined by those traits, while the compiler ensures that every concrete type substituted for the parameter satisfies the constraints.",
        relatedTerms: ["generics", "traits", "monomorphisation"],
        conceptId: "generics",
    },
    {
        id: "trait-objects",
        term: "Trait objects",
        definition:
            "Dynamically dispatched values accessed through a reference or pointer to a trait (such as &dyn Trait or Box<dyn Trait>). The concrete type behind a trait object is erased at compile time and looked up at runtime through a vtable. Trait objects are useful when you need heterogeneous collections or when the set of possible types is open-ended, at the cost of a small runtime overhead for the indirect dispatch.",
        relatedTerms: ["dyn", "traits", "generics", "box"],
        conceptId: "behaviour-abstraction",
    },
    {
        id: "traits",
        term: "Traits",
        definition:
            "Rust's mechanism for defining shared behaviour — similar to interfaces in other languages but more powerful. A trait declares a set of methods (with optional default implementations) and associated types that implementing types must provide. Traits cannot hold data directly (they are not mix-ins) but can define methods that operate on self. They are used for polymorphism (via generics or trait objects), operator overloading, and abstraction boundaries.",
        relatedTerms: ["impl-blocks", "trait-bounds", "generics", "associated-types", "trait-objects"],
        conceptId: "behaviour-abstraction",
    },
    {
        id: "zero-cost-abstractions",
        term: "Zero-cost abstractions",
        definition:
            "The principle that using a higher-level abstraction (generics, iterators, traits, async/await) should produce code that runs at least as fast as an equivalent hand-written low-level implementation. Rust achieves this through monomorphisation (generics compile to specialised code), aggressive inlining, and the absence of hidden heap allocations or runtime dispatch where static dispatch suffices. The programmer pays only for what is actually used.",
        relatedTerms: ["monomorphisation", "generics", "traits"],
    },
    {
        id: "dyn",
        term: "dyn Trait",
        definition:
            "The syntax for creating and annotating trait objects — dynamically dispatched references to values that implement a given trait. A value of type &dyn Trait or Box<dyn Trait> consists of a data pointer and a vtable pointer, enabling runtime polymorphism where the concrete type is not known at compile time. Trait objects incur a small runtime cost for the indirect call but allow heterogeneous collections and open-ended extensibility.",
        relatedTerms: ["trait-objects", "traits", "generics", "monomorphisation"],
        conceptId: "behaviour-abstraction",
    },
    {
        id: "expect",
        term: "expect",
        definition:
            "A method on Option and Result that unwraps the contained value or panics with a custom error message. It behaves identically to unwrap but lets you provide context about what you expected, making panics far easier to diagnose. Prefer expect over unwrap in any code that might fail: the extra message costs nothing at runtime and saves debugging time.",
        relatedTerms: ["unwrap", "option", "result", "panic"],
        conceptId: "error-signalling",
    },
    {
        id: "if-let",
        term: "if let",
        definition:
            "A control-flow construct that matches a single pattern and executes a block if it matches, with an optional else branch for the non-matching case. It is a concise alternative to match when you only care about one variant of an enum — for example, if let Some(value) = option avoids the boilerplate of a full match expression while still destructuring the value.",
        relatedTerms: ["match", "while-let", "option", "enums"],
    },
    {
        id: "impl-blocks",
        term: "impl blocks",
        definition:
            "Blocks of code that define the implementation of a type's methods or its satisfaction of a trait. An inherent impl block (impl MyStruct) adds methods directly to a type. A trait impl block (impl MyTrait for MyStruct) provides the required methods to satisfy that trait. Every method in Rust must live inside an impl block — there are no free-standing methods like in C++ or Java.",
        relatedTerms: ["traits", "generics", "structs"],
    },
    {
        id: "match",
        term: "match",
        definition:
            "Rust's pattern-matching expression. It checks a value against a series of arms, each containing a pattern and code to execute if that pattern matches. Match arms are tried in order and must be exhaustive — the compiler verifies that every possible value is covered. Patterns can destructure structs, enums, tuples, and slices, binding variables to the extracted data. Match is the primary way to work with enums and is always preferred over cascading if-else chains for type-driven branching.",
        relatedTerms: ["enums", "if-let", "while-let", "pattern-matching"],
        conceptId: "algebraic-data-types",
    },
    {
        id: "panic",
        term: "panic!",
        definition:
            "A macro that immediately aborts the current thread with an error message and stack trace. Panics are used for unrecoverable errors — situations where the program has reached a state the programmer did not anticipate. Common triggers include indexing out of bounds, dividing by zero, and calling unwrap on a None or Err. In non-test builds a panic unwinds the stack (running Drop implementations); it can also be configured to abort the process.",
        relatedTerms: ["result", "option", "unwrap", "expect"],
        conceptId: "error-signalling",
    },
    {
        id: "rustfmt",
        term: "rustfmt",
        definition:
            "Rust's official code formatting tool, invoked as cargo fmt. It automatically reformats Rust source code according to a standardised style, eliminating debates over formatting in teams. Configuration is minimal by design — the default style is considered canonical. Most Rust projects run rustfmt as part of CI to ensure a consistent style across contributions.",
        relatedTerms: ["cargo", "clippy"],
    },
    {
        id: "unwrap",
        term: "unwrap",
        definition:
            "A method on Option and Result that returns the contained value or panics if it is None or Err. While convenient for prototyping and cases where failure is genuinely impossible, unwrap should be used sparingly in production code — prefer the ? operator for propagation, expect for explicit failure messages, or combinator methods like unwrap_or and unwrap_or_default for graceful fallbacks.",
        relatedTerms: ["expect", "option", "result", "panic"],
        conceptId: "error-signalling",
    },
    {
        id: "while-let",
        term: "while let",
        definition:
            "A loop construct that repeatedly matches a single pattern and executes the body while the pattern matches. It is the loop equivalent of if let — for example, while let Some(value) = iterator.next() iterates until the iterator returns None, without needing a full match expression. It is particularly useful when consuming iterators or parsing streams.",
        relatedTerms: ["if-let", "match", "option"],
    },
] as const;
