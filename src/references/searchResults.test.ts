import { describe, expect, it, vi } from "vitest";
import {
    buildSearchResults,
    truncatePreview,
    DESCRIPTION_PREVIEW_CHARS,
} from "./searchResults.ts";
import { CONCEPTS } from "../data/concepts.ts";
import { GLOSSARY } from "../data/glossary.ts";
import { ERROR_CATALOGUE } from "../data/errors.ts";

/** A set of handler spies, one per result type, for asserting actions. */
function makeHandlers() {
    return {
        onOpenLesson: vi.fn(),
        onOpenConcept: vi.fn(),
        onOpenSyntax: vi.fn(),
        onOpenGlossary: vi.fn(),
        onOpenError: vi.fn(),
    };
}

describe("buildSearchResults — query gate", () => {
    it("returns nothing for a query shorter than two characters", () => {
        expect(buildSearchResults("a", makeHandlers())).toHaveLength(0);
    });

    it("returns nothing for a whitespace-padded single character", () => {
        // " a " trims to "a", which is below the two-character gate.
        expect(buildSearchResults(" a ", makeHandlers())).toHaveLength(0);
    });

    it("returns nothing for an empty query", () => {
        expect(buildSearchResults("", makeHandlers())).toHaveLength(0);
    });

    it("searches once the trimmed query is at least two characters", () => {
        // "ownership" is a concept title/id, so a two-character substring of it
        // must surface at least one result.
        expect(buildSearchResults("ow", makeHandlers()).length).toBeGreaterThan(
            0
        );
    });
});

describe("buildSearchResults — case insensitivity", () => {
    it("matches concept content regardless of query case", () => {
        const lower = buildSearchResults("ownership", makeHandlers());
        const upper = buildSearchResults("OWNERSHIP", makeHandlers());
        const mixed = buildSearchResults("OwNeRsHiP", makeHandlers());
        expect(lower.length).toBeGreaterThan(0);
        expect(upper.map((r) => r.label)).toEqual(lower.map((r) => r.label));
        expect(mixed.map((r) => r.label)).toEqual(lower.map((r) => r.label));
    });
});

describe("buildSearchResults — actions invoke the right handler", () => {
    it("a concept result calls onOpenConcept with that concept's id", () => {
        const concept = CONCEPTS[0];
        if (concept === undefined) throw new Error("no concepts to test");
        const handlers = makeHandlers();
        const results = buildSearchResults(concept.id, handlers);
        const match = results.find(
            (r) => r.type === "concept" && r.label === concept.title
        );
        if (match === undefined) {
            throw new Error(`no concept result for "${concept.id}"`);
        }
        match.action();
        expect(handlers.onOpenConcept).toHaveBeenCalledWith(concept.id);
        expect(handlers.onOpenLesson).not.toHaveBeenCalled();
        expect(handlers.onOpenGlossary).not.toHaveBeenCalled();
        expect(handlers.onOpenError).not.toHaveBeenCalled();
    });

    it("a glossary result calls onOpenGlossary with that term's id", () => {
        const term = GLOSSARY[0];
        if (term === undefined) throw new Error("no glossary entries to test");
        const handlers = makeHandlers();
        const results = buildSearchResults(term.term, handlers);
        const match = results.find(
            (r) => r.type === "glossary" && r.label === term.term
        );
        if (match === undefined) {
            throw new Error(`no glossary result for "${term.term}"`);
        }
        match.action();
        expect(handlers.onOpenGlossary).toHaveBeenCalledWith(term.id);
    });

    it("an error result calls onOpenError with that error's id", () => {
        const error = ERROR_CATALOGUE[0];
        if (error === undefined) throw new Error("no errors to test");
        const handlers = makeHandlers();
        const results = buildSearchResults(error.code, handlers);
        const match = results.find((r) => r.type === "error");
        if (match === undefined) {
            throw new Error(`no error result for "${error.code}"`);
        }
        match.action();
        expect(handlers.onOpenError).toHaveBeenCalledWith(error.id);
    });
});

describe("truncatePreview — ellipsis only when truncated", () => {
    // The bug: "..." was appended unconditionally, so a description shorter than
    // the cap still gained a misleading ellipsis. The fix appends the marker
    // only when the source text actually exceeds the cap.
    it("leaves a string shorter than the cap unchanged", () => {
        const short = "a".repeat(DESCRIPTION_PREVIEW_CHARS - 1);
        expect(truncatePreview(short)).toBe(short);
        expect(truncatePreview(short).endsWith("...")).toBe(false);
    });

    it("leaves a string exactly at the cap unchanged", () => {
        const exact = "a".repeat(DESCRIPTION_PREVIEW_CHARS);
        expect(truncatePreview(exact)).toBe(exact);
        expect(truncatePreview(exact).endsWith("...")).toBe(false);
    });

    it("truncates and appends an ellipsis when longer than the cap", () => {
        const long = "a".repeat(DESCRIPTION_PREVIEW_CHARS + 1);
        const out = truncatePreview(long);
        expect(out.endsWith("...")).toBe(true);
        expect(out).toBe("a".repeat(DESCRIPTION_PREVIEW_CHARS) + "...");
    });

    it("real glossary previews are truncated since every definition is long", () => {
        // Every shipped glossary definition exceeds the cap, so each glossary
        // result's description must carry the ellipsis — and must equal the
        // exact slice, never a double marker.
        for (const term of GLOSSARY) {
            const results = buildSearchResults(term.term, makeHandlers());
            const match = results.find(
                (r) => r.type === "glossary" && r.label === term.term
            );
            if (match === undefined) continue;
            expect(match.description).toBe(
                term.definition.slice(0, DESCRIPTION_PREVIEW_CHARS) + "..."
            );
        }
    });
});
