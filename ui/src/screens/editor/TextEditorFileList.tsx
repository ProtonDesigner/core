import Editor from "@monaco-editor/react";
import React, { FC, useState } from "react";
import Dialog from "../../components/Dialog";
import { Project, ProjectScript } from "../../libs/internal";

import { Tab } from "../../components/Tabs";
import getAsset from "../../libs/getAsset";

function createNewTab(
    title: string,
    script: ProjectScript,
    project: Project,
    saveProject: () => void
): Tab {
    const newTab: Tab = {
        title: title,
        content: <Editor
            height="100%"
            path={script.name}
            defaultLanguage="lua"
            defaultValue={script.contents}
            onChange={(value, e) => {
                project.updateScript(script.uid, value || script.contents)
                saveProject()
            }}
            theme="vs-dark"
        />
    }
    return newTab
}

interface TextEditorFileListProps {
    scripts: {
        [key: string]: any
    }
    setScripts: (value: {[key: string]: any}) => void
    tabs: Array<Tab>
    setTabs: (newState: Array<Tab>) => any
    setSelectedTab: (newState: number) => any
    project: Project
    saveProject: any
    rerender: (value: number) => void
}

function EditorFile<FC>(props: {
    script: {
        [key: string]: any
    }
    tabs:  Array<Tab>
    setTabs: (newState: Array<Tab>) => any
    setSelectedTab: (newState: number) => any
    project: Project
    saveProject: any
}) {
    const script: ProjectScript = new ProjectScript()
    script.load(props.script)
    return <div className="file" onClick={() => {
        // Check if tab is open
        // If tab is open, switch to tab
        // Else create a new tab

        let tabExists = false
        let tabIndex = 0

        props.tabs.map((tab, index) => {
            if (tab.title == script.name) {
                tabExists = true
                tabIndex = index
            }
        })

        if (tabExists) {
            props.setSelectedTab(tabIndex)
        } else {
            const newTab: Tab = createNewTab(
                script.name,
                script,
                props.project,
                props.saveProject
            )
            let newTabs = [...props.tabs]
            newTabs.push(newTab)
            props.setTabs(newTabs)
            props.setSelectedTab(props.tabs.length)
        }
    }}>
        <p>{props.script.name}</p>
        <img
            onClick={(e) => {
                e.preventDefault()

                props.project.deleteScript(script.uid)
                let newTabs = [...props.tabs]
                let tabFound = false;
                newTabs.map((tab, index) => {
                    if (tabFound) return
                    if (tab.title == props.script.name) {
                        delete newTabs[index]
                        tabFound = true
                    }
                })

                props.setTabs(newTabs)
                props.setSelectedTab(props.tabs.length - 1)
                // TODO: loop over tabs
                // Then delete the one that fits all the criteria
                // Above
                // (let's get this thing released tomorrow!)
            }}
            src={getAsset(".", "mul transparent.png")}
        />
    </div>
}

function createNewScript(name: string, project: Project) {
    if (!name.endsWith(".lua")) {
        return "Filename must end with .lua"
    }

    const newScript = new ProjectScript(name)
    project.addScript(newScript)
    return newScript
}

function CreateNewFileDialog<FC>(props: {
    setShow: (show: boolean) => void
    rerender: (value: number) => void
    project: Project
    saveProject: () => void
    setTabs: (value: any) => void
    scripts: {
        [key: string]: any
    }
    setScripts: (value: {[key: string]: any}) => void
    tabs: Array<Tab>
}) {
    const [filename, setFilename] = useState("")
    return <div className="new__file">
        <p>Please enter the name of the file below</p>
        <input
            type="text"
            placeholder="Name"
            value={filename}
            onChange={(e) => {
                setFilename(e.target.value)
            }}
        />
        <button onClick={(e) => {
            e.preventDefault()
            
            const newScript = createNewScript(filename, props.project)
            
            if (typeof newScript === 'string') {
                // TODO: handle error
                return
            }

            props.saveProject()
            props.setShow(false)
            props.rerender(1)

            props.setScripts(props.project.serialize().scripts)

            let newTabs = [...props.tabs]
            newTabs.push(
                createNewTab(
                    newScript.name,
                    newScript,
                    props.project,
                    props.saveProject
                )
            )
            props.setTabs(newTabs)
        }}>Create</button>
    </div>
}

function TextEditorFileList<FC>(props: TextEditorFileListProps) {
    const [showFileDialog, setShowFileDialog] = useState(false);
    const [, sidebarReload] = useState(0);

    return <>
        <div className="editor__list">
            {props.scripts && Object.keys(props.scripts).map(key => {
                const script: {
                    [key: string]: any
                } = props.scripts[key]
                return <EditorFile
                    tabs={props.tabs}
                    script={script}
                    setSelectedTab={props.setSelectedTab}
                    setTabs={props.setTabs}
                    project={props.project}
                    saveProject={props.saveProject}
                />
            })}

            <div className="file" onClick={() => {
                setShowFileDialog(true)
            }}>
                Add New File
            </div>
        </div>
        <Dialog title="Create New File" show={showFileDialog} setShow={setShowFileDialog}>
            <CreateNewFileDialog
                setShow={setShowFileDialog}
                rerender={sidebarReload}
                project={props.project}
                saveProject={props.saveProject}
                setScripts={props.setScripts}
                setTabs={props.setTabs}
                scripts={props.scripts}
                tabs={props.tabs}
            />
        </Dialog>
    </>
}

export default TextEditorFileList
