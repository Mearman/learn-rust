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
                stderr: `Playground request failed: ${String(response.status)} ${response.statusText}`,
                exitDetail: `HTTP ${String(response.status)}`,
            };
        }

        const raw: unknown = await response.json();
        if (typeof raw !== "object" || raw === null) {
            return {
                success: false,
                stdout: "",
                stderr: "Invalid response from Rust Playground.",
                exitDetail: "",
            };
        }
        const obj = raw;
        if (!("success" in obj) || !("stdout" in obj) || !("stderr" in obj)) {
            return {
                success: false,
                stdout: "",
                stderr: "Invalid response from Rust Playground.",
                exitDetail: "",
            };
        }
        const data = obj;
        if (
            typeof data.success !== "boolean" ||
            typeof data.stdout !== "string" ||
            typeof data.stderr !== "string"
        ) {
            return {
                success: false,
                stdout: "",
                stderr: "Invalid response from Rust Playground.",
                exitDetail: "",
            };
        }
        return {
            success: data.success,
            stdout: data.stdout,
            stderr: data.stderr,
            exitDetail:
                "exitDetail" in data && typeof data.exitDetail === "string"
                    ? data.exitDetail
                    : "",
        };
    }
}
