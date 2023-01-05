const { contextBridge } = require("electron")
const fs = require("fs") // TODO: use IPC renderer to get files from main process because you can't require native node modules from preload :(

function readThemeFile(themeFilePath, callback) {
    fs.readFile(themeFilePath, { encoding: "utf-8" }, (err, data) => {
        if (err) throw err;
        callback(JSON.parse(data))
    })
}

contextBridge.exposeInMainWorld("electronAPI", {
    readThemeFile: readThemeFile
})
