import { describe, it } from "vitest";
import { RuleTester } from "eslint";
import parser from "@typescript-eslint/parser";
import { noDynamicImports } from "./no-dynamic-imports.ts";

// RuleTester runs synchronously and throws on failure, which vitest will
// catch as a test error.

describe("no-dynamic-imports", () => {
    const tester = new RuleTester({
        languageOptions: { parser },
    });

    it("passes valid cases", () => {
        tester.run("no-dynamic-imports", noDynamicImports, {
            valid: [
                // Static imports are always fine.
                "import foo from 'bar';",
                "import { x } from './x.ts';",
                "import type { T } from './types.ts';",
                // An identifier named `import` used as an object property is
                // not a dynamic import expression.
                "const x = { import: 'value' };",
            ],
            invalid: [],
        });
    });

    it("flags import() expressions", () => {
        tester.run("no-dynamic-imports", noDynamicImports, {
            valid: [],
            invalid: [
                {
                    code: "import('foo');",
                    errors: [{ messageId: "noDynamicImport" }],
                },
                {
                    code: "const m = import('./module.ts');",
                    errors: [{ messageId: "noDynamicImport" }],
                },
                {
                    // Dynamic import inside an async arrow function.
                    code: "const fn = async () => import('./lazy.ts');",
                    errors: [{ messageId: "noDynamicImport" }],
                },
                {
                    // Multiple dynamic imports in one file — each is reported.
                    code: "import('a'); import('b');",
                    errors: [
                        { messageId: "noDynamicImport" },
                        { messageId: "noDynamicImport" },
                    ],
                },
            ],
        });
    });
});
