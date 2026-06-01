import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";

export default defineConfig({
    plugins: [
        react(),
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
