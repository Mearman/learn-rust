import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import eslintPluginPrettier from "eslint-plugin-prettier";
import { defineConfig, globalIgnores } from "eslint/config";
import { noPointlessReassignments } from "./eslint-rules/no-pointless-reassignments.ts";
import { noBarrelFiles } from "./eslint-rules/no-barrel-files.ts";
import { noReExports } from "./eslint-rules/no-re-exports.ts";
import { noDynamicImports } from "./eslint-rules/no-dynamic-imports.ts";

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
        },
    },
    eslintConfigPrettier
);
