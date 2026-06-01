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
    },
});
