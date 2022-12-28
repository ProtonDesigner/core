import React, { useState } from 'react';
import { render } from "react-dom";

import Home from "./screens/home/Home"
import Settings from "./screens/settings/Settings"
import Editor from "./screens/editor/Editor"

import "./main.scss"

const pages = [
    Home,
    Settings,
    Editor
]

function App(props: any) {
    const [state, setState] = useState({})
    const [currentPage, setPage] = useState(0)

    let Screen = pages[currentPage]

    return <Screen className="app" state={state} setState={setState} setPage={setPage} />
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);