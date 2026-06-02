import { PlayCircle } from "lucide-react";
import { vars } from "../theme/theme.css.ts";
import { runButton } from "../theme/styles.css.ts";

interface EditableCodeProps {
    readonly value: string;
    readonly onChange: (value: string) => void;
    readonly onRun: () => void;
    readonly compiling: boolean;
}

/** Editable code textarea used in fix-mode challenges. Controlled — the edited
 *  text lives in the parent component's state. Monospaced, matches the
 *  CodeBlock visual weight. */
export function EditableCode({
    value,
    onChange,
    onRun,
    compiling,
}: EditableCodeProps) {
    return (
        <div
            style={{
                borderRadius: "0.5rem",
                overflow: "hidden",
                border: `1px solid ${vars.colour.border}`,
                background: vars.colour.code,
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.375rem 0.75rem",
                    fontSize: "0.75rem",
                    fontFamily: "ui-monospace, monospace",
                    borderBottom: `1px solid ${vars.colour.borderSoft}`,
                    color: vars.colour.faint,
                }}
            >
                <span>edit.rs</span>
                <button
                    className={runButton}
                    onClick={onRun}
                    disabled={compiling}
                >
                    <PlayCircle size={13} aria-hidden="true" />
                    {compiling ? "Running…" : "Run"}
                </button>
            </div>
            <textarea
                value={value}
                onChange={(e) => {
                    onChange(e.currentTarget.value);
                }}
                spellCheck={false}
                rows={value.split("\n").length + 1}
                style={{
                    display: "block",
                    width: "100%",
                    padding: "1rem",
                    margin: 0,
                    fontSize: 12,
                    fontFamily: "ui-monospace, monospace",
                    lineHeight: 1.625,
                    color: vars.colour.text,
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    resize: "vertical",
                    overflowX: "auto",
                    boxSizing: "border-box",
                }}
            />
        </div>
    );
}
