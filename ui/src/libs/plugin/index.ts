import * as path from 'path';

import { Project } from '../internal';

import ProtonPlugin from "@techstudent10/plugin"

class PluginManager {
    // TODO: move this directory to the Electron side
    // TODO: set this dynamically
    PLUGIN_PATH = "C:/Users/moham/projs/ProtonDesigner/rewrite/ui/src/plugins"

    PLUGINS: {
        [key: string]: any
    } = []

    constructor(options?: {
        path?: string
    }) {
        if (options?.path) {
            this.PLUGIN_PATH = options.path
        }

        window.electronAPI.getPlugins(this.PLUGIN_PATH).then((data: Array<string>) => {
            this.load(data)
        })
    }

    load(pluginFiles: Array<string>) {
        window.electronAPI.logInfo("Loading plugins...")
        pluginFiles.map(filename => {
            // console.log("a", filename)
            try {
                const pluginObj = window.electronAPI.getPlugin(this.PLUGIN_PATH, filename)
                const plugin = pluginObj.plugin
                const pluginConfig = pluginObj.pluginConfig
                // console.log(plugin, "\n", pluginConfig)
                const newPlugin = new ProtonPlugin(new Project())
                Object.assign(newPlugin, plugin)
                // console.log(newPlugin, plugin)
                this.PLUGINS[filename] = {plugin: newPlugin, pluginConfig}
                window.electronAPI.logInfo(`Loaded Plugin ${filename}`)
            } catch (err) {
                const errMsg = `Error occurred while loading plugin ${filename}`
                console.error(errMsg)
                window.electronAPI.logErr(errMsg)
                console.error(err)
            }
        })

        window.electronAPI.logInfo("Plugins loaded")
        console.log("Plugins finished loading")
    }

    setProject(project: Project) {
        // console.log(this.PLUGINS)
        Object.keys(this.PLUGINS).map((key: any) => {
            this.PLUGINS[key].plugin.project = project
        })
    }

    invoke(command: string, namespace?: string, args?: {[key: string]: any} | null) {
        let results: {
            [key: string]: any
        } = {}
        namespace = namespace || "editor"
        Object.keys(this.PLUGINS).map(key => {
            const plugin = this.PLUGINS[key].plugin
            const func = plugin[`${namespace}_${command}`]
            // console.log(func)
            // console.log(`${namespace}_${command}`)
            let result;
            if (func) {
                // console.log("executing!")
                let _args: any = args ? args : {}
                // console.log(plugin)
                result = func(_args)
                // console.log(result)
            }
            results[key] = result
        })
        return results
    }
}

export default PluginManager
