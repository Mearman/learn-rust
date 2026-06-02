import { useState, useCallback, useRef } from "react";
import type { CompilerBackend, CompileResult } from "./types.ts";
import { PlaygroundBackend } from "./PlaygroundBackend.ts";

interface UseCompiler {
    readonly compiling: boolean;
    readonly result: CompileResult | null;
    /**
     * Identifier of the block whose snippet is currently compiling or last
     * produced `result`, or null when nothing has run. Callers pass a stable
     * per-block id so output renders only under the block that ran it.
     */
    readonly blockId: string | null;
    readonly compile: (code: string, blockId: string) => Promise<void>;
    readonly clear: () => void;
}

const backend: CompilerBackend = new PlaygroundBackend();

export function useCompiler(): UseCompiler {
    const [compiling, setCompiling] = useState(false);
    const [result, setResult] = useState<CompileResult | null>(null);
    const [blockId, setBlockId] = useState<string | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    const compile = useCallback(async (code: string, id: string) => {
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        setBlockId(id);
        setCompiling(true);
        setResult(null);

        try {
            const res = await backend.compile(code);
            if (controller.signal.aborted) return;
            setResult(res);
        } catch (err) {
            if (controller.signal.aborted) return;
            setResult({
                success: false,
                stdout: "",
                stderr: err instanceof Error ? err.message : String(err),
                exitDetail: "Request failed",
            });
        } finally {
            if (!controller.signal.aborted) {
                setCompiling(false);
            }
        }
    }, []);

    const clear = useCallback(() => {
        abortRef.current?.abort();
        setCompiling(false);
        setResult(null);
        setBlockId(null);
    }, []);

    return { compiling, result, blockId, compile, clear };
}
