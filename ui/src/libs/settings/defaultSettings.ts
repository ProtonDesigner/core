import {SettingsInterface} from "@libs/settings/settingsType";

const defaultSettings: SettingsInterface = {
    personalization: {
        darkMode: false,
        option: [
            {
                value: "hi",
                selected: false
            }, {
                value: "bye",
                selected: true
            }
        ]
    }
}

export default defaultSettings
