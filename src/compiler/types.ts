export interface CompileResult {
    readonly success: boolean;
    readonly stdout: string;
    readonly stderr: string;
    readonly exitDetail: string;
}

export interface CompilerBackend {
    readonly name: string;
    readonly available: boolean;
    compile(code: string): Promise<CompileResult>;
}
