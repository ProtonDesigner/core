import * as path from "path"

import TauriFS from "@libs/tauriFS"

class ThemeLoader {
    INIT_CONSTANT = "style.scss"

    constructor() {}

    async getThemes(): Promise<string[]> {
        return await TauriFS.listDir(path.join(await TauriFS.getHomeDir(), ".proton", "themes"))
    }

    async loadTheme(themeName: string): Promise<boolean> {
        const themes = await this.getThemes()
        const THEME_PATH = path.join(await TauriFS.getHomeDir(), ".proton", "themes")
        
        if (!themes.includes(themeName)) {
            return false
        }

        const styleContents = await TauriFS.readFile(path.join(THEME_PATH, themeName, "style.css"))

        const styleTag = document.createElement("style")
        styleTag.innerText = styleContents
        document.head.appendChild(styleTag)

        return true
    }
}

export default ThemeLoader
