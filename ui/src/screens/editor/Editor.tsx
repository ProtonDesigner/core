import React, { useState, useEffect, FC } from "react"
import BaseComponentProps from "../../BaseComponentProps";
import pb from "../../libs/pocketbase";
import "./Editor.scss"
import Hierarchy from "./Hierarchy";
import Inspector from "./Inspector";
import Tools from "./Tools";
import Project, { ProjectElement } from "../../libs/project"
import Dialog from "../../components/Dialog";
import Preview from "./Preview";
import ELEMENT_LIST from "../../libs/elements/list";

interface EditorProps extends BaseComponentProps {}

function Editor<FC>(props: EditorProps) {
    const [loaded, setLoaded] = useState(false)
    const [project, setProject] = useState<any>({})
    const [showElementDialog, setElementDialog] = useState(false)
    const [elements, setElements] = useState<any>({})

    function addElement(element: ProjectElement) {
        elements[element.uid] = element
    }

    useEffect(() => {
        async function getData() {
            const project_result = await pb.collection("projects").getOne(props.state.projectId)
            setProject(project_result)
            setLoaded(true)
            console.log(project_result.elements)
            setElements(project_result.elements)
        }
        if (!loaded) {
            getData()
        }
    }, [])

    return <div className={`${props.className} editor`}>
        {loaded ? <>
            <Tools />
            <Dialog title="Add element" show={showElementDialog} setShow={setElementDialog} className="element__parent">
                <div className="element__list">
                    {Object.keys(ELEMENT_LIST).map(element_id => {
                        let Element = ELEMENT_LIST[element_id]
                        return <div className="elements__item">
                            <h4>{Element.name}</h4>
                            <button onClick={() => {
                                const newElement = new Element()
                                addElement(newElement)
                                console.log(`added ${Element.name}`)
                                setElementDialog(false)
                            }}>Add</button>
                        </div>
                    })}
                </div>
            </Dialog>
            <Hierarchy project={project} setElementDialog={setElementDialog} />
            <Inspector />
            <Preview elements={elements} />
        </> : "Loading..."}
    </div>
}

export default Editor;
