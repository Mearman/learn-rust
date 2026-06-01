import { afterEach, describe, expect, it, vi } from "vitest";
import { PlaygroundBackend } from "./PlaygroundBackend.ts";

const ENDPOINT = "https://play.rust-lang.org/execute";

// Minimal interface matching the Response fields the backend actually reads.
interface MinimalResponse {
    readonly ok: boolean;
    readonly status: number;
    readonly statusText: string;
    json(): Promise<unknown>;
}

type FetchLike = (url: string, init: RequestInit) => Promise<MinimalResponse>;

function makeFetchResponse(
    body: unknown,
    ok = true,
    status = 200
): MinimalResponse {
    return {
        ok,
        status,
        statusText: ok ? "OK" : "Internal Server Error",
        json: () => Promise.resolve(body),
    };
}

function stubFetch(
    response: MinimalResponse
): ReturnType<typeof vi.fn<FetchLike>> {
    const mockFetch = vi.fn<FetchLike>().mockResolvedValue(response);
    vi.stubGlobal("fetch", mockFetch);
    return mockFetch;
}

/** Guard: assert that a call arg tuple exists, throwing if not. */
function assertCall(
    calls: readonly (readonly [string, RequestInit])[],
    index: number
): readonly [string, RequestInit] {
    const call = calls[index];
    if (call === undefined) {
        throw new Error(`Expected a call at index ${String(index)}`);
    }
    return call;
}

/** Narrow an unknown value to its string representation if it is a string. */
function assertString(value: unknown, label: string): string {
    if (typeof value !== "string") {
        throw new Error(`Expected ${label} to be a string`);
    }
    return value;
}

/** Narrow BodyInit | null | undefined to a string, throwing if not. */
function assertBodyString(body: BodyInit | null | undefined): string {
    if (typeof body !== "string") {
        throw new Error("Expected request body to be a string");
    }
    return body;
}

/** Parse a JSON string and narrow the result to a plain object. */
function parseJsonObject(json: string): Record<string, unknown> {
    const parsed: unknown = JSON.parse(json);
    if (
        typeof parsed !== "object" ||
        parsed === null ||
        Array.isArray(parsed)
    ) {
        throw new Error("Expected parsed JSON to be a plain object");
    }
    // After the guards above, parsed is narrowed to object (non-null,
    // non-array). Object.keys yields the string keys; Object.getOwnPropertyDescriptor
    // lets us read each value without an index-signature assertion.
    const result: Record<string, unknown> = {};
    for (const key of Object.keys(parsed)) {
        const descriptor = Object.getOwnPropertyDescriptor(parsed, key);
        if (descriptor !== undefined) {
            result[key] = descriptor.value;
        }
    }
    return result;
}

afterEach(() => {
    vi.unstubAllGlobals();
});

describe("PlaygroundBackend", () => {
    const backend = new PlaygroundBackend();

    // ------------------------------------------------------------------
    // Code-wrapping behaviour
    // ------------------------------------------------------------------

    describe("fn main wrapping", () => {
        it("wraps a bare snippet in fn main() { ... }", async () => {
            const mockFetch = stubFetch(
                makeFetchResponse({
                    success: true,
                    stdout: "42\n",
                    stderr: "",
                })
            );

            await backend.compile('println!("42");');

            expect(mockFetch).toHaveBeenCalledOnce();
            const [, init] = assertCall(mockFetch.mock.calls, 0);
            const body = parseJsonObject(assertBodyString(init.body));
            expect(assertString(body.code, "body.code")).toBe(
                'fn main() {\nprintln!("42");\n}'
            );
        });

        it("does not wrap a snippet that already contains fn main", async () => {
            const snippet = 'fn main() {\n    println!("hello");\n}';
            const mockFetch = stubFetch(
                makeFetchResponse({
                    success: true,
                    stdout: "hello\n",
                    stderr: "",
                })
            );

            await backend.compile(snippet);

            const [, init] = assertCall(mockFetch.mock.calls, 0);
            const body = parseJsonObject(assertBodyString(init.body));
            expect(assertString(body.code, "body.code")).toBe(snippet);
        });
    });

    // ------------------------------------------------------------------
    // Request shape
    // ------------------------------------------------------------------

    describe("request", () => {
        it("posts to the execute endpoint", async () => {
            const mockFetch = stubFetch(
                makeFetchResponse({
                    success: true,
                    stdout: "",
                    stderr: "",
                })
            );

            await backend.compile("fn main() {}");

            const [url] = assertCall(mockFetch.mock.calls, 0);
            expect(url).toBe(ENDPOINT);
        });

        it("sends the expected JSON body including edition 2024", async () => {
            const mockFetch = stubFetch(
                makeFetchResponse({
                    success: true,
                    stdout: "",
                    stderr: "",
                })
            );

            await backend.compile("fn main() {}");

            const [, init] = assertCall(mockFetch.mock.calls, 0);
            const body = parseJsonObject(assertBodyString(init.body));

            expect(body.channel).toBe("stable");
            expect(body.mode).toBe("debug");
            expect(body.edition).toBe("2024");
            expect(body.crateType).toBe("bin");
            expect(body.tests).toBe(false);
            expect(body.backtrace).toBe(false);
        });
    });

    // ------------------------------------------------------------------
    // Response mapping — success case
    // ------------------------------------------------------------------

    describe("response mapping", () => {
        it("maps a successful Playground response to CompileResult", async () => {
            stubFetch(
                makeFetchResponse({
                    success: true,
                    stdout: "Hello, world!\n",
                    stderr: "",
                    exitDetail: "exit status 0",
                })
            );

            const result = await backend.compile("fn main() {}");

            expect(result.success).toBe(true);
            expect(result.stdout).toBe("Hello, world!\n");
            expect(result.stderr).toBe("");
            expect(result.exitDetail).toBe("exit status 0");
        });

        it("maps a failed Playground response (stderr) to CompileResult", async () => {
            stubFetch(
                makeFetchResponse({
                    success: false,
                    stdout: "",
                    stderr: "error[E0425]: cannot find value `x`\n",
                })
            );

            const result = await backend.compile(
                'fn main() { println!("{}", x); }'
            );

            expect(result.success).toBe(false);
            expect(result.stdout).toBe("");
            expect(result.stderr).toBe("error[E0425]: cannot find value `x`\n");
            // exitDetail is optional in the playground response; should default
            // to an empty string when absent.
            expect(result.exitDetail).toBe("");
        });

        it("returns a failure when the HTTP response is not ok", async () => {
            stubFetch(makeFetchResponse(null, false, 500));

            const result = await backend.compile("fn main() {}");

            expect(result.success).toBe(false);
            expect(result.stderr).toContain("500");
        });

        it("returns a failure when the response body is not an object", async () => {
            stubFetch(makeFetchResponse("not an object"));

            const result = await backend.compile("fn main() {}");

            expect(result.success).toBe(false);
            expect(result.stderr).toContain("Invalid response");
        });

        it("returns a failure when required fields are missing from the response", async () => {
            stubFetch(makeFetchResponse({ success: true }));

            const result = await backend.compile("fn main() {}");

            expect(result.success).toBe(false);
            expect(result.stderr).toContain("Invalid response");
        });

        it("returns a failure when field types are wrong", async () => {
            stubFetch(
                makeFetchResponse({
                    success: 1,
                    stdout: null,
                    stderr: false,
                })
            );

            const result = await backend.compile("fn main() {}");

            expect(result.success).toBe(false);
            expect(result.stderr).toContain("Invalid response");
        });
    });
});
