import { PlayCircle, XCircle, Loader } from "lucide-react";
import { vars } from "../theme/theme.css.ts";
import {
    outputPanel,
    outputHeader,
    outputPre,
    clearButton,
    spin,
} from "../theme/styles.css.ts";
import type { CompileResult } from "../compiler/types.ts";

interface CompileOutputProps {
    readonly result: CompileResult | null;
    readonly compiling: boolean;
    onClear: () => void;
}

/**
 * Hard cap on how many characters of a single output stream are rendered. The
 * Playground can return arbitrarily large stdout/stderr (e.g. a program in a
 * tight println loop, or a wall of compiler errors); rendering all of it into a
 * single <pre> can lock the main thread. Truncate to this many characters and
 * tell the reader the output was cut, rather than silently dropping the tail.
 */
const MAX_OUTPUT_CHARS = 20000;

/** Cap a stream at {@link MAX_OUTPUT_CHARS}, flagging whether it was cut. */
function capOutput(content: string): {
    readonly text: string;
    readonly truncated: boolean;
} {
    if (content.length <= MAX_OUTPUT_CHARS) {
        return { text: content, truncated: false };
    }
    return { text: content.slice(0, MAX_OUTPUT_CHARS), truncated: true };
}

function OutputSection({
    label,
    content,
    colour,
}: {
    readonly label: string;
    readonly content: string;
    readonly colour: string;
}) {
    if (content.trim() === "") return null;
    const { text, truncated } = capOutput(content);
    return (
        <div>
            <div
                style={{
                    padding: "0.375rem 0.75rem",
                    fontSize: "0.6875rem",
                    fontFamily: "ui-monospace, monospace",
                    color: vars.colour.faint,
                    borderBottom: `1px solid ${vars.colour.borderSoft}`,
                }}
            >
                {label}
            </div>
            <pre className={outputPre} style={{ color: colour }}>
                {text}
                {truncated ? "\n\n(output truncated)" : null}
            </pre>
        </div>
    );
}

export function CompileOutput({
    result,
    compiling,
    onClear,
}: CompileOutputProps) {
    if (!compiling && result === null) return null;

    return (
        <div className={outputPanel}>
            <div className={outputHeader}>
                <span
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.375rem",
                    }}
                >
                    {compiling ? (
                        <>
                            <Loader size={13} className={spin} /> Compiling…
                        </>
                    ) : result?.success ? (
                        <>
                            <PlayCircle
                                size={13}
                                style={{ color: vars.colour.good }}
                            />{" "}
                            Ran successfully
                        </>
                    ) : (
                        <>
                            <XCircle
                                size={13}
                                style={{ color: vars.colour.bad }}
                            />{" "}
                            Compilation failed
                        </>
                    )}
                </span>
                {!compiling ? (
                    <button className={clearButton} onClick={onClear}>
                        Dismiss
                    </button>
                ) : null}
            </div>
            {result ? (
                <>
                    <OutputSection
                        label="stderr"
                        content={result.stderr}
                        colour={vars.colour.dim}
                    />
                    <OutputSection
                        label="stdout"
                        content={result.stdout}
                        colour={vars.colour.text}
                    />
                    <div
                        style={{
                            padding: "0.375rem 0.75rem",
                            fontSize: "0.65rem",
                            fontFamily: "ui-monospace, monospace",
                            color: vars.colour.faint,
                            borderTop: `1px solid ${vars.colour.borderSoft}`,
                        }}
                    >
                        Powered by{" "}
                        <a
                            href="https://play.rust-lang.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: vars.colour.faint }}
                        >
                            Rust Playground
                        </a>
                    </div>
                </>
            ) : null}
        </div>
    );
}
