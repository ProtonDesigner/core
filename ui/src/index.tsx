import React, { useState, FC } from 'react';
import { createRoot } from "react-dom/client";

import Home from "./screens/home/Home"
import Editor from "./screens/editor/Editor"
import PluginManager from './libs/plugin';
import Dialog from './components/Dialog';

import { open } from "@tauri-apps/api/shell"
import SettingsManager, { SettingsManagerOptions, SettingsType } from "@libs/settings"
import { initConfigDirs } from '@libs/configFiles';

import "./DarkMode.scss"

// Opening links in the default browser
Object.values(document.getElementsByTagName("a")).map(anchorElement => {
    if (anchorElement.target == "_blank") {
        anchorElement.onclick = (e) => {
            open(
                anchorElement.href
            )
        }
    }
})

initConfigDirs()

declare global {
    interface Window {
        customNamespace: {
            DEBUG: boolean
        }
    }
}

window.customNamespace = window.customNamespace || {}
window.customNamespace.DEBUG = window.location.href === "http://localhost:5173/"

import ThemeLoader from '@libs/theme';

// invoke("greet", { name: "world "}).then(response => {
//     console.log(response)
// })

// invoke("list_dir", { directory: "C:\\" }).then((response) => {
//     const data = response as string[]
//     console.log(data)
// })

import "./main.scss"
import ErrorBoundary from './ErrorBoundary';

const pluginManager = new PluginManager()
const settingsManager = new SettingsManager({})
const themeLoader = new ThemeLoader()

const pages = [
    Home,
    () => {return <></>},
    Editor
]

themeLoader.loadTheme()

function App<FC>(props: any) {
    const [state, setState] = useState({})
    const [currentPage, setPage] = useState(0)

    const [dialogTitle, setDialogTitle] = useState("")
    const [dialogContents, setDialogContents] = useState(<></>)
    const [dialogShow, setDialogShow] = useState(false)

    const setNewPage = (page: number) => {
        setPage(page)
    }

    let Screen = pages[currentPage]

    function createDialog(title: string, contents: JSX.Element) {
        console.log(title, contents)
        const newDialog = {
            title: title,
            contents: contents,
            show: false
        }
        return newDialog
    }

    // the `dialog` parameter is just the return type of `createDialog`
    function setDialog(dialog: ReturnType<typeof createDialog>) {
        setDialogTitle(dialog.title)
        setDialogContents(dialog.contents)
        setDialogShow(dialog.show)
    }

    function showDialog() {
        setDialogShow(true)
    }

    function hideDialog() {
        setDialogShow(false)
    }

    return <>
        <Dialog title={dialogTitle} show={dialogShow} setShow={setDialogShow}>
            {dialogContents}
        </Dialog>

        <Screen
            className={`app ${settingsManager.settings.personalization?.darkMode ? "dark" : ""}`}
            state={state}
            setState={setState}
            setPage={setNewPage}
            pluginManager={pluginManager}
            dialogUtils={{
                createDialog,
                setDialog,
                showDialog,
                hideDialog
            }}
            settingsManager={settingsManager}
        />
    </>
}

async function log(infoLevel: "info" | "warn" | "error" | "err", message: string) {
}

const node = document.getElementById("app");
const root = createRoot(node!);

root.render(
    <React.StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </React.StrictMode>
)