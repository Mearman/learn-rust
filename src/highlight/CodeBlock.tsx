import { useMemo } from "react";
import { vars } from "../theme/theme.css.ts";
import {
    codeBlock,
    codeHeader,
    codeDot,
    codePre,
    tokenCommentOrLifetime,
    runButton,
} from "../theme/styles.css.ts";
import { PlayCircle } from "lucide-react";
import type { TokenClass } from "./tokenize.ts";
import { tokenize } from "./tokenize.ts";

const tokenColour: Record<TokenClass, string> = {
    default: vars.tok.default,
    comment: vars.tok.comment,
    docComment: vars.tok.docComment,
    string: vars.tok.string,
    lifetime: vars.tok.lifetime,
    macro: vars.tok.macro,
    keyword: vars.tok.keyword,
    type: vars.tok.type,
    number: vars.tok.number,
    attribute: vars.tok.attribute,
};

interface CodeBlockProps {
    readonly code: string;
    readonly label?: string;
    readonly onRun?: () => void;
    readonly compiling?: boolean;
}

export function CodeBlock({ code, label, onRun, compiling }: CodeBlockProps) {
    const tokens = useMemo(() => tokenize(code), [code]);
    return (
        <div className={codeBlock}>
            {label ? (
                <div className={codeHeader}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            flex: 1,
                        }}
                    >
                        <span className={codeDot} />
                        <span className={codeDot} />
                        <span className={codeDot} />
                        <span style={{ marginLeft: "0.25rem" }}>{label}</span>
                    </div>
                    {onRun ? (
                        <button
                            className={runButton}
                            onClick={onRun}
                            disabled={compiling}
                        >
                            <PlayCircle size={13} />
                            {compiling ? "Running…" : "Run"}
                        </button>
                    ) : null}
                </div>
            ) : null}
            <pre className={codePre}>
                <code style={{ fontFamily: "ui-monospace, monospace" }}>
                    {tokens.map((tk, i) => (
                        <span
                            key={i}
                            className={
                                tk.c === "comment" ||
                                tk.c === "docComment" ||
                                tk.c === "lifetime"
                                    ? tokenCommentOrLifetime
                                    : undefined
                            }
                            style={{ color: tokenColour[tk.c] }}
                        >
                            {tk.t}
                        </span>
                    ))}
                </code>
            </pre>
        </div>
    );
}
