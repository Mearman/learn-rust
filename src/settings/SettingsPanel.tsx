import { Select, SegmentedControl } from "@mantine/core";
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
    developerBackgroundLabel,
} from "./backgrounds.ts";
import {
    LANGUAGE_FAMILIARITY_OPTIONS,
    languageFamiliarityLabel,
} from "./languages.ts";
import type { UserProfile, UserProfileUpdater } from "./types.ts";
import { isDeveloperBackground, isLanguageFamiliarity, isExperienceLevel } from "./types.ts";

const EXPERIENCE_OPTIONS = [
    { value: "beginner", label: "Beginner" },
    { value: "intermediate", label: "Intermediate" },
    { value: "advanced", label: "Advanced" },
] as const;

interface SettingsPanelProps {
    readonly profile: UserProfile;
    readonly setProfile: UserProfileUpdater;
}

export function SettingsPanel({ profile, setProfile }: SettingsPanelProps) {
    const handleBackground = (value: string | null) => {
        if (value === null) return;
        if (!isDeveloperBackground(value)) {
            throw new Error(`Unknown developer background: ${value}`);
        }
        setProfile((prev) => ({
            ...prev,
            background: value,
        }));
    };

    const handleFamiliarity = (value: string | null) => {
        if (value === null) return;
        if (!isLanguageFamiliarity(value)) {
            throw new Error(`Unknown language familiarity: ${value}`);
        }
        setProfile((prev) => ({
            ...prev,
            familiarity: value,
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
                    Pick your actual background, the language you know best, and how much detail you want.
                    They’re independent on purpose.
                </div>
            </div>

            <div className={settingsGrid}>
                <div className={settingsField}>
                    <label className={settingsLabel} htmlFor="developer-background">
                        Actual background
                    </label>
                    <Select
                        id="developer-background"
                        data={DEVELOPER_BACKGROUND_OPTIONS}
                        value={profile.background}
                        onChange={handleBackground}
                        allowDeselect={false}
                        aria-label="Actual background"
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
                        }}
                    />
                    <div className={settingsHelp}>
                        {profile.background === "none"
                            ? "No background selected yet."
                            : `We’ll keep this separate from language familiarity: ${developerBackgroundLabel(profile.background)}`}
                    </div>
                </div>

                <div className={settingsField}>
                    <label className={settingsLabel} htmlFor="language-familiarity">
                        Language familiarity
                    </label>
                    <Select
                        id="language-familiarity"
                        data={LANGUAGE_FAMILIARITY_OPTIONS}
                        value={profile.familiarity}
                        onChange={handleFamiliarity}
                        allowDeselect={false}
                        aria-label="Language familiarity"
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
                        }}
                    />
                    <div className={settingsHelp}>
                        {profile.familiarity === "none"
                            ? "No language selected yet."
                            : `Examples will lean on ${languageFamiliarityLabel(profile.familiarity)}.`}
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
