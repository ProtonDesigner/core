import React, { useState, useEffect, FC } from "react"
import BaseComponentProps from "../../BaseComponentProps";
import pb from "../../libs/pocketbase";
import "./Editor.scss"
import Hierarchy from "./Hierarchy";
import Inspector from "./Inspector";
import Tools from "./Tools";
import { ProjectElement, Project, ELEMENT_LIST } from "../../libs/internal"
import Dialog from "../../components/Dialog";
import Preview from "./Preview";
import Console from "./Console";
import ThemeLoader from "../../libs/theme";

import * as path from "path"
import TextEditor from "./TextEditor";

import { LuaFactory } from "wasmoon"

const factory = new LuaFactory()
const lua = await factory.createEngine()

interface EditorProps extends BaseComponentProps {}

const themeLoader = new ThemeLoader();
console.log(themeLoader.getTheme("example.js"))

function Editor<FC>(props: EditorProps) {
    const [loaded, setLoaded] = useState(false)
    const [showElementDialog, setElementDialog] = useState(false)
    // const [elements, setElements] = useState<any>({})
    const [currentElementUID, setCurrentElementUID] = useState<any>(null)
    const [render, forceRerender] = useState(0)
    const [consoleMessages, setConsoleMessages] = useState<any>([])

    const [currentPage, setCurrentPage] = useState(0)

    const [project, setProject] = useState<Project>(new Project());

    const [isRunning, setIsRunning] = useState(false)

    function consoleLog(message: any, type: string) {
        const newConsoleMessages = consoleMessages
        newConsoleMessages.push({
            message,
            type
        })
        setConsoleMessages([...newConsoleMessages])
    }

    function saveProject() {
        const serializedProject = project?.serialize()
        pb.collection('projects').update(project.id, serializedProject, {
            "$autoCancel": false
        })
    }

    function addElement(element: ProjectElement) {
        project?.addElement(element)
        saveProject()
    }

    useEffect(() => {
        async function getData() {
            const project_result = await pb.collection("projects").getOne(props.state.projectId)
            const newProject = new Project()
            newProject.load(project_result)
            setProject(newProject)
            console.log(newProject)
            setLoaded(true)
        }
        if (!loaded) {
            getData()
        }
    }, [])


    useEffect(() => {
        const doStuff = async () => {
            // Expose logging functions to lua
            lua.global.set("infoToConsole", (msg: any) => consoleLog(msg, "info"))
            lua.global.set("warnToConsole", (msg: any) => consoleLog(msg, "warn"))
            lua.global.set("errToConsole", (msg: any) => consoleLog(msg, "error"))

            // Expose elements to Lua
            lua.global.set("getElement", (name: string) => {
                const elements = project.elements
                let element: any = null
                Object.keys(elements).map(key => {
                    const _element: ProjectElement = elements[key]
                    if (!element) {
                        if (_element.name == name) {
                            element = _element.serialize()
                        }
                    }

                    return element
                })
            })

            // Get and execute the main function
            await lua.doStringSync(project.getScript("main.lua"))
            const mainFunction = lua.global.get("main")
            const output = mainFunction()
            // lua.global.close()
            setIsRunning(false)
        }
        if (isRunning) doStuff()
    }, [isRunning])

    return <div className={`${props.className} editor`}>
        <Tools
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setRunning={setIsRunning}
            running={isRunning}
        />
        {loaded ? (currentPage == 0 ? <>
            <Preview
                project={project}
                currentElementUID={currentElementUID}
                type="desktop"
                saveProject={saveProject}
                consoleLog={consoleLog}
            />
            <Dialog title="Add element" show={showElementDialog} setShow={setElementDialog} className="element__parent">
                <div className="element__list">
                    {Object.keys(ELEMENT_LIST).map(element_id => {
                        let Element = ELEMENT_LIST[element_id]
                        return <div className="elements__item">
                            <h4>{Element.name}</h4>
                            <button onClick={() => {
                                const newElement = new Element()
                                let amountOfNames = 0
                                Object.keys(project.elements).map(key => {
                                    const element: ProjectElement = project.elements[key]
                                    if (element.name.replace(/\d+$/, "") === newElement.name) {
                                        amountOfNames += 1
                                    }
                                })
                                newElement.name = `${newElement.name}${amountOfNames}`
                                addElement(newElement)
                                setCurrentElementUID(newElement.uid)
                                consoleLog(`added ${Element.name}`, "info")
                                setElementDialog(false)
                            }}>Add</button>
                        </div>
                    })}
                </div>
            </Dialog>
            <Hierarchy
                project={project}
                setElementDialog={setElementDialog}
                currentElementUID={currentElementUID}
                setCurrentElementUID={setCurrentElementUID}
                saveProject={saveProject}
            />
            <Inspector
                project={project}
                currentElementUID={currentElementUID}
                forceRerender={forceRerender}
                saveProject={saveProject}
                setCurrentElement={setCurrentElementUID}
            />
            <Console messages={consoleMessages} setMessages={setConsoleMessages} currentElementUID={currentElementUID} />
        </> : <TextEditor project={project} rerender={forceRerender} saveProject={saveProject} />) : "Loading..."}
    </div>
}

export default Editor;
