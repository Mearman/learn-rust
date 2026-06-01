import { describe, it } from "vitest";
import { RuleTester } from "eslint";
import parser from "@typescript-eslint/parser";
import { noReExports } from "./no-re-exports.ts";

// The no-re-exports rule bans `export ... from` in non-index files.
// It includes an autofix that removes the re-export statement.

describe("no-re-exports", () => {
    const tester = new RuleTester({
        languageOptions: { parser },
    });

    it("passes valid cases", () => {
        tester.run("no-re-exports", noReExports, {
            valid: [
                {
                    // Normal named export — not a re-export.
                    filename: "/src/foo.ts",
                    code: "export const x = 1;",
                },
                {
                    // Export of a locally declared function.
                    filename: "/src/utils.ts",
                    code: "export function helper() {}",
                },
                {
                    // A plain import (not a re-export) is fine.
                    filename: "/src/bar.ts",
                    code: "import { foo } from './foo.ts';",
                },
                {
                    // Re-exports are allowed in index files (the barrel-files
                    // rule handles those separately).
                    filename: "/src/index.ts",
                    code: "export { foo } from './foo.ts';",
                },
                {
                    filename: "/src/index.tsx",
                    code: "export * from './components.tsx';",
                },
                {
                    // export type without `from` is a local type-only export.
                    filename: "/src/types.ts",
                    code: "export type Foo = { bar: string };",
                },
            ],
            invalid: [],
        });
    });

    it("flags ExportNamedDeclaration with a source", () => {
        tester.run("no-re-exports", noReExports, {
            valid: [],
            invalid: [
                {
                    filename: "/src/foo.ts",
                    code: "export { bar } from './bar.ts';",
                    errors: [{ messageId: "noReExport" }],
                    // Autofix removes the entire statement.
                    output: "",
                },
                {
                    filename: "/src/foo.ts",
                    code: "export type { Bar } from './bar.ts';",
                    errors: [{ messageId: "noReExport" }],
                    output: "",
                },
                {
                    // Re-export appearing after another statement: the fix
                    // removes the re-export line but leaves the other content.
                    filename: "/src/foo.ts",
                    code: "const x = 1;\nexport { bar } from './bar.ts';",
                    errors: [{ messageId: "noReExport" }],
                    output: "const x = 1;",
                },
            ],
        });
    });

    it("flags ExportAllDeclaration", () => {
        tester.run("no-re-exports", noReExports, {
            valid: [],
            invalid: [
                {
                    filename: "/src/foo.ts",
                    code: "export * from './bar.ts';",
                    errors: [{ messageId: "noReExport" }],
                    output: "",
                },
                {
                    filename: "/src/foo.ts",
                    code: "export * as ns from './bar.ts';",
                    errors: [{ messageId: "noReExport" }],
                    output: "",
                },
            ],
        });
    });

    it("flags multiple re-exports in one file", () => {
        tester.run("no-re-exports", noReExports, {
            valid: [],
            invalid: [
                {
                    filename: "/src/foo.ts",
                    code: "export { a } from './a.ts';\nexport { b } from './b.ts';",
                    errors: [
                        { messageId: "noReExport" },
                        { messageId: "noReExport" },
                    ],
                    // ESLint applies non-conflicting fixes in one pass. The
                    // two removes overlap (first fix eats the newline that
                    // separates them), so ESLint applies only the first fix
                    // in a single pass, leaving the second line.
                    output: "export { b } from './b.ts';",
                },
            ],
        });
    });
});
