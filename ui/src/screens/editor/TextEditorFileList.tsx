import React, { FC } from "react";
import { ProjectScript } from "../../libs/internal";

interface TextEditorFileListProps {
    scripts: {
        [key: string]: any
    }
    tabs: {[key: string]: any}
    setTabs: (newState: {[key: string]: any}) => any
    setSelectedTab: (newState: number) => any
}

function EditorFile<FC>(props: {
    script: {
        [key: string]: any
    }
    tabs: {[key: string]: any}
    setTabs: (newState: {[key: string]: any}) => any
    setSelectedTab: (newState: number) => any
}) {
    const script: ProjectScript = new ProjectScript()
    script.load(props.script)
    return <div className="file" onClick={() => {
        // Check if tab is open
        // If tab is open, swich to tab
        // Else create a new tab

        let tabExists = false
        let tabIndex = 0
        Object.keys(props.tabs).map(key => {
            if (tabExists) return
            tabIndex++
            const tab = props.tabs[key]
            if (tab.name === script.name) {
                tabExists = true;
            }
        })

        if (tabExists) {
            props.setSelectedTab(tabIndex)
        } else {
            const newTabs = {...props.tabs}
            newTabs[script.uid] = script
            console.log("be state")
            props.setTabs(newTabs)
            props.setSelectedTab(props.tabs.length - 1)
            console.log("af state")
        }
    }}>
        {props.script.name}
    </div>
}

function TextEditorFileList<FC>(props: TextEditorFileListProps) {
    return <div className="editor__list">
        {props.scripts && Object.keys(props.scripts).map(key => {
            const script: {
                [key: string]: any
            } = props.scripts[key]
            return <EditorFile tabs={props.tabs} script={script} setSelectedTab={props.setSelectedTab} setTabs={props.setTabs} />
        })}
    </div>
}

export default TextEditorFileList
