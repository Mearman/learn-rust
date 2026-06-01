import { useEffect, type ReactNode } from "react";
import "@mantine/core/styles.css";
import { MantineProvider, createTheme } from "@mantine/core";
import { vars, darkTheme } from "./theme.css.js";
import "./styles.css.js";

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
    useEffect(() => {
        document.documentElement.classList.add(darkTheme);
    }, []);

    return <>{children}</>;
}

export function AppProvider({ children }: { children: ReactNode }) {
    return (
        <MantineProvider theme={rbcTheme} defaultColorScheme="dark">
            <ThemeSync>{children}</ThemeSync>
        </MantineProvider>
    );
}
