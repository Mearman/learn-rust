import { useState } from "react";
import { Lightbulb, ChevronDown, ChevronRight } from "lucide-react";
import { CodeBlock } from "../highlight/CodeBlock.tsx";
import { vars } from "../theme/theme.css.ts";
import {
    noteBlock,
    analogyBlock,
    textBlock,
    accentLabel,
    comparisonGrid,
    comparisonColumn,
    comparisonLabel,
    comparisonNotes,
    comparisonUnavailable,
    deepDiveToggle,
    deepDiveContent,
} from "../theme/styles.css.ts";
import { CompileOutput } from "../compiler/CompileOutput.tsx";
import type {
    LessonBlock,
    AnalogyBlock as AnalogyBlockType,
    ComparisonBlock as ComparisonBlockType,
    DeepDiveBlock as DeepDiveBlockType,
} from "./lessons.ts";
import type { CompileResult } from "../compiler/types.ts";
import type { LanguageFamiliarity, UserProfile } from "../settings/types.ts";
import { languageFamiliarityLabel } from "../settings/languages.ts";

interface BlockProps {
    readonly block: LessonBlock;
    readonly profile: UserProfile;
    readonly compiling?: boolean;
    readonly onRun?: () => void;
    readonly compileResult?: CompileResult | null;
    readonly onClearCompile?: () => void;
}

const LEVEL_ORDER = {
    beginner: 0,
    intermediate: 1,
    advanced: 2,
} as const;

function isVisible(
    blockLevel: "beginner" | "intermediate" | "advanced" | undefined,
    userLevel: UserProfile["experience"],
): boolean {
    if (blockLevel === undefined) return true;
    return LEVEL_ORDER[blockLevel] <= LEVEL_ORDER[userLevel];
}

function matchingFamiliarities<T>(
    familiarities: readonly LanguageFamiliarity[],
    options: Partial<Record<LanguageFamiliarity, T>>,
): readonly { readonly familiarity: LanguageFamiliarity; readonly value: T }[] {
    const matches: { readonly familiarity: LanguageFamiliarity; readonly value: T }[] = [];
    for (const familiarity of familiarities) {
        const value = options[familiarity];
        if (value !== undefined) {
            matches.push({ familiarity, value });
        }
    }
    return matches;
}

function AnalogySection({ block, profile }: {
    readonly block: AnalogyBlockType;
    readonly profile: UserProfile;
}) {
    const matches = matchingFamiliarities(profile.familiarities, block.comparisons ?? {});
    const label = profile.familiarities.length === 0
        ? "If you know other languages"
        : "If you’re familiar with these languages";

    return (
        <div className={analogyBlock}>
            <span className={accentLabel}>{label}</span>
            {matches.length === 0 ? (
                <div style={{ marginTop: "0.25rem" }}>{block.text}</div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "0.25rem" }}>
                    <div>{block.text}</div>
                    {matches.map(({ familiarity, value }) => (
                        <div key={familiarity} style={{ color: vars.colour.faint }}>
                            {languageFamiliarityLabel(familiarity)}: {value}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function ComparisonSection({ block, profile }: {
    readonly block: ComparisonBlockType;
    readonly profile: UserProfile;
}) {
    const matches = matchingFamiliarities(profile.familiarities, block.comparisons);

    return (
        <div className={comparisonGrid}>
            <div className={comparisonColumn}>
                <span className={comparisonLabel}>Rust</span>
                <CodeBlock code={block.rustCode} label="rust" />
            </div>
            <div className={comparisonColumn}>
                <span className={comparisonLabel}>
                    {profile.familiarities.length === 0 ? "Your familiar language" : "Your familiar languages"}
                </span>
                {matches.length > 0 ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {matches.map(({ familiarity, value }) => (
                            <div key={familiarity} style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
                                <span className={comparisonLabel} style={{ color: vars.colour.accentSoft }}>{languageFamiliarityLabel(familiarity)}</span>
                                <CodeBlock code={value.code} label={familiarity} />
                                {value.notes ? <span className={comparisonNotes}>{value.notes}</span> : null}
                            </div>
                        ))}
                    </div>
                ) : profile.familiarities.length === 0 ? (
                    <span className={comparisonUnavailable}>
                        Pick one or more languages to see the comparison.
                    </span>
                ) : (
                    <span className={comparisonUnavailable}>
                        No matching comparison available yet.
                    </span>
                )}
            </div>
        </div>
    );
}

function DeepDiveSection({ block, profile }: {
    readonly block: DeepDiveBlockType;
    readonly profile: UserProfile;
}) {
    const [open, setOpen] = useState(false);

    if (profile.experience !== "advanced") return null;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <button
                className={deepDiveToggle}
                onClick={() => setOpen((prev) => !prev)}
                type="button"
            >
                {open
                    ? <ChevronDown size={14} style={{ flexShrink: 0 }} />
                    : <ChevronRight size={14} style={{ flexShrink: 0 }} />
                }
                <span>{block.title}</span>
            </button>
            {open ? (
                <div className={deepDiveContent}>
                    {block.blocks.map((b, i) => (
                        <Block key={i} block={b} profile={profile} />
                    ))}
                </div>
            ) : null}
        </div>
    );
}

export function Block({ block, profile, compiling, onRun, compileResult, onClearCompile }: BlockProps) {
    if ("level" in block && block.level !== undefined) {
        if (!isVisible(block.level, profile.experience)) return null;
    }

    if (block.kind === "code") {
        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <CodeBlock code={block.code} label={block.label} onRun={onRun} compiling={compiling} />
                {compileResult !== undefined && compileResult !== null && onClearCompile ? (
                    <CompileOutput result={compileResult} compiling={compiling ?? false} onClear={onClearCompile} />
                ) : null}
            </div>
        );
    }
    if (block.kind === "note") {
        return (
            <div className={noteBlock}>
                <Lightbulb size={16} style={{ color: vars.colour.accent, flexShrink: 0, marginTop: 2 }} />
                <span>{block.text}</span>
            </div>
        );
    }
    if (block.kind === "analogy") {
        return <AnalogySection block={block} profile={profile} />;
    }
    if (block.kind === "comparison") {
        return <ComparisonSection block={block} profile={profile} />;
    }
    if (block.kind === "deep-dive") {
        return <DeepDiveSection block={block} profile={profile} />;
    }
    return <p className={textBlock}>{block.text}</p>;
}
