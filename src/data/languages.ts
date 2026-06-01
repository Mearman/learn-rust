import type { Language } from "./types.ts";

export const LANGUAGES = [
    {
        id: "rust",
        name: "Rust",
        paradigm: ["multi-paradigm", "functional", "imperative"],
        typeSystem: "static, nominal, affine",
        runtimeModel: "no GC, deterministic destruction via ownership",
    },
    {
        id: "python",
        name: "Python",
        paradigm: [
            "multi-paradigm",
            "object-oriented",
            "imperative",
            "functional",
        ],
        typeSystem: "dynamic, duck-typed",
        runtimeModel: "reference counting + cycle collector GC",
    },
    {
        id: "typescript",
        name: "TypeScript",
        paradigm: ["multi-paradigm", "object-oriented", "functional"],
        typeSystem: "static (gradual), structural",
        runtimeModel: "tracing GC (V8 / JS engine)",
    },
    {
        id: "java",
        name: "Java",
        paradigm: ["object-oriented", "imperative"],
        typeSystem: "static, nominal",
        runtimeModel: "tracing GC (JVM)",
    },
    {
        id: "kotlin",
        name: "Kotlin",
        paradigm: ["multi-paradigm", "object-oriented", "functional"],
        typeSystem: "static, nominal (JVM), gradual (JS/native)",
        runtimeModel: "tracing GC (JVM / JS engine)",
    },
    {
        id: "go",
        name: "Go",
        paradigm: ["imperative", "concurrent"],
        typeSystem: "static, structural",
        runtimeModel: "tracing GC",
    },
    {
        id: "csharp",
        name: "C#",
        paradigm: ["multi-paradigm", "object-oriented", "functional"],
        typeSystem: "static, nominal",
        runtimeModel: "tracing GC (CLR)",
    },
    {
        id: "cpp",
        name: "C++",
        paradigm: [
            "multi-paradigm",
            "procedural",
            "object-oriented",
            "generic",
        ],
        typeSystem: "static, nominal",
        runtimeModel: "manual memory management, RAII",
    },
] as const satisfies readonly Language[];

export type LanguageId = (typeof LANGUAGES)[number]["id"];

export type LanguageFamiliarity = Exclude<LanguageId, "rust">;

export function languageNameForId(id: LanguageId | string): string {
    const language = LANGUAGES.find((l) => l.id === id);
    if (language === undefined) {
        throw new Error(`Unknown language: ${id}`);
    }
    return language.name;
}

export const TARGET_LANGUAGE_ID = "rust";

export const LANGUAGE_FAMILIARITY_OPTIONS: readonly {
    readonly value: LanguageFamiliarity;
    readonly label: string;
}[] = (
    LANGUAGES.filter(
        (l) => l.id !== "rust"
    ) as readonly ((typeof LANGUAGES)[number] & {
        readonly id: LanguageFamiliarity;
    })[]
).map((l) => ({ value: l.id, label: l.name }));

export function joinLanguageFamiliarities(
    familiarities: readonly LanguageFamiliarity[]
): string {
    if (familiarities.length === 0) return "not set";
    return new Intl.ListFormat("en-GB", {
        style: "long",
        type: "conjunction",
    }).format(familiarities.map(languageNameForId));
}
