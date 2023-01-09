const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("electronAPI", {
    getSettings: () => ipcRenderer.invoke("settings:get"),
    // This could be used for local scripts
    // createTempDir: (name, cb) => ipcRenderer.invoke("file:createTempScriptDir", name, cb),
    // watchForChanges: (scriptDir, cb) => ipcRenderer.invoke("script:watchForChanges", scriptDir, cb)
})

console.log("Preloaded!")
