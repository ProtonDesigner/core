import React, { useState, useEffect, FC } from "react"
import BaseComponentProps from "../../BaseComponentProps";
import pb from "../../libs/pocketbase";
import "./Editor.scss"
import Hierarchy from "./Hierarchy";
import Inspector from "./Inspector";
import Tools from "./Tools";
import { ProjectElement } from "../../libs/project"
import Dialog from "../../components/Dialog";
import Preview from "./Preview";
import ELEMENT_LIST from "../../libs/elements/list";
import Console from "./Console";

interface EditorProps extends BaseComponentProps {}

function Editor<FC>(props: EditorProps) {
    const [loaded, setLoaded] = useState(false)
    const [project, setProject] = useState<any>({})
    const [showElementDialog, setElementDialog] = useState(false)
    const [elements, setElements] = useState<any>({})
    const [currentElementUID, setCurrentElementUID] = useState<any>(null)
    const [render, forceRerender] = useState(0)
    const [consoleMessages, setConsoleMessages] = useState<any>([])

    function log(message: string, type: string) {
        const newConsoleMessages = consoleMessages
        newConsoleMessages.push({
            message,
            type
        })
        setConsoleMessages([...newConsoleMessages])
    }


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
            <Preview elements={elements} currentElementUID={currentElementUID} />
            <Tools />
            <Dialog title="Add element" show={showElementDialog} setShow={setElementDialog} className="element__parent">
                <div className="element__list">
                    {Object.keys(ELEMENT_LIST).map(element_id => {
                        let Element = ELEMENT_LIST[element_id]
                        return <div className="elements__item">
                            <h4>{Element.name}</h4>
                            <button onClick={() => {
                                const newElement = new Element()
                                let amountOfNames = 0
                                Object.keys(elements).map(key => {
                                    const element: ProjectElement = elements[key]
                                    if (element.name.replace(/\d+$/, "") === newElement.name) {
                                        amountOfNames += 1
                                    }
                                })
                                newElement.name = `${newElement.name}${amountOfNames}`
                                addElement(newElement)
                                log(`added ${Element.name}`, "info")
                                setElementDialog(false)
                            }}>Add</button>
                        </div>
                    })}
                </div>
            </Dialog>
            <Hierarchy
                elements={elements}
                setElementDialog={setElementDialog}
                currentElementUID={currentElementUID}
                setCurrentElementUID={setCurrentElementUID}
            />
            <Inspector
                elements={elements}
                currentElementUID={currentElementUID}
                forceRerender={forceRerender}
            />
            <Console messages={consoleMessages} setMessages={setConsoleMessages} currentElementUID={currentElementUID} />
        </> : "Loading..."}
    </div>
}

export default Editor;
