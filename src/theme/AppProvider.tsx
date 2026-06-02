import { useEffect, type ReactNode } from "react";
// Granular per-component Mantine CSS instead of the full bundle. The app only
// uses MultiSelect, SegmentedControl, Collapse and TextInput, so only their
// styles (plus the three core layers) need shipping. The core layers —
// baseline (CSS reset), default-css-variables (theme tokens), and global
// (root/body rules) — are required regardless of which components are used.
// MultiSelect composes Combobox + Input + Pill + PillsInput + ScrollArea +
// Popover; TextInput composes Input + InlineInput; Collapse has no dedicated
// stylesheet (its transition is applied inline).
import "@mantine/core/styles/baseline.css";
import "@mantine/core/styles/default-css-variables.css";
import "@mantine/core/styles/global.css";
import "@mantine/core/styles/Input.css";
import "@mantine/core/styles/InlineInput.css";
import "@mantine/core/styles/Combobox.css";
import "@mantine/core/styles/Pill.css";
import "@mantine/core/styles/PillsInput.css";
import "@mantine/core/styles/ScrollArea.css";
import "@mantine/core/styles/Popover.css";
import "@mantine/core/styles/SegmentedControl.css";
import { MantineProvider, createTheme } from "@mantine/core";
import { vars, darkTheme, lightTheme } from "./theme.css.ts";
import { useThemeMode } from "./useThemeMode.ts";
import "./styles.css.ts";

const rbcTheme = createTheme({
    primaryColor: "rbc",
    colors: {
        rbc: [
            vars.colour.accentDim,
            "#fde8df",
            "#f5c9b5",
            "#edaa8b",
            "#e48b61",
            vars.colour.accent,
            vars.colour.accentSoft,
            "#a8532e",
            "#8a4020",
            "#6e3218",
        ],
    },
    defaultRadius: "md",
    fontFamily: "system-ui, -apple-system, sans-serif",
});

function ThemeSync({ children }: { children: ReactNode }) {
    const { resolved } = useThemeMode();

    useEffect(() => {
        const root = document.documentElement;
        // Remove both theme classes, then apply the resolved one
        root.classList.remove(darkTheme, lightTheme);
        root.classList.add(resolved === "dark" ? darkTheme : lightTheme);
    }, [resolved]);

    return <>{children}</>;
}

export function AppProvider({ children }: { children: ReactNode }) {
    const { resolved } = useThemeMode();

    return (
        <MantineProvider
            theme={rbcTheme}
            defaultColorScheme="dark"
            forceColorScheme={resolved}
        >
            <ThemeSync>{children}</ThemeSync>
        </MantineProvider>
    );
}
