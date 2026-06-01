import { useState } from "react";
import { ScrollArea, TextInput } from "@mantine/core";
import { List, Search, X } from "lucide-react";
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
} from "../theme/styles.css.ts";
import type { SubSection } from "../layout/subSections.ts";

interface SubSectionTocProps {
    readonly items: readonly SubSection[];
    readonly activeId: string | undefined;
    readonly onSelect: (id: string) => void;
}

export function SubSectionToc({
    items,
    activeId,
    onSelect,
}: SubSectionTocProps) {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [filter, setFilter] = useState("");

    const filtered =
        filter.length > 0
            ? items.filter((item) =>
                  item.label.toLowerCase().includes(filter.toLowerCase())
              )
            : items;

    const handleSelect = (id: string) => {
        onSelect(id);
        setSheetOpen(false);
        setFilter("");
    };

    return (
        <>
            {/* Desktop sidebar */}
            <aside className={tocSidebar}>
                {items.length > 0 ? (
                    <ScrollArea.Autosize
                        mah="calc(100vh - 120px)"
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
                            }}
                        >
                            {items.map((item) => {
                                const isActive = item.id === activeId;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => {
                                            handleSelect(item.id);
                                        }}
                                        className={`${tocItem} ${isActive ? tocItemActive : ""}`}
                                    >
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>
                    </ScrollArea.Autosize>
                ) : null}
            </aside>

            {/* Mobile FAB */}
            {items.length > 0 ? (
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
                        <div className={tocSheetContent}>
                            <div className={tocSheetHeader}>
                                <h3
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

                            {items.length > 8 ? (
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
                                        placeholder="Filter..."
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
                            ) : null}

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
                                    {filtered.map((item) => {
                                        const isActive = item.id === activeId;
                                        return (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() => {
                                                    handleSelect(item.id);
                                                }}
                                                className={`${tocItem} ${isActive ? tocItemActive : ""}`}
                                            >
                                                {item.label}
                                            </button>
                                        );
                                    })}
                                    {filtered.length === 0 ? (
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
