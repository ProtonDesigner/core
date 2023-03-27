import React, { useState, useEffect } from "react"
import SettingsManager from "@libs/settings"
import ThemeLoader from "@libs/theme"

const themeLoader = new ThemeLoader()

function ThemeSettingPanel(props: {}) {
    const [themes, setThemes] = useState<string[]>([])
    
    function getSetThemes() {
        themeLoader.getThemes().then(themes => {
            setThemes(themes)
        })
    }

    useEffect(() => {
        getSetThemes()
    }, [])
    

    if (themes.length == 0) return <>You have no themes installed! Go to the Marketplace to get some themes :)</>

    return <div>
        {themes && themes.map(themeName => <>
            <h3>{themeName}</h3>
            <br />
            <button onClick={ (e) => {
                themeLoader.setDefaultTheme(themeName)
                themeLoader.loadTheme()
            } } style={{
                color: "black"
            }}>Set "{themeName}" as default theme</button>
            {" "}
            <button style={{
                color: "black"
            }} onClick={(e) => {
                themeLoader.deleteTheme(themeName)
                getSetThemes()
                themeLoader.getDefaultTheme().then(defaultTheme => {
                    if (defaultTheme == themeName) {
                        themeLoader.setDefaultTheme("")
                        window.location.reload()
                    }
                })
            }}>
                Delete "{themeName}"
            </button>
            <br />
            <br />
        </>)}
        <hr />
        <br />
        <button onClick={(e) => {
            themeLoader.setDefaultTheme("")
            window.location.reload()
        }} style={{
            color: "black"
        }}>Revert to default theme</button>
    </div>
}

export default ThemeSettingPanel
