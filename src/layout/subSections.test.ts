import { describe, it, expect } from "vitest";
import { resolveActiveHash, type SectionGroup } from "./subSections.ts";

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
    it("returns the active sub-section when it belongs to the active section", () => {
        expect(resolveActiveHash(GROUPS, "learn", "lesson-b")).toBe("lesson-b");
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
