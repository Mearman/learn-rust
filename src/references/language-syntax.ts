import type { LanguageSyntax } from "./types.ts";

export const LANGUAGE_SYNTAX: readonly LanguageSyntax[] = [
    // =========================================================================
    // Ownership
    // =========================================================================
    {
        id: "ownership-python",
        language: "python",
        conceptIds: ["ownership"],
        title: "Python variable semantics vs Rust ownership",
        code: `# Python: variables are references;
# GC tracks object lifetime
s1 = "hello"
s2 = s1  # both names point to same object
# no concept of "moved from"`,
        explanation:
            "Python uses reference counting + a cycle collector. Both names remain valid until they go out of scope or are deleted.",
    },
    {
        id: "ownership-typescript",
        language: "typescript",
        conceptIds: ["ownership"],
        title: "TypeScript/JS reference model vs Rust ownership",
        code: `// TypeScript/JS: all values are GC-tracked
const s1 = "hello";
const s2 = s1;  // primitive is copied, string is immutable
// both are always valid`,
        explanation:
            "JS primitives (including strings) are copied on assignment. Objects share the reference and are GC'd when unreachable.",
    },
    {
        id: "ownership-java",
        language: "java",
        conceptIds: ["ownership"],
        title: "Java references vs Rust ownership",
        code: `// Java: references with GC
String s1 = "hello";
String s2 = s1;  // copies the reference, not the object
// both references remain valid`,
        explanation:
            "Java has no move semantics. All objects live on the heap and are garbage collected. Identity is by reference.",
    },
    {
        id: "ownership-kotlin",
        language: "kotlin",
        conceptIds: ["ownership"],
        title: "Kotlin references vs Rust ownership",
        code: `// Kotlin: same JVM model as Java
val s1 = "hello"
val s2 = s1  // reference copy
// both valid, GC-managed`,
        explanation:
            "Kotlin runs on the JVM (or JS/native) with the same GC model. No move semantics exist.",
    },
    {
        id: "ownership-go",
        language: "go",
        conceptIds: ["ownership"],
        title: "Go value/pointer semantics vs Rust ownership",
        code: `// Go: escape analysis + GC
func main() {
    s1 := "hello"
    s2 := s1  // copies the string header (pointer + len)
    // both valid until GC collects`,
        explanation:
            "Go strings are immutable slices (pointer + length). Assignment copies the header. The underlying data is GC'd.",
    },
    {
        id: "ownership-csharp",
        language: "csharp",
        conceptIds: ["ownership"],
        title: "C# reference types vs Rust ownership",
        code: `// C#: references with GC
string s1 = "hello";
string s2 = s1;  // copies the reference
// both valid, GC-managed`,
        explanation:
            "C# strings are immutable reference types. Assignment copies the reference, not the data.",
    },
    {
        id: "ownership-cpp",
        language: "cpp",
        conceptIds: ["ownership"],
        title: "C++ unique_ptr vs Rust ownership",
        code: `// C++: unique_ptr models single ownership
auto s1 = std::make_unique<std::string>("hello");
auto s2 = std::move(s1);  // explicit move required
// s1 is now nullptr; accessing it is UB`,
        explanation:
            "Rust's ownership is like unique_ptr but enforced at compile time. No need for std::move — the compiler tracks it.",
    },

    // =========================================================================
    // Borrowing & references
    // =========================================================================
    {
        id: "borrowing-python",
        language: "python",
        conceptIds: ["borrowing"],
        title: "Python aliases vs Rust borrows",
        code: `# Python: every name is an alias
def add_item(lst):
    lst.append(1)   # mutates the shared object

data = []
add_item(data)
# data is [1] — shared mutation with no rules`,
        explanation:
            "Python hands around aliases to the same object, but Rust distinguishes read-only and exclusive borrows.",
    },
    {
        id: "borrowing-typescript",
        language: "typescript",
        conceptIds: ["borrowing"],
        title: "TypeScript references vs Rust borrows",
        code: `// TypeScript: all object variables share state
function addItem(arr: number[]) {
    arr.push(1);  // mutates the shared array
}

const data: number[] = [];
addItem(data);
// data is [1] — no aliasing rules at all`,
        explanation:
            "TypeScript has references everywhere; Rust makes aliasing rules part of the type system.",
    },
    {
        id: "borrowing-java",
        language: "java",
        conceptIds: ["borrowing"],
        title: "Java references vs Rust borrows",
        code: `// Java: references are shared by default
void addItem(List<Integer> list) {
    list.add(1);  // mutates shared list
}

List<Integer> data = new ArrayList<>();
addItem(data);
// data is [1] — no exclusivity rules`,
        explanation:
            "Java references are shared by default; Rust only allows one mutable borrow at a time.",
    },
    {
        id: "borrowing-kotlin",
        language: "kotlin",
        conceptIds: ["borrowing"],
        title: "Kotlin references vs Rust borrows",
        code: `// Kotlin: shared references, no exclusivity
fun addItem(list: MutableList<Int>) {
    list.add(1)
}

val data = mutableListOf<Int>()
addItem(data)
// data is [1] — mutation is always shared`,
        explanation:
            "Kotlin shares references freely; Rust uses borrows to stop read/write overlap.",
    },
    {
        id: "borrowing-go",
        language: "go",
        conceptIds: ["borrowing"],
        title: "Go pointers vs Rust borrows",
        code: `// Go: pointers are ordinary values
func addItem(p *[]int) {
    *p = append(*p, 1)
}

data := []int{}
addItem(&data)
// data is [1] — no exclusivity at compile time`,
        explanation:
            "Go's pointers are ordinary values; Rust's references carry lifetime and exclusivity rules.",
    },
    {
        id: "borrowing-csharp",
        language: "csharp",
        conceptIds: ["borrowing"],
        title: "C# references vs Rust borrows",
        code: `// C# reference types are freely shared
void AddItem(List<int> list) {
    list.Add(1);  // mutates shared list
}

var data = new List<int>();
AddItem(data);
// data is [1] — no aliasing rules`,
        explanation:
            "C# reference types are shared, but Rust's borrow checker enforces who may write.",
    },
    {
        id: "borrowing-cpp",
        language: "cpp",
        conceptIds: ["borrowing"],
        title: "C++ references/pointers vs Rust borrows",
        code: `// C++: references and pointers are unchecked
void add_item(std::vector<int>& v) {
    v.push_back(1);  // no exclusivity check
}

std::vector<int> data;
add_item(data);
// data is {1} — aliasing is undefined behaviour if violated`,
        explanation:
            "C++ references and pointers are unchecked; Rust's borrows prevent undefined aliasing patterns.",
    },

    // =========================================================================
    // Slices & strings
    // =========================================================================
    {
        id: "slices-python",
        language: "python",
        conceptIds: ["slices-strings"],
        title: "Python strings vs Rust &str / String",
        code: `# Python: strings are immutable, shared by reference
s = "hello"
t = s[1:3]   # slice creates a new string
# no owned vs borrowed distinction`,
        explanation:
            "Python strings are immutable and shared by reference; Rust splits borrowed slices from owned strings.",
    },
    {
        id: "slices-typescript",
        language: "typescript",
        conceptIds: ["slices-strings"],
        title: "JavaScript strings vs Rust &str / String",
        code: `// JS: strings are immutable values
const s = "hello";
const t = s.slice(1, 3);  // new string
// no ownership boundary`,
        explanation:
            "JavaScript strings are immutable values; Rust makes ownership explicit when text must be stored.",
    },
    {
        id: "slices-java",
        language: "java",
        conceptIds: ["slices-strings"],
        title: "Java String vs Rust &str / String",
        code: `// Java: immutable, GC-managed
String s = "hello";
String t = s.substring(1, 3);  // new String (since Java 7u6)
// no borrowed view type`,
        explanation:
            "Java strings are immutable and GC-managed; Rust separates borrowed text from owned buffers.",
    },
    {
        id: "slices-kotlin",
        language: "kotlin",
        conceptIds: ["slices-strings"],
        title: "Kotlin String vs Rust &str / String",
        code: `// Kotlin String behaves like Java String
val s = "hello"
val t = s.substring(1, 3)  // new String
// no borrowed view`,
        explanation:
            "Kotlin String behaves like Java String; Rust distinguishes borrowed views from owned allocations.",
    },
    {
        id: "slices-go",
        language: "go",
        conceptIds: ["slices-strings"],
        title: "Go strings and slices vs Rust &str / String",
        code: `// Go strings are immutable slices
s := "hello"
t := s[1:3]  // shares underlying bytes
// closest to &str, but no lifetime tracking`,
        explanation:
            "Go strings are immutable slices; Rust's &str is a borrowed slice with lifetime checking.",
    },
    {
        id: "slices-csharp",
        language: "csharp",
        conceptIds: ["slices-strings"],
        title: "C# strings and spans vs Rust &str / String",
        code: `// C#: immutable references, Span<T> for views
string s = "hello";
ReadOnlySpan<char> t = s.AsSpan(1, 2);
// Span is closest to &str but stack-only`,
        explanation:
            "C# strings are immutable references; Rust makes the borrow vs ownership boundary explicit.",
    },
    {
        id: "slices-cpp",
        language: "cpp",
        conceptIds: ["slices-strings"],
        title: "C++ string_view vs Rust &str / String",
        code: `// C++: string_view is the borrowed counterpart
std::string s = "hello";
std::string_view t = s.substr(1, 2);
// string_view ≈ &str, std::string ≈ String`,
        explanation:
            "C++ string_view is the borrowed counterpart, while std::string owns the storage.",
    },

    // =========================================================================
    // Lifetimes
    // =========================================================================
    {
        id: "lifetimes-python",
        language: "python",
        conceptIds: ["lifetimes"],
        title: "Python GC vs Rust lifetimes",
        code: `# Python: GC keeps objects alive while reachable
def first(items):
    return items[0]  # no lifetime annotation needed
# GC ensures the list outlives the return value`,
        explanation:
            "Python uses GC, so borrowed-object lifetimes are managed at runtime instead of proven statically.",
    },
    {
        id: "lifetimes-typescript",
        language: "typescript",
        conceptIds: ["lifetimes"],
        title: "TypeScript vs Rust lifetimes",
        code: `// TypeScript: no reference lifetime model
function first<T>(items: T[]): T {
    return items[0];  // GC keeps array alive
}
// no lifetime annotations needed`,
        explanation:
            "TypeScript does not model reference lifetimes; Rust makes them explicit when ownership is borrowed.",
    },
    {
        id: "lifetimes-java",
        language: "java",
        conceptIds: ["lifetimes"],
        title: "Java GC vs Rust lifetimes",
        code: `// Java: GC keeps objects alive
<T> T first(List<T> items) {
    return items.get(0);  // no lifetime tracking
}
// reachable objects are never collected`,
        explanation:
            "Java GC keeps objects alive; Rust needs lifetimes because it has no GC safety net.",
    },
    {
        id: "lifetimes-kotlin",
        language: "kotlin",
        conceptIds: ["lifetimes"],
        title: "Kotlin GC vs Rust lifetimes",
        code: `// Kotlin: same GC model as Java
fun <T> first(items: List<T>): T {
    return items[0]  // no lifetime annotations
}`,
        explanation:
            "Kotlin's GC removes the need for lifetime annotations; Rust uses them to prove references stay valid.",
    },
    {
        id: "lifetimes-go",
        language: "go",
        conceptIds: ["lifetimes"],
        title: "Go GC vs Rust lifetimes",
        code: `// Go: GC handles reachability
func first[T any](items []T) T {
    return items[0]  // no lifetime tracking
}`,
        explanation:
            "Go's GC handles reachability, while Rust tracks outlives relationships at compile time.",
    },
    {
        id: "lifetimes-csharp",
        language: "csharp",
        conceptIds: ["lifetimes"],
        title: "C# GC and Span vs Rust lifetimes",
        code: `// C#: GC manages lifetime; Span is stack-only
T First<T>(List<T> items) {
    return items[0];  // GC keeps list alive
}
// Span<T> has implicit stack-lifetime constraints`,
        explanation:
            "C# GC and Span-style APIs solve this differently; Rust uses lifetime parameters instead.",
    },
    {
        id: "lifetimes-cpp",
        language: "cpp",
        conceptIds: ["lifetimes"],
        title: "C++ dangling references vs Rust lifetimes",
        code: `// C++: no static lifetime proof
std::string_view first(const std::vector<std::string>& v) {
    return v[0];  // dangling if vector is destroyed
}
// same problem as Rust, but no compiler proof`,
        explanation:
            "C++ has the same problem but no static proof, so dangling references become undefined behaviour.",
    },

    // =========================================================================
    // Enums & pattern matching
    // =========================================================================
    {
        id: "enums-python",
        language: "python",
        conceptIds: ["enums"],
        title: "Python match and dataclasses vs Rust enums",
        code: `# Python: dataclasses + match (3.10+)
from dataclasses import dataclass

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
            "Python dataclasses and match can model this, but exhaustiveness is not enforced.",
    },
    {
        id: "enums-typescript",
        language: "typescript",
        conceptIds: ["enums"],
        title: "TypeScript discriminated unions vs Rust enums",
        code: `// TypeScript: discriminated unions
type Direction =
    | { kind: "north" }
    | { kind: "south" };

function handle(d: Direction): number {
    switch (d.kind) {
        case "north": return 0;
        case "south": return 1;
    }
    // exhaustiveness needs a helper or never check`,
        explanation:
            "TypeScript discriminated unions are the nearest match; exhaustiveness usually needs a helper.",
    },
    {
        id: "enums-java",
        language: "java",
        conceptIds: ["enums"],
        title: "Java sealed classes vs Rust enums",
        code: `// Java: sealed classes + switch pattern matching
sealed interface Direction permits North, South {}
final class North implements Direction {}
final class South implements Direction {}

int handle(Direction d) {
    return switch (d) {
        case North n -> 0;
        case South s -> 1;
    };
}`,
        explanation:
            "Java sealed classes and switch pattern matching are the closest analogue.",
    },
    {
        id: "enums-kotlin",
        language: "kotlin",
        conceptIds: ["enums"],
        title: "Kotlin sealed classes vs Rust enums",
        code: `// Kotlin: sealed class + when
sealed class Direction {
    object North : Direction()
    object South : Direction()
}

fun handle(d: Direction): Int = when (d) {
    is Direction.North -> 0
    is Direction.South -> 1
}
// when is exhaustive over sealed classes`,
        explanation:
            "Kotlin sealed classes plus when are very close to Rust enums plus match.",
    },
    {
        id: "enums-go",
        language: "go",
        conceptIds: ["enums"],
        title: "Go interfaces and type switches vs Rust enums",
        code: `// Go: interfaces + type switch
type Direction interface{ dir() }

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
            "Go uses interfaces and type switches, but the compiler cannot prove you handled every case.",
    },
    {
        id: "enums-csharp",
        language: "csharp",
        conceptIds: ["enums"],
        title: "C# records and switch vs Rust enums",
        code: `// C#: records + switch expressions
abstract record Direction();
record North() : Direction;
record South() : Direction;

int Handle(Direction d) => d switch
{
    North => 0,
    South => 1,
    _ => -1  // default still common
};`,
        explanation:
            "C# records and switch expressions approximate the pattern, but default branches are still common.",
    },
    {
        id: "enums-cpp",
        language: "cpp",
        conceptIds: ["enums"],
        title: "C++ variant and visit vs Rust enums",
        code: `// C++: std::variant + std::visit
using Direction = std::variant<struct North, struct South>;

int handle(const Direction& d) {
    return std::visit([](auto&& arg) -> int {
        using T = std::decay_t<decltype(arg)>;
        if constexpr (std::is_same_v<T, North>) return 0;
        else return 1;
    }, d);
}`,
        explanation:
            "C++ std::variant and std::visit get close, but exhaustiveness is not the default.",
    },

    // =========================================================================
    // Option & Result
    // =========================================================================
    {
        id: "option-result-python",
        language: "python",
        conceptIds: ["option-result"],
        title: "Python None and exceptions vs Rust Option/Result",
        code: `# Python: None + exceptions
def parse_age(s: str) -> int:
    return int(s)  # raises ValueError

maybe = some_dict.get("key")  # returns None
# absence and failure use different mechanisms`,
        explanation:
            "Python uses None plus exceptions; Rust splits absence and failure into different value types.",
    },
    {
        id: "option-result-typescript",
        language: "typescript",
        conceptIds: ["option-result"],
        title: "TypeScript null/undefined vs Rust Option/Result",
        code: `// TypeScript: null/undefined + exceptions
function parseAge(s: string): number {
    return parseInt(s, 10);  // NaN or throws
}

const maybe: string | undefined = data["key"];
// absence is nullish, failure is an exception`,
        explanation:
            "TypeScript uses null/undefined and exceptions; Rust makes the branch explicit at the type level.",
    },
    {
        id: "option-result-java",
        language: "java",
        conceptIds: ["option-result"],
        title: "Java Optional and exceptions vs Rust Option/Result",
        code: `// Java: Optional + checked exceptions
Optional<Integer> parseAge(String s) {
    try {
        return Optional.of(Integer.parseInt(s));
    } catch (NumberFormatException e) {
        return Optional.empty();
    }
}`,
        explanation:
            "Java Optional and checked exceptions approximate the split, but Rust's ? is more composable.",
    },
    {
        id: "option-result-kotlin",
        language: "kotlin",
        conceptIds: ["option-result"],
        title: "Kotlin nullable and Result vs Rust Option/Result",
        code: `// Kotlin: nullable types + Result
fun parseAge(s: String): Result<Int> =
    runCatching { s.toInt() }

val maybe: String? = map["key"]  // nullable
// Result exists but exceptions are still common`,
        explanation:
            "Kotlin nullable types and Result are close, though the language still leans on exceptions.",
    },
    {
        id: "option-result-go",
        language: "go",
        conceptIds: ["option-result"],
        title: "Go (value, error) tuples vs Rust Option/Result",
        code: `// Go: (value, ok) / (value, error) tuples
func parseAge(s string) (int, error) {
    n, err := strconv.Atoi(s)
    return n, err
}

val, ok := m["key"]  // zero value + bool
// no dedicated Option or Result type`,
        explanation:
            "Go's (value, ok) and (value, error) tuples are the nearest shape, just without a dedicated type.",
    },
    {
        id: "option-result-csharp",
        language: "csharp",
        conceptIds: ["option-result"],
        title: "C# nullable and TryParse vs Rust Option/Result",
        code: `// C#: nullable refs + TryParse pattern
int ParseAge(string s) => int.Parse(s);  // throws

if (int.TryParse(s, out int age)) {
    // success path
}

string? maybe = dict["key"];  // nullable reference`,
        explanation:
            "C# nullable reference types and TryParse patterns map well, but Result is usually a library type.",
    },
    {
        id: "option-result-cpp",
        language: "cpp",
        conceptIds: ["option-result"],
        title: "C++ optional and expected vs Rust Option/Result",
        code: `// C++: std::optional + std::expected (C++23)
std::expected<int, std::string> parseAge(std::string_view s) {
    try { return std::stoi(std::string(s)); }
    catch (...) { return std::unexpected("parse error"); }
}

std::optional<int> maybe = map.contains("key")
    ? std::optional(map["key"]) : std::nullopt;`,
        explanation:
            "C++ std::optional and std::expected are the obvious counterparts, albeit with less ergonomic propagation.",
    },

    // =========================================================================
    // Traits
    // =========================================================================
    {
        id: "traits-python",
        language: "python",
        conceptIds: ["traits"],
        title: "Python duck typing and ABCs vs Rust traits",
        code: `# Python: duck typing or abstract base classes
from abc import ABC, abstractmethod

class Summary(ABC):
    @abstractmethod
    def title(self) -> str: ...

    def preview(self) -> str:
        return self.title()`,
        explanation:
            "Python tends to rely on duck typing or ABCs; Rust traits make the contract explicit and checked.",
    },
    {
        id: "traits-typescript",
        language: "typescript",
        conceptIds: ["traits"],
        title: "TypeScript interfaces vs Rust traits",
        code: `// TypeScript: interfaces
interface Summary {
    title(): string;
    preview?(): string;  // optional default
}

// no built-in default method implementation`,
        explanation:
            "TypeScript interfaces are close, though Rust traits can supply defaults and control dispatch more tightly.",
    },
    {
        id: "traits-java",
        language: "java",
        conceptIds: ["traits"],
        title: "Java interfaces vs Rust traits",
        code: `// Java: interfaces with default methods
interface Summary {
    String title();
    default String preview() {
        return title();
    }
}`,
        explanation:
            "Java interfaces with default methods are the nearest analogue, minus Rust's orphan rules.",
    },
    {
        id: "traits-kotlin",
        language: "kotlin",
        conceptIds: ["traits"],
        title: "Kotlin interfaces vs Rust traits",
        code: `// Kotlin: interfaces with defaults
interface Summary {
    fun title(): String
    fun preview(): String = title()
}`,
        explanation:
            "Kotlin interfaces with defaults are similar, but Rust also lets you opt into dynamic dispatch explicitly.",
    },
    {
        id: "traits-go",
        language: "go",
        conceptIds: ["traits"],
        title: "Go interfaces vs Rust traits",
        code: `// Go: structural interfaces
type Summarizer interface {
    Title() string
}

// any type with Title() satisfies Summarizer
// no declaration required`,
        explanation:
            "Go interfaces are structural, while Rust traits are nominal and more precise about implementations.",
    },
    {
        id: "traits-csharp",
        language: "csharp",
        conceptIds: ["traits"],
        title: "C# interfaces vs Rust traits",
        code: `// C#: interfaces with default implementations
interface ISummary {
    string Title();
    string Preview() => Title();
}`,
        explanation:
            "C# interfaces with default implementations are close, though Rust keeps static and dynamic dispatch distinct.",
    },
    {
        id: "traits-cpp",
        language: "cpp",
        conceptIds: ["traits"],
        title: "C++ concepts vs Rust traits",
        code: `// C++: concepts (C++20)
template<typename T>
concept Summarizable = requires(T t) {
    { t.title() } -> std::convertible_to<std::string>;
};

// no trait-object equivalent for runtime dispatch`,
        explanation:
            "C++ concepts and templates approximate trait bounds, but they do not give you the same trait-object story.",
    },

    // =========================================================================
    // Generics
    // =========================================================================
    {
        id: "generics-python",
        language: "python",
        conceptIds: ["generics"],
        title: "Python type hints vs Rust generics",
        code: `# Python: type hints (runtime is still dynamic)
from typing import TypeVar

T = TypeVar("T")

def wrap(value: T) -> list[T]:
    return [value]`,
        explanation:
            "Python type hints describe intent, but runtime remains dynamically typed and not monomorphised.",
    },
    {
        id: "generics-typescript",
        language: "typescript",
        conceptIds: ["generics"],
        title: "TypeScript generics vs Rust generics",
        code: `// TypeScript: generics are erased
function wrap<T>(value: T): T[] {
    return [value];
}
// no runtime specialisation`,
        explanation:
            "TypeScript generics are erased; Rust monomorphises the code for concrete types.",
    },
    {
        id: "generics-java",
        language: "java",
        conceptIds: ["generics"],
        title: "Java type erasure vs Rust monomorphisation",
        code: `// Java: type erasure
<T> List<T> wrap(T value) {
    return List.of(value);
}
// generics exist at compile time only`,
        explanation:
            "Java uses type erasure, so Rust's compile-time specialisation feels much closer to C++ templates.",
    },
    {
        id: "generics-kotlin",
        language: "kotlin",
        conceptIds: ["generics"],
        title: "Kotlin reified generics vs Rust monomorphisation",
        code: `// Kotlin: erased by default, reified in inline fns
inline fun <reified T> wrap(value: T): List<T> =
    listOf(value)`,
        explanation:
            "Kotlin shares Java's erased generics, with reified types only in special cases.",
    },
    {
        id: "generics-go",
        language: "go",
        conceptIds: ["generics"],
        title: "Go generics vs Rust generics",
        code: `// Go: generics with type constraints (1.18+)
func wrap[T any](value T) []T {
    return []T{value}
}`,
        explanation:
            "Go generics are newer and ergonomic, but still don't look exactly like Rust's bounds-first style.",
    },
    {
        id: "generics-csharp",
        language: "csharp",
        conceptIds: ["generics"],
        title: "C# reified generics vs Rust monomorphisation",
        code: `// C#: reified generics on the CLR
List<T> Wrap<T>(T value) {
    return new List<T> { value };
}`,
        explanation:
            "C# generics are reified on the CLR, which is closer to Rust than Java is, though the language model differs.",
    },
    {
        id: "generics-cpp",
        language: "cpp",
        conceptIds: ["generics"],
        title: "C++ templates vs Rust generics",
        code: `// C++: templates are the classic zero-cost generic
template<typename T>
std::vector<T> wrap(T value) {
    return {std::move(value)};
}`,
        explanation:
            "C++ templates are the classic zero-cost generic system; Rust aims for that with better error messages and safety.",
    },

    // =========================================================================
    // Iterators & closures
    // =========================================================================
    {
        id: "iterators-python",
        language: "python",
        conceptIds: ["iterators"],
        title: "Python comprehensions vs Rust iterators",
        code: `# Python: comprehensions and generators
names = ["a", "bb", "ccc"]
lengths = [len(s) for s in names]
total = sum(n * 2 for n in lengths)`,
        explanation:
            "Python comprehensions and generator pipelines are the closest mental model.",
    },
    {
        id: "iterators-typescript",
        language: "typescript",
        conceptIds: ["iterators"],
        title: "JavaScript array methods vs Rust iterators",
        code: `// JS: array methods
const names = ["a", "bb", "ccc"];
const lengths = names.map(s => s.length);
const total = lengths.reduce((a, n) => a + n * 2, 0);`,
        explanation:
            "JavaScript array methods and iterables feel similar, though Rust keeps borrowing and allocation rules explicit.",
    },
    {
        id: "iterators-java",
        language: "java",
        conceptIds: ["iterators"],
        title: "Java streams vs Rust iterators",
        code: `// Java: streams
List<String> names = List.of("a", "bb", "ccc");
List<Integer> lengths = names.stream()
    .map(String::length)
    .toList();
int total = lengths.stream()
    .mapToInt(n -> n * 2)
    .sum();`,
        explanation:
            "Java streams are a close analogue: lazy until terminal operation, with explicit mapping and filtering steps.",
    },
    {
        id: "iterators-kotlin",
        language: "kotlin",
        conceptIds: ["iterators"],
        title: "Kotlin sequences vs Rust iterators",
        code: `// Kotlin: sequences and collection operators
val names = listOf("a", "bb", "ccc")
val lengths = names.map { it.length }
val total = lengths.sumOf { it * 2 }`,
        explanation:
            "Kotlin sequences and collection operators map nicely to Rust iterators.",
    },
    {
        id: "iterators-go",
        language: "go",
        conceptIds: ["iterators"],
        title: "Go loops vs Rust iterators",
        code: `// Go: usually hand-written loops
names := []string{"a", "bb", "ccc"}
lengths := make([]int, 0, len(names))
for _, s := range names {
    lengths = append(lengths, len(s))
}
total := 0
for _, n := range lengths {
    total += n * 2
}`,
        explanation:
            "Go usually writes loops by hand; Rust's iterators make the pipeline explicit instead.",
    },
    {
        id: "iterators-csharp",
        language: "csharp",
        conceptIds: ["iterators"],
        title: "C# LINQ vs Rust iterators",
        code: `// C#: LINQ
var names = new[] { "a", "bb", "ccc" };
var lengths = names.Select(s => s.Length);
var total = lengths.Sum(n => n * 2);`,
        explanation:
            "C# LINQ is the nearest everyday equivalent, especially for lazy chained transformations.",
    },
    {
        id: "iterators-cpp",
        language: "cpp",
        conceptIds: ["iterators"],
        title: "C++ ranges vs Rust iterators",
        code: `// C++: ranges (C++20)
auto names = std::vector<std::string>{"a", "bb", "ccc"};
auto lengths = names
    | std::views::transform(&std::string::size);
auto total = std::accumulate(
    lengths.begin(), lengths.end(), 0,
    [](int a, std::size_t n) { return a + n * 2; });`,
        explanation:
            "C++ ranges are the closest structural analogue, though Rust's closure ergonomics are often cleaner.",
    },

    // =========================================================================
    // Smart pointers
    // =========================================================================
    {
        id: "smart-pointers-python",
        language: "python",
        conceptIds: ["smart-pointers"],
        title: "Python object model vs Rust smart pointers",
        code: `# Python: everything is a shared heap object
class Data:
    def __init__(self, v):
        self.v = v

a = Data(1)
b = a  # both reference the same object
# no ownership or pointer types`,
        explanation:
            "Python objects are heap-allocated and shared by default, so ownership is mostly invisible there.",
    },
    {
        id: "smart-pointers-typescript",
        language: "typescript",
        conceptIds: ["smart-pointers"],
        title: "JavaScript objects vs Rust smart pointers",
        code: `// JS: objects are shared GC references
const a = { v: 1 };
const b = a;  // shares the reference
// closer to Rc than to Box`,
        explanation:
            "JavaScript objects are shared GC references, closer to Rc than to Box or unique ownership.",
    },
    {
        id: "smart-pointers-java",
        language: "java",
        conceptIds: ["smart-pointers"],
        title: "Java references vs Rust smart pointers",
        code: `// Java: all objects are GC-managed heap references
var a = new int[]{1};
var b = a;  // shares the reference
// no Box/Rc/Arc distinction`,
        explanation:
            "Java and Kotlin mostly live in the GC world, so Rust's pointer types make the sharing policy explicit.",
    },
    {
        id: "smart-pointers-go",
        language: "go",
        conceptIds: ["smart-pointers"],
        title: "Go pointers vs Rust smart pointers",
        code: `// Go: simple pointers + GC
a := new(int)
*a = 1
b := a  // shares the pointer
// no ownership or ref-counting distinction`,
        explanation:
            "Go's pointers are simple references; Rust distinguishes heap ownership, sharing, and borrow-checked mutation.",
    },
    {
        id: "smart-pointers-csharp",
        language: "csharp",
        conceptIds: ["smart-pointers"],
        title: "C# reference types vs Rust smart pointers",
        code: `// C#: reference types are shared heap objects
var a = new int[] { 1 };
var b = a;  // shares the reference
// no Box/Rc distinction`,
        explanation:
            "C# reference types behave like shared heap objects; Rust splits the options into distinct pointer types.",
    },
    {
        id: "smart-pointers-cpp",
        language: "cpp",
        conceptIds: ["smart-pointers"],
        title: "C++ smart pointers vs Rust smart pointers",
        code: `// C++: unique_ptr / shared_ptr / weak_ptr
auto boxed = std::make_unique<int>(10);
auto shared = std::make_shared<int>(10);
auto weak = std::weak_ptr<int>(shared);
// maps closely to Box / Rc / Arc`,
        explanation:
            "C++ unique_ptr/shared_ptr/weak_ptr map quite closely to Box/Rc/Arc in spirit.",
    },
] as const;

export const CONCEPT_SYNTAX_IDS: Readonly<Record<string, readonly string[]>> = {
    ownership: [
        "ownership-python", "ownership-typescript", "ownership-java",
        "ownership-kotlin", "ownership-go", "ownership-csharp", "ownership-cpp",
    ],
    borrowing: [
        "borrowing-python", "borrowing-typescript", "borrowing-java",
        "borrowing-kotlin", "borrowing-go", "borrowing-csharp", "borrowing-cpp",
    ],
    "slices-strings": [
        "slices-python", "slices-typescript", "slices-java",
        "slices-kotlin", "slices-go", "slices-csharp", "slices-cpp",
    ],
    lifetimes: [
        "lifetimes-python", "lifetimes-typescript", "lifetimes-java",
        "lifetimes-kotlin", "lifetimes-go", "lifetimes-csharp", "lifetimes-cpp",
    ],
    enums: [
        "enums-python", "enums-typescript", "enums-java",
        "enums-kotlin", "enums-go", "enums-csharp", "enums-cpp",
    ],
    "option-result": [
        "option-result-python", "option-result-typescript", "option-result-java",
        "option-result-kotlin", "option-result-go", "option-result-csharp", "option-result-cpp",
    ],
    traits: [
        "traits-python", "traits-typescript", "traits-java",
        "traits-kotlin", "traits-go", "traits-csharp", "traits-cpp",
    ],
    generics: [
        "generics-python", "generics-typescript", "generics-java",
        "generics-kotlin", "generics-go", "generics-csharp", "generics-cpp",
    ],
    iterators: [
        "iterators-python", "iterators-typescript", "iterators-java",
        "iterators-kotlin", "iterators-go", "iterators-csharp", "iterators-cpp",
    ],
    "smart-pointers": [
        "smart-pointers-python", "smart-pointers-typescript", "smart-pointers-java",
        "smart-pointers-go", "smart-pointers-csharp", "smart-pointers-cpp",
    ],
};
