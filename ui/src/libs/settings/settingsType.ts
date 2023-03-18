interface SettingsInterface {
    personalization?: {
        darkMode: boolean,
        option: [
            {
                value: "hi",
                selected: boolean
            }, {
                value: "bye",
                selected: boolean
            }
        ]
    }
    [key: string]: any
}

export type {SettingsInterface}
