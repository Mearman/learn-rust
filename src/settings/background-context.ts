import type { DeveloperBackground } from "./types.ts";

/** Generic per-background note shown when no lesson-specific note exists. */
function genericNoteForBackground(background: DeveloperBackground): string {
    if (background === "frontend") {
        return "If you mostly ship UI code, think of this as moving a whole class of runtime bugs into the compiler.";
    }
    if (background === "backend") {
        return "If you work on services and APIs, Rust is forcing the same discipline your tests and production alerts usually discover too late.";
    }
    if (background === "mobile") {
        return "If you build mobile apps, this is the language making state transitions explicit instead of relying on app lifecycle luck.";
    }
    if (background === "systems") {
        return "If you already think in terms of ownership and lifetimes, Rust is giving those rules names the compiler can enforce.";
    }
    if (background === "devops") {
        return "If you live near deployment pipelines, this is the sort of correctness that saves you from rollout-time surprises.";
    }
    if (background === "data") {
        return "If you work with data transforms, Rust is making invalid states and partial failures impossible to ignore.";
    }
    if (background === "game-dev") {
        return "If you build games, this is the same low-level performance story with the memory rules written down for you.";
    }
    if (background === "embedded") {
        return "If you work close to hardware, Rust is the compiler backing up the discipline you already need.";
    }
    if (background === "student") {
        return "If this is your first systems language, focus on the shape of the rule rather than the syntax.";
    }
    if (background === "self-taught") {
        return "If you’ve learned by building, treat each rule as a way to move a bug you already know into compile time.";
    }
    return "Use the compiler as the thing that catches the bug before the code ships.";
}

/**
 * Lesson-specific context notes keyed by lesson id then background.
 * Only backgrounds that have something materially different to say for a given
 * lesson are listed — the generic fallback covers the rest.
 */
const LESSON_NOTES: Readonly<
    Record<string, Partial<Record<DeveloperBackground, string>>>
> = {
    ownership: {
        frontend:
            "React’s one-way data flow and component ownership are a loose analogy — Rust makes the same idea a hard compile-time rule.",
        backend:
            "Think of ownership as the language-level version of resource management you normally enforce through RAII or try-with-resources.",
        mobile: "Android’s lifecycle ownership and iOS ARC are runtime approximations of what Rust’s ownership enforces statically.",
        systems:
            "You already manage lifetimes manually; Rust is the compiler catching the mistakes you used to catch with Valgrind.",
        data: "Each transformation stage owns its buffer — no shared-mutable state means no accidental clobbers mid-pipeline.",
        "game-dev":
            "Entity ownership is a classic game-architecture problem. Rust’s ownership system forces you to make those decisions explicit at the type level.",
        embedded:
            "Peripheral ownership — only one driver holds the UART at a time — maps directly to Rust’s single-owner rule.",
        student:
            "This concept has no analogy in most languages taught in school. Read it as a rule about who is responsible for cleaning up a value.",
        "self-taught":
            "If you’ve debugged use-after-free or double-free in C/C++, this is the rule that makes those bugs impossible.",
    },
    borrowing: {
        frontend:
            "Immutable props and mutable state in React follow a similar pattern: shared reads are fine, exclusive writes require care.",
        backend:
            "Database read/write locking is the runtime equivalent of what Rust’s borrow checker enforces at compile time.",
        mobile: "Shared state bugs across UI and background threads are exactly what the borrow rules prevent at compile time.",
        systems:
            "The aliasing rules you follow manually in C to satisfy restrict or avoid UB — Rust enforces them statically.",
        data: "Read-many, write-once pipelines map cleanly: shared borrows for reads, exclusive borrows for writes.",
        "game-dev":
            "ECS systems that read some components and write others are a natural fit for the borrowing model.",
        embedded:
            "Interrupt handlers that share data with the main loop need exclusive access — the borrow rules model this directly.",
        student:
            "Think of it as lending a book: you can have multiple readers or one writer, never both at the same time.",
        "self-taught":
            "If you’ve hit concurrency bugs from shared mutable state, borrowing rules are the compile-time version of the fix.",
    },
    lifetimes: {
        frontend:
            "References that outlive the component that created them are a common React bug. Lifetimes catch that at compile time.",
        backend:
            "Request-scoped resources (database connections, spans) have natural lifetimes. Rust makes those scope boundaries explicit.",
        mobile: "View controller hierarchies have implicit lifetimes. Rust makes the relationship between data and its owner explicit.",
        systems:
            "Dangling pointer bugs are lifetime violations. The annotations just give the compiler the context to catch them.",
        data: "Iterator pipelines that borrow from a source dataset need the source to outlive the pipeline — lifetimes encode that constraint.",
        "game-dev":
            "Storing references to scene objects in components is where dangling pointers live in other languages. Lifetimes prevent it.",
        embedded:
            "DMA buffers that must outlive the transfer handle — lifetimes express that dependency and the compiler verifies it.",
        student:
            "Focus on what the annotation is saying, not the syntax: ‘the output reference lives at least as long as this input reference’.",
        "self-taught":
            "If you’ve seen segfaults from stale pointers, you’ve met a lifetime violation. Rust rejects those at compile time.",
    },
    slices: {
        frontend:
            "JavaScript’s substring always allocates. Rust’s &str is a zero-cost view into existing data — no allocation needed.",
        backend:
            "Parsing HTTP headers by slicing into a request buffer without copying — that’s exactly what &str enables.",
        systems:
            "String slice is the Rust equivalent of a (ptr, len) pair — familiar territory, but lifetime-checked.",
        data: "Splitting CSV lines by borrowing into the original buffer rather than copying each field is the idiomatic Rust approach.",
        "game-dev":
            "Asset name lookups that borrow from a string table rather than copying — zero-cost string views pay off here.",
        embedded:
            "Parsing protocol frames by taking slices of a receive buffer — no heap allocation needed in constrained environments.",
        student:
            "The key distinction is owned data (String) versus a borrowed view (&str). Most function parameters should accept &str.",
    },
    enums: {
        frontend:
            "Discriminated unions in TypeScript are the closest analogy. Rust’s enums are the same idea with compiler-enforced exhaustive matching.",
        backend:
            "Result-returning APIs replace exception-based error handling. Exhaustive match replaces missed catch branches.",
        mobile: "State machines with explicit variants — login flow, loading states — map directly to Rust enums.",
        systems:
            "Tagged unions in C are the manual version. Rust enums are the same with guaranteed exhaustiveness and safe access.",
        data: "Representing parse results (valid, missing, malformed) as enum variants forces every path to be handled.",
        "game-dev":
            "Game state machines (Menu, Playing, Paused, GameOver) are a textbook enum use case. Exhaustive match means no unhandled state.",
        embedded:
            "Protocol message types as enums — the compiler rejects any handler that doesn’t cover every message variant.",
        student:
            "Think of each enum variant as a named slot that can carry its own data. match is how you open the slot safely.",
        "self-taught":
            "If you’ve used if/else chains to simulate state machines, enums plus match are the cleaner, safer replacement.",
    },
    "option-result": {
        frontend:
            "Null checks on API responses that might be missing — Option forces you to handle the absent case before using the value.",
        backend:
            "Every database query that might return no row, every parse that might fail — Result and Option replace silent null returns.",
        mobile: "Network calls that can fail, optional user preferences, nullable fields — all modelled without null pointer exceptions.",
        systems:
            "Error codes and sentinel values are the C equivalent. Result is the same contract, but the compiler enforces handling.",
        data: "Parse failures, missing fields, out-of-range values — Result and Option make those paths visible in the type signature.",
        "game-dev":
            "Asset loading, save-file parsing, config reads — all fallible operations that Result models cleanly.",
        embedded:
            "Hardware operations that may fail or return no data — Result replaces the ad-hoc return-code convention.",
        student:
            "You can think of Option as a box that either holds a value or is empty. match forces you to check before opening it.",
        "self-taught":
            "If you’ve shipped null pointer bugs, Option is the type-level fix. If you’ve missed error returns, Result is the enforcement.",
    },
    traits: {
        frontend:
            "TypeScript interfaces define shapes. Rust traits define behaviour. The key difference: you can implement a trait for a type you didn’t write.",
        backend:
            "Dependency injection patterns — swap implementations by changing what implements a trait, not by changing call sites.",
        mobile: "Protocol/interface patterns in Swift and Kotlin map closely. Rust adds orphan rules and object safety constraints.",
        systems:
            "Vtables and interface dispatch are the manual version of what trait objects automate. Rust’s model is explicit about the cost.",
        data: "Serialisation traits (Display, Debug, serde::Serialize) let the same pipeline work over any type that implements the trait.",
        "game-dev":
            "Component behaviour as traits — anything that implements Update runs each frame. Static dispatch keeps it zero-cost.",
        embedded:
            "HAL traits (embedded-hal) let you write device drivers that work across any microcontroller implementing the trait.",
        student:
            "A trait is a promise: any type implementing it can do these things. The compiler holds every type to that promise.",
        "self-taught":
            "If you’ve used duck typing in Python, traits are the statically-checked version: the compiler verifies the interface at compile time.",
    },
    generics: {
        frontend:
            "TypeScript generics are the same concept. Rust’s version is monomorphised — no runtime overhead, unlike type erasure.",
        backend:
            "Generic repository or service types that work over any entity — the same abstraction compiles to type-specific code with no overhead.",
        systems:
            "C++ templates are the closest analogy. Rust generics are cleaner to read and have better error messages.",
        data: "Generic aggregation functions that work over any numeric type — monomorphisation means no boxing, no virtual calls.",
        "game-dev":
            "Generic data structures (spatial index, object pool) that work for any component type — zero-cost abstraction at the type level.",
        embedded:
            "Generic drivers that work over any type implementing a HAL trait — the specialisation happens at compile time with no runtime cost.",
        student:
            "Generics let you write one function that works for many types. The compiler creates a separate copy for each type you actually use.",
        "self-taught":
            "If you’ve written the same function for int, float, and String separately, generics are how you write it once.",
    },
    iterators: {
        frontend:
            "Array .map(), .filter(), .reduce() in JS are the same pipeline model. Rust’s version is lazy and allocation-free until .collect().",
        backend:
            "Database result processing pipelines — map each row, filter invalid ones, collect into a response — map directly to iterator chains.",
        systems:
            "Loop unrolling and SIMD are downstream optimisations the compiler applies to iterator chains — you get the abstraction without the overhead.",
        data: "Data transformation pipelines are iterators. The laziness means a 10-step pipeline over a million rows doesn’t allocate intermediate Vecs.",
        "game-dev":
            "Processing all entities with a given component is an iterator operation. Lazy evaluation means you only pay for what you consume.",
        embedded:
            "Processing sensor readings through a transformation pipeline without heap allocation — lazy iterators make this idiomatic.",
        student:
            "Think of iterator adapters as describing what to do, not doing it yet. .collect() is what actually runs the pipeline.",
        "self-taught":
            "If you’ve written for loops that filter and transform data, iterator chains express the same logic more directly.",
    },
    "smart-pointers": {
        frontend:
            "React’s ref model and shared component state are the use cases for Rc/RefCell — shared ownership with controlled mutation.",
        backend:
            "Connection pools and shared configuration objects are the Arc use case — multiple threads, one piece of data, safe concurrent access.",
        systems:
            "unique_ptr is Box, shared_ptr is Rc/Arc. The difference: Rust’s reference counting is explicit, not hidden by copy constructors.",
        data: "Sharing a large dataset across multiple pipeline stages without copying — Arc lets multiple owners share the same allocation.",
        "game-dev":
            "Scene graph nodes with multiple owners, shared asset handles — Rc/Arc replace manual reference counting with automatic cleanup.",
        embedded:
            "In no_std embedded contexts, Box requires a custom allocator. Rc/Arc are single-threaded and thread-safe shared ownership respectively.",
        student:
            "Box puts a value on the heap. Rc lets multiple owners share one value. RefCell moves the borrow check to runtime — use sparingly.",
        "self-taught":
            "If you’ve ever needed a value to outlive the scope that created it, Box is the answer. If multiple owners need it, Rc or Arc.",
    },
};

/**
 * Returns context notes for the given lesson and developer backgrounds.
 * Falls back to the generic background note when no lesson-specific entry exists.
 * Deduplicates notes that are identical across multiple selected backgrounds.
 */
export function backgroundContextNotes(
    backgrounds: readonly DeveloperBackground[],
    lessonId?: string
): readonly string[] {
    const notes: string[] = [];
    const lessonNotes =
        lessonId !== undefined ? LESSON_NOTES[lessonId] : undefined;
    for (const background of backgrounds) {
        const specific =
            lessonNotes !== undefined ? lessonNotes[background] : undefined;
        notes.push(specific ?? genericNoteForBackground(background));
    }
    return Array.from(new Set(notes));
}
