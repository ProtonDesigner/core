import React, { useState, useEffect, FC } from "react"
import BaseComponentProps from "../../BaseComponentProps";
import pb from "../../libs/pocketbase";
import "./Editor.scss"
import Hierarchy from "./Hierarchy";
import Inspector from "./Inspector";
import Tools from "./Tools";
import Project, { ProjectElement } from "../../libs/project"
import Dialog from "../../components/Dialog";

interface EditorProps extends BaseComponentProps {}

function Editor<FC>(props: EditorProps) {
    const [loaded, setLoaded] = useState(false)
    const [project, setProject] = useState<any>({})
    const [showElementDialog, setElementDialog] = useState(false)

    useEffect(() => {
        async function getData() {
            const project_result = await pb.collection("projects").getOne(props.state.projectId)
            setProject(project_result)
            setLoaded(true)
            console.log(project_result)
        }
        if (!loaded) {
            getData()
        }
    }, [])


    return <div className={`${props.className} editor`}>
        {loaded ? <>
            <Tools />
            <Dialog title="Add element" show={showElementDialog} setShow={setElementDialog}>
                yoyo
            </Dialog>
            <Hierarchy project={project} setElementDialog={setElementDialog} />
            <Inspector />
        </> : "Loading..."}
    </div>
}

export default Editor;
