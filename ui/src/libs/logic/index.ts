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
        this.saveScreens = this.saveScreens.bind(this)
    }

    saveProject() {
        // console.log(this)
        const { project } = this

        const serializedProject: { [key: string]: any } = {...project.serialize()}
        const screens = this.saveScreens()
        serializedProject["screens"] = screens

        pb.collection('projects').update(project.id, serializedProject, {
            "$autoCancel": false
        })
    }

    saveScreens() {
        const { project } = this

        const screens = project.screens
        let screenIDs: Array<string> = []

        Object.keys(screens).map(key => {
            const screen = screens[key]
            const serializedScreen = screen.serialize()

            let screenExists: boolean = screen.pb_id !== ""

            if (screenExists) {
                pb.collection("screens").update(screen.pb_id, serializedScreen, {
                    "$autoCancel": false
                })
            } else {
                pb.collection("screens").create(serializedScreen).then(data => {
                    screen.pb_id = data.id
                    console.log(data.id)
                })
                setTimeout(() => {}, 150)
            }

            screenIDs.push(screen.pb_id)
        })

        return screenIDs
    }

    addElement({ element, screenID }: {
        element: libs.ProjectElement,
        screenID: string
    }) {
        const { project } = this
        
        project.screens[screenID].addElement(element)
    }

    deleteElement({ elementUID, screenID }: {
        elementUID: string,
        screenID: string
    }) {
        const { project } = this

        project.screens[screenID].deleteElement(elementUID)
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
