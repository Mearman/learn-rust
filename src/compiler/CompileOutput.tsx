import { PlayCircle, XCircle, Loader } from "lucide-react";
import { vars } from "../theme/theme.css.ts";
import {
    outputPanel,
    outputHeader,
    outputPre,
    clearButton,
} from "../theme/styles.css.ts";
import type { CompileResult } from "../compiler/types.ts";

interface CompileOutputProps {
    readonly result: CompileResult | null;
    readonly compiling: boolean;
    onClear: () => void;
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
                {content}
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
                            <Loader
                                size={13}
                                style={{ animation: "spin 1s linear infinite" }}
                            />{" "}
                            Compiling…
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
                </>
            ) : null}
        </div>
    );
}
