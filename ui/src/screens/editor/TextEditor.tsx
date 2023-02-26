import React, { Fragment, useState } from "react";
import { Project, ProjectScript } from "@libs/project";
import './TextEditor.scss';
import Editor, { loader } from "@monaco-editor/react"

import * as monaco from "monaco-editor"
loader.config({ monaco })

import Tabs, { Tab } from '@components/Tabs';

import TextEditorFileList from "./TextEditorFileList";

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

    const [selectedTab, setSelectedTab] = useState(0)

    const [tabs, setTabs] = useState<Array<Tab>>([])

    return <div className="text__editor">
        <TextEditorFileList
            tabs={tabs}
            setTabs={setTabs}
            scripts={scripts}
            setScripts={setScripts}
            setSelectedTab={setSelectedTab}
            project={props.project}
            saveProject={props.saveProject}
            rerender={props.rerender}
        />
        <div className="tab__container">
            <Tabs
                tabs={tabs}
                currentIndex={selectedTab}
                setCurrentIndex={setSelectedTab}
                isEditor={true}
            />
        </div>
    </div>
}
