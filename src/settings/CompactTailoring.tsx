import { MultiSelect, SegmentedControl } from "@mantine/core";
import { vars } from "../theme/theme.css.ts";
import {
    compactStrip,
    compactStripTitle,
    compactStripControls,
    compactStripField,
    compactStripLabel,
} from "../theme/styles.css.ts";
import { DEVELOPER_BACKGROUND_OPTIONS } from "./backgrounds.ts";
import { LANGUAGE_FAMILIARITY_OPTIONS } from "../data/languages.ts";
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

interface CompactTailoringProps {
    readonly profile: UserProfile;
    readonly setProfile: UserProfileUpdater;
}

function validateSelections(
    values: readonly string[],
    validator: (value: string) => boolean
): void {
    for (const value of values) {
        if (!validator(value)) {
            throw new Error(`Invalid selection: ${value}`);
        }
    }
}

export function CompactTailoring({
    profile,
    setProfile,
}: CompactTailoringProps) {
    const handleBackgrounds = (values: string[]) => {
        validateSelections(values, isDeveloperBackground);
        const narrowed = values.filter(isDeveloperBackground);
        setProfile((prev) => ({
            ...prev,
            backgrounds: narrowed,
        }));
    };

    const handleFamiliarities = (values: string[]) => {
        validateSelections(values, isLanguageFamiliarity);
        const narrowed = values.filter(isLanguageFamiliarity);
        setProfile((prev) => ({
            ...prev,
            familiarities: narrowed,
        }));
    };

    const handleExperience = (value: string) => {
        if (!isExperienceLevel(value)) {
            throw new Error(`Unknown experience level: ${value}`);
        }
        setProfile((prev) => ({
            ...prev,
            experience: value,
        }));
    };

    return (
        <div className={compactStrip} aria-label="Quick tailoring controls">
            <span className={compactStripTitle}>
                Rust{" "}
                <span style={{ color: vars.colour.accent }}>by concept</span>
            </span>

            <div className={compactStripControls}>
                <div className={compactStripField}>
                    <span className={compactStripLabel}>Background</span>
                    <MultiSelect
                        size="xs"
                        data={DEVELOPER_BACKGROUND_OPTIONS}
                        value={[...profile.backgrounds]}
                        onChange={handleBackgrounds}
                        aria-label="Actual background"
                        placeholder="Any"
                        maxDropdownHeight={200}
                        styles={{
                            input: {
                                background: vars.colour.panel2,
                                border: `1px solid ${vars.colour.border}`,
                                color: vars.colour.text,
                                minHeight: "1.75rem",
                            },
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
                        }}
                    />
                </div>

                <div className={compactStripField}>
                    <span className={compactStripLabel}>Languages</span>
                    <MultiSelect
                        size="xs"
                        data={LANGUAGE_FAMILIARITY_OPTIONS}
                        value={[...profile.familiarities]}
                        onChange={handleFamiliarities}
                        aria-label="Language familiarity"
                        placeholder="Any"
                        maxDropdownHeight={200}
                        styles={{
                            input: {
                                background: vars.colour.panel2,
                                border: `1px solid ${vars.colour.border}`,
                                color: vars.colour.text,
                                minHeight: "1.75rem",
                            },
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
                        }}
                    />
                </div>

                <div className={compactStripField}>
                    <span className={compactStripLabel}>Level</span>
                    <SegmentedControl
                        size="xs"
                        data={[...EXPERIENCE_OPTIONS]}
                        value={profile.experience}
                        onChange={handleExperience}
                        styles={{
                            root: {
                                background: vars.colour.panel2,
                                border: `1px solid ${vars.colour.border}`,
                            },
                            label: {
                                color: vars.colour.dim,
                                fontSize: "0.75rem",
                                paddingTop: "0.2rem",
                                paddingBottom: "0.2rem",
                            },
                            indicator: {
                                background: vars.colour.accent,
                            },
                            innerLabel: {
                                color: "#1a0f08",
                                fontWeight: 500,
                            },
                            control: {
                                "&[data-active]": {
                                    "& .mantine-SegmentedControl-innerLabel": {
                                        color: "#1a0f08",
                                    },
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
