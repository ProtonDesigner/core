const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("electronAPI", {
    getSettings: () => ipcRenderer.invoke("settings:get")
})

console.log("Preloaded!")
