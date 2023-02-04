import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path-browserify"

export default defineConfig({
    root: ".",
    build: {
        outDir: "./dist"
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
