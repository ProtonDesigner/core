import React, { useState, FC } from 'react';
import { createRoot } from "react-dom/client";

import Home from "./screens/home/Home"
import Editor from "./screens/editor/Editor"
import PluginManager from './libs/plugin';
import Dialog from './components/Dialog';

import { invoke } from "@tauri-apps/api"
import { appLogDir } from "@tauri-apps/api/path"
import SettingsManager, { SettingsManagerOptions, SettingsType } from "@libs/settings"

declare global {
    interface Window {
        customNamespace: {
            DEBUG: boolean
        }
    }
}

window.customNamespace = window.customNamespace || {}
window.customNamespace.DEBUG = window.location.href === "http://localhost:5173/"

invoke("greet", { name: "world "}).then(response => {
    console.log(response)
})

import "./main.scss"
import ErrorBoundary from './ErrorBoundary';

const pluginManager = new PluginManager()
const settingsManager = new SettingsManager({})

const pages = [
    Home,
    () => {return <></>},
    Editor
]

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

    return <React.StrictMode>
        <Dialog title={dialogTitle} show={dialogShow} setShow={setDialogShow}>
            {dialogContents}
        </Dialog>

        <Screen
            className="app"
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
    </React.StrictMode>
}

async function log(infoLevel: "info" | "warn" | "error" | "err", message: string) {
}

const node = document.getElementById("app");
const root = createRoot(node!);

root.render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
)