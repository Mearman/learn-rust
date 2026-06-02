import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

export default defineConfig({
    plugins: [
        react(),
        babel({ presets: [reactCompilerPreset()] }),
        vanillaExtractPlugin(),
    ],
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx", ".css.ts"],
    },
    base: process.env.BASE_URL ?? "/",
    build: {
        outDir: "dist",
        rolldownOptions: {
            output: {
                // Split the rarely-changing framework runtime into a stable
                // vendor chunk so it caches independently of app code. React
                // and Mantine ship on (nearly) every page view but change only
                // on dependency upgrades; keeping them out of the entry chunk
                // means an app-code edit no longer invalidates them.
                // `[\\/]` matches the path separator portably (Windows-safe).
                codeSplitting: {
                    groups: [
                        {
                            name: "react-vendor",
                            test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/,
                            priority: 2,
                        },
                        {
                            name: "mantine-vendor",
                            test: /node_modules[\\/]@mantine[\\/]/,
                            priority: 1,
                        },
                    ],
                },
            },
        },
    },
});
