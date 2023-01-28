import pb from "../pocketbase"

import * as libs from "../internal"

import PluginManager from "../plugin"

interface EditorLogic {
    project: libs.Project
}

interface Logic {
    [key: string]: any
    name: string
}

class Logic {
    constructor(pluginManager: PluginManager) {
        this.pluginManager = pluginManager
    }

    invoke(command: string, args?: {[key: string]: any} | null) {
        const func = this[command]
        let results: {
            [key: string]: any
        } = {}
        if (func) {
            let _args: any = args ? args : {}
            results['main'] = func(_args)
        }
        let pluginResults = this.pluginManager.invoke(command, args)
        let new_results: any = {}
        Object.keys(results).map(key => {
            const result = results[key]
            new_results[key] = result
        })
        Object.keys(pluginResults).map(key => {
            const result = pluginResults[key]
            new_results[key] = result
        })
        return new_results
    }
}

class EditorLogic extends Logic {
    constructor(pluginManager: PluginManager, project: libs.Project) {
        super(pluginManager)
        this.name = "editor"
        this.project = project

        this.saveProject = this.saveProject.bind(this)
        this.deleteElement = this.deleteElement.bind(this)
        this.addElement = this.addElement.bind(this)
    }

    saveProject() {
        // console.log(this)
        const { project } = this

        const serializedProject = project.serialize()
        pb.collection('projects').update(project.id, serializedProject, {
            "$autoCancel": false
        })
    }

    addElement({ element }: {
        element: libs.ProjectElement
    }) {
        const { project } = this
        
        project.addElement(element)
    }

    deleteElement({ elementUID }: {
        elementUID: string
    }) {
        const { project } = this

        project.deleteElement(elementUID)
        this.saveProject()
    } 
}
class HomeLogic extends Logic {
    constructor(pluginManager: PluginManager) {
        super(pluginManager)
        this.name = "home"
    }
}

export {
    EditorLogic,
    HomeLogic
}
