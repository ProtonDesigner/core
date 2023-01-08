import React from "react"
import "./settings.scss"
import PocketBase from "pocketbase"

interface SettingsProps {
    pb: PocketBase
    currentUser: any
    setCurrentUser(newState: any): any
    setCurrentPage(newState: any): any
    setState(newState: any): any
    state: object
}

export default function Settings(props: SettingsProps) {
    return <div className="settings">
        settings
    </div>
}
