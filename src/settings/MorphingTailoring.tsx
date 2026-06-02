import { MultiSelect, SegmentedControl } from "@mantine/core";
import { BookOpen, Trophy } from "lucide-react";
import { vars } from "../theme/theme.css.ts";
import {
    morphPanel,
    morphTopRow,
    morphTitleCol,
    morphPanelTitle,
    morphSubtitle,
    morphMeta,
    morphFields,
    morphField,
    morphFieldWide,
    morphFieldLabel,
    morphFieldHelp,
    monoSm,
} from "../theme/styles.css.ts";
import {
    DEVELOPER_BACKGROUND_OPTIONS,
    joinDeveloperBackgrounds,
} from "./backgrounds.ts";
import {
    LANGUAGE_FAMILIARITY_OPTIONS,
    joinLanguageFamiliarities,
} from "../data/languages.ts";
import { ThemeToggle } from "../theme/ThemeToggle.tsx";
import type { ThemeMode } from "../theme/useThemeMode.ts";
import type { UserProfile, UserProfileUpdater } from "./types.ts";
import {
    isDeveloperBackground,
    isLanguageFamiliarity,
    isExperienceLevel,
} from "./types.ts";

const EXPERIENCE_OPTIONS = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
] as const;

// Control surfaces shrink with the morph: the input gets shorter and the text
// a touch smaller, so the same control reads as a full field when expanded and
// a slim strip control when condensed. `var(--morph)` resolves at paint, so
// these track the scroll without re-rendering.
const selectInputStyle = {
    background: vars.colour.panel,
    border: `1px solid ${vars.colour.border}`,
    color: vars.colour.text,
    minHeight: "calc(2.25rem - var(--morph, 0) * 0.6rem)",
    fontSize: "calc(0.875rem - var(--morph, 0) * 0.0625rem)",
} as const;

const selectMenuStyles = {
    input: selectInputStyle,
    dropdown: {
        background: vars.colour.panel,
        border: `1px solid ${vars.colour.border}`,
    },
    option: {
        color: vars.colour.text,
        "&[data-selected]": {
            background: vars.colour.accentDim,
            color: vars.colour.text,
        },
        "&[data-hovered]": {
            background: vars.colour.borderSoft,
        },
    },
    pill: {
        background: vars.colour.accentDim,
        color: vars.colour.text,
    },
    pillsList: {
        gap: "0.375rem",
    },
} as const;

interface MorphingTailoringProps {
    readonly profile: UserProfile;
    readonly setProfile: UserProfileUpdater;
    readonly viewedCount: number;
    readonly lessonCount: number;
    readonly challengeScore: {
        readonly correct: number;
        readonly total: number;
    };
    readonly themeMode: ThemeMode;
    readonly setThemeMode: (mode: ThemeMode) => void;
}

export function MorphingTailoring({
    profile,
    setProfile,
    viewedCount,
    lessonCount,
    challengeScore,
    themeMode,
    setThemeMode,
}: MorphingTailoringProps) {
    const handleBackgrounds = (values: string[]) => {
        const narrowed = values.filter(isDeveloperBackground);
        setProfile((prev) => ({ ...prev, backgrounds: narrowed }));
    };

    const handleFamiliarities = (values: string[]) => {
        const narrowed = values.filter(isLanguageFamiliarity);
        setProfile((prev) => ({ ...prev, familiarities: narrowed }));
    };

    const handleExperience = (value: string) => {
        if (!isExperienceLevel(value)) return;
        setProfile((prev) => ({ ...prev, experience: value }));
    };

    return (
        <div className={morphPanel} aria-label="Tailor the examples">
            <div className={morphTopRow}>
                <div className={morphTitleCol}>
                    <h1 className={morphPanelTitle}>
                        Rust{" "}
                        <span style={{ color: vars.colour.accent }}>
                            by concept
                        </span>
                    </h1>
                    <p className={morphSubtitle}>
                        The ten ideas that actually make Rust feel different.
                    </p>
                </div>

                <div className={`${morphMeta} ${monoSm}`}>
                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.375rem",
                        }}
                    >
                        <BookOpen
                            size={13}
                            style={{ color: vars.colour.accent }}
                        />
                        {viewedCount}/{lessonCount} read
                    </span>
                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.375rem",
                        }}
                    >
                        <Trophy
                            size={13}
                            style={{ color: vars.colour.accent }}
                        />
                        {challengeScore.correct}/{challengeScore.total}
                    </span>
                    <ThemeToggle mode={themeMode} onChange={setThemeMode} />
                </div>
            </div>

            <div className={morphFields}>
                <div className={morphField}>
                    <label
                        className={morphFieldLabel}
                        htmlFor="developer-background"
                    >
                        Background
                    </label>
                    <MultiSelect
                        id="developer-background"
                        data={DEVELOPER_BACKGROUND_OPTIONS}
                        value={[...profile.backgrounds]}
                        onChange={handleBackgrounds}
                        aria-label="Actual background"
                        placeholder="Any"
                        maxDropdownHeight={200}
                        comboboxProps={{ withinPortal: true, zIndex: 400 }}
                        styles={selectMenuStyles}
                    />
                    <div className={morphFieldHelp}>
                        {profile.backgrounds.length === 0
                            ? "No background selected yet."
                            : `Selected: ${joinDeveloperBackgrounds(profile.backgrounds)}`}
                    </div>
                </div>

                <div className={morphField}>
                    <label
                        className={morphFieldLabel}
                        htmlFor="language-familiarity"
                    >
                        Languages
                    </label>
                    <MultiSelect
                        id="language-familiarity"
                        data={LANGUAGE_FAMILIARITY_OPTIONS}
                        value={[...profile.familiarities]}
                        onChange={handleFamiliarities}
                        aria-label="Language familiarity"
                        placeholder="Any"
                        maxDropdownHeight={200}
                        comboboxProps={{ withinPortal: true, zIndex: 400 }}
                        styles={selectMenuStyles}
                    />
                    <div className={morphFieldHelp}>
                        {profile.familiarities.length === 0
                            ? "No language selected yet."
                            : `Examples will lean on ${joinLanguageFamiliarities(profile.familiarities)}.`}
                    </div>
                </div>

                <div className={`${morphField} ${morphFieldWide}`}>
                    <label className={morphFieldLabel}>Level</label>
                    <SegmentedControl
                        data={[...EXPERIENCE_OPTIONS]}
                        value={profile.experience}
                        onChange={handleExperience}
                        fullWidth
                        styles={{
                            root: {
                                background: vars.colour.panel,
                                border: `1px solid ${vars.colour.border}`,
                            },
                            label: {
                                color: vars.colour.text,
                                fontSize:
                                    "calc(0.875rem - var(--morph, 0) * 0.125rem)",
                                paddingTop:
                                    "calc(0.4rem - var(--morph, 0) * 0.15rem)",
                                paddingBottom:
                                    "calc(0.4rem - var(--morph, 0) * 0.15rem)",
                            },
                            indicator: {
                                background: vars.colour.accent,
                            },
                            innerLabel: {
                                color: vars.colour.accentText,
                                fontWeight: 500,
                            },
                            control: {
                                "&[data-active]": {
                                    "& .mantine-SegmentedControl-innerLabel": {
                                        color: vars.colour.accentText,
                                    },
                                },
                            },
                        }}
                    />
                    <div className={morphFieldHelp}>
                        Beginner shows the basics, intermediate adds the core
                        ideas, and advanced opens the deeper notes.
                    </div>
                </div>
            </div>
        </div>
    );
}
