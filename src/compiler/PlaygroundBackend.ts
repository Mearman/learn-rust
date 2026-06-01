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
        if (!("success" in raw) || !("stdout" in raw) || !("stderr" in raw)) {
            return {
                success: false,
                stdout: "",
                stderr: "Invalid response from Rust Playground.",
                exitDetail: "",
            };
        }
        if (
            typeof raw.success !== "boolean" ||
            typeof raw.stdout !== "string" ||
            typeof raw.stderr !== "string"
        ) {
            return {
                success: false,
                stdout: "",
                stderr: "Invalid response from Rust Playground.",
                exitDetail: "",
            };
        }
        return {
            success: raw.success,
            stdout: raw.stdout,
            stderr: raw.stderr,
            exitDetail:
                "exitDetail" in raw && typeof raw.exitDetail === "string"
                    ? raw.exitDetail
                    : "",
        };
    }
}
