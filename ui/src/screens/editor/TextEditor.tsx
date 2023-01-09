import React, { useState } from "react";
import { Project, ProjectScript } from "../../libs/internal";
import './TextEditor.scss';
import Editor from "@monaco-editor/react"

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

interface TextEditorProps {
    project: Project
    rerender: any
    saveProject: any
}

export default function TextEditor(props: TextEditorProps) {
    const scripts: {
        [key: string]: any
    } = props.project.serialize().scripts
    const [tabIndex, setTabIndex] = useState(0)

    return <div className="text__editor">
        <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
            <TabList>
                {scripts && Object.keys(scripts).map(key => {
                    const script: ProjectScript = scripts[key]
                    console.log(script)
                    return <Tab>{script.uid}</Tab>
                })}
            </TabList>
            {scripts && Object.keys(scripts).map(key => {
                return <TabPanel>
                    <Editor
                        height="80vh"
                        theme="vs-dark"
                        path={scripts[key].name}
                        defaultLanguage="lua"
                        defaultValue={scripts[key].content}
                    />
                </TabPanel>
            })}
            </Tabs>
        <button onClick={(e) => {
            const newScript = new ProjectScript("test.lua")
            props.project.addScript(newScript)
            props.rerender(1)
            console.log(props.project)
        }}>Add Script</button>
    </div>
}
