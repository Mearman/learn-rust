import { useState, useCallback, useRef } from "react";
import type { CompilerBackend, CompileResult } from "./types.ts";
import { PlaygroundBackend } from "./PlaygroundBackend.ts";

interface UseCompiler {
    readonly compiling: boolean;
    readonly result: CompileResult | null;
    readonly compile: (code: string) => Promise<void>;
    readonly clear: () => void;
}

const backend: CompilerBackend = new PlaygroundBackend();

export function useCompiler(): UseCompiler {
    const [compiling, setCompiling] = useState(false);
    const [result, setResult] = useState<CompileResult | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    const compile = useCallback(async (code: string) => {
        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

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
    }, []);

    return { compiling, result, compile, clear };
}
