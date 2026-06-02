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
// React internals. Buttons drive compile()/clear() through real clicks.
function Probe(): React.JSX.Element {
    const { blockId, result, compile, clear } = useCompiler();
    return (
        <div
            data-testid="probe"
            data-block-id={blockId ?? ""}
            data-has-result={result === null ? "no" : "yes"}
        >
            <button
                type="button"
                data-testid="run"
                onClick={() => {
                    void compile("fn main() {}", "lesson-3");
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
});
