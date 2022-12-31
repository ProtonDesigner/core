import React from 'react';

interface Project {
    elements: {
        [key: string]: ProjectElement
    }
    name: string
}

interface ProjectElement {
    uid: string
    properties: ElementProperties
    name: string
    render(): any
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

class Project {
    constructor() {
        this.elements = {}
        this.name = ""
    }

    addElement(element: ProjectElement) {
        this.elements[element.uid] = element
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

        return JSON.stringify({
            name: this.name,
            elements: serializedElements
        })
    }

    load() {}
}
class ProjectElement {
    constructor() {
        this.uid = ""
        this.name = "Element"
        this.properties = new ElementProperties()

        this.initialize()
        this.render = this.render.bind(this)
    }

    serialize() {
        return {
            uid: this.uid,
            properties: this.properties.getAllProps()
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
}

class ElementProperty {
    constructor(name: string, value: any) {
        this.value = value
        this.name = name
        this.uid = ""
        this.editable = true
    }

    changeValue(newValue: any) {
        this.value = newValue
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

export default Project
export {
    ProjectElement,
    ElementProperty
}
