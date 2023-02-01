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

import { EditorLogic } from "../../libs/logic";
import PluginManager from "../../libs/plugin";

const factory = new LuaFactory()
const lua = await factory.createEngine()

interface EditorProps extends BaseComponentProps {}

const themeLoader = new ThemeLoader();
// console.log(themeLoader.getTheme("example.js"))

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

    const logic = new EditorLogic(props.pluginManager, project)

    useEffect(() => {
        logic.project = project
    }, [project])

    function consoleLog(message: any, type: string) {
        const newConsoleMessages = consoleMessages
        newConsoleMessages.push({
            message,
            type
        })
        setConsoleMessages([...newConsoleMessages])
    }

    function saveProject() {
        return logic.invoke("saveProject")
    }

    function addElement(element: ProjectElement) {
        return logic.invoke("addElement", {element})
    }

    async function runLua() {
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
            })
            return element
        })

        Object.keys(project.elements).map(key => {
            const doStuff = async () => {
                const element = project.elements[key]
                try {
                    element.lua = lua
                    await element.onRun()
                } catch (err: any) {
                    consoleLog(`An exception occurred in ${element.name} while attempting to start:`, "error")
                    err.split("\n").map((line: string) => {
                        consoleLog(line, "error")
                    })
                }
            }
            doStuff()
        })

        // Get and execute the main function
        await lua.doStringSync(project.getScript("main.lua"))
        const mainFunction = lua.global.get("main")
        const output = mainFunction()

        // lua.global.close()
        setIsRunning(false)

        Object.keys(project.elements).map(key => {
            const doStuff = async () => {
                const element = project.elements[key]
                try {
                    await element.onStop()
                } catch (err: any) {
                    consoleLog(`An exception occurred in ${element.name} while stopping:`, "error")
                    err.split("\n").map((line: string) => {
                        consoleLog(line, "error")
                    })
                }
            }
            doStuff()
        })
    }

    useEffect(() => {
        async function getData() {
            const newProject = new Project()
            newProject.load(props.state.project)
            setProject(newProject)
            setLoaded(true)
            props.pluginManager.setProject(newProject)

            runLua().catch((reason) => {
                console.warn("Unable to execute Lua Script")
                console.warn(reason)
            })
        }
        if (!loaded) {
            getData()
        }
    }, [])


    useEffect(() => {
        if (isRunning) runLua()
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
                        let Element: ProjectElement = new ELEMENT_LIST[element_id]
                        return <div className="elements__item" key={element_id}>
                            <h4>{Element.name}</h4>
                            <button onClick={() => {
                                const newElement = Element
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
        </> : <TextEditor
            project={project}
            rerender={forceRerender}
            saveProject={saveProject} />) : "Loading..."}
    </div>
}

export default Editor;
