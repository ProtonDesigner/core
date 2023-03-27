import * as path from "path"

import TauriFS from "@libs/tauriFS"
import { v4 as uuidV4 } from "uuid"

class ThemeLoader {
    INIT_CONSTANT = "style.scss"

    theme_names: Array<string>

    constructor() {
        this.theme_names = []
    }

    async getThemes(): Promise<string[]> {
        return await TauriFS.listDir(path.join(await TauriFS.getHomeDir(), ".proton", "themes"))
    }

    async setDefaultTheme(themeName: string): Promise<void> {
        localStorage.setItem("defaultTheme", themeName)
    }

    async getDefaultTheme(): Promise<string> {
        return localStorage.getItem("defaultTheme") || ""
    }

    async loadTheme(): Promise<boolean> {
        return await this.loadThemeWithName(await this.getDefaultTheme())
    }

    async deleteTheme(themeName: string): Promise<void> {
        await TauriFS.rmdir(`${await TauriFS.getHomeDir()}/.proton/themes/${themeName}`)
    }

    async loadThemeWithName(themeName: string): Promise<boolean> {
        const themes = await this.getThemes()
        const THEME_PATH = path.join(await TauriFS.getHomeDir(), ".proton", "themes")

        if (themeName == "") return false
        if (!themes.includes(themeName)) return false

        let themeLoaded = false
        this.theme_names.map(_themeName => {
            if (themeLoaded) return
            if (themeName == _themeName) themeLoaded = true
        })

        if (themeLoaded) return false

        const styleContents = await TauriFS.readFile(path.join(THEME_PATH, themeName, "style.css"))

        const styleTag = document.createElement("style")
        styleTag.innerText = styleContents

        this.theme_names.push(themeName)

        document.head.appendChild(styleTag)

        return true
    }
}

export default ThemeLoader
