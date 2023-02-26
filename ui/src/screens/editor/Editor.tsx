import React, { useState, useEffect } from "react"
import BaseComponentProps from "@root/BaseComponentProps";
import "./Editor.scss"
import Hierarchy from "./Hierarchy";
import Inspector from "./Inspector";
import Tools from "./Tools";
import { ProjectElement, Project, ProjectScreen } from "@libs/project"
import { ELEMENT_LIST } from "@libs/elements/builtin"
import Dialog from "@components/Dialog";
import Preview from "./Preview";
import Console from "./Console";
import ThemeLoader from "@libs/theme";
import Tabs, { Tab } from "@components/Tabs";

import * as path from "path"
import TextEditor from "./TextEditor";

import { LuaFactory } from "wasmoon"

import { EditorLogic } from "@libs/logic";

// // @ts-expect-error
// import * as luaGlueWasm from "wasmoon/dist/glue.wasm"

const factory = new LuaFactory("/glue.wasm")
const lua = await factory.createEngine()

interface EditorProps extends BaseComponentProps {}

const themeLoader = new ThemeLoader();
// console.log(themeLoader.getTheme("example.js"))

function Editor(props: EditorProps) {
    const [loaded, setLoaded] = useState(false)
    const [showElementDialog, setElementDialog] = useState(false)
    const [currentElementUID, setCurrentElementUID] = useState<any>(null)
    const [render, forceRerender] = useState(0)
    const [consoleMessages, setConsoleMessages] = useState<any>([])
    const [currentPage, setCurrentPage] = useState(0)
    const [project, setProject] = useState<Project>(new Project());
    const [isRunning, setIsRunning] = useState(false)
    const [currentScreen, setCurrentScreen] = useState("")

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
        return logic.invoke("addElement", {element, screenID: currentScreen})
    }

    // async function runLua() {
    //     // Expose logging functions to lua
    //     lua.global.set("infoToConsole", (msg: any) => consoleLog(msg, "info"))
    //     lua.global.set("warnToConsole", (msg: any) => consoleLog(msg, "warn"))
    //     lua.global.set("errToConsole", (msg: any) => consoleLog(msg, "error"))

    //     // Expose elements to Lua
    //     lua.global.set("getElement", (name: string) => {
    //         const elements = project.elements
    //         let element: any = null
    //         Object.keys(elements).map(key => {
    //             const _element: ProjectElement = elements[key]
    //             if (!element) {
    //                 if (_element.name == name) {
    //                     element = _element.serialize()
    //                 }
    //             }
    //         })
    //         return element
    //     })

    //     Object.keys(project.elements).map(key => {
    //         const doStuff = async () => {
    //             const element = project.elements[key]
    //             try {
    //                 element.lua = lua
    //                 await element.onRun()
    //             } catch (err: any) {
    //                 consoleLog(`An exception occurred in ${element.name} while attempting to start:`, "error")
    //                 err.split("\n").map((line: string) => {
    //                     consoleLog(line, "error")
    //                 })
    //             }
    //         }
    //         doStuff()
    //     })

    //     // Get and execute the main function
    //     await lua.doStringSync(project.getScript("main.lua"))
    //     const mainFunction = lua.global.get("main")
    //     const output = mainFunction()

    //     // lua.global.close()
    //     setIsRunning(false)

    //     Object.keys(project.elements).map(key => {
    //         const doStuff = async () => {
    //             const element = project.elements[key]
    //             try {
    //                 await element.onStop()
    //             } catch (err: any) {
    //                 consoleLog(`An exception occurred in ${element.name} while stopping:`, "error")
    //                 err.split("\n").map((line: string) => {
    //                     consoleLog(line, "error")
    //                 })
    //             }
    //         }
    //         doStuff()
    //     })
    // }

    useEffect(() => {
        async function getData() {
            const newProject = new Project()
            newProject.load(props.state.project, () => {
                props.pluginManager.setProject(newProject)
                setCurrentScreen(Object.values(newProject.screens)[0].uid)
                setLoaded(true)
            })
            setProject(newProject)
            // console.log(props.state.project)

            // runLua().catch((reason) => {
            //     console.warn("Unable to execute Lua Script")
            //     console.warn(reason)
            // })
        }
        if (!loaded) {
            getData()
        }
    }, [])

    function createTabs() {
        let tabs: Array<Tab> = []

        Object.keys(project.screens).map(key => {
            const screen = project.screens[key]

            tabs.push({
                title: screen.name,
                content: <Preview
                    project={project}
                    currentElementUID={currentElementUID}
                    type="desktop"
                    saveProject={saveProject}
                    consoleLog={consoleLog}
                    screen={screen}
                />
            })
        })

        function CreateScreenDialog(props: any) {
            const [screenName, setScreenName] = useState(`Screen ${Object.keys(project.screens).length + 1}`)        
    
            return <>
                <label>Screen Name: </label>
                <input type="text" value={screenName} onChange={(e) => {
                    setScreenName(e.target.value)
                }} />
                <button onClick={(e) => {
                    e.preventDefault()

                    const newScreen = new ProjectScreen(screenName, {})
                    project.addScreen(newScreen)
                    setCurrentScreen(newScreen.uid)
                    forceRerender(0)
                }}>Create</button>
            </>
        }

        tabs.push({
            title: "+",
            onClick: () => {
                props.dialogUtils.setDialog(
                    props.dialogUtils.createDialog(
                        "Create Screen",
                        <CreateScreenDialog /> 
                    )
                )
                props.dialogUtils.showDialog()
            }
        })

        return tabs
    }

    // useEffect(() => {
    //     if (isRunning) runLua()
    // }, [isRunning])

    return <div className={`${props.className} editor`}>
        <Tools
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setRunning={setIsRunning}
            running={isRunning}
        />
        {loaded ? (currentPage == 0 ? <>
            <Tabs className={`tabs__component`} tabs={createTabs()} onChange={(index) => {
                setCurrentElementUID(null)
                setCurrentScreen(Object.values(project.screens)[index].uid)
            }} />
            <Dialog title="Add element" show={showElementDialog} setShow={setElementDialog} className="element__parent">
                <div className="element__list">
                    {Object.keys(ELEMENT_LIST).map(element_id => {
                        let Element: ProjectElement = new ELEMENT_LIST[element_id]
                        return <>
                            <br/>
                            <div className="elements__item" key={element_id}>
                                <h4>{Element.name}</h4>
                                <button onClick={() => {
                                    const newElement = Element
                                    let amountOfNames = 0
                                    let elements: {[key: string]: any} = [];

                                    Object.keys(project.screens).map(key => {
                                        const screen = project.screens[key]
                                        Object.keys(screen.elements).map(key => {
                                            const element = screen.elements[key]
                                            elements[element.uid] = element
                                        })
                                    })
                                    
                                    Object.keys(elements).map((key) => {
                                        const element: ProjectElement = elements[key]
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
                        </>
                    })}
                </div>
            </Dialog>
            
            <Hierarchy
                project={project}
                setElementDialog={setElementDialog}
                currentElementUID={currentElementUID}
                setCurrentElementUID={setCurrentElementUID}
                saveProject={saveProject}
                currentScreen={currentScreen}
            />
            <Inspector
                project={project}
                currentElementUID={currentElementUID}
                forceRerender={forceRerender}
                saveProject={saveProject}
                setCurrentElement={setCurrentElementUID}
                currentScreen={currentScreen}
            />
            <Console messages={consoleMessages} setMessages={setConsoleMessages} currentElementUID={currentElementUID} />
        </> : <TextEditor
            project={project}
            rerender={forceRerender}
            saveProject={saveProject} />) : "Loading..."}
    </div>
}

export default Editor;
