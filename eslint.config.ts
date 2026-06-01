import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import eslintPluginPrettier from "eslint-plugin-prettier";
import { defineConfig, globalIgnores } from "eslint/config";
import type { Rule } from "eslint";

// ---------------------------------------------------------------------------
// Custom rule: no-pointless-reassignments
//
// Bans const x = y aliases where no transformation occurs. Autofix replaces
// all reads of the alias with the original name and removes the declaration.
// ---------------------------------------------------------------------------

const noPointlessReassignments: Rule.RuleModule = {
    meta: {
        type: "problem",
        fixable: "code",
        messages: {
            pointlessReassignment:
                "Pointless reassignment: '{{ name }}' is just an alias for '{{ value }}'. Use the original directly.",
        },
        docs: {
            description:
                "Bans const x = y aliases where no transformation occurs — use the original identifier directly.",
        },
    },
    create(context) {
        return {
            VariableDeclarator(node) {
                if (
                    node.id.type !== "Identifier" ||
                    node.init?.type !== "Identifier" ||
                    node.id.name.startsWith("_")
                ) {
                    return;
                }

                if (
                    node.parent.type !== "VariableDeclaration" ||
                    node.parent.kind !== "const"
                ) {
                    return;
                }

                const aliasName = node.id.name;
                const originalName = node.init.name;

                context.report({
                    node,
                    messageId: "pointlessReassignment",
                    data: { name: aliasName, value: originalName },
                    fix(fixer) {
                        const scope = context.sourceCode.getScope(node);
                        const variable = scope.set.get(aliasName);
                        if (!variable) return null;

                        const mutationRefs = variable.references.filter(
                            (r) => r.isWrite() && r.identifier !== node.id
                        );
                        if (mutationRefs.length > 0) return null;

                        const readRefs = variable.references.filter((r) =>
                            r.isRead()
                        );

                        const hasShorthand = readRefs.some((r) => {
                            if (r.identifier.type !== "Identifier")
                                return false;
                            const afterToken = context.sourceCode.getTokenAfter(
                                r.identifier
                            );
                            if (afterToken?.value === ":") return false;
                            if (
                                afterToken?.value !== "}" &&
                                afterToken?.value !== ","
                            )
                                return false;
                            let tok = context.sourceCode.getTokenBefore(
                                r.identifier
                            );
                            while (tok) {
                                if (tok.value === "{") return true;
                                if (tok.value === "[" || tok.value === "(")
                                    return false;
                                if (tok.value === ":") return false;
                                tok = context.sourceCode.getTokenBefore(tok);
                            }
                            return false;
                        });
                        if (hasShorthand) return null;

                        const fixes = readRefs.map((r) =>
                            fixer.replaceText(r.identifier, originalName)
                        );

                        const declaration = node.parent;
                        if (
                            declaration.type !== "VariableDeclaration" ||
                            declaration.declarations.length !== 1
                        ) {
                            return null;
                        }
                        fixes.push(fixer.remove(declaration));
                        return fixes;
                    },
                });
            },
        };
    },
};

// ---------------------------------------------------------------------------
// Custom rule: no-barrel-files
//
// Bans index.ts / index.tsx files. Every module should be imported directly
// by its own name, not re-exported through a barrel.
// ---------------------------------------------------------------------------

const noBarrelFiles: Rule.RuleModule = {
    meta: {
        type: "problem",
        messages: {
            noBarrelFile:
                "Barrel files (index.ts/index.tsx) are banned. Every module should be imported directly by its name, not re-exported through a barrel.",
        },
        docs: {
            description:
                "Bans barrel files (index.ts / index.tsx) — every module is imported directly.",
        },
    },
    create(context) {
        const filename = context.filename;
        const basename = filename.split("/").pop() ?? "";
        if (basename !== "index.ts" && basename !== "index.tsx") return {};

        return {
            Program(node) {
                context.report({ node, messageId: "noBarrelFile" });
            },
        };
    },
};

// ---------------------------------------------------------------------------
// Custom rule: no-re-exports
//
// Bans re-exports (export ... from) in non-index files. Import directly from
// the source module instead. Autofix removes the re-export statement.
// ---------------------------------------------------------------------------

const noReExports: Rule.RuleModule = {
    meta: {
        type: "problem",
        fixable: "code",
        messages: {
            noReExport:
                "Re-exports (export ... from) are banned. Import directly from the source module instead.",
        },
        docs: {
            description:
                "Bans re-exports in non-index files — every module should be imported directly from its source.",
        },
    },
    create(context) {
        const filename = context.filename;
        const basename = filename.split("/").pop() ?? "";
        const isIndex = /^(?:index\.[cm]?[jt]sx?)$/.test(basename);

        if (isIndex) return {};

        function removeStatement(
            fixer: Rule.RuleFixer,
            node: Rule.Node
        ): Rule.Fix | null {
            const source = context.sourceCode;
            const statement = node.parent;
            if (statement === null) return null;
            // Walk up to the export declaration or module declaration
            let target: Rule.Node = statement;
            while (target.parent !== null && target.parent.type !== "Program") {
                target = target.parent;
            }
            if (target.parent?.type !== "Program") return null;
            if (target.range === undefined) return null;

            // Remove from the start of the line to capture leading whitespace/newlines
            const prevToken = source.getTokenBefore(target, {
                includeComments: false,
            });
            const start = prevToken ? prevToken.range[1] : target.range[0];
            // Eat trailing newline
            const textAfter = source.text.slice(target.range[1]);
            const nlMatch = textAfter.match(/^(\r?\n)?/);
            const end = target.range[1] + (nlMatch ? nlMatch[0].length : 0);

            // Don't leave behind blank lines — remove whitespace between
            // the previous token's end and the next token's start.
            const nextToken = source.getTokenAfter(target, {
                includeComments: false,
            });
            const removeEnd = nextToken
                ? Math.min(end, nextToken.range[0])
                : end;

            return fixer.removeRange([start, removeEnd]);
        }

        return {
            ExportNamedDeclaration(node) {
                if (node.source) {
                    context.report({
                        node,
                        messageId: "noReExport",
                        fix(fixer) {
                            return removeStatement(fixer, node);
                        },
                    });
                }
            },
            ExportAllDeclaration(node) {
                context.report({
                    node,
                    messageId: "noReExport",
                    fix(fixer) {
                        return removeStatement(fixer, node);
                    },
                });
            },
        };
    },
};

// ---------------------------------------------------------------------------
// Custom rule: no-dynamic-imports
//
// Bans dynamic import() expressions. Use static imports instead.
// ---------------------------------------------------------------------------

const noDynamicImports: Rule.RuleModule = {
    meta: {
        type: "problem",
        messages: {
            noDynamicImport:
                "Dynamic imports are forbidden — use static imports instead.",
        },
        docs: {
            description:
                "Bans dynamic import() expressions — every module dependency should be a static import.",
        },
    },
    create(context) {
        return {
            ImportExpression(node) {
                context.report({
                    node,
                    messageId: "noDynamicImport",
                });
            },
        };
    },
};

export default defineConfig(
    globalIgnores(["dist"]),
    {
        files: ["**/*.{ts,tsx}"],
        extends: [
            js.configs.recommended,
            ...tseslint.configs.recommended,
            ...tseslint.configs.strictTypeChecked,
            reactHooks.configs.flat.recommended,
            reactRefresh.configs.vite,
        ],
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            prettier: eslintPluginPrettier,
            custom: {
                rules: {
                    "no-pointless-reassignments": noPointlessReassignments,
                    "no-barrel-files": noBarrelFiles,
                    "no-re-exports": noReExports,
                    "no-dynamic-imports": noDynamicImports,
                },
            },
        },
        rules: {
            "prettier/prettier": "error",
            "@typescript-eslint/consistent-type-assertions": [
                "error",
                { assertionStyle: "never" },
            ],
            "custom/no-pointless-reassignments": "error",
            "custom/no-barrel-files": "error",
            "custom/no-re-exports": "error",
            "custom/no-dynamic-imports": "error",
        },
    },
    eslintConfigPrettier
);
