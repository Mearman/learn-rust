import type { LanguageConcept } from "./types.ts";

export const LANGUAGE_CONCEPTS: readonly LanguageConcept[] = [
    // =========================================================================
    // Memory management
    // =========================================================================
    {
        id: "memory-rust",
        languageId: "rust",
        conceptId: "memory-management",
        title: "Ownership and move semantics",
        code: `let s1 = String::from("hello");
let s2 = s1; // s1 is moved, no longer valid
// println!("{}", s1); // error: value borrowed after move`,
        explanation:
            "Each value has a single owner. Assignment moves the value, invalidating the previous binding. Drop runs automatically when the owner goes out of scope.",
    },
    {
        id: "memory-python",
        languageId: "python",
        conceptId: "memory-management",
        title: "Reference counting and garbage collection",
        code: `# Variables are references; GC tracks object lifetime
s1 = "hello"
s2 = s1  # both names point to same object
# no concept of "moved from"`,
        explanation:
            "Python uses reference counting with a cycle collector. Both names remain valid until they go out of scope or are deleted.",
    },
    {
        id: "memory-typescript",
        languageId: "typescript",
        conceptId: "memory-management",
        title: "Tracing garbage collection",
        code: `// All values are GC-tracked
const s1 = "hello";
const s2 = s1;  // primitive is copied, string is immutable
// both are always valid`,
        explanation:
            "JS primitives (including strings) are copied on assignment. Objects share the reference and are GC'd when unreachable.",
    },
    {
        id: "memory-java",
        languageId: "java",
        conceptId: "memory-management",
        title: "Shared references with GC",
        code: `// References with GC — no ownership model
String s1 = "hello";
String s2 = s1;  // copies the reference, not the object
// both references remain valid`,
        explanation:
            "Java has no move semantics. All objects live on the heap and are garbage collected. Identity is by reference.",
    },
    {
        id: "memory-kotlin",
        languageId: "kotlin",
        conceptId: "memory-management",
        title: "JVM garbage collection",
        code: `// Same JVM model as Java
val s1 = "hello"
val s2 = s1  // reference copy
// both valid, GC-managed`,
        explanation:
            "Kotlin runs on the JVM (or JS/native) with the same GC model. No move semantics exist.",
    },
    {
        id: "memory-go",
        languageId: "go",
        conceptId: "memory-management",
        title: "Escape analysis and GC",
        code: `// Escape analysis + GC
func main() {
    s1 := "hello"
    s2 := s1  // copies the string header (pointer + len)
    // both valid until GC collects`,
        explanation:
            "Go strings are immutable slices (pointer + length). Assignment copies the header. The underlying data is GC'd.",
    },
    {
        id: "memory-csharp",
        languageId: "csharp",
        conceptId: "memory-management",
        title: "Reference types with GC",
        code: `// References with GC
string s1 = "hello";
string s2 = s1;  // copies the reference
// both valid, GC-managed`,
        explanation:
            "C# strings are immutable reference types. Assignment copies the reference, not the data.",
    },
    {
        id: "memory-cpp",
        languageId: "cpp",
        conceptId: "memory-management",
        title: "RAII and unique_ptr",
        code: `// unique_ptr models single ownership
auto s1 = std::make_unique<std::string>("hello");
auto s2 = std::move(s1);  // explicit move required
// s1 is now nullptr; accessing it is UB`,
        explanation:
            "Rust's ownership is like unique_ptr but enforced at compile time. No need for std::move — the compiler tracks it.",
    },

    // =========================================================================
    // Reference semantics
    // =========================================================================
    {
        id: "refs-rust",
        languageId: "rust",
        conceptId: "reference-semantics",
        title: "Borrow checker: shared and exclusive references",
        code: `let r = &value;      // shared borrow (&T)
let m = &mut value;   // exclusive borrow (&mut T)
// many &T or one &mut T, never both`,
        explanation:
            "Rust's borrow checker enforces that shared and exclusive references never coexist. The rules are proven at compile time.",
    },
    {
        id: "refs-python",
        languageId: "python",
        conceptId: "reference-semantics",
        title: "Aliases with no access control",
        code: `# Every name is an alias
def add_item(lst):
    lst.append(1)   # mutates the shared object

data = []
add_item(data)
# data is [1] — shared mutation with no rules`,
        explanation:
            "Python hands around aliases to the same object. There is no distinction between read-only and exclusive access.",
    },
    {
        id: "refs-typescript",
        languageId: "typescript",
        conceptId: "reference-semantics",
        title: "Shared object references",
        code: `// All object variables share state
function addItem(arr: number[]) {
    arr.push(1);  // mutates the shared array
}

const data: number[] = [];
addItem(data);
// data is [1] — no aliasing rules at all`,
        explanation:
            "TypeScript has references everywhere with no aliasing rules. Any reference can read or mutate at any time.",
    },
    {
        id: "refs-java",
        languageId: "java",
        conceptId: "reference-semantics",
        title: "Shared references by default",
        code: `// References are shared by default
void addItem(List<Integer> list) {
    list.add(1);  // mutates shared list
}

List<Integer> data = new ArrayList<>();
addItem(data);
// data is [1] — no exclusivity rules`,
        explanation:
            "Java references are shared by default. There is no mechanism to enforce exclusive access.",
    },
    {
        id: "refs-kotlin",
        languageId: "kotlin",
        conceptId: "reference-semantics",
        title: "Shared references, no exclusivity",
        code: `// Shared references, no exclusivity
fun addItem(list: MutableList<Int>) {
    list.add(1)
}

val data = mutableListOf<Int>()
addItem(data)
// data is [1] — mutation is always shared`,
        explanation:
            "Kotlin shares references freely. Mutation is always through a shared reference.",
    },
    {
        id: "refs-go",
        languageId: "go",
        conceptId: "reference-semantics",
        title: "Pointers as ordinary values",
        code: `// Pointers are ordinary values
func addItem(p *[]int) {
    *p = append(*p, 1)
}

data := []int{}
addItem(&data)
// data is [1] — no exclusivity at compile time`,
        explanation:
            "Go's pointers are ordinary values. There are no aliasing rules — the compiler does not track who may read or write.",
    },
    {
        id: "refs-csharp",
        languageId: "csharp",
        conceptId: "reference-semantics",
        title: "Freely shared reference types",
        code: `// Reference types are freely shared
void AddItem(List<int> list) {
    list.Add(1);  // mutates shared list
}

var data = new List<int>();
AddItem(data);
// data is [1] — no aliasing rules`,
        explanation:
            "C# reference types are shared without restriction. The compiler does not enforce exclusivity.",
    },
    {
        id: "refs-cpp",
        languageId: "cpp",
        conceptId: "reference-semantics",
        title: "Unchecked references and pointers",
        code: `// References and pointers are unchecked
void add_item(std::vector<int>& v) {
    v.push_back(1);  // no exclusivity check
}

std::vector<int> data;
add_item(data);
// data is {1} — aliasing is UB if violated`,
        explanation:
            "C++ references and pointers are unchecked. Aliasing violations are undefined behaviour, not compile errors.",
    },

    // =========================================================================
    // String types
    // =========================================================================
    {
        id: "strings-rust",
        languageId: "rust",
        conceptId: "string-types",
        title: "Owned String and borrowed &str",
        code: `let s: &str = "hello";       // borrowed slice
let owned = s.to_string();    // owned allocation
fn greet(name: &str) { ... }  // accept both`,
        explanation:
            "Rust separates borrowed string slices (&str) from owned heap allocations (String). API boundaries make the distinction explicit.",
    },
    {
        id: "strings-python",
        languageId: "python",
        conceptId: "string-types",
        title: "Immutable, shared by reference",
        code: `# Strings are immutable, shared by reference
s = "hello"
t = s[1:3]   # slice creates a new string
# no owned vs borrowed distinction`,
        explanation:
            "Python strings are immutable and shared by reference. Slicing creates a new object. There is no owned/borrowed split.",
    },
    {
        id: "strings-typescript",
        languageId: "typescript",
        conceptId: "string-types",
        title: "Immutable primitive values",
        code: `// Strings are immutable values
const s = "hello";
const t = s.slice(1, 3);  // new string
// no ownership boundary`,
        explanation:
            "JavaScript strings are immutable primitives. All string operations create new values. There is no ownership boundary.",
    },
    {
        id: "strings-java",
        languageId: "java",
        conceptId: "string-types",
        title: "Immutable, GC-managed",
        code: `// Immutable, GC-managed
String s = "hello";
String t = s.substring(1, 3);  // new String (since Java 7u6)
// no borrowed view type`,
        explanation:
            "Java strings are immutable and GC-managed. Substring creates a new object. There is no borrowed view type.",
    },
    {
        id: "strings-kotlin",
        languageId: "kotlin",
        conceptId: "string-types",
        title: "Same as Java String",
        code: `// String behaves like Java String
val s = "hello"
val t = s.substring(1, 3)  // new String
// no borrowed view`,
        explanation:
            "Kotlin String behaves like Java String. There is no borrowed view counterpart.",
    },
    {
        id: "strings-go",
        languageId: "go",
        conceptId: "string-types",
        title: "Immutable slices with no lifetime tracking",
        code: `// Strings are immutable slices
s := "hello"
t := s[1:3]  // shares underlying bytes
// closest to &str, but no lifetime tracking`,
        explanation:
            "Go strings are immutable slices (pointer + length). Sub-slicing shares the underlying bytes. There is no lifetime tracking.",
    },
    {
        id: "strings-csharp",
        languageId: "csharp",
        conceptId: "string-types",
        title: "Immutable references with Span for views",
        code: `// Immutable references, Span<T> for views
string s = "hello";
ReadOnlySpan<char> t = s.AsSpan(1, 2);
// Span is closest to &str but stack-only`,
        explanation:
            "C# strings are immutable references. ReadOnlySpan<char> is the closest thing to a borrowed view, but it is stack-constrained.",
    },
    {
        id: "strings-cpp",
        languageId: "cpp",
        conceptId: "string-types",
        title: "string and string_view",
        code: `// string_view is the borrowed counterpart
std::string s = "hello";
std::string_view t(s.data() + 1, 2);  // view into s directly
// string_view ≈ &str, std::string ≈ String`,
        explanation:
            "C++ string_view is the borrowed counterpart to std::string. The split mirrors Rust's &str/String, but without lifetime enforcement. Note: binding string_view to the temporary returned by substr() is UB — the temporary is destroyed at the end of the statement. Slice the view directly from s.data() instead.",
    },

    // =========================================================================
    // Reference validity
    // =========================================================================
    {
        id: "validity-rust",
        languageId: "rust",
        conceptId: "reference-validity",
        title: "Lifetime parameters",
        code: `fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

struct Holder<'a> {
    item: &'a str,
}`,
        explanation:
            "Lifetimes are the compiler's proof that borrowed data outlives every reference. They are required when the compiler cannot infer the relationship.",
    },
    {
        id: "validity-python",
        languageId: "python",
        conceptId: "reference-validity",
        title: "Garbage collector keeps objects alive",
        code: `# GC keeps objects alive while reachable
def first(items):
    return items[0]  # no lifetime annotation needed
# GC ensures the list outlives the return value`,
        explanation:
            "Python's GC keeps objects alive as long as they are reachable. There is no compile-time proof of reference validity.",
    },
    {
        id: "validity-typescript",
        languageId: "typescript",
        conceptId: "reference-validity",
        title: "No reference lifetime model",
        code: `// No reference lifetime model
function first<T>(items: T[]): T {
    return items[0];  // GC keeps array alive
}
// no lifetime annotations needed`,
        explanation:
            "TypeScript does not model reference lifetimes. The GC ensures objects survive as long as they are reachable.",
    },
    {
        id: "validity-java",
        languageId: "java",
        conceptId: "reference-validity",
        title: "GC ensures reachability",
        code: `// GC keeps objects alive
<T> T first(List<T> items) {
    return items.get(0);  // no lifetime tracking
}
// reachable objects are never collected`,
        explanation:
            "Java's GC guarantees that reachable objects are never collected. There is no static proof of reference validity.",
    },
    {
        id: "validity-kotlin",
        languageId: "kotlin",
        conceptId: "reference-validity",
        title: "Same GC model as Java",
        code: `// Same GC model as Java
fun <T> first(items: List<T>): T {
    return items[0]  // no lifetime annotations
}`,
        explanation:
            "Kotlin's GC removes the need for lifetime annotations. Reference validity is a runtime property.",
    },
    {
        id: "validity-go",
        languageId: "go",
        conceptId: "reference-validity",
        title: "GC handles reachability",
        code: `// GC handles reachability
func first[T any](items []T) T {
    return items[0]  // no lifetime tracking
}`,
        explanation:
            "Go's GC handles reachability. There is no compile-time tracking of reference validity.",
    },
    {
        id: "validity-csharp",
        languageId: "csharp",
        conceptId: "reference-validity",
        title: "GC and stack-constrained Span",
        code: `// GC manages lifetime; Span is stack-only
T First<T>(List<T> items) {
    return items[0];  // GC keeps list alive
}
// Span<T> has implicit stack-lifetime constraints`,
        explanation:
            "C# relies on the GC for heap objects. Span<T> has stack-lifetime constraints but no general lifetime annotation system.",
    },
    {
        id: "validity-cpp",
        languageId: "cpp",
        conceptId: "reference-validity",
        title: "No static proof — dangling references are UB",
        code: `// No static lifetime proof
std::string_view first(const std::vector<std::string>& v) {
    return v[0];  // dangling if vector is destroyed
}
// same problem as Rust, but no compiler proof`,
        explanation:
            "C++ has the same reference-validity problem as Rust but no static proof. Dangling references become undefined behaviour.",
    },

    // =========================================================================
    // Algebraic data types
    // =========================================================================
    {
        id: "adt-rust",
        languageId: "rust",
        conceptId: "algebraic-data-types",
        title: "Enums with exhaustive match",
        code: `enum Direction { North, South, East, West }

fn to_int(d: Direction) -> i32 {
    match d {
        Direction::North => 0,
        Direction::South => 1,
        Direction::East => 2,
        Direction::West => 3,
    }
}`,
        explanation:
            "Rust enums are sum types. Match is exhaustive — the compiler rejects code that does not handle every variant.",
    },
    {
        id: "adt-python",
        languageId: "python",
        conceptId: "algebraic-data-types",
        title: "Dataclasses and match (3.10+)",
        code: `from dataclasses import dataclass

@dataclass
class North: pass
@dataclass
class South: pass

Direction = North | South

def handle(d: Direction):
    match d:
        case North(): return 0
        case South(): return 1
    # exhaustiveness is not enforced`,
        explanation:
            "Python dataclasses and match can model sum types, but exhaustiveness is not enforced by the compiler.",
    },
    {
        id: "adt-typescript",
        languageId: "typescript",
        conceptId: "algebraic-data-types",
        title: "Discriminated unions",
        code: `type Direction =
    | { kind: "north" }
    | { kind: "south" };

function handle(d: Direction): number {
    switch (d.kind) {
        case "north": return 0;
        case "south": return 1;
    }
    // exhaustiveness needs a helper or never check`,
        explanation:
            "TypeScript discriminated unions are the nearest analogue. Exhaustiveness requires a helper function or never-type narrowing.",
    },
    {
        id: "adt-java",
        languageId: "java",
        conceptId: "algebraic-data-types",
        title: "Sealed classes and switch pattern matching",
        code: `sealed interface Direction permits North, South {}
final class North implements Direction {}
final class South implements Direction {}

int handle(Direction d) {
    return switch (d) {
        case North n -> 0;
        case South s -> 1;
    };
}`,
        explanation:
            "Java sealed classes and switch pattern matching are the closest analogue. Exhaustiveness is enforced for sealed types.",
    },
    {
        id: "adt-kotlin",
        languageId: "kotlin",
        conceptId: "algebraic-data-types",
        title: "Sealed classes and when",
        code: `sealed class Direction {
    object North : Direction()
    object South : Direction()
}

fun handle(d: Direction): Int = when (d) {
    is Direction.North -> 0
    is Direction.South -> 1
}
// when is exhaustive over sealed classes`,
        explanation:
            "Kotlin sealed classes plus when are very close to Rust enums plus match. Exhaustiveness is enforced.",
    },
    {
        id: "adt-go",
        languageId: "go",
        conceptId: "algebraic-data-types",
        title: "Interfaces and type switches",
        code: `type Direction interface{ dir() }

type North struct{}
func (North) dir() {}
type South struct{}
func (South) dir() {}

func handle(d Direction) int {
    switch d.(type) {
    case North: return 0
    case South: return 1
    default: return -1
    }
}`,
        explanation:
            "Go uses interfaces and type switches. The compiler cannot prove that every case is handled — a default branch is common.",
    },
    {
        id: "adt-csharp",
        languageId: "csharp",
        conceptId: "algebraic-data-types",
        title: "Records and switch expressions",
        code: `abstract record Direction();
record North() : Direction;
record South() : Direction;

int Handle(Direction d) => d switch
{
    North => 0,
    South => 1,
    _ => -1  // default still common
};`,
        explanation:
            "C# records and switch expressions approximate sum types, but default branches are still common in practice.",
    },
    {
        id: "adt-cpp",
        languageId: "cpp",
        conceptId: "algebraic-data-types",
        title: "std::variant and std::visit",
        code: `using Direction = std::variant<struct North, struct South>;

int handle(const Direction& d) {
    return std::visit([](auto&& arg) -> int {
        using T = std::decay_t<decltype(arg)>;
        if constexpr (std::is_same_v<T, North>) return 0;
        else return 1;
    }, d);
}`,
        explanation:
            "C++ std::variant and std::visit get close to sum types, but exhaustiveness is not the default.",
    },

    // =========================================================================
    // Error signalling
    // =========================================================================
    {
        id: "error-rust",
        languageId: "rust",
        conceptId: "error-signalling",
        title: "Option<T> and Result<T, E>",
        code: `fn parse_age(s: &str) -> Result<u32, ParseIntError> {
    let age = s.parse()?;
    Ok(age)
}

let maybe: Option<i32> = Some(10);
let value = maybe?;`,
        explanation:
            "Rust splits absence (Option) from failure (Result). The ? operator propagates both. The type system forces handling.",
    },
    {
        id: "error-python",
        languageId: "python",
        conceptId: "error-signalling",
        title: "None and exceptions",
        code: `def parse_age(s: str) -> int:
    return int(s)  # raises ValueError

maybe = some_dict.get("key")  # returns None
# absence and failure use different mechanisms`,
        explanation:
            "Python uses None for absence and exceptions for failure. They are separate mechanisms with no type-level enforcement.",
    },
    {
        id: "error-typescript",
        languageId: "typescript",
        conceptId: "error-signalling",
        title: "null/undefined and exceptions",
        code: `function parseAge(s: string): number {
    return parseInt(s, 10);  // NaN or throws
}

const maybe: string | undefined = data["key"];
// absence is nullish, failure is an exception`,
        explanation:
            "TypeScript uses null/undefined for absence and exceptions for failure. Neither is enforced at the type level.",
    },
    {
        id: "error-java",
        languageId: "java",
        conceptId: "error-signalling",
        title: "Optional and checked exceptions",
        code: `Optional<Integer> parseAge(String s) {
    try {
        return Optional.of(Integer.parseInt(s));
    } catch (NumberFormatException e) {
        return Optional.empty();
    }
}`,
        explanation:
            "Java Optional and checked exceptions approximate the split. Optional is for absence, exceptions for failure.",
    },
    {
        id: "error-kotlin",
        languageId: "kotlin",
        conceptId: "error-signalling",
        title: "Nullable types and Result",
        code: `fun parseAge(s: String): Result<Int> =
    runCatching { s.toInt() }

val maybe: String? = map["key"]  // nullable
// Result exists but exceptions are still common`,
        explanation:
            "Kotlin nullable types handle absence. Result exists for failure but the ecosystem still leans heavily on exceptions.",
    },
    {
        id: "error-go",
        languageId: "go",
        conceptId: "error-signalling",
        title: "(value, error) tuples",
        code: `func parseAge(s string) (int, error) {
    n, err := strconv.Atoi(s)
    return n, err
}

val, ok := m["key"]  // zero value + bool
// no dedicated Option or Result type`,
        explanation:
            "Go uses multi-return values for errors and the ok pattern for map lookups. There is no dedicated Option or Result type.",
    },
    {
        id: "error-csharp",
        languageId: "csharp",
        conceptId: "error-signalling",
        title: "Nullable references and TryParse",
        code: `int ParseAge(string s) => int.Parse(s);  // throws

if (int.TryParse(s, out int age)) {
    // success path
}

string? maybe = dict["key"];  // nullable reference`,
        explanation:
            "C# nullable reference types and TryParse patterns handle absence and failure. Result is not in the standard library.",
    },
    {
        id: "error-cpp",
        languageId: "cpp",
        conceptId: "error-signalling",
        title: "std::optional and std::expected (C++23)",
        code: `std::expected<int, std::string> parseAge(std::string_view s) {
    try { return std::stoi(std::string(s)); }
    catch (...) { return std::unexpected("parse error"); }
}

std::optional<int> maybe = map.contains("key")
    ? std::optional(map["key"]) : std::nullopt;`,
        explanation:
            "C++ std::optional models absence. std::expected (C++23) models failure. Propagation is less ergonomic than Rust's ?.",
    },

    // =========================================================================
    // Behaviour abstraction
    // =========================================================================
    {
        id: "trait-rust",
        languageId: "rust",
        conceptId: "behaviour-abstraction",
        title: "Traits with default methods and dispatch control",
        code: `trait Summary {
    fn title(&self) -> String;
    fn preview(&self) -> String {
        self.title()
    }
}

fn announce(item: &impl Summary) {
    println!("{}", item.preview());
}`,
        explanation:
            "Rust traits define shared behaviour with optional default methods. Static dispatch (impl Trait) and dynamic dispatch (dyn Trait) are explicit.",
    },
    {
        id: "trait-python",
        languageId: "python",
        conceptId: "behaviour-abstraction",
        title: "Duck typing and abstract base classes",
        code: `from abc import ABC, abstractmethod

class Summary(ABC):
    @abstractmethod
    def title(self) -> str: ...

    def preview(self) -> str:
        return self.title()`,
        explanation:
            "Python relies on duck typing by convention. ABCs define contracts and are enforced at instantiation time — Python raises TypeError if a concrete subclass omits an abstract method. Duck typing still governs everything else.",
    },
    {
        id: "trait-typescript",
        languageId: "typescript",
        conceptId: "behaviour-abstraction",
        title: "Interfaces",
        code: `interface Summary {
    title(): string;
    preview?(): string;  // optional default
}

// no built-in default method implementation`,
        explanation:
            "TypeScript interfaces define contracts with structural typing. Default method implementations are not supported.",
    },
    {
        id: "trait-java",
        languageId: "java",
        conceptId: "behaviour-abstraction",
        title: "Interfaces with default methods",
        code: `interface Summary {
    String title();
    default String preview() {
        return title();
    }
}`,
        explanation:
            "Java interfaces support default methods. They are the closest analogue to Rust traits, minus the orphan rules.",
    },
    {
        id: "trait-kotlin",
        languageId: "kotlin",
        conceptId: "behaviour-abstraction",
        title: "Interfaces with defaults",
        code: `interface Summary {
    fun title(): String
    fun preview(): String = title()
}`,
        explanation:
            "Kotlin interfaces support default implementations. Dynamic dispatch is the default — there is no opt-in like Rust's dyn.",
    },
    {
        id: "trait-go",
        languageId: "go",
        conceptId: "behaviour-abstraction",
        title: "Structural interfaces",
        code: `type Summarizer interface {
    Title() string
}

// any type with Title() satisfies Summarizer
// no declaration required`,
        explanation:
            "Go interfaces are structural — a type satisfies an interface by having the right methods, without declaring it. This is different from Rust's nominal traits.",
    },
    {
        id: "trait-csharp",
        languageId: "csharp",
        conceptId: "behaviour-abstraction",
        title: "Interfaces with default implementations",
        code: `interface ISummary {
    string Title();
    string Preview() => Title();
}`,
        explanation:
            "C# interfaces support default implementations. Static and dynamic dispatch are not distinguished at the interface level.",
    },
    {
        id: "trait-cpp",
        languageId: "cpp",
        conceptId: "behaviour-abstraction",
        title: "Concepts and templates (C++20)",
        code: `template<typename T>
concept Summarizable = requires(T t) {
    { t.title() } -> std::convertible_to<std::string>;
};

// no trait-object equivalent for runtime dispatch`,
        explanation:
            "C++ concepts constrain templates. They approximate trait bounds but do not provide a runtime dispatch mechanism.",
    },

    // =========================================================================
    // Generics
    // =========================================================================
    {
        id: "generics-rust",
        languageId: "rust",
        conceptId: "generics",
        title: "Monomorphised generics with trait bounds",
        code: `fn wrap<T>(value: T) -> Vec<T> {
    vec![value]
}

fn first<T: Copy>(items: &[T]) -> T {
    items[0]
}`,
        explanation:
            "Rust monomorphises generic code for each concrete type. Trait bounds specify required capabilities.",
    },
    {
        id: "generics-python",
        languageId: "python",
        conceptId: "generics",
        title: "Type hints (runtime is dynamic)",
        code: `from typing import TypeVar

T = TypeVar("T")

def wrap(value: T) -> list[T]:
    return [value]`,
        explanation:
            "Python type hints describe generic intent but the runtime remains dynamically typed. There is no monomorphisation.",
    },
    {
        id: "generics-typescript",
        languageId: "typescript",
        conceptId: "generics",
        title: "Erased generics",
        code: `function wrap<T>(value: T): T[] {
    return [value];
}
// no runtime specialisation`,
        explanation:
            "TypeScript generics are erased at runtime. There is no monomorphisation or runtime specialisation.",
    },
    {
        id: "generics-java",
        languageId: "java",
        conceptId: "generics",
        title: "Type erasure",
        code: `<T> List<T> wrap(T value) {
    return List.of(value);
}
// generics exist at compile time only`,
        explanation:
            "Java generics are erased at runtime. Generic types become Object. There is no monomorphisation.",
    },
    {
        id: "generics-kotlin",
        languageId: "kotlin",
        conceptId: "generics",
        title: "Erased with reified in inline functions",
        code: `inline fun <reified T> wrap(value: T): List<T> =
    listOf(value)`,
        explanation:
            "Kotlin shares Java's erased generics. Reified type parameters are available only in inline functions.",
    },
    {
        id: "generics-go",
        languageId: "go",
        conceptId: "generics",
        title: "Type constraints (1.18+)",
        code: `func wrap[T any](value T) []T {
    return []T{value}
}`,
        explanation:
            "Go generics use type constraints. They are ergonomic but use a different syntax than Rust's bounds-first style.",
    },
    {
        id: "generics-csharp",
        languageId: "csharp",
        conceptId: "generics",
        title: "Reified generics on the CLR",
        code: `List<T> Wrap<T>(T value) {
    return new List<T> { value };
}`,
        explanation:
            "C# generics are reified on the CLR — type information is available at runtime. Closer to Rust than Java's erasure.",
    },
    {
        id: "generics-cpp",
        languageId: "cpp",
        conceptId: "generics",
        title: "Templates — the classic zero-cost generic",
        code: `template<typename T>
std::vector<T> wrap(T value) {
    return {std::move(value)};
}`,
        explanation:
            "C++ templates are monomorphised like Rust generics. Error messages are famously verbose; Rust aims for the same performance with better diagnostics.",
    },

    // =========================================================================
    // Collection pipelines
    // =========================================================================
    {
        id: "pipeline-rust",
        languageId: "rust",
        conceptId: "collection-pipelines",
        title: "Iterator adapters and closures",
        code: `let names = vec!["a", "bb", "ccc"];
let lengths: Vec<_> = names
    .iter()
    .map(|s| s.len())
    .collect();
let total: i32 = items
    .iter()
    .map(|n| n * 2)
    .sum();`,
        explanation:
            "Rust iterators chain transformations lazily. Each adapter returns a new iterator; nothing runs until a consumer like collect() or sum().",
    },
    {
        id: "pipeline-python",
        languageId: "python",
        conceptId: "collection-pipelines",
        title: "Comprehensions and generators",
        code: `names = ["a", "bb", "ccc"]
lengths = [len(s) for s in names]
total = sum(n * 2 for n in lengths)`,
        explanation:
            "Python comprehensions and generator expressions are the closest mental model. They are eager by default (generators are lazy).",
    },
    {
        id: "pipeline-typescript",
        languageId: "typescript",
        conceptId: "collection-pipelines",
        title: "Array methods",
        code: `const names = ["a", "bb", "ccc"];
const lengths = names.map(s => s.length);
const total = lengths.reduce((a, n) => a + n * 2, 0);`,
        explanation:
            "JavaScript array methods (map, filter, reduce) feel similar. They are eager — each step creates a new array.",
    },
    {
        id: "pipeline-java",
        languageId: "java",
        conceptId: "collection-pipelines",
        title: "Streams",
        code: `List<String> names = List.of("a", "bb", "ccc");
List<Integer> lengths = names.stream()
    .map(String::length)
    .toList();
int total = lengths.stream()
    .mapToInt(n -> n * 2)
    .sum();`,
        explanation:
            "Java streams are a close analogue — lazy until a terminal operation, with explicit mapping and filtering steps.",
    },
    {
        id: "pipeline-kotlin",
        languageId: "kotlin",
        conceptId: "collection-pipelines",
        title: "Sequences and collection operators",
        code: `val names = listOf("a", "bb", "ccc")
val lengths = names.map { it.length }
val total = lengths.sumOf { it * 2 }`,
        explanation:
            "Kotlin sequences and collection operators map nicely to Rust iterators. Sequences are lazy; collection operators are eager.",
    },
    {
        id: "pipeline-go",
        languageId: "go",
        conceptId: "collection-pipelines",
        title: "Hand-written loops",
        code: `names := []string{"a", "bb", "ccc"}
lengths := make([]int, 0, len(names))
for _, s := range names {
    lengths = append(lengths, len(s))
}
total := 0
for _, n := range lengths {
    total += n * 2
}`,
        explanation:
            "Go writes loops by hand. There is no built-in pipeline abstraction — iteration is imperative.",
    },
    {
        id: "pipeline-csharp",
        languageId: "csharp",
        conceptId: "collection-pipelines",
        title: "LINQ",
        code: `var names = new[] { "a", "bb", "ccc" };
var lengths = names.Select(s => s.Length);
var total = lengths.Sum(n => n * 2);`,
        explanation:
            "C# LINQ is the nearest everyday equivalent. Select/Where/Aggregate chain lazily over IEnumerable<T>.",
    },
    {
        id: "pipeline-cpp",
        languageId: "cpp",
        conceptId: "collection-pipelines",
        title: "Ranges (C++20)",
        code: `auto names = std::vector<std::string>{"a", "bb", "ccc"};
auto lengths = names
    | std::views::transform(&std::string::size);
auto total = std::accumulate(
    lengths.begin(), lengths.end(), 0,
    [](int a, std::size_t n) { return a + n * 2; });`,
        explanation:
            "C++ ranges are the closest structural analogue, with pipe syntax for chaining. Closure ergonomics are less clean than Rust.",
    },

    // =========================================================================
    // Smart pointers
    // =========================================================================
    {
        id: "ptr-rust",
        languageId: "rust",
        conceptId: "smart-pointers",
        title: "Box, Rc, Arc, RefCell",
        code: `let boxed = Box::new(10);
let shared = Rc::new("hi");
let thread_safe = Arc::new("hi");
let cell = RefCell::new(0);`,
        explanation:
            "Rust encodes ownership, sharing, and interior mutability as distinct types. Box for heap, Rc/Arc for shared ownership, RefCell for dynamic borrow checking.",
    },
    {
        id: "ptr-python",
        languageId: "python",
        conceptId: "smart-pointers",
        title: "Everything is a shared heap object",
        code: `class Data:
    def __init__(self, v):
        self.v = v

a = Data(1)
b = a  # both reference the same object
# no ownership or pointer types`,
        explanation:
            "Python objects are heap-allocated and shared by default. There is no distinction between owning and borrowing.",
    },
    {
        id: "ptr-typescript",
        languageId: "typescript",
        conceptId: "smart-pointers",
        title: "Objects are shared GC references",
        code: `const a = { v: 1 };
const b = a;  // shares the reference
// closer to Rc than to Box`,
        explanation:
            "JavaScript objects are shared GC references. The model is closest to Rc — shared ownership with no explicit control.",
    },
    {
        id: "ptr-java",
        languageId: "java",
        conceptId: "smart-pointers",
        title: "All objects are GC-managed heap references",
        code: `var a = new int[]{1};
var b = a;  // shares the reference
// no Box/Rc/Arc distinction`,
        explanation:
            "Java objects live on the heap with GC management. There is no distinction between pointer types.",
    },
    {
        id: "ptr-go",
        languageId: "go",
        conceptId: "smart-pointers",
        title: "Simple pointers with GC",
        code: `a := new(int)
*a = 1
b := a  // shares the pointer
// no ownership or ref-counting distinction`,
        explanation:
            "Go pointers are simple references. There is no distinction between owning, sharing, and borrow-checked mutation.",
    },
    {
        id: "ptr-csharp",
        languageId: "csharp",
        conceptId: "smart-pointers",
        title: "Reference types are shared heap objects",
        code: `var a = new int[] { 1 };
var b = a;  // shares the reference
// no Box/Rc distinction`,
        explanation:
            "C# reference types behave like shared heap objects. Value types are stack-allocated but there is no fine-grained pointer taxonomy.",
    },
    {
        id: "ptr-cpp",
        languageId: "cpp",
        conceptId: "smart-pointers",
        title: "unique_ptr, shared_ptr, weak_ptr",
        code: `auto boxed = std::make_unique<int>(10);
auto shared = std::make_shared<int>(10);
auto weak = std::weak_ptr<int>(shared);
// maps closely to Box / Rc / Arc`,
        explanation:
            "C++ unique_ptr/shared_ptr/weak_ptr map closely to Rust's Box/Rc/Arc. The main difference is that Rust enforces the rules at compile time.",
    },

    // =========================================================================
    // Asynchronous execution
    // =========================================================================
    {
        id: "async-rust",
        languageId: "rust",
        conceptId: "asynchronous-execution",
        title: "async/await driven by a runtime",
        code: `async fn fetch() -> u32 { 42 }

#[tokio::main]
async fn main() {
    let value = fetch().await; // the runtime polls the future
    println!("{value}");
}`,
        explanation:
            "An async fn returns a lazy Future that does nothing until awaited; a runtime such as Tokio polls it to completion. Send and Sync decide which futures may move across threads.",
    },
    {
        id: "async-python",
        languageId: "python",
        conceptId: "asynchronous-execution",
        title: "async def with asyncio",
        code: `import asyncio

async def fetch() -> int:
    return 42

asyncio.run(fetch())  # the event loop drives the coroutine`,
        explanation:
            "Coroutines declared with async def are driven by an event loop (asyncio). A single thread interleaves awaited tasks cooperatively.",
    },
    {
        id: "async-typescript",
        languageId: "typescript",
        conceptId: "asynchronous-execution",
        title: "async/await over Promises",
        code: `async function fetchValue(): Promise<number> {
    return 42;
}

const value = await fetchValue(); // resolves the promise`,
        explanation:
            "async functions return a Promise; await suspends until it resolves. The single-threaded event loop schedules the continuations.",
    },
    {
        id: "async-java",
        languageId: "java",
        conceptId: "asynchronous-execution",
        title: "CompletableFuture and virtual threads",
        code: `CompletableFuture<Integer> f =
    CompletableFuture.supplyAsync(() -> 42);
int value = f.join(); // completes asynchronously`,
        explanation:
            "Asynchrony is modelled with CompletableFuture chains, or since Java 21 with virtual threads that make blocking calls cheap. There is no await keyword.",
    },
    {
        id: "async-kotlin",
        languageId: "kotlin",
        conceptId: "asynchronous-execution",
        title: "suspend functions and coroutines",
        code: `suspend fun fetch(): Int = 42

runBlocking {
    val value = fetch() // suspends without blocking the thread
}`,
        explanation:
            "suspend functions can pause and resume; coroutine builders (launch, async, runBlocking) and a dispatcher schedule them, with lifetimes tied to a scope.",
    },
    {
        id: "async-go",
        languageId: "go",
        conceptId: "asynchronous-execution",
        title: "goroutines and channels",
        code: `ch := make(chan int)
go func() { ch <- 42 }() // lightweight goroutine
value := <-ch            // receive blocks until ready`,
        explanation:
            "Goroutines are cheap green threads scheduled by the runtime, and channels coordinate them. There is no async/await — blocking is fine because goroutines are cheap.",
    },
    {
        id: "async-csharp",
        languageId: "csharp",
        conceptId: "asynchronous-execution",
        title: "async/await over Task",
        code: `async Task<int> FetchAsync() => 42;

int value = await FetchAsync(); // resumes on completion`,
        explanation:
            "async methods return Task or Task<T>; await yields until the task completes. The synchronisation context decides where the continuation resumes.",
    },
    {
        id: "async-cpp",
        languageId: "cpp",
        conceptId: "asynchronous-execution",
        title: "std::async, futures, and coroutines",
        code: `std::future<int> f = std::async([] { return 42; });
int value = f.get(); // waits for the result

// C++20 also adds co_await / coroutines`,
        explanation:
            "std::async runs work and returns a std::future whose get() waits for the result. C++20 adds co_await coroutines, but they need a library-provided executor.",
    },
] as const;
