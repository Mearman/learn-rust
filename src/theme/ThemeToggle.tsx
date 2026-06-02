import { SegmentedControl } from "@mantine/core";
import { vars } from "../theme/theme.css.ts";
import { morphThemeToggle, morphThemeLabel } from "../theme/styles.css.ts";
import { isThemeMode, type ThemeMode } from "../theme/useThemeMode.ts";

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
        <div className={morphThemeToggle}>
            <label className={morphThemeLabel}>Theme</label>
            <SegmentedControl
                data={[...THEME_OPTIONS]}
                value={mode}
                onChange={(value) => {
                    if (isThemeMode(value)) onChange(value);
                }}
                size="xs"
                aria-label="Theme"
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
                        color: vars.colour.accentText,
                        fontWeight: 500,
                        fontSize: "0.75rem",
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
        </div>
    );
}
