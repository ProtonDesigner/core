const { default: ProtonPlugin } = require("@techstudent10/plugin")
const { contextBridge, ipcRenderer } = require("electron")

const path = require("path")

contextBridge.exposeInMainWorld("electronAPI", {
    getSettings: () => ipcRenderer.invoke("settings:get"),
    getPlugins: (pluginPath) => ipcRenderer.invoke("getPlugins", pluginPath),
    getPlugin: (pluginPath, pluginName) => {
        const plugin = require(path.join(pluginPath, pluginName))
        // console.log(plugin)
        const newPlugin = new ProtonPlugin(undefined)

        const pluginObj = new plugin()

        Object.getOwnPropertyNames(
            Object.getPrototypeOf(newPlugin)
        ).map(name => {
            newPlugin[name] = pluginObj[name]
        })

        const pluginConfig = require(path.join(pluginPath, pluginName, "proton.config.js"))
        return {plugin: newPlugin, pluginConfig: pluginConfig}
    }
    // This could be used for local scripts
    // createTempDir: (name, cb) => ipcRenderer.invoke("file:createTempScriptDir", name, cb),
    // watchForChanges: (scriptDir, cb) => ipcRenderer.invoke("script:watchForChanges", scriptDir, cb)
})


console.log("Preloaded!")
