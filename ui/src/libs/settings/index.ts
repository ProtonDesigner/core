import type {SettingsInterface} from "./settingsType.js"
import defaultSettings from "./defaultSettings"

interface SettingsManagerOptions {
    isDev?: boolean
    storageKey?: null | string
}

class SettingsManager {
    options: SettingsManagerOptions
    settings: SettingsInterface
    constructor(options: SettingsManagerOptions) {
        this.options = options
    
        this.settings = {}
        this.loadSettingsFromLocalStorage()
    }

    private loadSettingsFromLocalStorage(): void {
        if (localStorage.getItem("settings")) {
            this.settings = this.validateSettings(localStorage.getItem("settings"))
        } else {
            this.initializeSettings()
        }
    }

    private validateSettings(_settings: ReturnType<typeof localStorage.getItem>) {
        const settings = JSON.parse(_settings || "{}") as {[key: string]: any}

        Object.keys(defaultSettings).map(key => {
            const value = defaultSettings[key]
            if (!Object.keys(settings).includes(key)) {
                settings[key] = value
            }
        })

        Object.keys(settings).map(key => {
            if (!Object.keys(defaultSettings).includes(key)) {
                delete settings[key]
            }
        })

        return settings
    }

    saveSettings() {
        localStorage.setItem("settings", JSON.stringify(this.validateSettings(JSON.stringify(this.settings))))
        console.log("Saved settings!")
    }

    private initializeSettings(): void {
        this.settings = defaultSettings
        this.saveSettings()
    }
}

export default SettingsManager
export {
    SettingsManagerOptions,
    SettingsInterface as SettingsType
}
