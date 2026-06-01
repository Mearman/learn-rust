import { useEffect, type ReactNode } from "react";
import "@mantine/core/styles.css";
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
