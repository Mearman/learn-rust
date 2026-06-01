import { describe, it } from "vitest";
import { RuleTester } from "eslint";
import parser from "@typescript-eslint/parser";
import { noBarrelFiles } from "./no-barrel-files.ts";

// The barrel-files rule is filename-driven: it fires on any Program node
// inside a file named index.ts or index.tsx. RuleTester lets us supply a
// synthetic `filename` per test case.

describe("no-barrel-files", () => {
    const tester = new RuleTester({
        languageOptions: { parser },
    });

    it("passes non-index filenames", () => {
        tester.run("no-barrel-files", noBarrelFiles, {
            valid: [
                {
                    filename: "/src/foo.ts",
                    code: "export const x = 1;",
                },
                {
                    filename: "/src/components/Button.tsx",
                    code: "export function Button() {}",
                },
                {
                    // A file whose name contains "index" but is not exactly
                    // index.ts / index.tsx is fine.
                    filename: "/src/reindex.ts",
                    code: "export const x = 1;",
                },
                {
                    filename: "/src/index.css.ts",
                    code: "export const styles = {};",
                },
            ],
            invalid: [],
        });
    });

    it("flags index.ts files", () => {
        tester.run("no-barrel-files", noBarrelFiles, {
            valid: [],
            invalid: [
                {
                    filename: "/src/index.ts",
                    code: "export { foo } from './foo.ts';",
                    errors: [{ messageId: "noBarrelFile" }],
                },
                {
                    // Even an empty index.ts is banned.
                    filename: "/src/utils/index.ts",
                    code: "",
                    errors: [{ messageId: "noBarrelFile" }],
                },
            ],
        });
    });

    it("flags index.tsx files", () => {
        tester.run("no-barrel-files", noBarrelFiles, {
            valid: [],
            invalid: [
                {
                    filename: "/src/index.tsx",
                    code: "export { default as Button } from './Button.tsx';",
                    errors: [{ messageId: "noBarrelFile" }],
                },
            ],
        });
    });
});
