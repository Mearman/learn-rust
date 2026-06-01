import { Lightbulb } from "lucide-react";
import { CodeBlock } from "../highlight/CodeBlock.tsx";
import { vars } from "../theme/theme.css.ts";
import {
    noteBlock,
    analogyBlock,
    textBlock,
    accentLabel,
} from "../theme/styles.css.ts";
import type { LessonBlock } from "./lessons.ts";

interface BlockProps {
    readonly block: LessonBlock;
}

export function Block({ block }: BlockProps) {
    if (block.kind === "code") return <CodeBlock code={block.code} label={block.label} />;
    if (block.kind === "note") {
        return (
            <div className={noteBlock}>
                <Lightbulb size={16} style={{ color: vars.colour.accent, flexShrink: 0, marginTop: 2 }} />
                <span>{block.text}</span>
            </div>
        );
    }
    if (block.kind === "analogy") {
        return (
            <div className={analogyBlock}>
                <span className={accentLabel}>If you come from TS / C++ &nbsp;</span>
                {block.text}
            </div>
        );
    }
    return <p className={textBlock}>{block.text}</p>;
}
