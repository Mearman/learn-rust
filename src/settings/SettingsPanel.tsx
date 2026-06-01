import { MultiSelect, SegmentedControl } from "@mantine/core";
import { vars } from "../theme/theme.css.ts";
import {
    settingsPanel,
    settingsPanelHeader,
    settingsGrid,
    settingsField,
    settingsLabel,
    settingsHelp,
} from "../theme/styles.css.ts";
import {
    DEVELOPER_BACKGROUND_OPTIONS,
    joinDeveloperBackgrounds,
} from "./backgrounds.ts";
import {
    LANGUAGE_FAMILIARITY_OPTIONS,
    joinLanguageFamiliarities,
} from "./languages.ts";
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

interface SettingsPanelProps {
    readonly profile: UserProfile;
    readonly setProfile: UserProfileUpdater;
}

function validateSelections(values: readonly string[], validator: (value: string) => boolean): void {
    for (const value of values) {
        if (!validator(value)) {
            throw new Error(`Invalid selection: ${value}`);
        }
    }
}

export function SettingsPanel({ profile, setProfile }: SettingsPanelProps) {
    const handleBackgrounds = (values: string[]) => {
        validateSelections(values, isDeveloperBackground);
        setProfile((prev) => ({
            ...prev,
            backgrounds: values,
        }));
    };

    const handleFamiliarities = (values: string[]) => {
        validateSelections(values, isLanguageFamiliarity);
        setProfile((prev) => ({
            ...prev,
            familiarities: values,
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
        <section className={settingsPanel} aria-label="Personalise the lessons">
            <div className={settingsPanelHeader}>
                <div style={{ fontSize: "0.875rem", fontWeight: 600, color: vars.colour.text }}>
                    Tailor the examples
                </div>
                <div className={settingsHelp}>
                    Pick your actual background, the languages you know best, and how much detail you want.
                    They’re independent on purpose.
                </div>
            </div>

            <div className={settingsGrid}>
                <div className={settingsField}>
                    <label className={settingsLabel} htmlFor="developer-background">
                        Actual background
                    </label>
                    <MultiSelect
                        id="developer-background"
                        data={DEVELOPER_BACKGROUND_OPTIONS}
                        value={profile.backgrounds}
                        onChange={handleBackgrounds}
                        aria-label="Actual background"
                        placeholder="Select one or more"
                        styles={{
                            input: {
                                background: vars.colour.panel,
                                border: `1px solid ${vars.colour.border}`,
                                color: vars.colour.text,
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
                            pillLabel: {
                                color: vars.colour.text,
                            },
                            pillsList: {
                                gap: "0.375rem",
                            },
                        }}
                    />
                    <div className={settingsHelp}>
                        {profile.backgrounds.length === 0
                            ? "No background selected yet."
                            : `Selected: ${joinDeveloperBackgrounds(profile.backgrounds)}`}
                    </div>
                </div>

                <div className={settingsField}>
                    <label className={settingsLabel} htmlFor="language-familiarity">
                        Language familiarity
                    </label>
                    <MultiSelect
                        id="language-familiarity"
                        data={LANGUAGE_FAMILIARITY_OPTIONS}
                        value={profile.familiarities}
                        onChange={handleFamiliarities}
                        aria-label="Language familiarity"
                        placeholder="Select one or more"
                        styles={{
                            input: {
                                background: vars.colour.panel,
                                border: `1px solid ${vars.colour.border}`,
                                color: vars.colour.text,
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
                            pillLabel: {
                                color: vars.colour.text,
                            },
                            pillsList: {
                                gap: "0.375rem",
                            },
                        }}
                    />
                    <div className={settingsHelp}>
                        {profile.familiarities.length === 0
                            ? "No language selected yet."
                            : `Examples will lean on ${joinLanguageFamiliarities(profile.familiarities)}.`}
                    </div>
                </div>

                <div className={settingsField}>
                    <label className={settingsLabel}>Experience level</label>
                    <SegmentedControl
                        data={EXPERIENCE_OPTIONS}
                        value={profile.experience}
                        onChange={handleExperience}
                        fullWidth
                        styles={{
                            root: {
                                background: vars.colour.panel,
                                border: `1px solid ${vars.colour.border}`,
                            },
                            label: {
                                color: vars.colour.dim,
                                fontSize: "0.875rem",
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
                    <div className={settingsHelp}>
                        Beginner shows the basics, intermediate adds the core ideas, and advanced opens the deeper notes.
                    </div>
                </div>
            </div>
        </section>
    );
}
