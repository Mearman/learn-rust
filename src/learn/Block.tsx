import { Lightbulb } from "lucide-react";
import { CodeBlock } from "../highlight/CodeBlock.tsx";
import { C } from "../theme/colours.ts";
import type { LessonBlock } from "./lessons.ts";

interface BlockProps {
    readonly block: LessonBlock;
}

export function Block({ block }: BlockProps) {
    if (block.kind === "code")
        return <CodeBlock code={block.code} label={block.label} />;
    if (block.kind === "note") {
        return (
            <div
                className="rounded-lg p-3 text-sm leading-relaxed flex gap-2.5"
                style={{
                    background: C.panel2,
                    border: `1px solid ${C.borderSoft}`,
                    color: C.dim,
                }}
            >
                <Lightbulb
                    size={16}
                    style={{ color: C.accent, flexShrink: 0, marginTop: 2 }}
                />
                <span>{block.text}</span>
            </div>
        );
    }
    if (block.kind === "analogy") {
        return (
            <div
                className="rounded-lg p-3 text-sm leading-relaxed"
                style={{
                    borderLeft: `3px solid ${C.accentDim}`,
                    background: "transparent",
                    color: C.faint,
                }}
            >
                <span style={{ color: C.accent, fontWeight: 600 }}>
                    If you come from TS / C++ &nbsp;
                </span>
                {block.text}
            </div>
        );
    }
    return (
        <p
            className="leading-relaxed m-0"
            style={{ color: C.text, fontSize: 15 }}
        >
            {block.text}
        </p>
    );
}
