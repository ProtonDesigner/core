import React, { useState, useEffect, FC } from "react"
import BaseComponentProps from "../../BaseComponentProps";
import pb from "../../libs/pocketbase";
import "./Editor.scss"
import Hierarchy from "./Hierarchy";
import Inspector from "./Inspector";
import Tools from "./Tools";

interface EditorProps extends BaseComponentProps {}

function Editor<FC>(props: EditorProps) {
    const [loaded, setLoaded] = useState(false)
    const [project, setProject] = useState<any>({})

    useEffect(() => {
        async function getData() {
            const project = await pb.collection("projects").getOne(props.state.projectId)
            setProject(project)
            setLoaded(true)
        }
        if (!loaded) {
            getData()
        }
    }, [])


    return <div className={`${props.className} editor`}>
        {loaded ? <>
            <Tools />
            <Hierarchy />
            <Inspector />
        </> : "Loading..."}
    </div>
}

export default Editor;
