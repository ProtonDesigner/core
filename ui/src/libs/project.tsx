import React from 'react';
import { v4 as uuidV4 } from 'uuid';

import { ELEMENT_LIST } from './internal';

interface Project {
    elements: {
        [key: string]: ProjectElement
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
}

interface ElementProperty {
    value: any
    name: string
    uid: string
    editable: boolean
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

class Project {
    constructor() {
        this.elements = {}
        this.name = ""
        this.id = ""
        this.scripts = {}
    }

    addElement(element: ProjectElement) {
        this.elements[element.uid] = element
    }

    deleteElement(elementUID: string) {
        delete this.elements[elementUID]
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

    serialize() {
        // Serialize elements
        let serializedElements: {
            [key: string]: {}
        } = {}
        Object.keys(this.elements).map((element_key) => {
            const element: ProjectElement = this.elements[element_key]
            const serializedElement = element.serialize()
            serializedElements[element.uid] = serializedElement
        })

        // Serialize scripts
        let serializedScripts: {
            [key: string]: {}
        } = {}

        Object.keys(this.scripts).map(key => {
            const script: ProjectScript = this.scripts[key]
            console.log(script)
            serializedScripts[script.uid] = script?.serialize()
        })

        return {
            name: this.name,
            elements: serializedElements,
            scripts: serializedScripts
        }
    }

    load(json: any) {
        const elements: {
            [key: string]: any
        } = json.elements
        const name: string = json.name

        this.name = name
        this.id = json.id
        Object.keys(json.scripts).map(key => {
            const script = json.scripts[key]
            const newScript = new ProjectScript()
            newScript.load(script)
            this.addScript(newScript)
        })
        Object.keys(elements).map(key => {
            const element = elements[key]
            const elementID: string = element.elementID
            const ElementConstructor = ELEMENT_LIST[elementID]
            const newElement = new ElementConstructor()
            newElement.load(element)
            this.addElement(newElement)
        })
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
        this.properties[property.name] = property
    }

    updateProperty(name: string, value: any) {
        this.properties[name].changeValue(value)
    }

    deleteProperty(name: string) {
        delete this.properties[name]
    }

    getProp(name: string) {
        let property = this.properties[name]
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
    constructor(name: string, value: any) {
        this.value = value
        this.name = name
        this.uid = uuidV4()
        this.editable = true
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

export {
    ProjectElement,
    ElementProperty,
    ElementProperties,
    ProjectScript,
    Project
}
