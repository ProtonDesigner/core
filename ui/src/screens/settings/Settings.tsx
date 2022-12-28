import React, { FC } from "react"
import BaseComponentProps from "../../BaseComponentProps";
import "./Settings.scss"

interface SettingsProps extends BaseComponentProps {}

function Settings<FC>(props: SettingsProps) {
    return <div className={`${props.className} settings`}></div>
}

export default Settings;
