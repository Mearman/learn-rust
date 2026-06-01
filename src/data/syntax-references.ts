import type { SyntaxReference } from "./types.ts";

export const SYNTAX_REFERENCES: readonly SyntaxReference[] = [
    // =========================================================================
    // Variable declaration
    // =========================================================================
    {
        id: "var-rust",
        languageId: "rust",
        topic: "Variable declaration",
        title: "let bindings with mutability control",
        code: `let x = 10;           // immutable
let mut y = 20;        // mutable
let z: i32 = 30;       // with type annotation
const MAX: i32 = 100;  // compile-time constant`,
        explanation:
            "Bindings are immutable by default. Use mut to allow mutation. Type annotations are optional when inferable.",
    },
    {
        id: "var-python",
        languageId: "python",
        topic: "Variable declaration",
        title: "Dynamic assignment",
        code: `x = 10          # no type declaration needed
y: int = 20      # optional type hint
MAX = 100        # convention: uppercase for constants
# all variables are mutable`,
        explanation:
            "Variables are created by assignment. Type hints are optional and not enforced at runtime. There is no immutability keyword.",
    },
    {
        id: "var-typescript",
        languageId: "typescript",
        topic: "Variable declaration",
        title: "let, const, and type annotations",
        code: `let x = 10;              // mutable
const y = 20;             // immutable binding
let z: number = 30;       // with type annotation
// const prevents reassignment, not mutation of objects`,
        explanation:
            "let creates mutable bindings, const creates immutable ones. Type annotations are optional. const does not make objects deeply immutable.",
    },
    {
        id: "var-java",
        languageId: "java",
        topic: "Variable declaration",
        title: "Typed declarations with final",
        code: `int x = 10;              // mutable
final int y = 20;         // immutable binding
var z = 30;               // type inferred (Java 10+)
// final prevents reassignment, not mutation of objects`,
        explanation:
            "Variables require a type (or var for inference). final prevents reassignment but does not make objects immutable.",
    },
    {
        id: "var-kotlin",
        languageId: "kotlin",
        topic: "Variable declaration",
        title: "val and var",
        code: `val x = 10           // immutable (read-only)
var y = 20           // mutable
val z: Int = 30      // with type annotation`,
        explanation:
            "val creates read-only bindings, var creates mutable ones. Type annotations are optional when inferable.",
    },
    {
        id: "var-go",
        languageId: "go",
        topic: "Variable declaration",
        title: "Short declaration with :=",
        code: `x := 10             // short declaration (inside functions)
var y int = 20       // var with type
const Max = 100      // constant`,
        explanation:
            "Short declaration (:=) is the most common form inside functions. All variables are mutable; there is no immutability keyword.",
    },
    {
        id: "var-csharp",
        languageId: "csharp",
        topic: "Variable declaration",
        title: "var and typed declarations",
        code: `int x = 10;               // typed
var y = 20;                // type inferred
const int z = 30;          // compile-time constant
readonly int w = 40;       // runtime constant (fields)`,
        explanation:
            "var uses type inference. const is for compile-time constants. readonly prevents reassignment after construction.",
    },
    {
        id: "var-cpp",
        languageId: "cpp",
        topic: "Variable declaration",
        title: "Typed declarations with const",
        code: `int x = 10;               // mutable
const int y = 20;          // immutable
auto z = 30;               // type inferred
constexpr int w = 40;      // compile-time constant`,
        explanation:
            "auto deduces the type. const prevents mutation. constexpr evaluates at compile time. All variables are typed.",
    },

    // =========================================================================
    // Function definition
    // =========================================================================
    {
        id: "fn-rust",
        languageId: "rust",
        topic: "Function definition",
        title: "fn with explicit types",
        code: `fn add(a: i32, b: i32) -> i32 {
    a + b  // implicit return for expressions
}

fn greet(name: &str) {
    println!("Hello, {}", name);
}`,
        explanation:
            "Functions require parameter types. Return type is optional for unit (). The last expression is returned implicitly.",
    },
    {
        id: "fn-python",
        languageId: "python",
        topic: "Function definition",
        title: "def with optional type hints",
        code: `def add(a: int, b: int) -> int:
    return a + b

def greet(name: str) -> None:
    print(f"Hello, {name}")`,
        explanation:
            "Functions are defined with def. Type hints are optional and not enforced at runtime. Indentation defines the body.",
    },
    {
        id: "fn-typescript",
        languageId: "typescript",
        topic: "Function definition",
        title: "Arrow and function declarations",
        code: `function add(a: number, b: number): number {
    return a + b;
}

const greet = (name: string): void => {
    console.log(\`Hello, \${name}\`);
};`,
        explanation:
            "Functions can be declared with function or as arrow expressions. Parameter and return types are enforced at compile time.",
    },
    {
        id: "fn-java",
        languageId: "java",
        topic: "Function definition",
        title: "Methods with explicit types",
        code: `int add(int a, int b) {
    return a + b;
}

void greet(String name) {
    System.out.println("Hello, " + name);
}`,
        explanation:
            "All functions are methods (inside classes). Parameter and return types are always required.",
    },
    {
        id: "fn-kotlin",
        languageId: "kotlin",
        topic: "Function definition",
        title: "fun with expression bodies",
        code: `fun add(a: Int, b: Int): Int = a + b

fun greet(name: String) {
    println("Hello, $name")
}`,
        explanation:
            "Functions use fun. Expression bodies (single expression with =) infer the return type. Block bodies need explicit types.",
    },
    {
        id: "fn-go",
        languageId: "go",
        topic: "Function definition",
        title: "func with explicit types",
        code: `func add(a int, b int) int {
    return a + b
}

func greet(name string) {
    fmt.Printf("Hello, %s", name)
}`,
        explanation:
            "Functions use func. Types come after parameter names. Multiple return values are common (value, error).",
    },
    {
        id: "fn-csharp",
        languageId: "csharp",
        topic: "Function definition",
        title: "Methods with expression bodies",
        code: `int Add(int a, int b) => a + b;

void Greet(string name) {
    Console.WriteLine($"Hello, {name}");
}`,
        explanation:
            "Methods use expression bodies (=>) for single expressions. Types are always required for parameters.",
    },
    {
        id: "fn-cpp",
        languageId: "cpp",
        topic: "Function definition",
        title: "Typed functions with auto return",
        code: `int add(int a, int b) {
    return a + b;
}

auto greet(const std::string& name) -> void {
    std::cout << "Hello, " << name;
}`,
        explanation:
            "Functions require types. auto can be used for return type deduction. References are often passed to avoid copies.",
    },

    // =========================================================================
    // Control flow
    // =========================================================================
    {
        id: "flow-rust",
        languageId: "rust",
        topic: "Control flow",
        title: "if/else as expressions",
        code: `let level = if score > 90 {
    "A"
} else if score > 70 {
    "B"
} else {
    "C"
};

match value {
    0 => println!("zero"),
    n if n > 0 => println!("positive"),
    _ => println!("negative"),
}`,
        explanation:
            "if/else is an expression that returns a value. match handles all patterns with exhaustiveness checking.",
    },
    {
        id: "flow-python",
        languageId: "python",
        topic: "Control flow",
        title: "if/elif/else and match",
        code: `if score > 90:
    level = "A"
elif score > 70:
    level = "B"
else:
    level = "C"

match value:  # Python 3.10+
    case 0:
        print("zero")
    case n if n > 0:
        print("positive")
    case _:
        print("negative")`,
        explanation:
            "if/elif/else is a statement, not an expression. match (3.10+) supports structural pattern matching.",
    },
    {
        id: "flow-typescript",
        languageId: "typescript",
        topic: "Control flow",
        title: "if/else and switch",
        code: `const level = score > 90 ? "A"
    : score > 70 ? "B"
    : "C";

switch (value) {
    case 0: console.log("zero"); break;
    default: console.log("other"); break;
}`,
        explanation:
            "The ternary operator is the closest thing to expression-based if. switch is statement-based and requires break.",
    },
    {
        id: "flow-java",
        languageId: "java",
        topic: "Control flow",
        title: "if/else and switch expressions",
        code: `String level = score > 90 ? "A"
    : score > 70 ? "B"
    : "C";

// Switch expression (Java 14+)
String result = switch (value) {
    case 0 -> "zero";
    default -> "other";
};`,
        explanation:
            "Switch expressions (Java 14+) return values. Traditional switch statements require break.",
    },
    {
        id: "flow-kotlin",
        languageId: "kotlin",
        topic: "Control flow",
        title: "when as an expression",
        code: `val level = when {
    score > 90 -> "A"
    score > 70 -> "B"
    else -> "C"
}

when (value) {
    0 -> println("zero")
    in 1..10 -> println("small")
    else -> println("other")
}`,
        explanation:
            "when is Kotlin's answer to switch/match. It works as an expression and supports arbitrary conditions.",
    },
    {
        id: "flow-go",
        languageId: "go",
        topic: "Control flow",
        title: "if/else — no ternary operator",
        code: `var level string
if score > 90 {
    level = "A"
} else if score > 70 {
    level = "B"
} else {
    level = "C"
}

switch value {
case 0:
    fmt.Println("zero")
default:
    fmt.Println("other")
}`,
        explanation:
            "Go has no ternary operator. switch does not need break (it breaks automatically).",
    },
    {
        id: "flow-csharp",
        languageId: "csharp",
        topic: "Control flow",
        title: "switch expressions and patterns",
        code: `var level = score > 90 ? "A"
    : score > 70 ? "B"
    : "C";

// Switch expression
var result = value switch
{
    0 => "zero",
    > 0 => "positive",
    _ => "negative"
};`,
        explanation:
            "C# switch expressions (C# 8+) return values and support relational patterns. The ternary operator handles simple cases.",
    },
    {
        id: "flow-cpp",
        languageId: "cpp",
        topic: "Control flow",
        title: "if/else and switch",
        code: `std::string level = score > 90 ? "A"
    : score > 70 ? "B"
    : "C";

switch (value) {
    case 0: std::cout << "zero"; break;
    default: std::cout << "other"; break;
}`,
        explanation:
            "The ternary operator returns values. switch is statement-based and requires break to prevent fall-through.",
    },

    // =========================================================================
    // Loop constructs
    // =========================================================================
    {
        id: "loop-rust",
        languageId: "rust",
        topic: "Loop constructs",
        title: "loop, while, for..in",
        code: `// Infinite loop with break value
let mut count = 0;
let result = loop {
    count += 1;
    if count == 10 { break count; }
};

while condition {
    // ...
}

for item in collection.iter() {
    // ...
}`,
        explanation:
            "loop runs forever until break. while checks a condition. for..in iterates over anything implementing Iterator.",
    },
    {
        id: "loop-python",
        languageId: "python",
        topic: "Loop constructs",
        title: "for and while with comprehensions",
        code: `for item in collection:
    ...

while condition:
    ...

# comprehension replaces many loops
results = [transform(x) for x in collection if predicate(x)]`,
        explanation:
            "for iterates over any iterable. Comprehensions replace many loop patterns. while checks a condition.",
    },
    {
        id: "loop-typescript",
        languageId: "typescript",
        topic: "Loop constructs",
        title: "for, for..of, while",
        code: `for (const item of collection) {
    // ...
}

for (let i = 0; i < n; i++) {
    // ...
}

while (condition) {
    // ...
}`,
        explanation:
            "for..of iterates over iterables. Traditional for with index is still common. while checks a condition.",
    },
    {
        id: "loop-java",
        languageId: "java",
        topic: "Loop constructs",
        title: "for, for-each, while",
        code: `for (var item : collection) {
    // ...
}

for (int i = 0; i < n; i++) {
    // ...
}

while (condition) {
    // ...
}`,
        explanation:
            "The enhanced for loop iterates over collections and arrays. Traditional for and while are also available.",
    },
    {
        id: "loop-kotlin",
        languageId: "kotlin",
        topic: "Loop constructs",
        title: "for..in and while",
        code: `for (item in collection) {
    // ...
}

for (i in 0 until n) {
    // ...
}

while (condition) {
    // ...
}`,
        explanation:
            "for..in iterates over ranges and iterables. Ranges (0 until n) replace traditional index loops.",
    },
    {
        id: "loop-go",
        languageId: "go",
        topic: "Loop constructs",
        title: "for is the only loop",
        code: `for _, item := range collection {
    // ...
}

for i := 0; i < n; i++ {
    // ...
}

for condition {
    // ...
}

for {
    // infinite loop
}`,
        explanation:
            "Go has only one loop keyword: for. It handles for-each (range), C-style, while, and infinite loops.",
    },
    {
        id: "loop-csharp",
        languageId: "csharp",
        topic: "Loop constructs",
        title: "for, foreach, while",
        code: `foreach (var item in collection) {
    // ...
}

for (int i = 0; i < n; i++) {
    // ...
}

while (condition) {
    // ...
}`,
        explanation:
            "foreach iterates over IEnumerable. Traditional for and while are also available.",
    },
    {
        id: "loop-cpp",
        languageId: "cpp",
        topic: "Loop constructs",
        title: "for, range-based for, while",
        code: `for (const auto& item : collection) {
    // ...
}

for (int i = 0; i < n; ++i) {
    // ...
}

while (condition) {
    // ...
}`,
        explanation:
            "Range-based for (C++11) iterates over containers. Traditional for and while are also available.",
    },

    // =========================================================================
    // Module system
    // =========================================================================
    {
        id: "mod-rust",
        languageId: "rust",
        topic: "Module system",
        title: "mod and use with visibility",
        code: `// mod.rs or <name>.rs defines a module
pub fn exported() { ... }
fn private() { ... }

// Consuming
use crate::module::exported;
use std::collections::HashMap;`,
        explanation:
            "Modules are defined by file structure. pub controls visibility. use brings items into scope.",
    },
    {
        id: "mod-python",
        languageId: "python",
        topic: "Module system",
        title: "import with __init__.py packages",
        code: `# module.py
def exported():
    ...

# consuming
from package.module import exported
import numpy as np`,
        explanation:
            "Files are modules, directories with __init__.py are packages. import brings names into scope.",
    },
    {
        id: "mod-typescript",
        languageId: "typescript",
        topic: "Module system",
        title: "ES module import/export",
        code: `// module.ts
export function exported() { ... }

// consuming
import { exported } from "./module.ts";
import * as mod from "./module.ts";`,
        explanation:
            "TypeScript uses ES modules. Named and default exports. Import paths are resolved by the bundler.",
    },
    {
        id: "mod-java",
        languageId: "java",
        topic: "Module system",
        title: "Packages and imports",
        code: `// package declaration at top of file
package com.example.module;

public class MyClass { ... }

// consuming
import com.example.module.MyClass;`,
        explanation:
            "Packages are defined by directory structure. import brings classes into scope. Visibility is controlled by public/private/protected.",
    },
    {
        id: "mod-kotlin",
        languageId: "kotlin",
        topic: "Module system",
        title: "Packages and imports",
        code: `// package declaration at top of file
package com.example.module

fun exported() { ... }

// consuming
import com.example.module.exported`,
        explanation:
            "Kotlin uses the same package system as Java. top-level functions and properties can be imported directly.",
    },
    {
        id: "mod-go",
        languageId: "go",
        topic: "Module system",
        title: "Packages with capitalised exports",
        code: `// package declaration at top of file
package mypackage

func Exported() { ... }  // capitalised = exported
func private() { ... }   // lowercase = unexported

// consuming
import "github.com/user/mypackage"`,
        explanation:
            "Visibility is controlled by capitalisation. Capitalised names are exported, lowercase names are not.",
    },
    {
        id: "mod-csharp",
        languageId: "csharp",
        topic: "Module system",
        title: "Namespaces and using",
        code: `namespace MyNamespace {
    public class MyClass { ... }
}

// consuming
using MyNamespace;`,
        explanation:
            "Namespaces organise types. using brings them into scope. Visibility is controlled by public/private/internal.",
    },
    {
        id: "mod-cpp",
        languageId: "cpp",
        topic: "Module system",
        title: "Headers and include (or C++20 modules)",
        code: `// header file (traditional)
#pragma once
void exported();

// consuming
#include "myheader.h"

// C++20 modules (modern)
export module mymodule;
export void exported();`,
        explanation:
            "Traditional C++ uses header files and #include. C++20 introduces modules with export/import.",
    },

    // =========================================================================
    // Type definitions
    // =========================================================================
    {
        id: "type-rust",
        languageId: "rust",
        topic: "Type definitions",
        title: "struct, enum, type alias",
        code: `struct User {
    name: String,
    age: u32,
}

enum Status {
    Active,
    Inactive,
}

type Point = (i32, i32);  // type alias`,
        explanation:
            "struct defines record types. enum defines sum types. type creates aliases. All fields have explicit types.",
    },
    {
        id: "type-python",
        languageId: "python",
        topic: "Type definitions",
        title: "Classes and type aliases",
        code: `from dataclasses import dataclass

@dataclass
class User:
    name: str
    age: int

class Status:
    ACTIVE = "active"
    INACTIVE = "inactive"

type Point = tuple[int, int]  # Python 3.12+`,
        explanation:
            "Classes define types. dataclasses reduce boilerplate. Type aliases (3.12+) name existing types.",
    },
    {
        id: "type-typescript",
        languageId: "typescript",
        topic: "Type definitions",
        title: "interface, type, enum",
        code: `interface User {
    name: string;
    age: number;
}

type Status = "active" | "inactive";

type Point = [number, number];`,
        explanation:
            "interface defines object shapes. type creates aliases, unions, and tuples. string literal unions replace enums.",
    },
    {
        id: "type-java",
        languageId: "java",
        topic: "Type definitions",
        title: "Classes, interfaces, enums",
        code: `record User(String name, int age) {}

enum Status { ACTIVE, INACTIVE }

// or traditional class
class User {
    private final String name;
    private final int age;
    // constructor, getters...
}`,
        explanation:
            "Classes define types. Records (Java 16+) reduce boilerplate. Enums define a closed set of values.",
    },
    {
        id: "type-kotlin",
        languageId: "kotlin",
        topic: "Type definitions",
        title: "data class, sealed class, typealias",
        code: `data class User(val name: String, val age: Int)

sealed class Status {
    object Active : Status()
    object Inactive : Status()
}

typealias Point = Pair<Int, Int>`,
        explanation:
            "data class defines record types. sealed class defines closed hierarchies. typealias creates aliases.",
    },
    {
        id: "type-go",
        languageId: "go",
        topic: "Type definitions",
        title: "struct and interface",
        code: `type User struct {
    Name string
    Age  int
}

type Status int

const (
    Active Status = iota
    Inactive
)

type Point = [2]int  // type alias`,
        explanation:
            "struct defines record types. iota generates enum-like constants. Type aliases use =, new types do not.",
    },
    {
        id: "type-csharp",
        languageId: "csharp",
        topic: "Type definitions",
        title: "class, record, enum",
        code: `record User(string Name, int Age);

enum Status { Active, Inactive }

// or traditional class
class User {
    public string Name { get; }
    public int Age { get; }
}`,
        explanation:
            "Records (C# 9+) define immutable data types. Classes are the traditional reference type. Enums define named constants.",
    },
    {
        id: "type-cpp",
        languageId: "cpp",
        topic: "Type definitions",
        title: "struct, class, enum, using",
        code: `struct User {
    std::string name;
    int age;
};

enum class Status { Active, Inactive };

using Point = std::pair<int, int>;`,
        explanation:
            "struct and class define types (default visibility differs). enum class is scoped. using creates type aliases.",
    },

    // =========================================================================
    // Error handling
    // =========================================================================
    {
        id: "err-rust",
        languageId: "rust",
        topic: "Error handling",
        title: "Result and Option with ? operator",
        code: `use std::fs;
use std::io;

fn read_username() -> Result<String, io::Error> {
    let content = fs::read_to_string("username.txt")?;
    Ok(content.trim().to_string())
}

fn find_user(id: u32) -> Option<String> {
    if id == 1 { Some("Alice".into()) } else { None }
}`,
        explanation:
            "Result<T, E> represents success or error. Option<T> represents presence or absence. The ? operator propagates errors early.",
    },
    {
        id: "err-python",
        languageId: "python",
        topic: "Error handling",
        title: "try/except with custom exceptions",
        code: `class AppError(Exception):
    pass

def read_username() -> str:
    try:
        with open("username.txt") as f:
            return f.read().strip()
    except FileNotFoundError:
        raise AppError("username file missing")
    except OSError as e:
        raise AppError(f"read failed: {e}") from e`,
        explanation:
            "Exceptions are raised and caught with try/except. Custom exceptions extend Exception. The raise...from chain preserves context.",
    },
    {
        id: "err-typescript",
        languageId: "typescript",
        topic: "Error handling",
        title: "try/catch and Result-like patterns",
        code: `function readUsername(): Result<string, Error> {
    try {
        const content = readFileSync("username.txt", "utf-8");
        return { ok: true, value: content.trim() };
    } catch (e) {
        return { ok: false, error: toError(e) };
    }
}

// Or simply throw
function findUser(id: number): string | undefined {
    return id === 1 ? "Alice" : undefined;
}`,
        explanation:
            "TypeScript has try/catch for exceptions. Some codebases use Result-style discriminated unions for explicit error handling without throwing.",
    },
    {
        id: "err-java",
        languageId: "java",
        topic: "Error handling",
        title: "try/catch with checked exceptions",
        code: `String readUsername() throws IOException {
    return Files.readString(Path.of("username.txt")).trim();
}

// Caller must handle or declare
void process() {
    try {
        String name = readUsername();
    } catch (IOException e) {
        throw new RuntimeException("read failed", e);
    } finally {
        // always runs
    }
}`,
        explanation:
            "Checked exceptions must be declared or caught. Unchecked exceptions (RuntimeException) do not. finally guarantees cleanup.",
    },
    {
        id: "err-kotlin",
        languageId: "kotlin",
        topic: "Error handling",
        title: "try as expression with Result",
        code: `fun readUsername(): Result<String> = runCatching {
    File("username.txt").readText().trim()
}

// try is an expression
val name = try {
    readUsername().getOrThrow()
} catch (e: IOException) {
    "unknown"
}

// nullable for absence
fun findUser(id: Int): String? =
    if (id == 1) "Alice" else null`,
        explanation:
            "try is an expression that returns a value. Result<T> wraps success or failure. Nullable types (T?) replace checked exceptions for simple absence.",
    },
    {
        id: "err-go",
        languageId: "go",
        topic: "Error handling",
        title: "Explicit error return values",
        code: `func readUsername() (string, error) {
    data, err := os.ReadFile("username.txt")
    if err != nil {
        return "", fmt.Errorf("read failed: %w", err)
    }
    return strings.TrimSpace(string(data)), nil
}

// Caller checks error
name, err := readUsername()
if err != nil {
    log.Fatal(err)
}`,
        explanation:
            "Errors are returned as the last value. Callers check err != nil. fmt.Errorf with %w wraps errors. No exceptions are used.",
    },
    {
        id: "err-csharp",
        languageId: "csharp",
        topic: "Error handling",
        title: "try/catch and Result patterns",
        code: `string ReadUsername() {
    try {
        return File.ReadAllText("username.txt").Trim();
    } catch (FileNotFoundException) {
        throw new InvalidOperationException("username file missing");
    } finally {
        // always runs
    }
}

// nullable for absence
string? FindUser(int id) =>
    id == 1 ? "Alice" : null;`,
        explanation:
            "Exceptions are thrown and caught with try/catch. Nullable reference types (C# 8+) track absence. finally guarantees cleanup.",
    },
    {
        id: "err-cpp",
        languageId: "cpp",
        topic: "Error handling",
        title: "Exceptions and std::optional/std::expected",
        code: `std::string read_username() {
    try {
        auto content = read_file("username.txt");
        return trim(content);
    } catch (const std::filesystem::filesystem_error& e) {
        throw std::runtime_error("read failed: " + std::string(e.what()));
    }
}

// C++23: std::expected<T, E>
std::expected<std::string, int> find_user(int id) {
    if (id == 1) return "Alice";
    return std::unexpected(404);
}

// C++17: std::optional<T>
std::optional<std::string> lookup(int id);`,
        explanation:
            "Exceptions are thrown and caught. std::optional (C++17) represents absence. std::expected (C++23) represents success or error without exceptions.",
    },

    // =========================================================================
    // Struct/class definition
    // =========================================================================
    {
        id: "struct-rust",
        languageId: "rust",
        topic: "Struct/class definition",
        title: "Named and tuple structs with impl",
        code: `struct User {
    name: String,
    age: u32,
}

impl User {
    fn new(name: String, age: u32) -> Self {
        Self { name, age }
    }

    fn greet(&self) -> String {
        format!("Hello, {}", self.name)
    }
}

struct Point(f64, f64);  // tuple struct`,
        explanation:
            "Structs hold named fields. Methods are added in impl blocks. Tuple structs have positional fields. No inheritance — composition only.",
    },
    {
        id: "struct-python",
        languageId: "python",
        topic: "Struct/class definition",
        title: "Classes with dataclass",
        code: `from dataclasses import dataclass

@dataclass
class User:
    name: str
    age: int

    def greet(self) -> str:
        return f"Hello, {self.name}"

# or a plain class
class Point:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y`,
        explanation:
            "dataclass generates __init__, __repr__, and __eq__. Plain classes use __init__ for setup. Methods are defined in the class body.",
    },
    {
        id: "struct-typescript",
        languageId: "typescript",
        topic: "Struct/class definition",
        title: "Classes and plain objects",
        code: `interface User {
    readonly name: string;
    readonly age: number;
}

const user: User = { name: "Alice", age: 30 };

// or with a class
class UserCls {
    constructor(readonly name: string, readonly age: number) {}

    greet(): string {
        return \`Hello, \${this.name}\`;
    }
}`,
        explanation:
            "Plain objects with interfaces are common for data. Classes add methods and encapsulation. Parameter properties reduce boilerplate.",
    },
    {
        id: "struct-java",
        languageId: "java",
        topic: "Struct/class definition",
        title: "Records and traditional classes",
        code: `record User(String name, int age) {
    String greet() {
        return "Hello, " + name;
    }
}

// Traditional class with encapsulation
class Point {
    private final double x;
    private final double y;

    Point(double x, double y) {
        this.x = x;
        this.y = y;
    }
}`,
        explanation:
            "Records (Java 16+) provide immutable data carriers with auto-generated accessors, equals, and hashCode. Traditional classes offer full encapsulation.",
    },
    {
        id: "struct-kotlin",
        languageId: "kotlin",
        topic: "Struct/class definition",
        title: "data class with methods",
        code: `data class User(val name: String, val age: Int) {
    fun greet(): String = "Hello, \${'$'}name"
}

// or a plain class
class Point(val x: Double, val y: Double)`,
        explanation:
            "data class generates equals, hashCode, toString, and copy. Primary constructor parameters become properties. Plain classes are lighter.",
    },
    {
        id: "struct-go",
        languageId: "go",
        topic: "Struct/class definition",
        title: "Structs with methods",
        code: `type User struct {
    Name string
    Age  int
}

func (u User) Greet() string {
    return fmt.Sprintf("Hello, %s", u.Name)
}

func (u *User) Birthday() {
    u.Age++
}`,
        explanation:
            "Structs hold fields. Methods are attached via receiver arguments. Pointer receivers allow mutation. No classes or inheritance.",
    },
    {
        id: "struct-csharp",
        languageId: "csharp",
        topic: "Struct/class definition",
        title: "Records, classes, and structs",
        code: `record User(string Name, int Age) {
    public string Greet() => $"Hello, {Name}";
}

// Positional struct (C# 10+)
readonly struct Point(double X, double Y);

// Traditional class
class Entity {
    public string Name { get; init; }
}`,
        explanation:
            "Records (C# 9+) provide value-based equality. Classes are reference types. Structs are value types. init setters allow object initialiser assignment.",
    },
    {
        id: "struct-cpp",
        languageId: "cpp",
        topic: "Struct/class definition",
        title: "Structs and classes with methods",
        code: `struct User {
    std::string name;
    unsigned int age;

    std::string greet() const {
        return "Hello, " + name;
    }
};

// class: members are private by default
class Point {
    double x_, y_;
public:
    Point(double x, double y) : x_(x), y_(y) {}
    double x() const { return x_; }
};`,
        explanation:
            "struct and class differ only in default visibility (public vs private). Methods are defined inline or out-of-line. const methods cannot mutate.",
    },

    // =========================================================================
    // Enum/variant definition
    // =========================================================================
    {
        id: "enum-rust",
        languageId: "rust",
        topic: "Enum/variant definition",
        title: "Enums carrying data",
        code: `enum Shape {
    Circle { radius: f64 },
    Rectangle { width: f64, height: f64 },
    Triangle(f64, f64, f64),  // tuple variant
}

enum Option<T> {
    Some(T),
    None,
}

// Use with match
fn area(shape: &Shape) -> f64 {
    match shape {
        Shape::Circle { radius } => std::f64::consts::PI * radius * radius,
        Shape::Rectangle { width, height } => width * height,
        Shape::Triangle(a, b, c) => { /* Heron's formula */ }
    }
}`,
        explanation:
            "Enums can carry named or positional data. Each variant is a distinct type within the enum. match provides exhaustiveness checking.",
    },
    {
        id: "enum-python",
        languageId: "python",
        topic: "Enum/variant definition",
        title: "Enums and tagged unions via classes",
        code: `from enum import Enum, auto

class Status(Enum):
    ACTIVE = auto()
    INACTIVE = auto()

# Tagged union via subclasses
class Shape:
    pass

class Circle(Shape):
    radius: float

class Rectangle(Shape):
    width: float
    height: float

# Python 3.10+ match
match shape:
    case Circle(r=r):
        print(f"circle: {r}")
    case Rectangle(w=w, h=h):
        print(f"rect: {w}x{h}")`,
        explanation:
            "Standard enums hold simple values. Tagged unions are modelled with class hierarchies and matched with structural pattern matching (Python 3.10+).",
    },
    {
        id: "enum-typescript",
        languageId: "typescript",
        topic: "Enum/variant definition",
        title: "Union types and discriminated unions",
        code: `// Union of string literals
type Status = "active" | "inactive";

// Discriminated union with a tag
type Shape =
    | { kind: "circle"; radius: number }
    | { kind: "rectangle"; width: number; height: number };

function area(shape: Shape): number {
    switch (shape.kind) {
        case "circle":
        return Math.PI * shape.radius ** 2;
        case "rectangle":
        return shape.width * shape.height;
    }
}`,
        explanation:
            "Discriminated unions use a shared literal field (kind) for narrowing. TypeScript checks exhaustiveness in switch statements. String unions replace simple enums.",
    },
    {
        id: "enum-java",
        languageId: "java",
        topic: "Enum/variant definition",
        title: "Enums with fields and sealed interfaces",
        code: `enum Status { ACTIVE, INACTIVE }

// Rich enum with data
enum Planet {
    MERCURY(3.303e+23),
    VENUS(4.869e+24);

    final double mass;
    Planet(double mass) { this.mass = mass; }
}

// Sealed interface (Java 17+) for sum types
sealed interface Shape permits Circle, Rectangle {}
record Circle(double radius) implements Shape {}
record Rectangle(double width, double height) implements Shape {}`,
        explanation:
            "Enums can carry fields and methods. Sealed interfaces (Java 17+) create closed hierarchies that the compiler checks exhaustively.",
    },
    {
        id: "enum-kotlin",
        languageId: "kotlin",
        topic: "Enum/variant definition",
        title: "Enum classes and sealed hierarchies",
        code: `enum class Status { ACTIVE, INACTIVE }

// Sealed class for sum types
sealed class Shape {
    data class Circle(val radius: Double) : Shape()
    data class Rectangle(val width: Double, val height: Double) : Shape()
}

fun area(shape: Shape): Double = when (shape) {
    is Shape.Circle -> Math.PI * shape.radius * shape.radius
    is Shape.Rectangle -> shape.width * shape.height
}`,
        explanation:
            "Enum classes hold simple constants. Sealed classes define closed hierarchies where the compiler knows all subtypes. when is exhaustive over sealed types.",
    },
    {
        id: "enum-go",
        languageId: "go",
        topic: "Enum/variant definition",
        title: "iota constants and interface-based sum types",
        code: `type Status int

const (
    Active Status = iota
    Inactive
)

// Sum type via interface
type Shape interface { isShape() }

type Circle struct { Radius float64 }
func (Circle) isShape() {}

type Rectangle struct { Width, Height float64 }
func (Rectangle) isShape() {}

// Type switch
func area(s Shape) float64 {
    switch v := s.(type) {
    case Circle:
        return math.Pi * v.Radius * v.Radius
    case Rectangle:
        return v.Width * v.Height
    default:
        return 0
    }
}`,
        explanation:
            "iota generates sequential constants for enum-like types. Sum types are modelled with interfaces and type switches, but exhaustiveness is not checked by the compiler.",
    },
    {
        id: "enum-csharp",
        languageId: "csharp",
        topic: "Enum/variant definition",
        title: "Enums and discriminated unions via OneOf",
        code: `enum Status { Active, Inactive }

// Discriminated union via one-of library or manual
type Shape =
    | Circle of radius: float
    | Rectangle of width: float * height: float;

// Pure C# approach: abstract record
abstract record Shape {
    public sealed record Circle(double Radius) : Shape;
    public sealed record Rectangle(double Width, double Height) : Shape;
}

var area = shape switch {
    Shape.Circle c => Math.PI * c.Radius * c.Radius,
    Shape.Rectangle r => r.Width * r.Height,
};`,
        explanation:
            "Standard enums hold named integers. Discriminated unions can be modelled with sealed abstract records and pattern matching. The compiler checks exhaustiveness.",
    },
    {
        id: "enum-cpp",
        languageId: "cpp",
        topic: "Enum/variant definition",
        title: "Scoped enums and std::variant",
        code: `enum class Status { Active, Inactive };

// Sum type via std::variant (C++17)
using Shape = std::variant<
    struct Circle { double radius; },
    struct Rectangle { double width, height; }
>;

// Visit with overload set
double area(const Shape& s) {
    return std::visit(overloaded{
        [](const Circle& c) { return 3.14159 * c.radius * c.radius; },
        [](const Rectangle& r) { return r.width * r.height; }
    }, s);
}`,
        explanation:
            "enum class is scoped and type-safe. std::variant (C++17) provides tagged unions with std::visit for pattern matching. No compiler exhaustiveness check.",
    },

    // =========================================================================
    // Pattern matching
    // =========================================================================
    {
        id: "pattern-rust",
        languageId: "rust",
        topic: "Pattern matching",
        title: "match with guards and destructuring",
        code: `fn classify(value: i32) -> &'static str {
    match value {
        0 => "zero",
        n if n > 0 => "positive",
        _ => "negative",
    }
}

// Destructuring structs
match event {
    MouseEvent { x, y, .. } if x > 0 => { /* ... */ }
    KeyEvent { code, .. } => { /* ... */ }
    _ => {}
}

// Slice patterns
match slice {
    [first, .., last] => println!("{first} ... {last}"),
    [single] => println!("{single}"),
    [] => println!("empty"),
}`,
        explanation:
            "match checks exhaustiveness. Guards (if) add conditions. .. ignores remaining fields. Slice patterns match start and end elements.",
    },
    {
        id: "pattern-python",
        languageId: "python",
        topic: "Pattern matching",
        title: "match with structural patterns (3.10+)",
        code: `def classify(value: int) -> str:
    match value:
        case 0:
            return "zero"
        case n if n > 0:
            return "positive"
        case _:
            return "negative"

# Destructuring
def handle(event):
    match event:
        case {"type": "click", "x": x, "y": y}:
            print(f"click at {x}, {y}")
        case {"type": "key", "code": code}:
            print(f"key: {code}")
        case _:
            print("unknown")`,
        explanation:
            "match (Python 3.10+) supports literal, sequence, mapping, and class patterns. Guards use if. _ is the wildcard.",
    },
    {
        id: "pattern-typescript",
        languageId: "typescript",
        topic: "Pattern matching",
        title: "switch with narrowing and destructuring",
        code: `function classify(value: number): string {
    switch (true) {
        case value === 0: return "zero";
        case value > 0: return "positive";
        default: return "negative";
    }
}

// Destructuring objects
function handle(event: Event) {
    switch (event.kind) {
        case "click":
        console.log(\`click at \${event.x}, \${event.y}\`);
        break;
        case "key":
        console.log(\`key: \${event.code}\`);
        break;
    }
}

// Tuple destructuring
const [first, ...rest] = [1, 2, 3];`,
        explanation:
            "switch with discriminated unions provides narrowing. Object and array destructuring work outside switch. No exhaustiveness guarantee without never checks.",
    },
    {
        id: "pattern-java",
        languageId: "java",
        topic: "Pattern matching",
        title: "switch patterns (Java 21+)",
        code: `String classify(int value) {
    return switch (value) {
        case 0 -> "zero";
        case int n when n > 0 -> "positive";
        default -> "negative";
    };
}

// Record pattern matching (Java 21+)
String describe(Shape s) {
    return switch (s) {
        case Circle(var r) -> "circle radius " + r;
        case Rectangle(var w, var h) -> w + "x" + h;
    };
}

// instanceof pattern
if (obj instanceof String s) {
    System.out.println(s.length());
}`,
        explanation:
            "switch expressions with pattern matching (Java 21+) support type patterns, record destructuring, and guards (when). instanceof narrows in one step.",
    },
    {
        id: "pattern-kotlin",
        languageId: "kotlin",
        topic: "Pattern matching",
        title: "when with smart casts",
        code: `fun classify(value: Int): String = when (value) {
    0 -> "zero"
    in 1..Int.MAX_VALUE -> "positive"
    else -> "negative"
}

// Smart casting with is
fun describe(shape: Shape): String = when (shape) {
    is Shape.Circle -> "circle radius \${'$'}{shape.radius}"
    is Shape.Rectangle -> "\${'$'}{shape.width}x\${'$'}{shape.height}"
}

// Destructuring declarations
val (name, age) = user
val (first, rest) = list`,
        explanation:
            "when supports values, ranges, and type checks. is triggers smart casts so members are accessible without casting. Destructuring works with data classes.",
    },
    {
        id: "pattern-go",
        languageId: "go",
        topic: "Pattern matching",
        title: "Type switch and simple matching",
        code: `func classify(value int) string {
    switch {
    case value == 0:
        return "zero"
    case value > 0:
        return "positive"
    default:
        return "negative"
    }
}

// Type switch
func describe(v interface{}) string {
    switch v := v.(type) {
    case int:
        return fmt.Sprintf("int: %d", v)
    case string:
        return fmt.Sprintf("string: %s", v)
    default:
        return fmt.Sprintf("unknown: %T", v)
    }
}`,
        explanation:
            "Switch without a condition acts like if/else chains. Type switches (v.(type)) narrow interface types. No destructuring or pattern guards.",
    },
    {
        id: "pattern-csharp",
        languageId: "csharp",
        topic: "Pattern matching",
        title: "Switch expressions with patterns",
        code: `string Classify(int value) => value switch {
    0 => "zero",
    > 0 => "positive",
    _ => "negative"
};

// Property and positional patterns
string Describe(Shape shape) => shape switch {
    Circle { Radius: var r } => $"circle radius {r}",
    Rectangle(var w, var h) => $"{w}x{h}",
    _ => "unknown"
};

// is pattern
if (obj is string s) {
    Console.WriteLine(s.Length);
}`,
        explanation:
            "switch expressions support relational, property, and positional patterns. is narrows types in one step. The compiler checks exhaustiveness.",
    },
    {
        id: "pattern-cpp",
        languageId: "cpp",
        topic: "Pattern matching",
        title: "std::visit and structured bindings",
        code: `std::string classify(int value) {
    if (value == 0) return "zero";
    if (value > 0) return "positive";
    return "negative";
}

// Structured bindings (C++17)
auto [name, age] = user;
auto [first, second] = pair;
auto& [key, value] = *map_iter;

// Variant visitation
std::visit(overloaded{
    [](int i) { fmt::print("int: {}", i); },
    [](const std::string& s) { fmt::print("str: {}", s); }
}, variant);`,
        explanation:
            "C++ has no built-in pattern matching. Structured bindings (C++17) destructure tuples and pairs. std::visit dispatches on variant types.",
    },

    // =========================================================================
    // Generics and type parameters
    // =========================================================================
    {
        id: "generic-rust",
        languageId: "rust",
        topic: "Generics and type parameters",
        title: "Generic functions and traits",
        code: `fn largest<T: PartialOrd>(list: &[T]) -> &T {
    let mut biggest = &list[0];
    for item in &list[1..] {
        if item > biggest {
            biggest = item;
        }
    }
    biggest
}

// Generic struct
struct Wrapper<T> {
    value: T,
}

// Trait bound
impl<T: Display> Wrapper<T> {
    fn describe(&self) {
        println!("{}", self.value);
    }
}

// Where clause
fn process<T, U>(a: T, b: U)
where
    T: Clone + Debug,
    U: Into<T>,
{
    // ...
}`,
        explanation:
            "Type parameters are declared in angle brackets. Trait bounds constrain what types can do. Where clauses keep signatures clean for complex bounds.",
    },
    {
        id: "generic-python",
        languageId: "python",
        topic: "Generics and type parameters",
        title: "Type variables and generic functions",
        code: `from typing import TypeVar, Generic

T = TypeVar("T")

def largest(list: list[T]) -> T:
    biggest = list[0]
    for item in list[1:]:
        if item > biggest:
            biggest = item
    return biggest

# Generic class
class Wrapper(Generic[T]):
    def __init__(self, value: T) -> None:
        self.value = value

# Python 3.12+ type parameter syntax
def first[T](items: list[T]) -> T:
    return items[0]`,
        explanation:
            "TypeVar defines type parameters. Generic[T] makes classes generic. Python 3.12+ allows type parameters directly in function and class signatures.",
    },
    {
        id: "generic-typescript",
        languageId: "typescript",
        topic: "Generics and type parameters",
        title: "Generic functions with constraints",
        code: `function largest<T extends { compareTo(other: T): number }>(
    list: readonly T[]
): T {
    return list.reduce((a, b) => a.compareTo(b) >= 0 ? a : b);
}

// Generic interface
interface Wrapper<T> {
    readonly value: T;
}

// Generic type with default
type Result<T, E = Error> =
    | { ok: true; value: T }
    | { ok: false; error: E };

// Inference: T is inferred from arguments
const w: Wrapper<string> = { value: "hello" };`,
        explanation:
            "Type parameters are declared in angle brackets. extends constrains types. Defaults reduce boilerplate. TypeScript infers types from usage.",
    },
    {
        id: "generic-java",
        languageId: "java",
        topic: "Generics and type parameters",
        title: "Generic methods and bounded types",
        code: `<T extends Comparable<T>> T largest(List<T> list) {
    T biggest = list.getFirst();
    for (T item : list) {
        if (item.compareTo(biggest) > 0) {
            biggest = item;
        }
    }
    return biggest;
}

// Generic class
class Wrapper<T> {
    private final T value;
    Wrapper(T value) { this.value = value; }
    T get() { return value; }
}

// Bounded wildcard
void process(List<? extends Number> numbers) {
    // reads from numbers, cannot add
}`,
        explanation:
            "Type parameters are declared in angle brackets. extends bounds types. Wildcards (? extends T) provide variance at use site.",
    },
    {
        id: "generic-kotlin",
        languageId: "kotlin",
        topic: "Generics and type parameters",
        title: "Generic functions with reified types",
        code: `fun <T : Comparable<T>> largest(list: List<T>): T {
    var biggest = list[0]
    for (item in list.drop(1)) {
        if (item > biggest) biggest = item
    }
    return biggest
}

// Generic class
class Wrapper<T>(val value: T)

// Reified type parameter (inline only)
inline fun <reified T> typeOf(): String = T::class.simpleName ?: "Unknown"

// Declaration-site variance
interface Source<out T> {
    fun next(): T
}`,
        explanation:
            "Type parameters are declared in angle brackets. Reified types (inline functions) preserve generics at runtime. out/in control variance at declaration site.",
    },
    {
        id: "generic-go",
        languageId: "go",
        topic: "Generics and type parameters",
        title: "Type parameters with constraints (Go 1.18+)",
        code: `type Ordered interface {
    ~int | ~int8 | ~int16 | ~int32 | ~int64 |
    ~float32 | ~float64 | ~string
}

func Largest[T Ordered](list []T) T {
    biggest := list[0]
    for _, item := range list[1:] {
        if item > biggest {
            biggest = item
        }
    }
    return biggest
}

// Generic struct
type Wrapper[T any] struct {
    Value T
}

// Type sets in interfaces
type Adder interface {
    int | float64 | string
}`,
        explanation:
            "Go 1.18+ supports type parameters. Constraints are interfaces with type sets. ~T includes all types with underlying type T. any is an alias for interface{}.",
    },
    {
        id: "generic-csharp",
        languageId: "csharp",
        topic: "Generics and type parameters",
        title: "Generic methods with constraints",
        code: `T Largest<T>(IReadOnlyList<T> list) where T : IComparable<T> {
    var biggest = list[0];
    foreach (var item in list) {
        if (item.CompareTo(biggest) > 0)
            biggest = item;
    }
    return biggest;
}

// Generic class
class Wrapper<T> {
    public T Value { get; }
    public Wrapper(T value) => Value = value;
}

// Multiple constraints
void Process<T>(T item)
    where T : class, IComparable, new()
{
    // T is a reference type, comparable, and has a parameterless constructor
}`,
        explanation:
            "Type parameters are declared in angle brackets. where constrains them. Constraints can require interfaces, a base class, a parameterless constructor, or reference/value type.",
    },
    {
        id: "generic-cpp",
        languageId: "cpp",
        topic: "Generics and type parameters",
        title: "Templates with concepts (C++20)",
        code: `template <typename T>
T largest(const std::vector<T>& list) {
    T biggest = list[0];
    for (const auto& item : list) {
        if (item > biggest) biggest = item;
    }
    return biggest;
}

// C++20 concepts
template <typename T>
concept Ordered = requires(T a, T b) {
    { a < b } -> std::convertible_to<bool>;
};

template <Ordered T>
T largest(const std::vector<T>& list);

// Generic struct
template <typename T>
struct Wrapper {
    T value;
};`,
        explanation:
            "Templates are the C++ mechanism for generics. Concepts (C++20) constrain template parameters with readable requirements. Errors are caught earlier.",
    },

    // =========================================================================
    // Async and concurrency
    // =========================================================================
    {
        id: "async-rust",
        languageId: "rust",
        topic: "Async and concurrency",
        title: "async/await with tokio runtime",
        code: `use tokio;

async fn fetch_data(url: &str) -> Result<String, reqwest::Error> {
    let response = reqwest::get(url).await?;
    let body = response.text().await?;
    Ok(body)
}

// Spawning concurrent tasks
#[tokio::main]
async fn main() {
    let handle = tokio::spawn(async {
        fetch_data("https://example.com").await
    });

    let result = handle.await.unwrap();
}

// Channels for message passing
use tokio::sync::mpsc;
let (tx, mut rx) = mpsc::channel(32);`,
        explanation:
            "async fn returns a Future. .await suspends until the future resolves. Tasks are spawned on a runtime (usually tokio). Channels pass messages between tasks.",
    },
    {
        id: "async-python",
        languageId: "python",
        topic: "Async and concurrency",
        title: "async/await with asyncio",
        code: `import asyncio

async def fetch_data(url: str) -> str:
    # simulated async I/O
    await asyncio.sleep(1)
    return f"data from {url}"

async def main() -> None:
    # Concurrent execution
    results = await asyncio.gather(
        fetch_data("https://a.com"),
        fetch_data("https://b.com"),
    )

    # Task creation
    task = asyncio.create_task(fetch_data("https://c.com"))
    result = await task

asyncio.run(main())`,
        explanation:
            "async def defines coroutines. await suspends until the awaitable completes. asyncio.gather runs coroutines concurrently. asyncio.run drives the event loop.",
    },
    {
        id: "async-typescript",
        languageId: "typescript",
        topic: "Async and concurrency",
        title: "async/await with Promises",
        code: `async function fetchData(url: string): Promise<string> {
    const response = await fetch(url);
    return response.text();
}

// Concurrent execution
async function main(): Promise<void> {
    const [a, b] = await Promise.all([
        fetchData("https://a.com"),
        fetchData("https://b.com"),
    ]);
}

// Promise creation
const p = new Promise<string>((resolve, reject) => {
    // ...
    resolve("result");
});`,
        explanation:
            "async functions return Promises. await unwraps them. Promise.all runs operations concurrently. The event loop handles scheduling.",
    },
    {
        id: "async-java",
        languageId: "java",
        topic: "Async and concurrency",
        title: "CompletableFuture and virtual threads",
        code: `// CompletableFuture (async pipeline)
CompletableFuture<String> future = CompletableFuture
    .supplyAsync(() -> fetchData("https://example.com"))
    .thenApply(String::trim)
    .exceptionally(ex -> "fallback");

// Combine multiple futures
CompletableFuture.allOf(futureA, futureB).join();

// Virtual threads (Java 21+)
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    var task = executor.submit(() -> fetchData("https://example.com"));
    String result = task.get();
}`,
        explanation:
            "CompletableFuture chains async operations. Virtual threads (Java 21+) provide lightweight concurrency with blocking-style code. Structured concurrency is incubating.",
    },
    {
        id: "async-kotlin",
        languageId: "kotlin",
        topic: "Async and concurrency",
        title: "Coroutines with structured concurrency",
        code: `import kotlinx.coroutines.*

suspend fun fetchData(url: String): String {
    delay(1000) // simulated async I/O
    return "data from \${'$'}url"
}

fun main() = runBlocking {
    // Concurrent coroutines
    val deferred: List<Deferred<String>> = listOf(
        "https://a.com",
        "https://b.com",
    ).map { url ->
        async { fetchData(url) }
    }

    val results = deferred.awaitAll()

    // Flow for streams
    flow {
        emit(1)
        emit(2)
    }.collect { value ->
        println(value)
    }
}`,
        explanation:
            "suspend marks async functions. Coroutines are launched in scopes for structured concurrency. async returns a Deferred. Flow represents cold async streams.",
    },
    {
        id: "async-go",
        languageId: "go",
        topic: "Async and concurrency",
        title: "Goroutines and channels",
        code: `func fetchData(url string) string {
    resp, _ := http.Get(url)
    defer resp.Body.Close()
    body, _ := io.ReadAll(resp.Body)
    return string(body)
}

func main() {
    // Goroutine
    ch := make(chan string)
    go func() {
        ch <- fetchData("https://example.com")
    }()
    result := <-ch

    // WaitGroup for multiple goroutines
    var wg sync.WaitGroup
    for _, url := range urls {
        wg.Add(1)
        go func(u string) {
            defer wg.Done()
            fetchData(u)
        }(url)
    }
    wg.Wait()
}`,
        explanation:
            "go launches a goroutine. Channels communicate between goroutines. sync.WaitGroup waits for a group of goroutines to finish. No async/await keyword.",
    },
    {
        id: "async-csharp",
        languageId: "csharp",
        topic: "Async and concurrency",
        title: "async/await with Tasks",
        code: `async Task<string> FetchData(string url) {
    using var client = new HttpClient();
    return await client.GetStringAsync(url);
}

// Concurrent execution
async Task Main() {
    var tasks = new[] {
        FetchData("https://a.com"),
        FetchData("https://b.com"),
    };
    var results = await Task.WhenAll(tasks);
}

// Task creation
var task = Task.Run(() => ComputeHeavy());
var result = await task;`,
        explanation:
            "async methods return Task or Task<T>. await unwraps the result. Task.WhenAll runs operations concurrently. Task.Run offloads CPU-bound work to the thread pool.",
    },
    {
        id: "async-cpp",
        languageId: "cpp",
        topic: "Async and concurrency",
        title: "std::async, threads, and coroutines",
        code: `// std::async (C++11)
auto future = std::async(std::launch::async, [] {
    return fetchData("https://example.com");
});
std::string result = future.get();

// std::thread
std::thread t([] {
    std::cout << "hello from thread";
});
t.join();

// C++20 coroutines
Task<std::string> fetchData(std::string url) {
    auto response = co_await http_get(url);
    co_return response.body;
}

// Promise and future for communication
std::promise<std::string> p;
auto f = p.get_future();
p.set_value("result");`,
        explanation:
            "std::async launches asynchronous tasks. std::thread provides OS-level threads. C++20 coroutines use co_await/co_return. promise/future communicate between threads.",
    },
] as const;
