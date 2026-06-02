import { describe, it, expect } from "vitest";
import {
    resolveActiveHash,
    sectionForElementId,
    nestedHashFor,
    elementIdFromHash,
    type SectionGroup,
} from "./subSections.ts";

const GROUPS: readonly SectionGroup[] = [
    {
        id: "learn",
        label: "Learn",
        subSections: [
            { id: "lesson-a", label: "A" },
            { id: "lesson-b", label: "B" },
        ],
    },
    { id: "path", label: "Path", subSections: [] },
];

describe("resolveActiveHash", () => {
    it("nests the active sub-section under its section", () => {
        expect(resolveActiveHash(GROUPS, "learn", "lesson-b")).toBe(
            "learn/lesson-b"
        );
    });

    it("returns the section id when the section has no sub-sections", () => {
        // activeSub is stale from a previous section while scrolling through
        // a sub-less section like path.
        expect(resolveActiveHash(GROUPS, "path", "lesson-a")).toBe("path");
    });

    it("returns the section id when the active sub belongs to another section", () => {
        expect(resolveActiveHash(GROUPS, "path", "lesson-b")).toBe("path");
    });

    it("returns the section id when there is no active sub-section", () => {
        expect(resolveActiveHash(GROUPS, "learn", undefined)).toBe("learn");
    });

    it("returns the section id when the sub is not found in the active section", () => {
        expect(resolveActiveHash(GROUPS, "learn", "concept-x")).toBe("learn");
    });
});

describe("sectionForElementId", () => {
    it("returns the id itself for a section id", () => {
        expect(sectionForElementId("compare")).toBe("compare");
    });

    it("resolves a sub-section id from its prefix", () => {
        expect(sectionForElementId("concept-x")).toBe("compare");
        expect(sectionForElementId("lesson-ownership")).toBe("learn");
        expect(sectionForElementId("error-E0382")).toBe("errors");
        expect(sectionForElementId("challenge-3")).toBe("challenge");
    });

    it("returns undefined for an unrecognised id", () => {
        expect(sectionForElementId("mystery-x")).toBeUndefined();
    });
});

describe("nestedHashFor", () => {
    it("nests a sub-section under its section", () => {
        expect(nestedHashFor("concept-reference-semantics")).toBe(
            "compare/concept-reference-semantics"
        );
        expect(nestedHashFor("challenge-3")).toBe("challenge/challenge-3");
    });

    it("returns a section id unchanged", () => {
        expect(nestedHashFor("compare")).toBe("compare");
        expect(nestedHashFor("path")).toBe("path");
    });

    it("returns an unrecognised id unchanged", () => {
        expect(nestedHashFor("mystery-x")).toBe("mystery-x");
    });
});

describe("elementIdFromHash", () => {
    it("takes the last segment of a nested hash", () => {
        expect(elementIdFromHash("#compare/concept-x")).toBe("concept-x");
    });

    it("handles a section-only hash", () => {
        expect(elementIdFromHash("#compare")).toBe("compare");
    });

    it("handles a flat (un-nested) hash", () => {
        expect(elementIdFromHash("#lesson-ownership")).toBe("lesson-ownership");
    });

    it("returns empty for an empty hash", () => {
        expect(elementIdFromHash("")).toBe("");
    });
});
