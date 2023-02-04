const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { autoUpdater } = require("electron-updater");

const settings = require("electron-settings");
const { tmpdir } = require('os');

const fs = require('fs');

const date = new Date()
const LOGGING_FILE_NAME = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.log`
const LOGGING_DIR = app.isPackaged ? 
                            path.join(app.getPath("userData"), "logs") :
                            path.join("logs")
const LOGGING_FILE_PATH = path.join(LOGGING_DIR, LOGGING_FILE_NAME)

const PLUGIN_PATH = app.isPackaged ? path.join(app.getPath("userData"), "plugins") : path.join(__dirname, "ui", "src", "plugins")

if (!fs.existsSync(LOGGING_DIR)) fs.mkdirSync(LOGGING_DIR)

const loggingStream = fs.createWriteStream(LOGGING_FILE_PATH)

app.on("ready", () => {
	autoUpdater.checkForUpdatesAndNotify();
});

let win

function createWindow () {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            sandbox: false,
            nodeIntegration: true
        },
        logo: path.join(__dirname, 'assets', 'logo.png')
    })

    if (app.isPackaged) {
        win.loadFile(path.join(__dirname, 'ui', 'index.html'))
    } else {
        win.loadURL("http://localhost:5173")
    }
}

let tmpDir

app.whenReady().then(() => {
    createWindow()

    ipcMain.handle("settings:get", (event) => {
        console.log("settings")
        const getSettings = async () => {
            let result
            await settings.get("settings").then(data => {
                result = data
                console.log(data)
            })
            console.log(result)
            return result
        }
        return getSettings()
    })

    ipcMain.on("log", (event, level, message) => {
        loggingStream.write(`[${level.toUpperCase()}] ${message}` + "\n")
    })

    ipcMain.handle("getDev", (event) => {
        return app.isPackaged
    })

    ipcMain.handle("getUserDir", (event) => {
        return app.getPath("userData")
    })

    ipcMain.handle("getPlugins", (event) => {
        let result = fs.readdirSync(PLUGIN_PATH)
        console.log(result)
        return result
    })

    ipcMain.handle("getPlugin", (event, pluginName) => {
        const plugin = require(path.join(PLUGIN_PATH, pluginName))
        const pluginConfig = require(path.join(PLUGIN_PATH, pluginName, "proton.config.js"))
        return JSON.stringify({plugin: plugin, pluginConfig: pluginConfig})
    })

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
