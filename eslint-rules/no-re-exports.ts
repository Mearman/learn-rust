import type { Rule } from "eslint";

// ---------------------------------------------------------------------------
// Custom rule: no-re-exports
//
// Bans re-exports (export ... from) in non-index files. Import directly from
// the source module instead. Autofix removes the re-export statement.
// ---------------------------------------------------------------------------

export const noReExports: Rule.RuleModule = {
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
            // Walk up from node itself to find the direct child of Program.
            let target: Rule.Node = node;
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
