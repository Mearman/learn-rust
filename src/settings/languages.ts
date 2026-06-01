import type { LanguageFamiliarity } from "./types.ts";

export const LANGUAGE_FAMILIARITY_OPTIONS = [
    { value: "none", label: "Skip for now" },
    { value: "python", label: "Python" },
    { value: "typescript", label: "TypeScript" },
    { value: "java", label: "Java" },
    { value: "kotlin", label: "Kotlin" },
    { value: "go", label: "Go" },
    { value: "csharp", label: "C#" },
    { value: "cpp", label: "C++" },
] as const;

export function languageFamiliarityLabel(
    familiarity: Exclude<LanguageFamiliarity, "none">,
): string {
    if (familiarity === "python") return "Python";
    if (familiarity === "typescript") return "TypeScript";
    if (familiarity === "java") return "Java";
    if (familiarity === "kotlin") return "Kotlin";
    if (familiarity === "go") return "Go";
    if (familiarity === "csharp") return "C#";
    return "C++";
}
