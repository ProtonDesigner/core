import React, { useEffect, useState } from "react";
import "./marketplace.scss"

import PocketBase from "pocketbase"
import PluginManager from "@libs/plugin";

import GitHubUtils from "@libs/github";
import TauriFS from "@libs/tauriFS";
import ThemeLoader from "@libs/theme";

interface MarketplaceProps {
    pb: PocketBase
    currentUser: any
    setCurrentUser(newState: any): any
    setCurrentPage(newState: any): any
    setState(newState: any): any
    state: object
    pluginManager: PluginManager
    dialogUtils: {
        createDialog: Function,
        setDialog: Function,
        showDialog: Function,
        hideDialog: Function
    }
}

const themeLoader = new ThemeLoader()

interface InfoJSONSchema {
    name: string
    author: string
}

interface ThemeInterface {
    aboutMD: string
    name: string
    styleCSSPath: string
    infoJSON: InfoJSONSchema
}

function MarketplaceItem(props: {
    theme: ThemeInterface
}) {
    const [themeInstalled, setThemeInstalled] = useState(false)

    useEffect(() => {
        (async () => {
            const themes = await themeLoader.getThemes()
            if (themes.includes(`${theme.infoJSON.author}.${theme.infoJSON.name}`)) {
                setThemeInstalled(true)
            }
        })()
    }, [])

    if (themeInstalled) return <></>

    const { theme } = props
    return <div className="marketplace__item">
        <div className="info">
            <b>{theme.infoJSON.name}</b>
            <br />
            By {theme.infoJSON.author}
        </div>
        <br />
        <button style={{
            color: "black"
        }} onClick={(e) => {
            const stylesheet = GitHubUtils.getFile({
                username: "ProtonDesigner",
                repo: "themes",
                file_path: theme.styleCSSPath,
                branch: "develop"
            })
            TauriFS.getHomeDir().then(homeDir => {
                const themeDir = `${homeDir}/.proton/themes/${theme.infoJSON.author}.${theme.infoJSON.name}`
                TauriFS.exists(themeDir).then(dirExists => {
                    if (!dirExists) {
                        TauriFS.mkdir(themeDir)
                    }

                    TauriFS.writeFile(`${themeDir}/style.css`, stylesheet)
                    setThemeInstalled(true)
                })
            })
        }}>Install theme</button>
    </div>
}

function Marketplace<FC>(props: MarketplaceProps) {
    const [themes, setThemes] = useState<ThemeInterface[]>([])

    useEffect(() => {
        if (themes.length !== 0) return
        const themeFolderNames = (GitHubUtils.getDirectory({
            user: "ProtonDesigner",
            repo: "themes",
            path: "themes"
        })) as any[]

        let fetchedThemes: Array<ThemeInterface> = []
        themeFolderNames.forEach(theme => {
            const dir = (GitHubUtils.getDirectory({
                user: "ProtonDesigner",
                repo: "themes",
                path: theme.path
            })) as any[]

            let aboutMD = ""
            const name = theme.name
            let styleCSSPath = ""
            let infoJSON: InfoJSONSchema = {
                name: "You'll never see this",
                author: "Tech10 (developer)"
            }

            dir.map(file => {
                let filename: string = file.name
                const readFile = GitHubUtils.getFile({
                    username: "ProtonDesigner",
                    repo: "themes",
                    file_path: file.path,
                    branch: "develop"
                })
                if (filename.toLowerCase() == "about.md") {
                    aboutMD = readFile
                } else if (filename.toLowerCase() == "info.json") {
                    infoJSON = JSON.parse(readFile)
                } else if (filename.toLowerCase() == "style.css") {
                    styleCSSPath = file.path
                }
            })
            
            fetchedThemes.push({
                aboutMD,
                infoJSON,
                name,
                styleCSSPath
            })
        })

        console.log(fetchedThemes)
        setThemes(fetchedThemes)
    }, [])

    return <div className="marketplace">
        <h2>Marketplace</h2>
        <p>The Marketplace is the tab where users can share their own custom made themes for Proton! Check some out below.</p>
        <p>
            <a href="https://github.com/ProtonDesigner/themes/" target={"_blank"}>
                Theme Index (open in default browser)
            </a>
        </p>
        <div className="themes">
            {themes && themes.map(theme => {
                return <MarketplaceItem theme={theme} />
            })}
        </div>
    </div>
}

export default Marketplace
