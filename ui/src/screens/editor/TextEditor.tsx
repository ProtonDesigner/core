import React, { Fragment, useState } from "react";
import { Project, ProjectScript } from "../../libs/internal";
import './TextEditor.scss';
import Editor, { loader } from "@monaco-editor/react"

import * as monaco from "monaco-editor"
loader.config({ monaco })

import Tabs from 'react-responsive-tabs';
import 'react-responsive-tabs/styles.css';

interface TextEditorProps {
    project: Project
    rerender: any
    saveProject: any
}

export default function TextEditor(props: TextEditorProps) {
    const [scripts, setScripts] = useState<
    {
        [key: string]: any
    }
    >(props.project.serialize().scripts)

    function getTabs() {
        let tabs: any = Object.keys(scripts).map((key, index: number) => {
            const script: ProjectScript = scripts[key]
            
            return {
                title: script.name,
                getContent: () => <Editor
                    height="100%"
                    path={script.name}
                    defaultLanguage="lua"
                    defaultValue={script.contents}
                    onChange={(value, e) => {
                        console.log(value, e)
                        props.project.updateScript(script.uid, value || script.contents)
                        setScripts(props.project.serialize().scripts)
                        // setScripts(newScripts)
                    }}
                />,
                key: index,
                panelClassName: "editor-panel"
            }
        })
        tabs.push({
            title: "Add Script",
            getContent: () => <img src="" onError={() => {
                // This is used to create the new tab when the imaage isn't loaded
                // and eventually causes an error. This could be exploited for XSS or RCE
                // But this is isolated from the rest of the app
                // So I think it's fine

                const newScript = new ProjectScript(`test-${Math.random()}.lua`)
                props.project.addScript(newScript)
                setScripts(props.project.serialize().scripts)
                props.rerender(1)
                console.log(props.project)
            }} />
        })
        return tabs
    }

    return <div className="text__editor">
        <Tabs items={getTabs()} />
    </div>
}
