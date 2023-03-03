import React from 'react';
import { v4 as uuidV4 } from 'uuid';
import { LuaEngine } from 'wasmoon';

import { newMainLuaFile } from './newMainLuaFile';
// import { ELEMENT_LIST } from "./elements/builtin"
import pb from './pocketbase';

interface Project {
    screens: {
        [key: string]: ProjectScreen
    }
    name: string
    id: string
    scripts: {
        [key: string]: any
    }
}

interface ProjectElement {
    uid: string
    properties: ElementProperties
    name: string
    render(): any,
    elementID: string
    lua: LuaEngine
}

interface ElementProperty {
    value: any
    name: string
    uid: string
    editable: boolean
    id: string
}

interface ElementProperties {
    properties: {
        [key: string]: ElementProperty
    }
}

interface ProjectScript {
    name: string
    contents: string
    uid: string
}

import { ELEMENT_LIST } from "@libs/internal"

class Project {
    constructor(name?: string) {
        this.screens = {}
        this.name = name || ""
        this.id = uuidV4()
        this.scripts = {}
    }

    addScreen(screen: ProjectScreen) {
        this.screens[screen.uid] = screen
    }

    deleteScreen(screenUID: string) {
        delete this.screens[screenUID]
    }

    addScript(script: ProjectScript) {
        this.scripts[script.uid] = script
    }

    updateScript(scriptUID: string, newValue: string) {
        this.scripts[scriptUID].updateContents(newValue)
    }

    deleteScript(scriptUID: string) {
        delete this.scripts[scriptUID]
    }

    getScripts() {
        return this.scripts
    }

    getScript(scriptName: string) {
        const scripts = this.getScripts()

        let scriptContents: string = "";

        Object.keys(scripts).map(key => {
            const script: ProjectScript = scripts[key]
            if (!scriptContents) {
                if (scriptName == script.name) {
                    scriptContents = script.contents
                }
            }
        })

        return scriptContents
    }

    serialize() {
        // Serialize scripts
        let serializedScripts: {
            [key: string]: {}
        } = {}

        Object.keys(this.scripts).map(key => {
            const script: ProjectScript = this.scripts[key]
            // console.log(script)
            serializedScripts[script.uid] = script?.serialize()
        })

        return {
            name: this.name,
            scripts: serializedScripts
        }
    }

    load(json: any, screensCallback: Function) {
        const screens: Array<string> = json.screens
        console.log(json)
        const name: string = json.name

        this.name = name
        this.id = json.id
        let mainExists = false
        Object.keys(json.scripts).map(key => {
            const script = json.scripts[key]
            if (script.name == "main.lua") {
                mainExists = true
            }
            const newScript = new ProjectScript()
            newScript.load(script)
            this.addScript(newScript)
        })

        if (!mainExists) {
            this.addScript(newMainLuaFile())
        }

        if (screens.length === 0) {
            const newScreen = new ProjectScreen("Screen 1")
            if (json.elements) {
                Object.keys(json.elements).forEach(key => {
                    const element = json.elements[key]
                    
                    const ElementConstructor = ELEMENT_LIST[element.id]
                    const newElement: ProjectElement = new ElementConstructor()
                    newElement.load(element)
                    newScreen.addElement(element)
                })
            }
            pb.collection("screens").create(newScreen.serialize()).then(createdScreen => {
                newScreen.load(createdScreen)
                this.addScreen(newScreen)
                pb.collection("projects").update(this.id, {
                    screens: [
                        createdScreen.id
                    ]
                })
                console.log(createdScreen)
            })
        } else {
            const screenObj: { [key: string]: any } = {}
            const screensFinished = new Event("screens-finished")
            screens.map((screenID, index) => {
                pb.collection("screens").getOne(screenID).then(screen => {
                    console.log(index, screens.length)
                    screenObj[screen.uid] = screen
                    if (index == (screens.length - 1)) {
                        document.dispatchEvent(screensFinished)
                        console.log("ending loop!")
                    }
                })
            })
            document.addEventListener("screens-finished", (e) => {
                console.log("sr")
                Object.keys(screenObj).map(key => {
                    const screen = screenObj[key]
                    const newScreen = new ProjectScreen()
                    newScreen.load(screen)
                    console.log(screen)
                    this.addScreen(newScreen)
                })
                screensCallback()
            })
        }

        console.log(this.screens)
    }
}

class ProjectElement {
    constructor() {
        this.uid = uuidV4()
        this.name = "Element"
        this.elementID = "generic"
        this.properties = new ElementProperties()

        this.properties.addProperty(new ElementProperty("x", 0))
        this.properties.addProperty(new ElementProperty("y", 0))
        this.initialize()
        this.render = this.render.bind(this)
    }

    serialize() {
        return {
            uid: this.uid,
            properties: this.properties.getAllProps(),
            elementID: this.elementID,
            name: this.name
        }
    }

    render() {
        return <div>
            Here you put your custom component logic!
        </div>
    }

    onRun() {}
    onStop() {}

    getLua(functionName: string) {
        const isMain = functionName === "main"
        
        if (isMain) {
            return
        }

        const func = this.lua.global.get(functionName)

        if (typeof func !== "function") { 
            return
        }

        return func
    }

    initialize() {
        console.log(`Component "${this.uid}" initialized!`)
    }

    load(json: any) {
        this.uid = json.uid
        this.name = json.name
        this.elementID = json.elementID
        this.properties.loadProperties(json.properties)
    }
}

class ElementProperties {
    constructor() {
        this.properties = {};
    }

    addProperty(property: ElementProperty) {
        this.properties[property.id] = property
    }

    updateProperty(id: string, value: any) {
        this.properties[id].changeValue(value)
    }

    deleteProperty(id: string) {
        delete this.properties[id]
    }

    getProp(id: string) {
        let property = this.properties[id]
        return property.value
    }

    getAllProps() {
        let properties: {
            [key: string]: any
        } = {}
        Object.keys(this.properties).map((property_key: string) => {
            const property = this.properties[property_key]
            properties[property_key] = property.value
        })
        return properties
    }

    loadProperties(json: {
        [key: string]: any
    }) {
        Object.keys(json).map(key => {
            const property = json[key]
            this.updateProperty(key, property)
        })
    }
}

class ElementProperty {
    constructor(name: string, value: any, id?: string) {
        this.value = value
        this.name = name
        this.uid = uuidV4()
        this.editable = true

        this.id = id || this.name
    }

    changeValue(newValue: any) {
        this.value = newValue
    }

    load(json: any) {
        this.value = json.value
        this.name = json.name
        this.uid = json.uid
        this.editable = json.editable
    }

    serialize() {
        return {
            name: this.name,
            value: this.value,
            uid: this.uid,
            editable: this.editable
        }
    }
}

class ProjectScript {
    constructor(name?: string, initialContents?: string) {
        this.name = name || "script.lua"
        this.contents = initialContents || ""
        this.uid = uuidV4()
    }

    updateContents(newContents: string) {
        this.contents = newContents
    }

    load(json: any) {
        this.name = json.name
        this.contents = json.contents
        this.uid = json.uid
    }

    serialize() {
        return {
            name: this.name,
            contents: this.contents,
            uid: this.uid
        }
    }
}

class ProjectScreen {
    uid: string
    name: string
    elements: {[key: string]: ProjectElement}
    pb_id: string

    constructor(name?: string, initialElements?: any) {
        this.name = name || ""
        this.elements = initialElements || {}
        this.uid = uuidV4()
        this.pb_id = ""
    }

    addElement(element: ProjectElement) {
        this.elements[element.uid] = element
    }

    deleteElement(elementUID: string) {
        delete this.elements[elementUID]
    }

    load(json: {[key: string]: any}) {
        this.name = json.name
        this.uid = json.uid
        this.pb_id = json.id

        Object.keys(json.elements).map(key => {
            const element = json.elements[key]
            const elementID = element.elementID
            // const builtinElements = require("./elements/builtin")
            // const ELEMENT_LIST = builtinElements.default
            const ElementConstructor = ELEMENT_LIST[elementID]
            const newElement: ProjectElement = new ElementConstructor()
            newElement.load(element)

            this.addElement(newElement)
        })
    }

    serialize() {
        let elements: {[key: string]: any} = {};

        Object.keys(this.elements).map(key => {
            const element = this.elements[key]
            elements[element.uid] = element.serialize()
        })

        const data: {
            [key: string]: any
        } = {
            id: this.pb_id,
            uid: this.uid,
            name: this.name,
            elements: elements
        }

        if (this.pb_id == "") {
            delete data.id
        }

        return data
    }
}

export {
    ProjectElement,
    ProjectScreen,
    ElementProperty,
    ElementProperties,
    ProjectScript,
    Project
}
