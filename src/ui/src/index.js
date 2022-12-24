import React, { useState } from 'react';
import { render } from "react-dom";

import Home from "./screens/home/Home"
import Settings from "./screens/settings/Settings"
import Editor from "./screens/editor/Editor"

import "./main.scss"

const pages = {
    "home": {
        component: Home
    },
    "settings": {
        component: Settings
    },
    "editor": {
        component: Editor
    }
}

function App(props) {
    const [state, setState] = useState({})
    const [currentPage, setPage] = useState("home")

    let Screen = pages[currentPage]

    return <Screen state={state} setState={setState} setPage={setPage} />
}

const appDiv = document.getElementById("app");
render(<App />, appDiv);