import { configDefaults, defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

// Two projects:
//  - "unit": the existing logic tests, run in node with no plugins (fast).
//  - "browser": *.browser.test.tsx run in a real Chromium via Playwright, with
//    the app's Vite plugins so JSX, the React compiler, and the vanilla-extract
//    CSS all compile — without real CSS there is no layout to measure.
export default defineConfig({
    test: {
        passWithNoTests: true,
        projects: [
            {
                test: {
                    name: "unit",
                    // Keep Vitest's default include (covers the eslint-rules
                    // tests outside src/ too) and just exclude the browser test.
                    exclude: [
                        ...configDefaults.exclude,
                        "**/*.browser.test.{ts,tsx}",
                    ],
                },
            },
            {
                plugins: [
                    react(),
                    babel({ presets: [reactCompilerPreset()] }),
                    vanillaExtractPlugin(),
                ],
                test: {
                    name: "browser",
                    include: ["src/**/*.browser.test.{ts,tsx}"],
                    browser: {
                        enabled: true,
                        provider: playwright(),
                        headless: true,
                        instances: [{ browser: "chromium" }],
                    },
                },
            },
        ],
    },
});
