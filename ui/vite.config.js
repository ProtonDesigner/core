import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path-browserify"

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
        sourcemap: !process.env.TAURI_DEBUG
    },
    plugins: [
        react({
            include: "**/*.{jsx,tsx}"
        })
    ],
    publicDir: "assets",
    resolve: {
        alias: {
            path: "path-browserify"
        }
    }
})
