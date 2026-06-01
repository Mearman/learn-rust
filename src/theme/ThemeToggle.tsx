import { SegmentedControl } from "@mantine/core";
import { vars } from "../theme/theme.css.ts";
import { settingsLabel } from "../theme/styles.css.ts";
import type { ThemeMode } from "../theme/useThemeMode.ts";

interface ThemeToggleProps {
    readonly mode: ThemeMode;
    readonly onChange: (mode: ThemeMode) => void;
}

const THEME_OPTIONS = [
    { value: "auto", label: "Auto" },
    { value: "dark", label: "Dark" },
    { value: "light", label: "Light" },
] as const satisfies readonly (
    | ThemeMode
    | { readonly value: ThemeMode; readonly label: string }
)[];

export function ThemeToggle({ mode, onChange }: ThemeToggleProps) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <label className={settingsLabel}>Theme</label>
            <SegmentedControl
                data={[...THEME_OPTIONS]}
                value={mode}
                onChange={(value) => {
                    if (value === "auto" || value === "dark" || value === "light") {
                        onChange(value);
                    }
                }}
                size="xs"
                styles={{
                    root: {
                        background: vars.colour.panel,
                        border: `1px solid ${vars.colour.border}`,
                    },
                    label: {
                        color: vars.colour.dim,
                        fontSize: "0.75rem",
                    },
                    indicator: {
                        background: vars.colour.accent,
                    },
                    innerLabel: {
                        color: "#1a0f08",
                        fontWeight: 500,
                        fontSize: "0.75rem",
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
    );
}
