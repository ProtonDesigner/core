import React from "react"
import "./settings.scss"
import PocketBase from "pocketbase"

import Tabs, { Tab } from "@components/Tabs"
import PluginManager from "@libs/plugin"

import General from "./General"
import PluginSettings from "./PluginSettings"

interface SettingsProps {
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

export default function Settings(props: SettingsProps) {
    return <div className="settings">
        <Tabs className="settings__tabs" tabs={[
            {
                title: "General",
                content: <General />
            },
            {
                title: "Plugins",
                content: <PluginSettings pluginManager={props.pluginManager} />
            }
        ]} />
    </div>
}
