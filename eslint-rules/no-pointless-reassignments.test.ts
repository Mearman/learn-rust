import { describe, it } from "vitest";
import { RuleTester } from "eslint";
import parser from "@typescript-eslint/parser";
import { noPointlessReassignments } from "./no-pointless-reassignments.ts";

// Tests for the no-pointless-reassignments rule.
//
// The rule bans `const x = y` aliases where no transformation occurs. It
// autofixes by replacing all reads of the alias with the original name and
// removing the declaration.

describe("no-pointless-reassignments", () => {
    const tester = new RuleTester({
        languageOptions: { parser },
    });

    it("passes valid cases", () => {
        tester.run("no-pointless-reassignments", noPointlessReassignments, {
            valid: [
                // Transformation present — not a bare alias.
                "const x = y + 1;",
                // Function call — not a bare alias.
                "const x = foo();",
                // let / var — only const is covered.
                "let x = y; console.log(x);",
                "var x = y; console.log(x);",
                // Alias starting with _ is explicitly excluded.
                "const _alias = original; console.log(_alias);",
                // Object destructuring initialiser — not a bare identifier.
                "const { x } = obj;",
                // Array destructuring.
                "const [a] = arr;",
            ],
            invalid: [],
        });
    });

    it("flags a bare const alias and fixes by inlining the original", () => {
        tester.run("no-pointless-reassignments", noPointlessReassignments, {
            valid: [],
            invalid: [
                {
                    // Simple alias with one read. The `fixer.remove` call
                    // removes the declaration token range but not any
                    // adjacent whitespace, so the output retains a leading
                    // space before the next statement.
                    code: "const alias = original; console.log(alias);",
                    errors: [{ messageId: "pointlessReassignment" }],
                    output: " console.log(original);",
                },
                {
                    // Alias read multiple times.
                    code: "const b = a; console.log(b); return b;",
                    errors: [{ messageId: "pointlessReassignment" }],
                    output: " console.log(a); return a;",
                },
                {
                    // Alias that is never read — declaration is still
                    // removed.
                    code: "const alias = original;",
                    errors: [{ messageId: "pointlessReassignment" }],
                    output: "",
                },
            ],
        });
    });

    it("reports the correct name and value in the message", () => {
        tester.run("no-pointless-reassignments", noPointlessReassignments, {
            valid: [],
            invalid: [
                {
                    code: "const x = y;",
                    errors: [
                        {
                            messageId: "pointlessReassignment",
                            data: { name: "x", value: "y" },
                        },
                    ],
                    output: "",
                },
            ],
        });
    });

    it("does not fix when the alias appears in shorthand object notation", () => {
        // `{ alias }` is shorthand for `{ alias: alias }`. Replacing `alias`
        // with `original` would produce `{ original }` which changes the key
        // name — incorrect. The rule reports the violation but declines to fix.
        tester.run("no-pointless-reassignments", noPointlessReassignments, {
            valid: [],
            invalid: [
                {
                    code: "const alias = original; const obj = { alias };",
                    errors: [{ messageId: "pointlessReassignment" }],
                    // null means no fix was applied.
                    output: null,
                },
            ],
        });
    });
});
