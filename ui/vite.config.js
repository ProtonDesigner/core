import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path-browserify"
import wasm from "vite-plugin-wasm"

export default defineConfig({
    root: ".",
    clearScreen: false,
    server: {
        strictPort: true
    },
    envPrefix: ["VITE_", "TAURI_"],
    build: {
        outDir: "./dist",
        target: "esnext",
        minify: !process.env.TAURI_DEBUG  ? "esbuild" : false,
        sourcemap: !process.env.TAURI_DEBUG,
        commonjsOptions: {
            transformMixedEsModules: true
        }
    },
    plugins: [
        react({
            include: "**/*.{jsx,tsx}"
        }),
        wasm()
    ],
    publicDir: "assets",
    resolve: {
        alias: {
            path: "path-browserify",
            "@components": path.resolve(__dirname, "/src/components"),
            "@libs": path.resolve(__dirname, "/src/libs"),
            "@screens": path.resolve(__dirname, "/src/screens"),
            "@root": path.resolve(__dirname, "/src")
        }
    }
})
