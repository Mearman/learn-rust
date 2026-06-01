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
                            (r) => r.isWrite() && r.identifier !== node.id,
                        );
                        if (mutationRefs.length > 0) return null;

                        const readRefs = variable.references.filter((r) =>
                            r.isRead(),
                        );

                        const hasShorthand = readRefs.some((r) => {
                            const afterToken = context.sourceCode.getTokenAfter(
                                r.identifier,
                            );
                            if (afterToken?.value === ":") return false;
                            if (
                                afterToken?.value !== "}" &&
                                afterToken?.value !== ","
                            )
                                return false;
                            let tok = context.sourceCode.getTokenBefore(
                                r.identifier,
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
                            fixer.replaceText(r.identifier, originalName),
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
                projectService: {
                    allowDefaultProject: [
                        "commitlint.config.ts",
                        "eslint.config.ts",
                        "lint-staged.config.ts",
                        "prettier.config.ts",
                        "vite.config.ts",
                        "vitest.config.ts",
                    ],
                },
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            prettier: eslintPluginPrettier,
            custom: {
                rules: {
                    "no-pointless-reassignments": noPointlessReassignments,
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
        },
    },
    eslintConfigPrettier,
);
