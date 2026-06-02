import { Check } from "lucide-react";
import { CodeBlock } from "../highlight/CodeBlock.tsx";
import { CompileOutput } from "../compiler/CompileOutput.tsx";
import { EditableCode } from "./EditableCode.tsx";
import type { CompileResult } from "../compiler/types.ts";
import {
    fixBody,
    fixSolvedLine,
    actionRow,
    giveUpButton,
} from "./challenge.css.ts";

/** Fix-mode state for a single challenge card. The card owns the state machine;
 *  this editor is the presentational body that renders each state. */
export type FixMode =
    | { readonly kind: "idle" }
    | { readonly kind: "editing"; readonly editedCode: string }
    | { readonly kind: "submitted-incorrect"; readonly editedCode: string }
    | { readonly kind: "solved"; readonly editedCode: string }
    | { readonly kind: "gave-up" };

interface FixModeEditorProps {
    /** The resolved fix-mode state (idle is never passed — the card only renders
     *  this body when fix mode is active). */
    readonly fixMode: FixMode;
    /** Fallback source shown in the editor before any edit is made. */
    readonly originalCode: string;
    readonly compiling: boolean;
    readonly result: CompileResult | null;
    readonly onEditChange: (code: string) => void;
    readonly onRun: () => void;
    readonly onGiveUp: () => void;
    readonly onClear: () => void;
}

/** The editable "fix this code" body. Renders the live editor (with its own
 *  compile/run output) while the reader is working, the give-up control, and —
 *  once solved — the read-only fixed snippet plus the confirming output. */
export function FixModeEditor({
    fixMode,
    originalCode,
    compiling,
    result,
    onEditChange,
    onRun,
    onGiveUp,
    onClear,
}: FixModeEditorProps) {
    return (
        <div className={fixBody}>
            {fixMode.kind === "solved" ? (
                <div className={fixSolvedLine}>
                    <Check size={16} aria-hidden="true" /> Fixed!
                </div>
            ) : null}

            {fixMode.kind !== "gave-up" && fixMode.kind !== "solved" ? (
                <>
                    <EditableCode
                        value={
                            fixMode.kind === "editing" ||
                            fixMode.kind === "submitted-incorrect"
                                ? fixMode.editedCode
                                : originalCode
                        }
                        onChange={onEditChange}
                        onRun={onRun}
                        compiling={compiling}
                    />
                    <CompileOutput
                        result={result}
                        compiling={compiling}
                        onClear={onClear}
                    />
                    <div className={actionRow}>
                        <button onClick={onGiveUp} className={giveUpButton}>
                            Show me the fix
                        </button>
                    </div>
                </>
            ) : null}

            {/* After solving, show the edited code (read-only) and the compile
                output confirming success. */}
            {fixMode.kind === "solved" ? (
                <>
                    <CodeBlock code={fixMode.editedCode} label="your fix" />
                    <CompileOutput
                        result={result}
                        compiling={compiling}
                        onClear={onClear}
                    />
                </>
            ) : null}
        </div>
    );
}
