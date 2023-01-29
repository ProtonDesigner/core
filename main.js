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
            sandbox: false
        },
        logo: path.join(__dirname, 'assets', 'logo.png')
    })

    win.loadFile(path.join(__dirname, 'ui', 'index.html'))

    // if (!app.isPackaged) {
    //     win.webContents.openDevTools()   
    // }
}

let tmpDir

app.whenReady().then(() => {
    // if (!app.isPackaged) {
    //     const { default: installExtension, REACT_DEVELOPER_TOOLS } = require("electron-devtools-installer")
    //     installExtension(REACT_DEVELOPER_TOOLS)
    //         .then((ex_name) => console.log(`Added "${ex_name}" Extension`))
    //         .catch((err) => console.log("An error occured when attempting to install extensions:", err))
    // }

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

    // When working with local scripts, use these functions
    // ipcMain.handle("file:createTempScriptDir", (event, name, cb) => {
    //     try {
    //         tmpDir = fs.mkdtemp(path.join(tmpdir(), "proton", name))
    //         cb(tmpDir)
    //     } catch (e) {
    //         console.error(e)
    //     } finally {
    //         try {
    //             if (tmpDir) {
    //                 fs.rm(tmpDir, { recursive: true })
    //             } 
    //         } catch (e) {
    //             console.error(e)
    //         }
    //     }
    // })

    // ipcMain.handle("script:watchForChanges", (event, scriptDir, cb) => {
    //     fs.watch(scriptDir, (event, filename)  => {
    //         console.log(`Change found in ${filename}`, e)
    //         if (filename) {
    //             cb(event, filename)
    //         } else {
    //             console.warn("No file found")
    //         }
    //     })
    // })

    ipcMain.handle("getPlugins", (event, pluginDir) => {
        return fs.readdirSync(pluginDir)
    })

    ipcMain.handle("getPlugin", (event, pluginDir, pluginName) => {
        const plugin = require(path.join(pluginDir, pluginName))
        const pluginConfig = require(path.join(pluginDir, pluginName, "proton.config.js"))
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
