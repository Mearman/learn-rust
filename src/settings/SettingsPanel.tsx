import { useState } from "react";
import { Settings } from "lucide-react";
import { Drawer, Select, SegmentedControl } from "@mantine/core";
import { vars } from "../theme/theme.css.ts";
import { settingsTrigger } from "../theme/styles.css.ts";
import type { UserProfile, UserProfileUpdater } from "./types.ts";
import { isBackgroundLanguage, isExperienceLevel } from "./types.ts";

const BACKGROUND_OPTIONS = [
    { value: "none", label: "No background" },
    { value: "python", label: "Python" },
    { value: "typescript", label: "TypeScript" },
    { value: "java", label: "Java" },
    { value: "kotlin", label: "Kotlin" },
    { value: "go", label: "Go" },
    { value: "csharp", label: "C#" },
    { value: "cpp", label: "C++" },
] as const;

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
    const [opened, setOpened] = useState(false);

    const handleBackground = (value: string | null) => {
        if (value === null) return;
        if (!isBackgroundLanguage(value)) {
            throw new Error(`Unknown background language: ${value}`);
        }
        setProfile((prev) => ({
            ...prev,
            background: value,
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
        <>
            <button
                className={settingsTrigger}
                onClick={() => {
                    setOpened(true);
                }}
                aria-label="Open settings"
                type="button"
            >
                <Settings size={16} />
            </button>

            <Drawer
                opened={opened}
                onClose={() => {
                    setOpened(false);
                }}
                title="Settings"
                position="right"
                overlayProps={{ backgroundOpacity: 0.35, blur: 2 }}
                styles={{
                    content: {
                        background: vars.colour.panel,
                        borderLeft: `1px solid ${vars.colour.border}`,
                    },
                    header: {
                        background: vars.colour.panel,
                        borderBottom: `1px solid ${vars.colour.borderSoft}`,
                        color: vars.colour.text,
                    },
                    title: {
                        fontWeight: 600,
                        color: vars.colour.text,
                    },
                    close: {
                        color: vars.colour.dim,
                        "&:hover": {
                            background: vars.colour.panel2,
                            color: vars.colour.text,
                        },
                    },
                    body: {
                        color: vars.colour.text,
                    },
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.5rem",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem",
                        }}
                    >
                        <label
                            style={{
                                fontSize: "0.875rem",
                                fontWeight: 500,
                                color: vars.colour.dim,
                            }}
                        >
                            Your background
                        </label>
                        <Select
                            data={BACKGROUND_OPTIONS.map((o) => ({
                                value: o.value,
                                label: o.label,
                            }))}
                            value={profile.background}
                            onChange={handleBackground}
                            allowDeselect={false}
                            styles={{
                                input: {
                                    background: vars.colour.panel2,
                                    border: `1px solid ${vars.colour.border}`,
                                    color: vars.colour.text,
                                },
                                dropdown: {
                                    background: vars.colour.panel2,
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
                    </div>

                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "0.5rem",
                        }}
                    >
                        <label
                            style={{
                                fontSize: "0.875rem",
                                fontWeight: 500,
                                color: vars.colour.dim,
                            }}
                        >
                            Experience level
                        </label>
                        <SegmentedControl
                            data={EXPERIENCE_OPTIONS.map((o) => ({
                                value: o.value,
                                label: o.label,
                            }))}
                            value={profile.experience}
                            onChange={handleExperience}
                            fullWidth
                            styles={{
                                root: {
                                    background: vars.colour.panel2,
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
                                        "& .mantine-SegmentedControl-innerLabel":
                                            {
                                                color: "#1a0f08",
                                            },
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            </Drawer>
        </>
    );
}
