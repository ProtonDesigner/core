import React, { useState, FC } from 'react';
import { createRoot } from "react-dom/client";

import Home from "./screens/home/Home"
import Editor from "./screens/editor/Editor"
import PluginManager from './libs/plugin';

import "./main.scss"

const pluginManager = new PluginManager()

const pages = [
    Home,
    () => {return <></>},
    Editor
]

function App<FC>(props: any) {
    const [state, setState] = useState({})
    const [currentPage, setPage] = useState(0)

    const setNewPage = (page: number) => {
        setPage(page)
    }

    let Screen = pages[currentPage]

    return <React.StrictMode>
        <Screen
            className="app"
            state={state}
            setState={setState}
            setPage={setNewPage}
            pluginManager={pluginManager}
        />
    </React.StrictMode>
}

const node = document.getElementById("app");
const root = createRoot(node!)
root.render(<App />)
