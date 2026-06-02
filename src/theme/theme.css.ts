import { createThemeContract, createTheme } from "@vanilla-extract/css";

export const vars = createThemeContract({
    colour: {
        bg: null,
        panel: null,
        panel2: null,
        code: null,
        border: null,
        borderSoft: null,
        text: null,
        dim: null,
        faint: null,
        accent: null,
        accentSoft: null,
        accentDim: null,
        accentText: null,
        good: null,
        goodDim: null,
        bad: null,
        badDim: null,
    },
    tok: {
        default: null,
        comment: null,
        docComment: null,
        string: null,
        lifetime: null,
        macro: null,
        keyword: null,
        type: null,
        number: null,
        attribute: null,
    },
});

export const darkTheme = createTheme(vars, {
    colour: {
        bg: "#0c0b0a",
        panel: "#161412",
        panel2: "#1e1b18",
        code: "#100f0d",
        border: "#2c2823",
        borderSoft: "#221f1b",
        text: "#ece7e0",
        dim: "#a39c91",
        faint: "#6e675d",
        accent: "#e2703a",
        accentSoft: "#f0915f",
        accentDim: "#5a3526",
        // Dark text on #e2703a: contrast 5.93:1 (WCAG AA)
        accentText: "#1a0f08",
        good: "#5dd6a0",
        goodDim: "#1c3b30",
        bad: "#ee6a6a",
        badDim: "#3d2120",
    },
    tok: {
        default: "#ece7e0",
        comment: "#736a5e",
        docComment: "#8a9e6e",
        string: "#b6d98c",
        lifetime: "#e7a6e0",
        macro: "#74c7d4",
        keyword: "#f0915f",
        type: "#e6c878",
        number: "#e89a6a",
        attribute: "#c4a87a",
    },
});

export const lightTheme = createTheme(vars, {
    colour: {
        bg: "#f8f6f3",
        panel: "#ffffff",
        panel2: "#f0ede8",
        code: "#f5f3ef",
        border: "#ddd8d0",
        borderSoft: "#e8e4dc",
        text: "#1c1917",
        dim: "#57534e",
        // Darkened from #a8a29e (2.16:1 worst) → #706a64 (4.57:1 worst, WCAG AA)
        faint: "#706a64",
        // Darkened from #d45a25 (3.40:1 worst) → #b8481c (4.52:1 worst, WCAG AA)
        accent: "#b8481c",
        // Darkened from #e87040 (2.64:1 worst) → #a0441c (5.39:1 worst, WCAG AA)
        accentSoft: "#a0441c",
        accentDim: "#fde8df",
        // White on #b8481c: contrast 5.27:1 (WCAG AA)
        accentText: "#ffffff",
        // Darkened from #16a34a (3.87:1 worst) → #147a3a (4.64:1 worst, WCAG AA)
        good: "#147a3a",
        goodDim: "#dcfce7",
        // Darkened from #dc2626 (4.14:1 worst) → #ce1f1f (4.68:1 worst, WCAG AA)
        bad: "#ce1f1f",
        badDim: "#fee2e2",
    },
    tok: {
        default: "#1c1917",
        comment: "#9ca3af",
        docComment: "#6b8f3e",
        string: "#65a30d",
        lifetime: "#c026d3",
        macro: "#0891b2",
        keyword: "#d45a25",
        type: "#b45309",
        number: "#d97706",
        attribute: "#92650a",
    },
});
