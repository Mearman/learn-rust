import type { Rule } from "eslint";

// ---------------------------------------------------------------------------
// Custom rule: no-barrel-files
//
// Bans index.ts / index.tsx files. Every module should be imported directly
// by its own name, not re-exported through a barrel.
// ---------------------------------------------------------------------------

export const noBarrelFiles: Rule.RuleModule = {
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
