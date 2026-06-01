import type { SyntaxReference } from "./types.ts";

export const SYNTAX_REFERENCES: readonly SyntaxReference[] = [
    // =========================================================================
    // Variable declaration
    // =========================================================================
    { id: "var-rust", languageId: "rust", topic: "Variable declaration", title: "let bindings with mutability control", code: `let x = 10;           // immutable
let mut y = 20;        // mutable
let z: i32 = 30;       // with type annotation
const MAX: i32 = 100;  // compile-time constant`, explanation: "Bindings are immutable by default. Use mut to allow mutation. Type annotations are optional when inferable." },
    { id: "var-python", languageId: "python", topic: "Variable declaration", title: "Dynamic assignment", code: `x = 10          # no type declaration needed
y: int = 20      # optional type hint
MAX = 100        # convention: uppercase for constants
# all variables are mutable`, explanation: "Variables are created by assignment. Type hints are optional and not enforced at runtime. There is no immutability keyword." },
    { id: "var-typescript", languageId: "typescript", topic: "Variable declaration", title: "let, const, and type annotations", code: `let x = 10;              // mutable
const y = 20;             // immutable binding
let z: number = 30;       // with type annotation
// const prevents reassignment, not mutation of objects`, explanation: "let creates mutable bindings, const creates immutable ones. Type annotations are optional. const does not make objects deeply immutable." },
    { id: "var-java", languageId: "java", topic: "Variable declaration", title: "Typed declarations with final", code: `int x = 10;              // mutable
final int y = 20;         // immutable binding
var z = 30;               // type inferred (Java 10+)
// final prevents reassignment, not mutation of objects`, explanation: "Variables require a type (or var for inference). final prevents reassignment but does not make objects immutable." },
    { id: "var-kotlin", languageId: "kotlin", topic: "Variable declaration", title: "val and var", code: `val x = 10           // immutable (read-only)
var y = 20           // mutable
val z: Int = 30      // with type annotation`, explanation: "val creates read-only bindings, var creates mutable ones. Type annotations are optional when inferable." },
    { id: "var-go", languageId: "go", topic: "Variable declaration", title: "Short declaration with :=", code: `x := 10             // short declaration (inside functions)
var y int = 20       // var with type
const Max = 100      // constant`, explanation: "Short declaration (:=) is the most common form inside functions. All variables are mutable; there is no immutability keyword." },
    { id: "var-csharp", languageId: "csharp", topic: "Variable declaration", title: "var and typed declarations", code: `int x = 10;               // typed
var y = 20;                // type inferred
const int z = 30;          // compile-time constant
readonly int w = 40;       // runtime constant (fields)`, explanation: "var uses type inference. const is for compile-time constants. readonly prevents reassignment after construction." },
    { id: "var-cpp", languageId: "cpp", topic: "Variable declaration", title: "Typed declarations with const", code: `int x = 10;               // mutable
const int y = 20;          // immutable
auto z = 30;               // type inferred
constexpr int w = 40;      // compile-time constant`, explanation: "auto deduces the type. const prevents mutation. constexpr evaluates at compile time. All variables are typed." },

    // =========================================================================
    // Function definition
    // =========================================================================
    { id: "fn-rust", languageId: "rust", topic: "Function definition", title: "fn with explicit types", code: `fn add(a: i32, b: i32) -> i32 {
    a + b  // implicit return for expressions
}

fn greet(name: &str) {
    println!("Hello, {}", name);
}`, explanation: "Functions require parameter types. Return type is optional for unit (). The last expression is returned implicitly." },
    { id: "fn-python", languageId: "python", topic: "Function definition", title: "def with optional type hints", code: `def add(a: int, b: int) -> int:
    return a + b

def greet(name: str) -> None:
    print(f"Hello, {name}")`, explanation: "Functions are defined with def. Type hints are optional and not enforced at runtime. Indentation defines the body." },
    { id: "fn-typescript", languageId: "typescript", topic: "Function definition", title: "Arrow and function declarations", code: `function add(a: number, b: number): number {
    return a + b;
}

const greet = (name: string): void => {
    console.log(\`Hello, \${name}\`);
};`, explanation: "Functions can be declared with function or as arrow expressions. Parameter and return types are enforced at compile time." },
    { id: "fn-java", languageId: "java", topic: "Function definition", title: "Methods with explicit types", code: `int add(int a, int b) {
    return a + b;
}

void greet(String name) {
    System.out.println("Hello, " + name);
}`, explanation: "All functions are methods (inside classes). Parameter and return types are always required." },
    { id: "fn-kotlin", languageId: "kotlin", topic: "Function definition", title: "fun with expression bodies", code: `fun add(a: Int, b: Int): Int = a + b

fun greet(name: String) {
    println("Hello, $name")
}`, explanation: "Functions use fun. Expression bodies (single expression with =) infer the return type. Block bodies need explicit types." },
    { id: "fn-go", languageId: "go", topic: "Function definition", title: "func with explicit types", code: `func add(a int, b int) int {
    return a + b
}

func greet(name string) {
    fmt.Printf("Hello, %s", name)
}`, explanation: "Functions use func. Types come after parameter names. Multiple return values are common (value, error)." },
    { id: "fn-csharp", languageId: "csharp", topic: "Function definition", title: "Methods with expression bodies", code: `int Add(int a, int b) => a + b;

void Greet(string name) {
    Console.WriteLine($"Hello, {name}");
}`, explanation: "Methods use expression bodies (=>) for single expressions. Types are always required for parameters." },
    { id: "fn-cpp", languageId: "cpp", topic: "Function definition", title: "Typed functions with auto return", code: `int add(int a, int b) {
    return a + b;
}

auto greet(const std::string& name) -> void {
    std::cout << "Hello, " << name;
}`, explanation: "Functions require types. auto can be used for return type deduction. References are often passed to avoid copies." },

    // =========================================================================
    // Control flow
    // =========================================================================
    { id: "flow-rust", languageId: "rust", topic: "Control flow", title: "if/else as expressions", code: `let level = if score > 90 {
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
}`, explanation: "if/else is an expression that returns a value. match handles all patterns with exhaustiveness checking." },
    { id: "flow-python", languageId: "python", topic: "Control flow", title: "if/elif/else and match", code: `if score > 90:
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
        print("negative")`, explanation: "if/elif/else is a statement, not an expression. match (3.10+) supports structural pattern matching." },
    { id: "flow-typescript", languageId: "typescript", topic: "Control flow", title: "if/else and switch", code: `const level = score > 90 ? "A"
    : score > 70 ? "B"
    : "C";

switch (value) {
    case 0: console.log("zero"); break;
    default: console.log("other"); break;
}`, explanation: "The ternary operator is the closest thing to expression-based if. switch is statement-based and requires break." },
    { id: "flow-java", languageId: "java", topic: "Control flow", title: "if/else and switch expressions", code: `String level = score > 90 ? "A"
    : score > 70 ? "B"
    : "C";

// Switch expression (Java 14+)
String result = switch (value) {
    case 0 -> "zero";
    default -> "other";
};`, explanation: "Switch expressions (Java 14+) return values. Traditional switch statements require break." },
    { id: "flow-kotlin", languageId: "kotlin", topic: "Control flow", title: "when as an expression", code: `val level = when {
    score > 90 -> "A"
    score > 70 -> "B"
    else -> "C"
}

when (value) {
    0 -> println("zero")
    in 1..10 -> println("small")
    else -> println("other")
}`, explanation: "when is Kotlin's answer to switch/match. It works as an expression and supports arbitrary conditions." },
    { id: "flow-go", languageId: "go", topic: "Control flow", title: "if/else — no ternary operator", code: `var level string
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
}`, explanation: "Go has no ternary operator. switch does not need break (it breaks automatically)." },
    { id: "flow-csharp", languageId: "csharp", topic: "Control flow", title: "switch expressions and patterns", code: `var level = score > 90 ? "A"
    : score > 70 ? "B"
    : "C";

// Switch expression
var result = value switch
{
    0 => "zero",
    > 0 => "positive",
    _ => "negative"
};`, explanation: "C# switch expressions (C# 8+) return values and support relational patterns. The ternary operator handles simple cases." },
    { id: "flow-cpp", languageId: "cpp", topic: "Control flow", title: "if/else and switch", code: `std::string level = score > 90 ? "A"
    : score > 70 ? "B"
    : "C";

switch (value) {
    case 0: std::cout << "zero"; break;
    default: std::cout << "other"; break;
}`, explanation: "The ternary operator returns values. switch is statement-based and requires break to prevent fall-through." },

    // =========================================================================
    // Loop constructs
    // =========================================================================
    { id: "loop-rust", languageId: "rust", topic: "Loop constructs", title: "loop, while, for..in", code: `// Infinite loop with break value
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
}`, explanation: "loop runs forever until break. while checks a condition. for..in iterates over anything implementing Iterator." },
    { id: "loop-python", languageId: "python", topic: "Loop constructs", title: "for and while with comprehensions", code: `for item in collection:
    ...

while condition:
    ...

# comprehension replaces many loops
results = [transform(x) for x in collection if predicate(x)]`, explanation: "for iterates over any iterable. Comprehensions replace many loop patterns. while checks a condition." },
    { id: "loop-typescript", languageId: "typescript", topic: "Loop constructs", title: "for, for..of, while", code: `for (const item of collection) {
    // ...
}

for (let i = 0; i < n; i++) {
    // ...
}

while (condition) {
    // ...
}`, explanation: "for..of iterates over iterables. Traditional for with index is still common. while checks a condition." },
    { id: "loop-java", languageId: "java", topic: "Loop constructs", title: "for, for-each, while", code: `for (var item : collection) {
    // ...
}

for (int i = 0; i < n; i++) {
    // ...
}

while (condition) {
    // ...
}`, explanation: "The enhanced for loop iterates over collections and arrays. Traditional for and while are also available." },
    { id: "loop-kotlin", languageId: "kotlin", topic: "Loop constructs", title: "for..in and while", code: `for (item in collection) {
    // ...
}

for (i in 0 until n) {
    // ...
}

while (condition) {
    // ...
}`, explanation: "for..in iterates over ranges and iterables. Ranges (0 until n) replace traditional index loops." },
    { id: "loop-go", languageId: "go", topic: "Loop constructs", title: "for is the only loop", code: `for _, item := range collection {
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
}`, explanation: "Go has only one loop keyword: for. It handles for-each (range), C-style, while, and infinite loops." },
    { id: "loop-csharp", languageId: "csharp", topic: "Loop constructs", title: "for, foreach, while", code: `foreach (var item in collection) {
    // ...
}

for (int i = 0; i < n; i++) {
    // ...
}

while (condition) {
    // ...
}`, explanation: "foreach iterates over IEnumerable. Traditional for and while are also available." },
    { id: "loop-cpp", languageId: "cpp", topic: "Loop constructs", title: "for, range-based for, while", code: `for (const auto& item : collection) {
    // ...
}

for (int i = 0; i < n; ++i) {
    // ...
}

while (condition) {
    // ...
}`, explanation: "Range-based for (C++11) iterates over containers. Traditional for and while are also available." },

    // =========================================================================
    // Module system
    // =========================================================================
    { id: "mod-rust", languageId: "rust", topic: "Module system", title: "mod and use with visibility", code: `// mod.rs or <name>.rs defines a module
pub fn exported() { ... }
fn private() { ... }

// Consuming
use crate::module::exported;
use std::collections::HashMap;`, explanation: "Modules are defined by file structure. pub controls visibility. use brings items into scope." },
    { id: "mod-python", languageId: "python", topic: "Module system", title: "import with __init__.py packages", code: `# module.py
def exported():
    ...

# consuming
from package.module import exported
import numpy as np`, explanation: "Files are modules, directories with __init__.py are packages. import brings names into scope." },
    { id: "mod-typescript", languageId: "typescript", topic: "Module system", title: "ES module import/export", code: `// module.ts
export function exported() { ... }

// consuming
import { exported } from "./module.ts";
import * as mod from "./module.ts";`, explanation: "TypeScript uses ES modules. Named and default exports. Import paths are resolved by the bundler." },
    { id: "mod-java", languageId: "java", topic: "Module system", title: "Packages and imports", code: `// package declaration at top of file
package com.example.module;

public class MyClass { ... }

// consuming
import com.example.module.MyClass;`, explanation: "Packages are defined by directory structure. import brings classes into scope. Visibility is controlled by public/private/protected." },
    { id: "mod-kotlin", languageId: "kotlin", topic: "Module system", title: "Packages and imports", code: `// package declaration at top of file
package com.example.module

fun exported() { ... }

// consuming
import com.example.module.exported`, explanation: "Kotlin uses the same package system as Java. top-level functions and properties can be imported directly." },
    { id: "mod-go", languageId: "go", topic: "Module system", title: "Packages with capitalised exports", code: `// package declaration at top of file
package mypackage

func Exported() { ... }  // capitalised = exported
func private() { ... }   // lowercase = unexported

// consuming
import "github.com/user/mypackage"`, explanation: "Visibility is controlled by capitalisation. Capitalised names are exported, lowercase names are not." },
    { id: "mod-csharp", languageId: "csharp", topic: "Module system", title: "Namespaces and using", code: `namespace MyNamespace {
    public class MyClass { ... }
}

// consuming
using MyNamespace;`, explanation: "Namespaces organise types. using brings them into scope. Visibility is controlled by public/private/internal." },
    { id: "mod-cpp", languageId: "cpp", topic: "Module system", title: "Headers and include (or C++20 modules)", code: `// header file (traditional)
#pragma once
void exported();

// consuming
#include "myheader.h"

// C++20 modules (modern)
export module mymodule;
export void exported();`, explanation: "Traditional C++ uses header files and #include. C++20 introduces modules with export/import." },

    // =========================================================================
    // Type definitions
    // =========================================================================
    { id: "type-rust", languageId: "rust", topic: "Type definitions", title: "struct, enum, type alias", code: `struct User {
    name: String,
    age: u32,
}

enum Status {
    Active,
    Inactive,
}

type Point = (i32, i32);  // type alias`, explanation: "struct defines record types. enum defines sum types. type creates aliases. All fields have explicit types." },
    { id: "type-python", languageId: "python", topic: "Type definitions", title: "Classes and type aliases", code: `from dataclasses import dataclass

@dataclass
class User:
    name: str
    age: int

class Status:
    ACTIVE = "active"
    INACTIVE = "inactive"

type Point = tuple[int, int]  # Python 3.12+`, explanation: "Classes define types. dataclasses reduce boilerplate. Type aliases (3.12+) name existing types." },
    { id: "type-typescript", languageId: "typescript", topic: "Type definitions", title: "interface, type, enum", code: `interface User {
    name: string;
    age: number;
}

type Status = "active" | "inactive";

type Point = [number, number];`, explanation: "interface defines object shapes. type creates aliases, unions, and tuples. string literal unions replace enums." },
    { id: "type-java", languageId: "java", topic: "Type definitions", title: "Classes, interfaces, enums", code: `record User(String name, int age) {}

enum Status { ACTIVE, INACTIVE }

// or traditional class
class User {
    private final String name;
    private final int age;
    // constructor, getters...
}`, explanation: "Classes define types. Records (Java 16+) reduce boilerplate. Enums define a closed set of values." },
    { id: "type-kotlin", languageId: "kotlin", topic: "Type definitions", title: "data class, sealed class, typealias", code: `data class User(val name: String, val age: Int)

sealed class Status {
    object Active : Status()
    object Inactive : Status()
}

typealias Point = Pair<Int, Int>`, explanation: "data class defines record types. sealed class defines closed hierarchies. typealias creates aliases." },
    { id: "type-go", languageId: "go", topic: "Type definitions", title: "struct and interface", code: `type User struct {
    Name string
    Age  int
}

type Status int

const (
    Active Status = iota
    Inactive
)

type Point = [2]int  // type alias`, explanation: "struct defines record types. iota generates enum-like constants. Type aliases use =, new types do not." },
    { id: "type-csharp", languageId: "csharp", topic: "Type definitions", title: "class, record, enum", code: `record User(string Name, int Age);

enum Status { Active, Inactive }

// or traditional class
class User {
    public string Name { get; }
    public int Age { get; }
}`, explanation: "Records (C# 9+) define immutable data types. Classes are the traditional reference type. Enums define named constants." },
    { id: "type-cpp", languageId: "cpp", topic: "Type definitions", title: "struct, class, enum, using", code: `struct User {
    std::string name;
    int age;
};

enum class Status { Active, Inactive };

using Point = std::pair<int, int>;`, explanation: "struct and class define types (default visibility differs). enum class is scoped. using creates type aliases." },
] as const;
