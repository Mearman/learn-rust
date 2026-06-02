import { beforeAll, describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { createRoot } from "react-dom/client";
import { AppProvider } from "./theme/AppProvider.tsx";
import { App } from "./App.tsx";

// The whole app is one long scrolling document, so a single element wider than
// the viewport makes the entire page scroll sideways — the regression class
// behind the path-graph SVG, the cheatsheet cards and the code blocks. Guard
// it at the widths that matter, from a small phone up to desktop.
const WIDTHS = [320, 360, 390, 414, 768, 1024, 1280] as const;

const tick = (ms: number): Promise<void> =>
    new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Describe the widest element that pushes the document past the viewport and is
 * not contained by a scroll/clip ancestor — i.e. the actual cause of a
 * horizontal page overflow. Returned in the failure message so a regression
 * points straight at the offending component.
 */
function describeOverflowCulprit(): string {
    const vw = document.documentElement.clientWidth;
    const clips = (el: Element): boolean => {
        const o = getComputedStyle(el).overflowX;
        return o === "hidden" || o === "auto" || o === "scroll";
    };
    let worst: { desc: string; right: number } | null = null;
    for (const el of document.querySelectorAll("*")) {
        const right = el.getBoundingClientRect().right;
        if (right <= vw + 1) continue;
        let p = el.parentElement;
        let clipped = false;
        while (p !== null && p !== document.documentElement) {
            if (clips(p)) {
                clipped = true;
                break;
            }
            p = p.parentElement;
        }
        if (clipped) continue;
        if (worst === null || right > worst.right) {
            let section = "";
            let s: Element | null = el;
            while (s !== null) {
                if (s.tagName === "SECTION" && s.id !== "") {
                    section = ` in #${s.id}`;
                    break;
                }
                s = s.parentElement;
            }
            const cls = el.getAttribute("class") ?? "";
            worst = {
                desc: `<${el.tagName.toLowerCase()} class="${cls.slice(0, 50)}">${section} extends to ${String(Math.round(right))}px`,
                right,
            };
        }
    }
    return worst?.desc ?? "(no unclipped overflower found)";
}

describe("responsive layout: the document never overflows horizontally", () => {
    beforeAll(async () => {
        const root = document.createElement("div");
        document.body.appendChild(root);
        createRoot(root).render(
            <AppProvider>
                <App />
            </AppProvider>
        );
        // Let the first paint, effects, and observers settle.
        await tick(400);
    });

    for (const width of WIDTHS) {
        it(`fits the viewport at ${String(width)}px`, async () => {
            await page.viewport(width, 900);
            await tick(80);
            // Scroll to the bottom so the lazy-mounted sections (Compare,
            // Syntax) render, then back to the top, so the whole page width is
            // measured rather than just the eagerly-rendered sections.
            window.scrollTo(0, document.body.scrollHeight);
            await tick(250);
            window.scrollTo(0, 0);
            await tick(100);

            const docEl = document.documentElement;
            const overflow = docEl.scrollWidth - docEl.clientWidth;
            // Allow 1px for sub-pixel rounding.
            if (overflow > 1) {
                throw new Error(
                    `Document overflows horizontally by ${String(overflow)}px at ${String(width)}px viewport. Widest offender: ${describeOverflowCulprit()}`
                );
            }
            expect(overflow).toBeLessThanOrEqual(1);
        });
    }
});
