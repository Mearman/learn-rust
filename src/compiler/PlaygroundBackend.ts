import type { CompilerBackend, CompileResult } from "./types.ts";

interface PlaygroundRequest {
    readonly channel: "stable" | "beta" | "nightly";
    readonly mode: "debug" | "release";
    readonly edition: string;
    readonly crateType: "bin";
    readonly tests: boolean;
    readonly code: string;
    readonly backtrace: boolean;
}

interface PlaygroundResponse {
    readonly success: boolean;
    readonly stdout: string;
    readonly stderr: string;
    readonly exitDetail: string;
}

const ENDPOINT = "https://play.rust-lang.org/execute";

export class PlaygroundBackend implements CompilerBackend {
    readonly name = "Rust Playground";
    readonly available = true;

    async compile(code: string): Promise<CompileResult> {
        // Wrap bare statements in fn main() so fragments compile
        const wrapped = code.includes("fn main")
            ? code
            : `fn main() {\n${code}\n}`;

        const body: PlaygroundRequest = {
            channel: "stable",
            mode: "debug",
            edition: "2021",
            crateType: "bin",
            tests: false,
            code: wrapped,
            backtrace: false,
        };

        const response = await fetch(ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            return {
                success: false,
                stdout: "",
                stderr: `Playground request failed: ${response.status} ${response.statusText}`,
                exitDetail: `HTTP ${response.status}`,
            };
        }

        const data: PlaygroundResponse = await response.json();
        return {
            success: data.success,
            stdout: data.stdout,
            stderr: data.stderr,
            exitDetail: data.exitDetail ?? "",
        };
    }
}
