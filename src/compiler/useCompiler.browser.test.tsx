import { afterEach, describe, expect, it, vi } from "vitest";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import { useCompiler } from "./useCompiler.ts";

// Minimal response shape the PlaygroundBackend reads from fetch.
interface MinimalResponse {
    readonly ok: boolean;
    readonly status: number;
    readonly statusText: string;
    json(): Promise<unknown>;
}

function okResponse(): MinimalResponse {
    return {
        ok: true,
        status: 200,
        statusText: "OK",
        json: () => Promise.resolve({ success: true, stdout: "", stderr: "" }),
    };
}

const tick = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

// Renders the hook into a real DOM and projects its state into data-attributes
// so the test reads behaviour through the rendered output rather than poking at
// React internals. Buttons drive compile()/clear() through real clicks. The two
// run buttons carry distinct block ids and snippet text so a race test can tell
// which compile's result won.
function Probe(): React.JSX.Element {
    const { blockId, result, compiling, compile, clear } = useCompiler();
    return (
        <div
            data-testid="probe"
            data-block-id={blockId ?? ""}
            data-has-result={result === null ? "no" : "yes"}
            data-compiling={compiling ? "yes" : "no"}
            data-stdout={result?.stdout ?? ""}
        >
            <button
                type="button"
                data-testid="run"
                onClick={() => {
                    void compile("fn main() {}", "lesson-3");
                }}
            />
            <button
                type="button"
                data-testid="run-a"
                onClick={() => {
                    void compile("// A", "block-a");
                }}
            />
            <button
                type="button"
                data-testid="run-b"
                onClick={() => {
                    void compile("// B", "block-b");
                }}
            />
            <button type="button" data-testid="clear" onClick={clear} />
        </div>
    );
}

function getProbe(host: HTMLElement): HTMLElement {
    const el = host.querySelector<HTMLElement>('[data-testid="probe"]');
    if (el === null) throw new Error("probe not rendered");
    return el;
}

function getButton(host: HTMLElement, testid: string): HTMLButtonElement {
    const el = host.querySelector<HTMLButtonElement>(
        `[data-testid="${testid}"]`
    );
    if (el === null) throw new Error(`button ${testid} not rendered`);
    return el;
}

let host: HTMLElement | null = null;
let root: Root | null = null;

afterEach(() => {
    vi.unstubAllGlobals();
    root?.unmount();
    host?.remove();
    host = null;
    root = null;
});

function mount(): HTMLElement {
    const el = document.createElement("div");
    document.body.appendChild(el);
    host = el;
    root = createRoot(el);
    root.render(<Probe />);
    return el;
}

describe("useCompiler", () => {
    it("records the block id passed to compile()", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(okResponse()));
        const el = mount();
        await tick(20);

        expect(getProbe(el).dataset.blockId).toBe("");

        getButton(el, "run").click();
        await tick(50);

        expect(getProbe(el).dataset.blockId).toBe("lesson-3");
        expect(getProbe(el).dataset.hasResult).toBe("yes");
    });

    it("clears the block id on clear()", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue(okResponse()));
        const el = mount();
        await tick(20);

        getButton(el, "run").click();
        await tick(50);
        expect(getProbe(el).dataset.blockId).toBe("lesson-3");

        getButton(el, "clear").click();
        await tick(20);

        expect(getProbe(el).dataset.blockId).toBe("");
        expect(getProbe(el).dataset.hasResult).toBe("no");
    });

    it("drops a superseded compile when a later one starts first (abort race)", async () => {
        // Hand out one deferred response per fetch call so the test controls
        // resolution order. Each response reports a distinct stdout so we can
        // assert which compile's result the hook kept.
        const resolvers: ((stdout: string) => void)[] = [];
        const fetchMock = vi.fn().mockImplementation(
            () =>
                new Promise<MinimalResponse>((resolve) => {
                    resolvers.push((stdout: string) => {
                        resolve({
                            ok: true,
                            status: 200,
                            statusText: "OK",
                            json: () =>
                                Promise.resolve({
                                    success: true,
                                    stdout,
                                    stderr: "",
                                }),
                        });
                    });
                })
        );
        vi.stubGlobal("fetch", fetchMock);

        const el = mount();
        await tick(20);

        // Start A, then start B before A resolves.
        getButton(el, "run-a").click();
        await tick(20);
        getButton(el, "run-b").click();
        await tick(20);

        expect(getProbe(el).dataset.blockId).toBe("block-b");
        expect(resolvers).toHaveLength(2);

        // Resolve A last. Its controller was aborted when B started, so the hook
        // must ignore A's late result and keep B's block id with no result yet.
        const resolveA = resolvers[0];
        const resolveB = resolvers[1];
        if (resolveA === undefined || resolveB === undefined) {
            throw new Error("expected two deferred fetches");
        }
        resolveA("A-OUTPUT");
        await tick(40);

        // A's resolution was dropped: still on block B, no A output leaked.
        expect(getProbe(el).dataset.blockId).toBe("block-b");
        expect(getProbe(el).dataset.stdout).not.toBe("A-OUTPUT");

        // Now resolve B; its result is the one that lands.
        resolveB("B-OUTPUT");
        await tick(40);
        expect(getProbe(el).dataset.blockId).toBe("block-b");
        expect(getProbe(el).dataset.stdout).toBe("B-OUTPUT");
        expect(getProbe(el).dataset.hasResult).toBe("yes");
    });

    it("clear() aborts an in-flight compile so its result is discarded", async () => {
        const resolvers: ((stdout: string) => void)[] = [];
        const fetchMock = vi.fn().mockImplementation(
            () =>
                new Promise<MinimalResponse>((resolve) => {
                    resolvers.push((stdout: string) => {
                        resolve({
                            ok: true,
                            status: 200,
                            statusText: "OK",
                            json: () =>
                                Promise.resolve({
                                    success: true,
                                    stdout,
                                    stderr: "",
                                }),
                        });
                    });
                })
        );
        vi.stubGlobal("fetch", fetchMock);

        const el = mount();
        await tick(20);

        getButton(el, "run-a").click();
        await tick(20);
        expect(getProbe(el).dataset.compiling).toBe("yes");

        // Clear while the request is still pending.
        getButton(el, "clear").click();
        await tick(20);
        expect(getProbe(el).dataset.blockId).toBe("");
        expect(getProbe(el).dataset.hasResult).toBe("no");
        expect(getProbe(el).dataset.compiling).toBe("no");

        // The in-flight fetch now resolves; the hook must ignore it.
        const finish = resolvers[0];
        if (finish === undefined) throw new Error("fetch never invoked");
        finish("LATE-OUTPUT");
        await tick(40);
        expect(getProbe(el).dataset.hasResult).toBe("no");
        expect(getProbe(el).dataset.stdout).toBe("");
    });
});
