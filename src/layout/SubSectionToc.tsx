import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollArea, TextInput } from "@mantine/core";
import { ChevronRight, List, Search, X } from "lucide-react";
import { vars } from "../theme/theme.css.ts";
import {
    tocSidebar,
    tocFab,
    tocSheet,
    tocSheetBackdrop,
    tocSheetContent,
    tocSheetHeader,
    tocItem,
    tocItemActive,
    tocSectionHeader,
    tocSectionHeaderActive,
    tocCaret,
    tocCaretOpen,
    tocCount,
    tocGroupEntries,
    tocTree,
    tocSectionLabel,
} from "../theme/styles.css.ts";
import type { SectionGroup } from "../layout/subSections.ts";
import type { SectionId } from "../layout/useActiveSection.ts";

interface SubSectionTocProps {
    readonly groups: readonly SectionGroup[];
    readonly activeSection: SectionId;
    readonly activeId: string | undefined;
    readonly onSelectEntry: (id: string) => void;
    readonly onSelectSection: (id: SectionId) => void;
}

// ---------------------------------------------------------------------------
// Tree rendering helpers
// ---------------------------------------------------------------------------

interface TocTreeProps {
    readonly groups: readonly SectionGroup[];
    readonly activeSection: SectionId;
    readonly activeId: string | undefined;
    readonly expanded: ReadonlySet<SectionId>;
    readonly onToggle: (id: SectionId) => void;
    readonly onSelectEntry: (id: string) => void;
    readonly onSelectSection: (id: SectionId) => void;
    /** When set, only entries whose label matches will be shown, and matched
     *  groups will be forced open. */
    readonly filter?: string;
    /** Ref to the active entry button so the parent can scroll it into view. */
    readonly activeEntryRef?: React.RefObject<HTMLButtonElement | null>;
}

function TocTree({
    groups,
    activeSection,
    activeId,
    expanded,
    onToggle,
    onSelectEntry,
    onSelectSection,
    filter,
    activeEntryRef,
}: TocTreeProps) {
    const normFilter = filter !== undefined ? filter.trim().toLowerCase() : "";
    const hasFilter = normFilter.length > 0;

    return (
        <div className={tocTree}>
            {groups.map((group) => {
                const isActiveSection = group.id === activeSection;
                const hasEntries = group.subSections.length > 0;
                const isExpanded = expanded.has(group.id);

                // When filtering, determine which entries match.
                const matchingEntries = hasFilter
                    ? group.subSections.filter((s) =>
                          s.label.toLowerCase().includes(normFilter)
                      )
                    : group.subSections;

                // When filtering, hide groups that have entries but none
                // match (groups without entries are always shown as they
                // are section scroll anchors).
                if (hasFilter && hasEntries && matchingEntries.length === 0) {
                    return null;
                }

                // Under a filter, always show matched entries regardless of
                // the manual expand state.
                const showEntries =
                    hasEntries &&
                    (hasFilter ? matchingEntries.length > 0 : isExpanded);

                // Stable id for the disclosure region — used by aria-controls.
                const entriesId = `toc-entries-${group.id}`;

                return (
                    <div key={group.id}>
                        {/* Section header row */}
                        <button
                            type="button"
                            className={`${tocSectionHeader} ${isActiveSection ? tocSectionHeaderActive : ""}`}
                            onClick={() => {
                                if (hasEntries && !hasFilter) {
                                    onToggle(group.id);
                                }
                                onSelectSection(group.id);
                            }}
                            aria-expanded={hasEntries ? isExpanded : undefined}
                            aria-controls={hasEntries ? entriesId : undefined}
                            aria-current={
                                isActiveSection ? "location" : undefined
                            }
                        >
                            {hasEntries ? (
                                <ChevronRight
                                    size={11}
                                    aria-hidden="true"
                                    className={`${tocCaret} ${
                                        isExpanded ||
                                        (hasFilter &&
                                            matchingEntries.length > 0)
                                            ? tocCaretOpen
                                            : ""
                                    }`}
                                />
                            ) : null}
                            <span className={tocSectionLabel}>
                                {group.label}
                            </span>
                            {hasEntries && !isExpanded && !hasFilter ? (
                                <span className={tocCount} aria-hidden="true">
                                    {group.subSections.length}
                                </span>
                            ) : null}
                        </button>

                        {/* Nested entry list */}
                        {showEntries ? (
                            <div id={entriesId} className={tocGroupEntries}>
                                {matchingEntries.map((entry) => {
                                    const isActive = entry.id === activeId;
                                    return (
                                        <button
                                            key={entry.id}
                                            ref={
                                                isActive
                                                    ? activeEntryRef
                                                    : undefined
                                            }
                                            type="button"
                                            onClick={() => {
                                                onSelectEntry(entry.id);
                                            }}
                                            className={`${tocItem} ${isActive ? tocItemActive : ""}`}
                                            aria-current={
                                                isActive
                                                    ? "location"
                                                    : undefined
                                            }
                                        >
                                            {entry.label}
                                        </button>
                                    );
                                })}
                            </div>
                        ) : null}
                    </div>
                );
            })}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function SubSectionToc({
    groups,
    activeSection,
    activeId,
    onSelectEntry,
    onSelectSection,
}: SubSectionTocProps) {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [filter, setFilter] = useState("");

    // Expansion state model.
    //
    // expanded: the set of section IDs currently open.
    // User manual toggles update it directly via handleToggle.
    //
    // Auto-expansion on scroll: we use the "adjust state when a prop changes"
    // pattern from the React docs (preferred over useEffect + setState, which
    // triggers cascading renders). We track prevActiveSection; when it differs
    // from activeSection in the current render, we union the new section into
    // expanded. React batches both setState calls into one re-render.
    const [expanded, setExpanded] = useState<ReadonlySet<SectionId>>(
        () => new Set([activeSection])
    );
    const [prevActiveSection, setPrevActiveSection] =
        useState<SectionId>(activeSection);

    if (prevActiveSection !== activeSection) {
        setPrevActiveSection(activeSection);
        if (!expanded.has(activeSection)) {
            setExpanded((prev) => {
                const next = new Set(prev);
                next.add(activeSection);
                return next;
            });
        }
    }

    const handleToggle = (id: SectionId) => {
        setExpanded((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    // Ref for the active entry button inside the sidebar ScrollArea.
    const activeEntryRef = useRef<HTMLButtonElement | null>(null);
    // Ref for the ScrollArea viewport so we can scroll it without touching
    // the main page window.
    const viewportRef = useRef<HTMLDivElement | null>(null);

    // Keep the active entry visible inside the sidebar ScrollArea whenever
    // activeId changes. Manual scroll positioning on the viewport element
    // avoids element.scrollIntoView() which would move the main page window.
    useEffect(() => {
        const button = activeEntryRef.current;
        const viewport = viewportRef.current;
        if (button === null || viewport === null) return;

        const btnTop = button.offsetTop;
        const btnBottom = btnTop + button.offsetHeight;
        const viewTop = viewport.scrollTop;
        const viewBottom = viewTop + viewport.clientHeight;

        if (btnTop < viewTop) {
            viewport.scrollTop = btnTop - 8;
        } else if (btnBottom > viewBottom) {
            viewport.scrollTop = btnBottom - viewport.clientHeight + 8;
        }
    }, [activeId]);

    const handleSelectEntry = (id: string) => {
        onSelectEntry(id);
        setSheetOpen(false);
        setFilter("");
    };

    // Use the prop rather than importing scrollToSection directly, so that
    // if the prop is ever wrapped (e.g. to update history state), the mobile
    // path stays in sync with the desktop path.
    const handleSelectSection = (id: SectionId) => {
        onSelectSection(id);
        setSheetOpen(false);
        setFilter("");
    };

    // -----------------------------------------------------------------------
    // Mobile sheet focus management
    // -----------------------------------------------------------------------

    // Ref for the sheet content panel — used for focus trap and initial focus.
    const sheetContentRef = useRef<HTMLDivElement | null>(null);
    // Ref for the filter input inside the sheet — receives focus on open.
    const filterInputRef = useRef<HTMLInputElement | null>(null);
    // Remember which element had focus before the sheet opened so we can
    // restore it on close.
    const priorFocusRef = useRef<Element | null>(null);

    // Focus the filter input when the sheet opens; restore focus on close.
    useEffect(() => {
        if (sheetOpen) {
            priorFocusRef.current = document.activeElement;
            // Use a microtask so the DOM is painted before we move focus.
            const id = window.setTimeout(() => {
                filterInputRef.current?.focus();
            }, 0);
            return () => {
                window.clearTimeout(id);
            };
        } else {
            const prior = priorFocusRef.current;
            if (prior instanceof HTMLElement) {
                prior.focus();
            }
            priorFocusRef.current = null;
        }
    }, [sheetOpen]);

    // Focus trap: keep Tab cycling inside the sheet while it is open.
    const handleSheetKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === "Escape") {
                e.preventDefault();
                setSheetOpen(false);
                setFilter("");
                return;
            }

            if (e.key !== "Tab") return;
            const panel = sheetContentRef.current;
            if (panel === null) return;

            const focusable = Array.from(
                panel.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
                )
            );
            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (first === undefined || last === undefined) return;

            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        },
        []
    );

    // Always show FAB for the combined tree (all sections present).
    const totalEntries = groups.reduce((n, g) => n + g.subSections.length, 0);

    const normFilterTrimmed = filter.trim().toLowerCase();
    const noMobileMatches =
        normFilterTrimmed.length > 0 &&
        groups.every(
            (g) =>
                g.subSections.filter((s) =>
                    s.label.toLowerCase().includes(normFilterTrimmed)
                ).length === 0
        );

    const sheetTitleId = "toc-sheet-title";

    return (
        <>
            {/* Desktop sidebar */}
            <aside className={tocSidebar}>
                <ScrollArea.Autosize
                    mah="calc(100vh - 120px)"
                    offsetScrollbars
                    viewportRef={viewportRef}
                    styles={{
                        root: { minWidth: 0 },
                    }}
                >
                    <TocTree
                        groups={groups}
                        activeSection={activeSection}
                        activeId={activeId}
                        expanded={expanded}
                        onToggle={handleToggle}
                        onSelectEntry={handleSelectEntry}
                        onSelectSection={onSelectSection}
                        activeEntryRef={activeEntryRef}
                    />
                </ScrollArea.Autosize>
            </aside>

            {/* Mobile FAB — always rendered for the combined tree */}
            {totalEntries > 0 ? (
                <button
                    type="button"
                    className={tocFab}
                    onClick={() => {
                        setSheetOpen(true);
                    }}
                    aria-label="Table of contents"
                >
                    <List size={18} />
                </button>
            ) : null}

            {/* Mobile bottom sheet */}
            {sheetOpen ? (
                <div
                    className={tocSheetBackdrop}
                    onClick={() => {
                        setSheetOpen(false);
                        setFilter("");
                    }}
                >
                    <div
                        className={tocSheet}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <div
                            ref={sheetContentRef}
                            className={tocSheetContent}
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby={sheetTitleId}
                            onKeyDown={handleSheetKeyDown}
                        >
                            <div className={tocSheetHeader}>
                                <h3
                                    id={sheetTitleId}
                                    style={{
                                        margin: 0,
                                        fontSize: "0.875rem",
                                        fontWeight: 600,
                                        color: vars.colour.text,
                                    }}
                                >
                                    Jump to...
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSheetOpen(false);
                                        setFilter("");
                                    }}
                                    style={{
                                        background: "transparent",
                                        border: "none",
                                        color: vars.colour.dim,
                                        cursor: "pointer",
                                        padding: "0.25rem",
                                    }}
                                    aria-label="Close"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div
                                style={{
                                    padding: "0 0.75rem 0.5rem",
                                    position: "sticky",
                                    top: 0,
                                    background: vars.colour.panel,
                                    zIndex: 1,
                                }}
                            >
                                <TextInput
                                    ref={filterInputRef}
                                    placeholder="Filter sections and entries..."
                                    leftSection={
                                        <Search
                                            size={14}
                                            style={{
                                                color: vars.colour.faint,
                                            }}
                                        />
                                    }
                                    value={filter}
                                    onChange={(e) => {
                                        setFilter(e.currentTarget.value);
                                    }}
                                    size="xs"
                                    styles={{
                                        input: {
                                            background: vars.colour.panel2,
                                            border: `1px solid ${vars.colour.border}`,
                                            color: vars.colour.text,
                                            fontSize: "0.8rem",
                                        },
                                    }}
                                />
                            </div>

                            <ScrollArea.Autosize
                                mah="50vh"
                                offsetScrollbars
                                styles={{
                                    root: { minWidth: 0 },
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "0.125rem",
                                        padding: "0 0.75rem 0.75rem",
                                    }}
                                >
                                    <TocTree
                                        groups={groups}
                                        activeSection={activeSection}
                                        activeId={activeId}
                                        expanded={expanded}
                                        onToggle={handleToggle}
                                        onSelectEntry={handleSelectEntry}
                                        onSelectSection={handleSelectSection}
                                        filter={filter}
                                    />
                                    {noMobileMatches ? (
                                        <span
                                            style={{
                                                color: vars.colour.faint,
                                                fontSize: "0.8rem",
                                                padding: "0.5rem 0",
                                            }}
                                        >
                                            No matches.
                                        </span>
                                    ) : null}
                                </div>
                            </ScrollArea.Autosize>
                        </div>
                    </div>
                </div>
            ) : null}
        </>
    );
}
