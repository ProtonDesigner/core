import React, { RefObject, useRef, useState } from "react"
import "./settings.scss"
import PocketBase from "pocketbase"

import PluginManager from "@libs/plugin"

import General from "./General"
import PluginSettings from "./PluginSettings"
import TabbedSidebar, { Tab } from "@components/TabbedSidebar"

import SettingsManager from "@libs/settings"
import capitalizeFirstLetter from "@libs/utils/capitalizeFirstLetter"
import addSpaceAtCapitals from "@libs/utils/addSpaceAtCaptials"

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

const settingsManager = new SettingsManager({})

export default function Settings(props: SettingsProps) {
    let tabs: Array<Tab> = [{
        title: "Welcome",
        content: <>
            Welcome to Proton Designer!
        </>
    }]

    function generateTabs(_object: { [key: string]: any }, level: number, inputRef: RefObject<HTMLInputElement>, inputState: ReturnType<typeof useState<string>>) {
        Object.keys(_object).map(objKey => {
            const value = _object[objKey]
            const [inpState, setInpState] = inputState
                        // setInpState("")

            console.log(objKey, value)

            if (typeof value == "object") {
                console.log(value)
                let content = <></>
                function getContent(value: any, key: string) {
                    const valueType = typeof value

                    if (valueType == "boolean") {
                        return <select onChange={e => {
                            const boolValue = e.target.value == "true"
                            settingsManager.settings[objKey][key] = boolValue
                            settingsManager.saveSettings()
                        }} name="value" defaultValue={settingsManager.settings[objKey][key] ? "true" : "false"}>
                            <option value={"true"}>On</option>
                            <option value={"false"}>Off</option>
                        </select>
                    } else if (valueType == "string") {
                        return <input type={valueType} ref={inputRef} value={inpState} onChange={(e) => {
                            setInpState(e.target.value)
                            
                            settingsManager.settings[objKey][key] = e.target.value
                            settingsManager.saveSettings()
                        }} />
                    }
                }
                tabs.push({
                    title: capitalizeFirstLetter(objKey),
                    content: <>{Object.keys(value).map((key) => {
                        const settingValue = value[key]
                        setInpState(settingsManager.settings[objKey][key])
                        return <>
                            <h4>You must restart the app to apply changes.</h4>
                            <br/>
                            {addSpaceAtCapitals(capitalizeFirstLetter(key))}: {getContent(settingValue, key)}
                        </>
                    })}</>
                })
            } else {
                tabs.push({
                    title: capitalizeFirstLetter(objKey),
                    content: <>{value}</>
                })
            }
        })

        return tabs
    }

    return <div className="settings">
        <TabbedSidebar title="Settings" tabs={(ref, state) => generateTabs(settingsManager.settings, 0, ref, state)} />
    </div>
}
