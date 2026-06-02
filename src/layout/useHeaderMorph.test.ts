import { describe, expect, it } from "vitest";
import { computeMorphProgress } from "./useHeaderMorph.ts";

describe("computeMorphProgress", () => {
    it("is 0 at the top of the page", () => {
        expect(computeMorphProgress(0, 120)).toBe(0);
    });

    it("is 1 once scrolled past the header height", () => {
        expect(computeMorphProgress(120, 120)).toBe(1);
    });

    it("clamps to 1 when scrolled well past the header", () => {
        expect(computeMorphProgress(500, 120)).toBe(1);
    });

    it("interpolates linearly through the morph window", () => {
        expect(computeMorphProgress(60, 120)).toBe(0.5);
        expect(computeMorphProgress(30, 120)).toBe(0.25);
    });

    it("clamps negative scroll (overscroll/bounce) to 0", () => {
        expect(computeMorphProgress(-40, 120)).toBe(0);
    });

    it("returns 0 for a non-positive header height rather than dividing by zero", () => {
        expect(computeMorphProgress(100, 0)).toBe(0);
        expect(computeMorphProgress(100, -10)).toBe(0);
    });
});
