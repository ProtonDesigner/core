import * as path from "path"

class ThemeLoader {
    constructor() {}

    getTheme(themeFilePath: string) {
        let finalJSON: any;

        window.electronAPI.readThemeFile(themeFilePath, (data: object) => {
            finalJSON = data
        })

        return finalJSON
    }
}

export default ThemeLoader
