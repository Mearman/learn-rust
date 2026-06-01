import type { Rule } from "eslint";

// ---------------------------------------------------------------------------
// Custom rule: no-dynamic-imports
//
// Bans dynamic import() expressions. Use static imports instead.
// ---------------------------------------------------------------------------

export const noDynamicImports: Rule.RuleModule = {
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
