import React, { useState, useEffect, FC } from "react"
import BaseComponentProps from "../../BaseComponentProps";
import TextElement from "../../libs/elements/TextElement";
import pb from "../../libs/pocketbase";
import "./Editor.scss"

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

    const TextComponent = new TextElement().render

    return <div className={`${props.className} editor`}>
        {loaded ? <>
            <p>{project.name}</p>
            <TextComponent />
        </> : "Loading..."}
    </div>
}

export default Editor;
