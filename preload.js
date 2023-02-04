const { default: ProtonPlugin } = require("@techstudent10/plugin")
const { contextBridge, ipcRenderer } = require("electron")

const path = require("path")
let PLUGIN_PATH;

window.globalThis.path = path

ipcRenderer.invoke("getDev").then(isDev => {
    ipcRenderer.invoke("getUserDir").then(userDir => {
        PLUGIN_PATH = isDev ? path.join(userDir, "plugins") : path.join(__dirname, "ui", "src", "plugins")
    })
})

contextBridge.exposeInMainWorld("electronAPI", {
    getSettings: () => ipcRenderer.invoke("settings:get"),
    getPlugins: () => ipcRenderer.invoke("getPlugins"),
    getPlugin: (pluginName) => {
        const plugin = require(path.join(PLUGIN_PATH, pluginName))
        // console.log(plugin)
        const newPlugin = new ProtonPlugin(undefined)

        const pluginObj = new plugin()

        Object.getOwnPropertyNames(
            Object.getPrototypeOf(newPlugin)
        ).map(name => {
            newPlugin[name] = pluginObj[name]
        })

        const pluginConfig = require(path.join(PLUGIN_PATH, pluginName, "proton.config.js"))
        return {plugin: newPlugin, pluginConfig: pluginConfig}
    },
    logInfo: (message) => ipcRenderer.send("log", "info", message),
    logWarn: (message) => ipcRenderer.send("log", "warn", message),
    logErr: (message) => ipcRenderer.send("log", "error", message),
    // This could be used for local scripts
    // createTempDir: (name, cb) => ipcRenderer.invoke("file:createTempScriptDir", name, cb),
    // watchForChanges: (scriptDir, cb) => ipcRenderer.invoke("script:watchForChanges", scriptDir, cb)
})


console.log("Preloaded!")
