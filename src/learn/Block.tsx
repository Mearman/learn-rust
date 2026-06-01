import { Lightbulb } from "lucide-react";
import { CodeBlock } from "../highlight/CodeBlock.tsx";
import { vars } from "../theme/theme.css.ts";
import {
    noteBlock,
    analogyBlock,
    textBlock,
    accentLabel,
} from "../theme/styles.css.ts";
import { CompileOutput } from "../compiler/CompileOutput.tsx";
import type { LessonBlock } from "./lessons.ts";
import type { CompileResult } from "../compiler/types.ts";

interface BlockProps {
    readonly block: LessonBlock;
    readonly compiling?: boolean;
    readonly onRun?: () => void;
    readonly compileResult?: CompileResult | null;
    readonly onClearCompile?: () => void;
}

export function Block({ block, compiling, onRun, compileResult, onClearCompile }: BlockProps) {
    if (block.kind === "code") {
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <CodeBlock code={block.code} label={block.label} onRun={onRun} compiling={compiling} />
                {compileResult !== undefined && compileResult !== null && onClearCompile ? (
                    <CompileOutput result={compileResult} compiling={compiling ?? false} onClear={onClearCompile} />
                ) : null}
            </div>
        );
    }
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
